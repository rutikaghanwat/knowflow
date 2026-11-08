-- ============================================================================
-- KNOWFLOW — Complete Unified Initial Database Schema (PostgreSQL + pgvector)
-- Host Target: Supabase PostgreSQL (Postgres 15+)
-- Auth Architecture: Supabase Auth (auth.users) + public.user_profiles
-- Embedding Model: all-MiniLM-L6-v2 (Vector dimension: 384)
-- Security: Server-side RBAC, Granular Source ACL, Full RLS Default-Deny
-- Integrity: Exclusive Arc Sources, Same-Project Composite FKs, Safe Lifecycles
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXTENSIONS & UTILITIES
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 2. IDENTITY & MULTI-TENANCY (SUPABASE AUTH INTEGRATION)
-- ----------------------------------------------------------------------------

-- Application User Profiles (Linked 1:1 to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON public.user_profiles(is_active);

CREATE TRIGGER trg_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Secure trigger function to synchronize auth.users with public.user_profiles
-- Uses SECURITY DEFINER and search_path = '' to protect against search_path hijacking
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = ''
LANGUAGE plpgsql
AS $$
DECLARE
    v_full_name TEXT;
    v_avatar_url TEXT;
BEGIN
    -- KNOWFLOW strictly requires an email address for identity, notifications, and handover audit
    IF NEW.email IS NULL OR NEW.email = '' THEN
        RAISE EXCEPTION 'Cannot create user_profile: email is required by Knowflow';
    END IF;

    -- Extract name metadata safely if provided during signup, fallback to email prefix
    v_full_name := COALESCE(
        NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
        NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
        split_part(NEW.email, '@', 1)
    );
    v_avatar_url := NULLIF(TRIM(NEW.raw_user_meta_data->>'avatar_url'), '');

    INSERT INTO public.user_profiles (id, email, full_name, avatar_url, is_active)
    VALUES (
        NEW.id,
        NEW.email,
        v_full_name,
        v_avatar_url,
        true
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        -- Retain custom user-edited name if already set, otherwise sync from metadata
        full_name = CASE 
            WHEN public.user_profiles.full_name IS NULL OR public.user_profiles.full_name = '' 
            THEN EXCLUDED.full_name 
            ELSE public.user_profiles.full_name 
        END,
        avatar_url = COALESCE(public.user_profiles.avatar_url, EXCLUDED.avatar_url),
        -- Preserve application-managed is_active status without overwriting
        is_active = public.user_profiles.is_active,
        updated_at = NOW();

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE OF email, raw_user_meta_data ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Organizations Table (Tenants)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);

CREATE TRIGGER trg_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Organization Members Table
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('OWNER', 'ADMIN', 'MEMBER')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_organization_members UNIQUE (organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON public.organization_members(organization_id);

CREATE TRIGGER trg_organization_members_updated_at
    BEFORE UPDATE ON public.organization_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 3. PROJECTS & PERMISSION-AWARE ACCESS CONTROL (RBAC)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key VARCHAR(50) NOT NULL,
    description TEXT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED')),
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_projects_org_key UNIQUE (organization_id, key)
);

CREATE INDEX IF NOT EXISTS idx_projects_org ON public.projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('PROJECT', 'SOURCES', 'HANDOVERS', 'AUDIT', 'ADMIN')),
    description TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_permissions_category ON public.permissions(category);

CREATE TABLE IF NOT EXISTS public.project_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    is_system BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_project_roles_project_name UNIQUE (project_id, name),
    CONSTRAINT uq_project_roles_project_id UNIQUE (project_id, id)
);

CREATE INDEX IF NOT EXISTS idx_project_roles_project ON public.project_roles(project_id);

