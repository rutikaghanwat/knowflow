-- Migration: 006_handovers_and_approvals.sql
-- Description: Handover workflows, versioned handover reports, identity snapshots, and member protection triggers
-- Author: KNOWFLOW Team

-- 1. Handovers Table
CREATE TABLE IF NOT EXISTS public.handovers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    departing_user_id UUID NULL REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    departing_user_name VARCHAR(255) NOT NULL,
    departing_user_email VARCHAR(255) NOT NULL,
    target_role_id UUID NOT NULL,
    target_user_id UUID NULL REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_by UUID NULL REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT' CHECK (
        status IN ('DRAFT', 'GENERATING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED')
    ),
    scheduled_handover_date DATE NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Enforce project integrity: target role must belong to the exact same project
    CONSTRAINT fk_handovers_target_role 
        FOREIGN KEY (project_id, target_role_id) 
        REFERENCES public.project_roles(project_id, id) 
        ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_handovers_project_status ON public.handovers(project_id, status);
CREATE INDEX IF NOT EXISTS idx_handovers_departing ON public.handovers(departing_user_id);
CREATE INDEX IF NOT EXISTS idx_handovers_target_role ON public.handovers(target_role_id);

CREATE TRIGGER trg_handovers_updated_at
    BEFORE UPDATE ON public.handovers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Populate immutable departing-user identity snapshots at creation time
CREATE OR REPLACE FUNCTION public.populate_handover_identity_snapshots()
RETURNS TRIGGER AS $$
DECLARE
    v_profile public.user_profiles%ROWTYPE;
BEGIN
    -- Populate snapshots on insert or when departing_user_id explicitly changes
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.departing_user_id IS DISTINCT FROM NEW.departing_user_id) THEN
        IF NEW.departing_user_id IS NOT NULL THEN
            SELECT * INTO v_profile FROM public.user_profiles WHERE id = NEW.departing_user_id;
            IF NOT FOUND THEN
                RAISE EXCEPTION 'Cannot populate identity snapshot: user_profile not found for departing_user_id %', NEW.departing_user_id;
            END IF;
            -- Freeze verified identity snapshots from user profile
            NEW.departing_user_name := COALESCE(NULLIF(TRIM(NEW.departing_user_name), ''), v_profile.full_name);
            NEW.departing_user_email := COALESCE(NULLIF(TRIM(NEW.departing_user_email), ''), v_profile.email);
        END IF;

        IF NEW.departing_user_name IS NULL OR NEW.departing_user_name = '' THEN
            RAISE EXCEPTION 'departing_user_name is required for handover creation';
        END IF;
        IF NEW.departing_user_email IS NULL OR NEW.departing_user_email = '' THEN
            RAISE EXCEPTION 'departing_user_email is required for handover creation';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_populate_handover_snapshots ON public.handovers;
CREATE TRIGGER trg_populate_handover_snapshots
    BEFORE INSERT OR UPDATE OF departing_user_id ON public.handovers
    FOR EACH ROW
    EXECUTE FUNCTION public.populate_handover_identity_snapshots();

-- Trigger: Validate member assignment against active project members with concurrency row-locks
CREATE OR REPLACE FUNCTION public.validate_handover_members()
RETURNS TRIGGER AS $$
BEGIN
    -- Concurrency-safe check: departing user must be an active project member
    IF NEW.departing_user_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.project_members 
            WHERE project_id = NEW.project_id 
              AND user_id = NEW.departing_user_id 
              AND is_active = true
            FOR SHARE
        ) THEN
            RAISE EXCEPTION 'departing_user_id % must be an active assigned member of project %', 
                NEW.departing_user_id, NEW.project_id;
        END IF;
    END IF;

    -- Concurrency-safe check: target user (if provided) must be an active project member
    IF NEW.target_user_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.project_members 
            WHERE project_id = NEW.project_id 
              AND user_id = NEW.target_user_id 
              AND is_active = true
            FOR SHARE
        ) THEN
            RAISE EXCEPTION 'target_user_id % must be an active assigned member of project %', 
                NEW.target_user_id, NEW.project_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_handover_members ON public.handovers;
CREATE TRIGGER trg_validate_handover_members
    BEFORE INSERT OR UPDATE OF project_id, departing_user_id, target_user_id ON public.handovers
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_handover_members();

