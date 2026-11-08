-- Migration: 009_enable_rls_security.sql
-- Description: Enable Row Level Security (RLS) across all 19 application tables
-- Purpose: Prevent direct PostgREST table exposure from clients; mandate backend Express RBAC
-- Author: KNOWFLOW Team

-- ----------------------------------------------------------------------------
-- 1. Enable RLS on All 19 Application Tables
-- ----------------------------------------------------------------------------

-- Identity & Multi-Tenancy
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Projects & RBAC
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Ingestion Sources & Chunks
ALTER TABLE public.source_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;

-- AI Knowledge & Evidence
ALTER TABLE public.knowledge_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_references ENABLE ROW LEVEL SECURITY;

-- Handovers & Approvals
ALTER TABLE public.handovers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handover_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;

-- Audit
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 2. Client PostgREST Policy Architecture (Default-Deny)
-- ----------------------------------------------------------------------------
-- By default in PostgreSQL, enabling RLS without permissive policies results
-- in an absolute DENY ALL for the 'anon' and 'authenticated' roles.
--
-- This guarantees that clients CANNOT bypass the Express backend to query
-- source documents, embeddings, knowledge findings, reports, or audit logs directly.
--
-- The ONLY client-facing policy permitted is self-profile reading:

DROP POLICY IF EXISTS "user_profiles_self_read" ON public.user_profiles;
CREATE POLICY "user_profiles_self_read"
    ON public.user_profiles
    FOR SELECT
    TO authenticated
    USING (id = (SELECT auth.uid()));

-- All mutations, project permissions, handover generation, manager approvals,
-- and source ACL enforcement MUST be executed through the KNOWFLOW backend using
-- the service-role connection (which bypasses RLS).
