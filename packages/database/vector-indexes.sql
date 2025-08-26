-- @author: fatima bashir
-- Vector indexes for Mentorly database
-- Run this after setting up your database with Prisma

-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create vector indexes for similarity search
-- Note: These indexes will be created when you have actual data

-- Index for document chunks vector similarity search
-- CREATE INDEX CONCURRENTLY doc_chunks_embedding_idx 
-- ON doc_chunks USING ivfflat (embedding vector_cosine_ops) 
-- WITH (lists = 100);

-- Index for job descriptions vector similarity search  
-- CREATE INDEX CONCURRENTLY job_descriptions_embedding_idx
-- ON job_descriptions USING ivfflat (embedding vector_cosine_ops)
-- WITH (lists = 100);

-- Text search indexes for hybrid search
CREATE INDEX CONCURRENTLY IF NOT EXISTS doc_chunks_content_gin_idx 
ON doc_chunks USING gin (to_tsvector('english', content));

CREATE INDEX CONCURRENTLY IF NOT EXISTS doc_chunks_content_trgm_idx
ON doc_chunks USING gin (content gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS job_descriptions_description_gin_idx
ON job_descriptions USING gin (to_tsvector('english', description));

-- Helper function for hybrid search scoring
CREATE OR REPLACE FUNCTION hybrid_search_score(
    semantic_score float,
    bm25_score float,
    semantic_weight float DEFAULT 0.7
)
RETURNS float AS $$
BEGIN
    RETURN (semantic_weight * semantic_score) + ((1 - semantic_weight) * bm25_score);
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;
