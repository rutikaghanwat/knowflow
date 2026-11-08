-- Migration: 008_seed_system_permissions.sql
-- Description: Baseline system permission registry entries for RBAC and access control
-- Author: KNOWFLOW Team

INSERT INTO public.permissions (code, name, category, description)
VALUES
    -- Project scope
    ('project:view', 'View Project Details', 'PROJECT', 'Permission to view project overview, metadata, and status'),
    ('project:edit', 'Edit Project Settings', 'PROJECT', 'Permission to edit project settings, description, and status'),
    ('project:manage_members', 'Manage Project Members & Roles', 'PROJECT', 'Permission to assign roles and manage members in the project'),

    -- Sources scope
    ('sources:upload', 'Upload Source Documents', 'SOURCES', 'Permission to upload PDF and DOCX files'),
    ('sources:connect_github', 'Connect GitHub Repositories', 'SOURCES', 'Permission to connect and synchronize GitHub repositories'),
    ('sources:view', 'View Sources & Chunks', 'SOURCES', 'Permission to view authorized project sources and chunks'),
    ('sources:manage_access', 'Manage Source ACLs', 'SOURCES', 'Permission to grant or restrict role access to specific sources'),
    ('sources:delete', 'Delete Sources', 'SOURCES', 'Permission to remove source documents or repositories'),

    -- Handovers scope
    ('handovers:create', 'Create Handover Process', 'HANDOVERS', 'Permission to initiate a new handover process for a departing member'),
    ('handovers:view', 'View Handover Reports', 'HANDOVERS', 'Permission to view generated handover reports within authorized scope'),
    ('handovers:review', 'Review Handover Reports', 'HANDOVERS', 'Permission for managers to review, curate, and comment on handover reports'),
    ('handovers:approve', 'Approve / Reject Handover Reports', 'HANDOVERS', 'Permission for designated managers to formally approve or reject reports'),
    ('handovers:share', 'Share Approved Reports', 'HANDOVERS', 'Permission to distribute approved handover reports to recipients'),

    -- Audit & Security
    ('audit:view', 'View Audit Logs', 'AUDIT', 'Permission to view compliance and security audit logs'),

    -- Admin
    ('admin:all', 'Full Project Administration', 'ADMIN', 'Superuser administrative access within the project')
ON CONFLICT (code) DO UPDATE 
SET 
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description;