CREATE TRIGGER trg_project_roles_updated_at
    BEFORE UPDATE ON public.project_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.project_role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.project_roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_project_role_permissions UNIQUE (role_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_project_role_perms_role ON public.project_role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_project_role_perms_perm ON public.project_role_permissions(permission_id);

CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_project_members UNIQUE (project_id, user_id),
    CONSTRAINT fk_project_members_role 
        FOREIGN KEY (project_id, role_id) 
        REFERENCES public.project_roles(project_id, id) 
        ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_project_members_project ON public.project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user ON public.project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_role ON public.project_members(role_id);
CREATE INDEX IF NOT EXISTS idx_project_members_active ON public.project_members(is_active);

CREATE TRIGGER trg_project_members_updated_at
    BEFORE UPDATE ON public.project_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 4. SOURCES, SOURCE ACLs & VECTOR DOCUMENT CHUNKS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.source_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('PDF', 'DOCX')),
    file_size_bytes BIGINT NOT NULL,
    checksum_sha256 VARCHAR(64) NOT NULL,
    access_level VARCHAR(50) NOT NULL DEFAULT 'INTERNAL' CHECK (access_level IN ('PUBLIC_IN_PROJECT', 'INTERNAL', 'RESTRICTED')),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'INDEXED', 'FAILED')),
    error_message TEXT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_source_documents_project_id UNIQUE (project_id, id)
);

CREATE INDEX IF NOT EXISTS idx_source_docs_project ON public.source_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_source_docs_status ON public.source_documents(status);
CREATE INDEX IF NOT EXISTS idx_source_docs_access ON public.source_documents(access_level);

CREATE TRIGGER trg_source_documents_updated_at
    BEFORE UPDATE ON public.source_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.github_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    connected_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    repo_owner VARCHAR(100) NOT NULL,
    repo_name VARCHAR(100) NOT NULL,
    default_branch VARCHAR(100) NOT NULL DEFAULT 'main',
    selected_branches TEXT[] NOT NULL DEFAULT ARRAY['main'],
    access_token_encrypted TEXT NULL,
    access_level VARCHAR(50) NOT NULL DEFAULT 'INTERNAL' CHECK (access_level IN ('PUBLIC_IN_PROJECT', 'INTERNAL', 'RESTRICTED')),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('CONNECTED', 'SYNCING', 'INDEXED', 'ERROR')),
    last_synced_commit VARCHAR(40) NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_github_sources_repo UNIQUE (project_id, repo_owner, repo_name),
    CONSTRAINT uq_github_sources_project_id UNIQUE (project_id, id)
);

CREATE INDEX IF NOT EXISTS idx_github_sources_project ON public.github_sources(project_id);
CREATE INDEX IF NOT EXISTS idx_github_sources_status ON public.github_sources(status);

