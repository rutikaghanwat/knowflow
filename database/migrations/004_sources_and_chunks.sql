-- Migration: 004_sources_and_chunks.sql
-- Description: Ingestion sources (PDF/DOCX, GitHub), source ACLs, and vector document chunks with Exclusive Arc integrity
-- Author: KNOWFLOW Team

-- 1. Source Documents (PDF/DOCX Uploads) Table
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

-- 2. GitHub Connected Sources Table
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

-- 3. Source Role Permissions Table (Exclusive Arc & Same-Project Foreign Keys)
CREATE TABLE IF NOT EXISTS public.source_role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    source_document_id UUID NULL,
    github_source_id UUID NULL,
    -- Stored generated columns for clean query compatibility
    source_type VARCHAR(20) GENERATED ALWAYS AS (
        CASE WHEN source_document_id IS NOT NULL THEN 'DOCUMENT' ELSE 'GITHUB' END
    ) STORED,
    source_id UUID GENERATED ALWAYS AS (
        COALESCE(source_document_id, github_source_id)
    ) STORED,
    role_id UUID NOT NULL,
    can_read BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Exactly one source reference must be populated
    CONSTRAINT chk_source_role_perms_arc CHECK (
        (source_document_id IS NOT NULL AND github_source_id IS NULL) OR
        (source_document_id IS NULL AND github_source_id IS NOT NULL)
    ),
    -- Guarantees source document and ACL rule belong to the exact same project
    CONSTRAINT fk_source_role_perms_doc 
        FOREIGN KEY (project_id, source_document_id) 
        REFERENCES public.source_documents(project_id, id) 
        ON DELETE CASCADE,
    -- Guarantees GitHub repo and ACL rule belong to the exact same project
    CONSTRAINT fk_source_role_perms_github 
        FOREIGN KEY (project_id, github_source_id) 
        REFERENCES public.github_sources(project_id, id) 
        ON DELETE CASCADE,
    -- Guarantees role belongs to the exact same project
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

-- 4. Document Chunks & Vector Embeddings Table (Exclusive Arc & Same-Project Foreign Keys)
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    source_document_id UUID NULL,
    github_source_id UUID NULL,
    -- Stored generated columns for clean query compatibility
    source_type VARCHAR(20) GENERATED ALWAYS AS (
        CASE WHEN source_document_id IS NOT NULL THEN 'DOCUMENT' ELSE 'GITHUB' END
    ) STORED,
    source_id UUID GENERATED ALWAYS AS (
        COALESCE(source_document_id, github_source_id)
    ) STORED,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    token_count INTEGER NULL,
    -- Vector dimension 384 corresponds to sentence-transformers 'all-MiniLM-L6-v2'
    embedding vector(384) NULL,
    page_number INTEGER NULL,
    file_path TEXT NOT NULL,
    start_line INTEGER NULL,
    end_line INTEGER NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Composite unique key to support composite foreign keys from evidence_references
    CONSTRAINT uq_document_chunks_project_id UNIQUE (project_id, id),
    -- Exactly one source reference must be populated
    CONSTRAINT chk_document_chunks_arc CHECK (
        (source_document_id IS NOT NULL AND github_source_id IS NULL) OR
        (source_document_id IS NULL AND github_source_id IS NOT NULL)
    ),
    -- Guarantees chunks belong to the exact same project as their source document
    CONSTRAINT fk_document_chunks_source_doc 
        FOREIGN KEY (project_id, source_document_id) 
        REFERENCES public.source_documents(project_id, id) 
        ON DELETE CASCADE,
    -- Guarantees chunks belong to the exact same project as their GitHub repository
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

-- HNSW Cosine distance index for high-performance vector retrieval
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding_hnsw 
    ON public.document_chunks 
    USING hnsw (embedding vector_cosine_ops);
