-- V8__documents.sql
-- Document storage for RAG pipeline

CREATE TABLE documents (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_document_id  UUID REFERENCES source_documents(id),
    title               TEXT NOT NULL,
    publisher           TEXT NOT NULL,
    document_type       TEXT NOT NULL,
    language            TEXT NOT NULL DEFAULT 'en',
    base_year           TEXT,
    data_period_from    TEXT,
    data_period_to      TEXT,
    publication_date    DATE,
    retrieval_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source_url          TEXT,
    content_hash        TEXT NOT NULL,
    raw_text_length     INTEGER,
    parse_status        TEXT NOT NULL DEFAULT 'ok' CHECK (parse_status IN ('ok','partial','failed')),
    parse_errors        TEXT[],
    metadata            JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT documents_hash_uq UNIQUE (content_hash)
);
CREATE INDEX idx_documents_publisher ON documents(publisher);
CREATE INDEX idx_documents_pub_date ON documents(publication_date);
CREATE INDEX idx_documents_base_year ON documents(base_year);

CREATE TABLE document_chunks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id     UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index     INTEGER NOT NULL,
    section         TEXT,
    page_number     INTEGER,
    table_label     TEXT,
    chunk_text      TEXT NOT NULL,
    token_count     INTEGER,
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT document_chunks_doc_idx_uq UNIQUE (document_id, chunk_index)
);
CREATE INDEX idx_document_chunks_doc ON document_chunks(document_id);
-- Full-text search index
CREATE INDEX idx_document_chunks_fts ON document_chunks USING GIN (to_tsvector('english', chunk_text));

CREATE TABLE embedding_metadata (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chunk_id        UUID NOT NULL REFERENCES document_chunks(id) ON DELETE CASCADE,
    embedding_model TEXT NOT NULL,
    embedding_dims  INTEGER NOT NULL,
    embedding       vector,                            -- pgvector; dims set at insert time
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT embedding_metadata_chunk_model_uq UNIQUE (chunk_id, embedding_model)
);
-- HNSW index for ANN search (created after first bulk insert)
-- CREATE INDEX idx_embedding_hnsw ON embedding_metadata USING hnsw (embedding vector_cosine_ops);