-- Granular Source ACL: Exclusive Arc with Same-Project Enforcement
CREATE TABLE IF NOT EXISTS public.source_role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    source_document_id UUID NULL,
    github_source_id UUID NULL,
    source_type VARCHAR(20) GENERATED ALWAYS AS (
        CASE WHEN source_document_id IS NOT NULL THEN 'DOCUMENT' ELSE 'GITHUB' END
    ) STORED,
    source_id UUID GENERATED ALWAYS AS (
        COALESCE(source_document_id, github_source_id)
    ) STORED,
    role_id UUID NOT NULL,
    can_read BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_source_role_perms_arc CHECK (
        (source_document_id IS NOT NULL AND github_source_id IS NULL) OR
        (source_document_id IS NULL AND github_source_id IS NOT NULL)
    ),
    CONSTRAINT fk_source_role_perms_doc 
        FOREIGN KEY (project_id, source_document_id) 
        REFERENCES public.source_documents(project_id, id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_source_role_perms_github 
        FOREIGN KEY (project_id, github_source_id) 
        REFERENCES public.github_sources(project_id, id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_source_role_perms_role 
        FOREIGN KEY (project_id, role_id) 
        REFERENCES public.project_roles(project_id, id) 
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_uq_source_role_perms_doc 
    ON public.source_role_permissions(source_document_id, role_id) 
    WHERE source_document_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_uq_source_role_perms_github 
    ON public.source_role_permissions(github_source_id, role_id) 
    WHERE github_source_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_source_role_perms_lookup 
    ON public.source_role_permissions(project_id, role_id, source_document_id, github_source_id);

CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    source_document_id UUID NULL,
    github_source_id UUID NULL,
    source_type VARCHAR(20) GENERATED ALWAYS AS (
        CASE WHEN source_document_id IS NOT NULL THEN 'DOCUMENT' ELSE 'GITHUB' END
    ) STORED,
    source_id UUID GENERATED ALWAYS AS (
        COALESCE(source_document_id, github_source_id)
    ) STORED,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    token_count INTEGER NULL,
    embedding vector(384) NULL,
    page_number INTEGER NULL,
    file_path TEXT NOT NULL,
    start_line INTEGER NULL,
    end_line INTEGER NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_document_chunks_project_id UNIQUE (project_id, id),
    CONSTRAINT chk_document_chunks_arc CHECK (
        (source_document_id IS NOT NULL AND github_source_id IS NULL) OR
        (source_document_id IS NULL AND github_source_id IS NOT NULL)
    ),
    CONSTRAINT fk_document_chunks_source_doc 
        FOREIGN KEY (project_id, source_document_id) 
        REFERENCES public.source_documents(project_id, id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_document_chunks_github_source 
        FOREIGN KEY (project_id, github_source_id) 
        REFERENCES public.github_sources(project_id, id) 
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_uq_doc_chunks_doc_index 
    ON public.document_chunks(source_document_id, chunk_index) 
    WHERE source_document_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_uq_doc_chunks_github_index 
    ON public.document_chunks(github_source_id, chunk_index) 
    WHERE github_source_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_document_chunks_project_sources 
    ON public.document_chunks(project_id, source_document_id, github_source_id);

CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding_hnsw 
    ON public.document_chunks 
    USING hnsw (embedding vector_cosine_ops);

-- ----------------------------------------------------------------------------
-- 5. AI KNOWLEDGE FINDINGS & EVIDENCE CITATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.knowledge_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (
        category IN ('TASK', 'DECISION', 'RESPONSIBILITY', 'RISK', 'BLOCKER', 'DEPENDENCY', 'UNRESOLVED_QUESTION')
    ),
    classification VARCHAR(50) NOT NULL CHECK (
        classification IN ('FACT', 'INFERENCE', 'RECOMMENDATION', 'UNKNOWN')
    ),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    confidence_score NUMERIC(4, 3) NULL CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    extracted_by VARCHAR(100) NOT NULL DEFAULT 'AI_EXTRACTOR',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DISMISSED', 'VERIFIED')),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_knowledge_findings_project_id UNIQUE (project_id, id)
);

CREATE INDEX IF NOT EXISTS idx_findings_project_cat_class 
    ON public.knowledge_findings(project_id, category, classification);

CREATE INDEX IF NOT EXISTS idx_findings_status 
    ON public.knowledge_findings(status);

CREATE TRIGGER trg_knowledge_findings_updated_at
    BEFORE UPDATE ON public.knowledge_findings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.evidence_references (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    finding_id UUID NOT NULL,
    chunk_id UUID NULL,
    source_document_id UUID NULL,
    github_source_id UUID NULL,
    source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('DOCUMENT', 'GITHUB')),
    source_title VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    page_number INTEGER NULL,
    start_line INTEGER NULL,
    end_line INTEGER NULL,
    snippet TEXT NOT NULL,
    context_summary TEXT NULL,
    confidence NUMERIC(4, 3) NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
    is_source_deleted BOOLEAN NOT NULL DEFAULT false,
    source_deleted_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_evidence_finding 
        FOREIGN KEY (project_id, finding_id) 
        REFERENCES public.knowledge_findings(project_id, id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_evidence_source_doc 
        FOREIGN KEY (project_id, source_document_id) 
        REFERENCES public.source_documents(project_id, id) 
        ON DELETE SET NULL (source_document_id),
    CONSTRAINT fk_evidence_source_github 
        FOREIGN KEY (project_id, github_source_id) 
        REFERENCES public.github_sources(project_id, id) 
        ON DELETE SET NULL (github_source_id),
    CONSTRAINT fk_evidence_chunk 
        FOREIGN KEY (project_id, chunk_id) 
        REFERENCES public.document_chunks(project_id, id) 
        ON DELETE SET NULL (chunk_id),
    CONSTRAINT chk_evidence_references_lifecycle CHECK (
        (NOT is_source_deleted AND (
            (source_type = 'DOCUMENT' AND source_document_id IS NOT NULL AND github_source_id IS NULL) OR
            (source_type = 'GITHUB' AND github_source_id IS NOT NULL AND source_document_id IS NULL)
        ))
        OR
        (is_source_deleted AND source_document_id IS NULL AND github_source_id IS NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_evidence_finding ON public.evidence_references(finding_id);
CREATE INDEX IF NOT EXISTS idx_evidence_chunk ON public.evidence_references(chunk_id);
CREATE INDEX IF NOT EXISTS idx_evidence_sources ON public.evidence_references(source_document_id, github_source_id);
CREATE INDEX IF NOT EXISTS idx_evidence_project ON public.evidence_references(project_id);

CREATE OR REPLACE FUNCTION public.handle_evidence_source_deletion()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.source_document_id IS NOT NULL AND NEW.source_document_id IS NULL) OR
       (OLD.github_source_id IS NOT NULL AND NEW.github_source_id IS NULL) THEN
        NEW.is_source_deleted := true;
        NEW.source_deleted_at := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_handle_evidence_source_deletion ON public.evidence_references;
CREATE TRIGGER trg_handle_evidence_source_deletion
    BEFORE UPDATE OF source_document_id, github_source_id ON public.evidence_references
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_evidence_source_deletion();

-- ----------------------------------------------------------------------------
-- 6. HANDOVERS, REPORTS & APPROVAL WORKFLOW
-- ----------------------------------------------------------------------------
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

CREATE OR REPLACE FUNCTION public.populate_handover_identity_snapshots()
RETURNS TRIGGER AS $$
DECLARE
    v_profile public.user_profiles%ROWTYPE;
BEGIN
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.departing_user_id IS DISTINCT FROM NEW.departing_user_id) THEN
        IF NEW.departing_user_id IS NOT NULL THEN
            SELECT * INTO v_profile FROM public.user_profiles WHERE id = NEW.departing_user_id;
            IF NOT FOUND THEN
                RAISE EXCEPTION 'Cannot populate identity snapshot: user_profile not found for departing_user_id %', NEW.departing_user_id;
            END IF;
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

CREATE OR REPLACE FUNCTION public.validate_handover_members()
RETURNS TRIGGER AS $$
BEGIN
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

CREATE OR REPLACE FUNCTION public.protect_project_member_removal()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND (OLD.is_active = false OR NEW.is_active = true) THEN
        RETURN NEW;
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.handovers 
        WHERE project_id = OLD.project_id 
          AND target_user_id = OLD.user_id 
          AND status IN ('DRAFT', 'GENERATING', 'IN_REVIEW', 'APPROVED')
    ) THEN
        RAISE EXCEPTION 'Cannot remove or deactivate member (user_id: %): user is the designated successor for an active handover in this project. Reassign or clear target_user_id first.', OLD.user_id;
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.handovers 
        WHERE project_id = OLD.project_id 
          AND departing_user_id = OLD.user_id 
          AND status IN ('DRAFT', 'GENERATING', 'IN_REVIEW', 'APPROVED')
    ) THEN
        RAISE EXCEPTION 'Cannot remove or deactivate member (user_id: %): an active handover is currently in progress. Complete or reject the handover before removing this member.', OLD.user_id;
    END IF;

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

CREATE TABLE IF NOT EXISTS public.report_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.handover_reports(id) ON DELETE CASCADE,
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

-- ----------------------------------------------------------------------------
-- 7. AUDIT LOGS (TAMPER-RESISTANT & DECOUPLED HISTORICAL IMMUTABILITY)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NULL,
    project_id UUID NULL,
    actor_id UUID NULL,
    actor_email VARCHAR(255) NULL,
    actor_role VARCHAR(100) NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_project_created 
    ON public.audit_logs(project_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_org_created 
    ON public.audit_logs(organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_created 
    ON public.audit_logs(actor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_resource 
    ON public.audit_logs(resource_type, resource_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action 
    ON public.audit_logs(action);

CREATE OR REPLACE FUNCTION public.prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'KNOWFLOW audit_logs records are strictly append-only and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_audit_logs ON public.audit_logs;
CREATE TRIGGER trg_protect_audit_logs
    BEFORE UPDATE OR DELETE ON public.audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_audit_log_modification();

-- ----------------------------------------------------------------------------
-- 8. BASELINE SYSTEM PERMISSIONS SEED
-- ----------------------------------------------------------------------------
INSERT INTO public.permissions (code, name, category, description)
VALUES
    ('project:view', 'View Project Details', 'PROJECT', 'Permission to view project overview, metadata, and status'),
    ('project:edit', 'Edit Project Settings', 'PROJECT', 'Permission to edit project settings, description, and status'),
    ('project:manage_members', 'Manage Project Members & Roles', 'PROJECT', 'Permission to assign roles and manage members in the project'),
    ('sources:upload', 'Upload Source Documents', 'SOURCES', 'Permission to upload PDF and DOCX files'),
    ('sources:connect_github', 'Connect GitHub Repositories', 'SOURCES', 'Permission to connect and synchronize GitHub repositories'),
    ('sources:view', 'View Sources & Chunks', 'SOURCES', 'Permission to view authorized project sources and chunks'),
    ('sources:manage_access', 'Manage Source ACLs', 'SOURCES', 'Permission to grant or restrict role access to specific sources'),
    ('sources:delete', 'Delete Sources', 'SOURCES', 'Permission to remove source documents or repositories'),
    ('handovers:create', 'Create Handover Process', 'HANDOVERS', 'Permission to initiate a new handover process for a departing member'),
    ('handovers:view', 'View Handover Reports', 'HANDOVERS', 'Permission to view generated handover reports within authorized scope'),
    ('handovers:review', 'Review Handover Reports', 'HANDOVERS', 'Permission for managers to review, curate, and comment on handover reports'),
    ('handovers:approve', 'Approve / Reject Handover Reports', 'HANDOVERS', 'Permission for designated managers to formally approve or reject reports'),
    ('handovers:share', 'Share Approved Reports', 'HANDOVERS', 'Permission to distribute approved handover reports to recipients'),
    ('audit:view', 'View Audit Logs', 'AUDIT', 'Permission to view compliance and security audit logs'),
    ('admin:all', 'Full Project Administration', 'ADMIN', 'Superuser administrative access within the project')
ON CONFLICT (code) DO UPDATE 
SET 
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description;

-- ----------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) & ACCESS HARDENING
-- ----------------------------------------------------------------------------
-- Enable RLS across all 19 application tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handovers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handover_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Self-profile read policy for authenticated users
DROP POLICY IF EXISTS "user_profiles_self_read" ON public.user_profiles;
CREATE POLICY "user_profiles_self_read"
    ON public.user_profiles
    FOR SELECT
    TO authenticated
    USING (id = (SELECT auth.uid()));

-- All remaining tables default-deny direct client PostgREST access.
-- The Express backend accesses database objects using service-role or postgres pool credentials.
