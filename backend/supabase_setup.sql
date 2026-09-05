-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your documents
create table documents (
  id uuid primary key default uuid_generate_v4(),
  content text,               -- corresponds to Document.page_content
  metadata jsonb,             -- corresponds to Document.metadata
  embedding vector(768)       -- 768 works for Gemini text-embedding-004 and text-embedding-004 models
);

-- Create a function to search for documents
create function match_documents (
  query_embedding vector(768),
  match_count int DEFAULT null,
  filter jsonb DEFAULT '{}'
) returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Create an index to speed up vector searches
create index on documents using hnsw (embedding vector_cosine_ops);
