-- Migration: 003_projects_and_permissions.sql
-- Description: Projects, manager-defined project roles, permissions, and project membership with active status
-- Author: KNOWFLOW Team

-- 1. Projects Table
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

-- 2. System Permissions Registry Table
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('PROJECT', 'SOURCES', 'HANDOVERS', 'AUDIT', 'ADMIN')),
    description TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_permissions_category ON public.permissions(category);

-- 3. Manager-defined Project Roles Table
CREATE TABLE IF NOT EXISTS public.project_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    is_system BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_project_roles_project_name UNIQUE (project_id, name),
    -- Composite unique key to support cross-table project-consistency foreign keys
    CONSTRAINT uq_project_roles_project_id UNIQUE (project_id, id)
);

CREATE INDEX IF NOT EXISTS idx_project_roles_project ON public.project_roles(project_id);

CREATE TRIGGER trg_project_roles_updated_at
    BEFORE UPDATE ON public.project_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Role Permissions Mapping Table
CREATE TABLE IF NOT EXISTS public.project_role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.project_roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_project_role_permissions UNIQUE (role_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_project_role_perms_role ON public.project_role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_project_role_perms_perm ON public.project_role_permissions(permission_id);

-- 5. Project Members Table
CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_project_members UNIQUE (project_id, user_id),
    -- Enforce project integrity: role must belong to the exact same project
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