-- Trigger on project_members: Prevent removing or deactivating members referenced by active handovers
CREATE OR REPLACE FUNCTION public.protect_project_member_removal()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if member is being deactivated (is_active transition from true to false)
    IF TG_OP = 'UPDATE' AND (OLD.is_active = false OR NEW.is_active = true) THEN
        RETURN NEW;
    END IF;

    -- 1. Block removal/deactivation if user is the assigned successor for an active handover
    IF EXISTS (
        SELECT 1 FROM public.handovers 
        WHERE project_id = OLD.project_id 
          AND target_user_id = OLD.user_id 
          AND status IN ('DRAFT', 'GENERATING', 'IN_REVIEW', 'APPROVED')
    ) THEN
        RAISE EXCEPTION 'Cannot remove or deactivate member (user_id: %): user is the designated successor for an active handover in this project. Reassign or clear target_user_id first.', OLD.user_id;
    END IF;

    -- 2. Block removal/deactivation if user is the departing member for an active handover
    IF EXISTS (
        SELECT 1 FROM public.handovers 
        WHERE project_id = OLD.project_id 
          AND departing_user_id = OLD.user_id 
          AND status IN ('DRAFT', 'GENERATING', 'IN_REVIEW', 'APPROVED')
    ) THEN
        RAISE EXCEPTION 'Cannot remove or deactivate member (user_id: %): an active handover is currently in progress. Complete or reject the handover before removing this member.', OLD.user_id;
    END IF;

    -- 3. If handovers are completed or rejected, removal/deactivation is permitted
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_project_member_removal ON public.project_members;
CREATE TRIGGER trg_protect_project_member_removal
    BEFORE DELETE OR UPDATE OF is_active ON public.project_members
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_project_member_removal();

-- 2. Handover Reports (Versioned Artifacts) Table
CREATE TABLE IF NOT EXISTS public.handover_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    handover_id UUID NOT NULL REFERENCES public.handovers(id) ON DELETE CASCADE,
    version INTEGER NOT NULL DEFAULT 1,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    structured_content JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT' CHECK (
        status IN ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'SUPERSEDED')
    ),
    generated_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_handover_reports_version UNIQUE (handover_id, version)
);

CREATE INDEX IF NOT EXISTS idx_handover_reports_handover ON public.handover_reports(handover_id);
CREATE INDEX IF NOT EXISTS idx_handover_reports_status ON public.handover_reports(status);

CREATE TRIGGER trg_handover_reports_updated_at
    BEFORE UPDATE ON public.handover_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 3. Report Findings Junction Table
-- Maps extracted findings to specific report versions with role relevance and manager curation
CREATE TABLE IF NOT EXISTS public.report_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.handover_reports(id) ON DELETE CASCADE,
    -- RESTRICT prevents accidental deletion of findings cited in official reports
    finding_id UUID NOT NULL REFERENCES public.knowledge_findings(id) ON DELETE RESTRICT,
    role_relevance_score NUMERIC(4, 3) NULL CHECK (role_relevance_score >= 0.0 AND role_relevance_score <= 1.0),
    is_included BOOLEAN NOT NULL DEFAULT true,
    manager_override_notes TEXT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_report_findings UNIQUE (report_id, finding_id)
);

CREATE INDEX IF NOT EXISTS idx_report_findings_report_included 
    ON public.report_findings(report_id, is_included);

CREATE INDEX IF NOT EXISTS idx_report_findings_finding 
    ON public.report_findings(finding_id);

-- 4. Approvals Table with Reviewer Snapshot
CREATE TABLE IF NOT EXISTS public.approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.handover_reports(id) ON DELETE CASCADE,
    reviewer_id UUID NULL REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    reviewer_name VARCHAR(255) NOT NULL,
    decision VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (
        decision IN ('PENDING', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED')
    ),
    comments TEXT NULL,
    decided_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_approvals_report_decision ON public.approvals(report_id, decision);
CREATE INDEX IF NOT EXISTS idx_approvals_reviewer ON public.approvals(reviewer_id);

CREATE TRIGGER trg_approvals_updated_at
    BEFORE UPDATE ON public.approvals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Populate reviewer name snapshot at approval creation
CREATE OR REPLACE FUNCTION public.populate_approval_identity_snapshots()
RETURNS TRIGGER AS $$
DECLARE
    v_profile public.user_profiles%ROWTYPE;
BEGIN
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.reviewer_id IS DISTINCT FROM NEW.reviewer_id) THEN
        IF NEW.reviewer_id IS NOT NULL THEN
            SELECT * INTO v_profile FROM public.user_profiles WHERE id = NEW.reviewer_id;
            IF FOUND THEN
                NEW.reviewer_name := COALESCE(NULLIF(TRIM(NEW.reviewer_name), ''), v_profile.full_name);
            END IF;
        END IF;

        IF NEW.reviewer_name IS NULL OR NEW.reviewer_name = '' THEN
            RAISE EXCEPTION 'reviewer_name is required for approval records';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_populate_approval_snapshots ON public.approvals;
CREATE TRIGGER trg_populate_approval_snapshots
    BEFORE INSERT OR UPDATE OF reviewer_id ON public.approvals
    FOR EACH ROW
    EXECUTE FUNCTION public.populate_approval_identity_snapshots();
