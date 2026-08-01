-- E14.01 — append-only audit triggers for sensitive tables
create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_log (org_id, actor_id, table_name, record_id, action, old_data, new_data)
  values (
    coalesce(NEW.org_id, OLD.org_id),
    auth.uid(),
    TG_TABLE_NAME,
    coalesce(NEW.id, OLD.id),
    TG_OP,
    case when TG_OP in ('UPDATE', 'DELETE') then to_jsonb(OLD) else null end,
    case when TG_OP in ('INSERT', 'UPDATE') then to_jsonb(NEW) else null end
  );
  return coalesce(NEW, OLD);
end;
$$;

drop trigger if exists audit_documents on public.documents;
create trigger audit_documents
after insert or update or delete on public.documents
for each row execute function public.audit_row_change();

drop trigger if exists audit_org_members on public.org_members;
create trigger audit_org_members
after insert or update or delete on public.org_members
for each row execute function public.audit_row_change();
