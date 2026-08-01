-- E7.01 / E7.02 — Postgres full-text search (tsvector + GIN + pg_trgm)
-- Archive search stays in Postgres; no Elasticsearch.

create extension if not exists pg_trgm;

-- Generated search vector over filename, type, cost center, and OCR text mirror.
-- ocr_text is a denormalized column filled by index/classify jobs (nullable until OCR).
alter table public.documents
  add column if not exists ocr_text text;

alter table public.documents
  add column if not exists search_vector tsvector
  generated always as (
    setweight(to_tsvector('portuguese', coalesce(original_filename, '')), 'A')
    || setweight(to_tsvector('portuguese', coalesce(document_type, '')), 'B')
    || setweight(to_tsvector('portuguese', coalesce(cost_center, '')), 'B')
    || setweight(to_tsvector('portuguese', coalesce(ocr_text, '')), 'C')
  ) stored;

create index if not exists documents_search_vector_gin_idx
  on public.documents using gin (search_vector);

create index if not exists documents_original_filename_trgm_idx
  on public.documents using gin (original_filename gin_trgm_ops);

create index if not exists documents_ocr_text_trgm_idx
  on public.documents using gin (ocr_text gin_trgm_ops);

-- Optional helper for fuzzy / partial match under RLS (callers still filter org_id).
create or replace function public.documents_search(
  p_org_id uuid,
  p_query text,
  p_limit int default 20,
  p_offset int default 0
)
returns table (
  id uuid,
  original_filename text,
  document_type text,
  status text,
  rank real
)
language sql
stable
as $$
  select
    d.id,
    d.original_filename,
    d.document_type,
    d.status,
    greatest(
      ts_rank(d.search_vector, websearch_to_tsquery('portuguese', p_query)),
      similarity(d.original_filename, p_query)
    ) as rank
  from public.documents d
  where d.org_id = p_org_id
    and (
      d.search_vector @@ websearch_to_tsquery('portuguese', p_query)
      or d.original_filename % p_query
      or coalesce(d.ocr_text, '') % p_query
    )
  order by rank desc
  limit greatest(p_limit, 1)
  offset greatest(p_offset, 0);
$$;
