-- =====================================================
-- DocPilot AI Database Schema
-- =====================================================
--
-- Database : PostgreSQL (Supabase)
-- Extension : pgvector
--
-- Description:
-- Database schema for DocPilot AI including
-- user profiles, workspaces, PDF documents,
-- vector embeddings, chat history,
-- tasks, tool logs, and semantic search.
--
-- =====================================================

CREATE EXTENSION IF NOT EXISTS vector;

-- =====================================================
-- PROFILES
-- =====================================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- WORKSPACES
-- =====================================================

CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workspaces_user
ON workspaces(user_id);

-- =====================================================
-- DOCUMENTS
-- =====================================================

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_hash TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(workspace_id, file_hash)
);

CREATE INDEX idx_documents_workspace
ON documents(workspace_id);

-- =====================================================
-- DOCUMENT CHUNKS (Shared Vector Store)
-- =====================================================

CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workspace_id UUID NOT NULL
        REFERENCES workspaces(id)
        ON DELETE CASCADE,

    document_id UUID NOT NULL
        REFERENCES documents(id)
        ON DELETE CASCADE,

    chunk_number INT NOT NULL,

    page_number INT,

    chunk_text TEXT NOT NULL,

    embedding VECTOR(384),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chunks_workspace
ON document_chunks(workspace_id);

-- =====================================================
-- CHAT HISTORY
-- =====================================================

CREATE TABLE chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workspace_id UUID NOT NULL
        REFERENCES workspaces(id)
        ON DELETE CASCADE,

    user_id UUID NOT NULL
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    question TEXT NOT NULL,

    answer TEXT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_workspace
ON chat_history(workspace_id);

-- =====================================================
-- TASKS
-- =====================================================

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workspace_id UUID NOT NULL
        REFERENCES workspaces(id)
        ON DELETE CASCADE,

    title TEXT NOT NULL,

    status TEXT DEFAULT 'Pending',

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_workspace
ON tasks(workspace_id);

-- =====================================================
-- TOOL LOGS
-- =====================================================

CREATE TABLE tool_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workspace_id UUID NOT NULL
        REFERENCES workspaces(id)
        ON DELETE CASCADE,

    tool_name TEXT NOT NULL,

    arguments JSONB,

    result JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tool_logs_workspace
ON tool_logs(workspace_id);

-- =====================================================
-- VECTOR SIMILARITY SEARCH FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION public.match_document_chunks(
    query_embedding VECTOR(384),
    workspace UUID,
    match_count INTEGER
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    filename TEXT,
    page_number INTEGER,
    chunk_text TEXT,
    similarity DOUBLE PRECISION
)
LANGUAGE SQL
AS $$
SELECT
    dc.id,
    dc.document_id,
    d.filename,
    dc.page_number,
    dc.chunk_text,
    1 - (dc.embedding <=> query_embedding) AS similarity
FROM document_chunks dc
JOIN documents d
    ON d.id = dc.document_id
WHERE dc.workspace_id = workspace
ORDER BY dc.embedding <=> query_embedding
LIMIT match_count;
$$;