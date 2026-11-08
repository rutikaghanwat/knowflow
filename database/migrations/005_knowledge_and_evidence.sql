-- Migration: 005_knowledge_and_evidence.sql
-- Description: Extracted knowledge findings, evidence references with project-level integrity and historical preservation
-- Author: KNOWFLOW Team

-- 1. Knowledge Findings Table
-- Represents extracted units of knowledge categorized by type and epistemic classification
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
    -- Composite unique key to enforce same-project foreign keys from evidence_references
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

-- 2. Evidence References Table
-- Connects findings to raw chunks and source metadata; retains historical evidence if sources are deleted
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
    -- Enforce same-project consistency across finding, sources, and chunks
    CONSTRAINT fk_evidence_finding 
        FOREIGN KEY (project_id, finding_id) 
        REFERENCES public.knowledge_findings(project_id, id) 
        ON DELETE CASCADE,
    -- Column-list ON DELETE SET NULL preserves project_id when source is deleted (PostgreSQL 15+)
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
    -- Strict Lifecycle Constraint:
    -- When active: exactly one source reference must be populated.
    -- When deleted: both source references must be null, but title and snippet metadata persist.
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

-- Trigger: Automatically mark evidence as historical when its parent source is deleted
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
