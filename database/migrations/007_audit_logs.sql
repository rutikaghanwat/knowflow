-- Migration: 007_audit_logs.sql
-- Description: Tamper-resistant, immutable audit logs with decoupled historical identifiers and actor snapshot
-- Author: KNOWFLOW Team

-- 1. Audit Logs Table
-- Records security, compliance, access, and handover approval events
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Decoupled from cascading entity lifecycle: retains point-in-time historical UUIDs
    organization_id UUID NULL,
    project_id UUID NULL,
    actor_id UUID NULL,
    -- Actor identity snapshot at the exact time of the logged event
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

-- Optimize audit log lookups by project, actor, and chronological ordering
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

-- 2. Immutability Trigger
-- Enforce strict append-only integrity: prevent updates or deletions of audit log entries
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
