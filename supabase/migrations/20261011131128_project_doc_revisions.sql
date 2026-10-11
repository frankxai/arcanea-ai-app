-- Atomic owner-bound edits. Existing history is retained, including old duplicate
-- version numbers; only new operation identities receive a uniqueness constraint.
alter table public.project_docs add column save_revision bigint not null default 0
  check (save_revision between 0 and 2147483647);
update public.project_docs d set save_revision = greatest(0, coalesce(
  (select max(version_number) from public.project_doc_versions v where v.doc_id = d.id), 0
));
alter table public.project_doc_versions add column save_operation_id uuid,
  add column save_patch jsonb, add column save_expected_revision bigint;
create unique index project_doc_version_operation on public.project_doc_versions
  (doc_id, save_operation_id) where save_operation_id is not null;

-- Creation inserts the empty content in the same transaction as the document.
create function public.initialize_project_doc_content()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.project_doc_content(doc_id, content_json, content_text, word_count)
    values (new.id, '{}'::jsonb, '', 0);
  return new;
end $$;
revoke all on function public.initialize_project_doc_content() from public, anon, authenticated;
create trigger initialize_project_doc_content after insert on public.project_docs
  for each row execute function public.initialize_project_doc_content();

create function public.save_project_document(
  p_project uuid, p_doc uuid, p_revision bigint, p_operation uuid, p_patch jsonb
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  d public.project_docs%rowtype;
  c public.project_doc_content%rowtype;
  prior public.project_doc_versions%rowtype;
  next_json jsonb; next_text text; next_words integer;
begin
  if auth.uid() is null then raise exception 'document_not_found' using errcode='P0001'; end if;
  if p_operation is null or p_revision is null or p_revision < 0 or p_revision >= 2147483647
    or p_patch is null or jsonb_typeof(p_patch) <> 'object' or p_patch = '{}'::jsonb
    or octet_length(p_patch::text) > 1048576 then
    raise exception 'document_invalid' using errcode='P0001';
  end if;
  if exists(select 1 from jsonb_object_keys(p_patch) k
    where k not in ('title','doc_type','status','icon','content_json','content_text','word_count')) then
    raise exception 'document_invalid' using errcode='P0001';
  end if;
  if (p_patch ? 'title' and (jsonb_typeof(p_patch->'title') <> 'string' or length(p_patch->>'title') > 500))
    or (p_patch ? 'doc_type' and coalesce(p_patch->>'doc_type','') not in ('note','brief','outline','lore','research','prompt_book','spec','journal'))
    or (p_patch ? 'status' and coalesce(p_patch->>'status','') not in ('draft','active','archived','published'))
    or (p_patch ? 'icon' and p_patch->'icon' <> 'null'::jsonb and (jsonb_typeof(p_patch->'icon') <> 'string' or length(p_patch->>'icon') > 100))
    or (p_patch ? 'content_json' and jsonb_typeof(p_patch->'content_json') <> 'object')
    or (p_patch ? 'content_text' and (jsonb_typeof(p_patch->'content_text') <> 'string' or length(p_patch->>'content_text') > 200000))
    or (p_patch ? 'word_count' and (jsonb_typeof(p_patch->'word_count') <> 'number' or (p_patch->>'word_count') !~ '^[0-9]+$' or (p_patch->>'word_count')::numeric > 200000)) then
    raise exception 'document_invalid' using errcode='P0001';
  end if;
  -- Ownership and requested parent are checked before any read, replay or mutation.
  select * into d from public.project_docs
    where id=p_doc and project_id=p_project and user_id=(select auth.uid()) for update;
  if not found then raise exception 'document_not_found' using errcode='P0001'; end if;
  select * into prior from public.project_doc_versions
    where doc_id=d.id and save_operation_id=p_operation;
  if found then
    if prior.save_patch is distinct from p_patch or prior.save_expected_revision is distinct from p_revision then
      raise exception 'document_operation_conflict' using errcode='P0001';
    end if;
    return jsonb_build_object('doc_id',d.id,'project_id',d.project_id,'user_id',d.user_id,
      'operation_id',p_operation,'revision',prior.version_number);
  end if;
  if d.save_revision <> p_revision then raise exception 'document_revision_conflict' using errcode='P0001'; end if;
  select * into c from public.project_doc_content where doc_id=d.id;
  -- Preserve pre-contract content before its first edit, even if history was absent.
  if not exists(select 1 from public.project_doc_versions where doc_id=d.id) then
    insert into public.project_doc_versions(doc_id,version_number,editor_type,author_user_id,content_json,content_text,change_summary)
      values(d.id,0,'human',d.user_id,coalesce(c.content_json,'{}'::jsonb),coalesce(c.content_text,''),'Retained pre-revision content');
  end if;
  next_json := case when p_patch ? 'content_json' then p_patch->'content_json' else coalesce(c.content_json,'{}'::jsonb) end;
  next_text := case when p_patch ? 'content_text' then p_patch->>'content_text' else coalesce(c.content_text,'') end;
  next_words := case when p_patch ? 'word_count' then (p_patch->>'word_count')::integer else coalesce(c.word_count,0) end;
  insert into public.project_doc_content(doc_id,content_json,content_text,word_count,reading_time_minutes)
    values(d.id,next_json,next_text,next_words,greatest(1,round(next_words/200.0)::integer))
    on conflict(doc_id) do update set content_json=excluded.content_json,content_text=excluded.content_text,
      word_count=excluded.word_count,reading_time_minutes=excluded.reading_time_minutes;
  update public.project_docs set
    title=case when p_patch ? 'title' then p_patch->>'title' else title end,
    doc_type=case when p_patch ? 'doc_type' then p_patch->>'doc_type' else doc_type end,
    status=case when p_patch ? 'status' then p_patch->>'status' else status end,
    icon=case when p_patch ? 'icon' then p_patch->>'icon' else icon end,
    save_revision=save_revision+1,last_edited_at=now()
    where id=d.id returning * into d;
  -- A failure here rolls back content, metadata, revision and initial history.
  insert into public.project_doc_versions(doc_id,version_number,editor_type,author_user_id,
    content_json,content_text,save_operation_id,save_patch,save_expected_revision)
    values(d.id,d.save_revision,'human',d.user_id,next_json,next_text,p_operation,p_patch,p_revision);
  return jsonb_build_object('doc_id',d.id,'project_id',d.project_id,'user_id',d.user_id,
    'operation_id',p_operation,'revision',d.save_revision);
end $$;
revoke all on function public.save_project_document(uuid,uuid,bigint,uuid,jsonb) from public, anon;
grant execute on function public.save_project_document(uuid,uuid,bigint,uuid,jsonb) to authenticated;
-- Owner clients can create/delete documents, but edits and history require the RPC.
revoke update on public.project_docs from anon, authenticated;
revoke insert, update, delete on public.project_doc_content, public.project_doc_versions from anon, authenticated;
