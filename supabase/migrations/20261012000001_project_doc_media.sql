-- Private originals share the existing account's capacity. No default capacity,
-- live provisioning, public grant, historical migration edit or deletion.
begin;
create table public.project_doc_media (
  id uuid primary key,
  user_id uuid not null references auth.users(id),
  project_id uuid not null,
  doc_id uuid not null,
  byte_size integer not null check (byte_size between 1 and 10485760),
  mime_type text not null check (mime_type in ('image/png','image/jpeg','image/webp')),
  sha256 text not null check (sha256 ~ '^[a-f0-9]{64}$'),
  fingerprint text not null check (fingerprint ~ '^[a-f0-9]{64}$'),
  filename text not null check (length(filename) between 1 and 255),
  alt_text text not null check (length(alt_text) between 1 and 2000),
  source_status text not null default 'creator_supplied_unverified' check (source_status = 'creator_supplied_unverified'),
  rights_status text not null default 'unverified' check (rights_status = 'unverified'),
  status text not null default 'reserved' check (status in ('reserved','ready')),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  check ((status = 'ready') = (completed_at is not null))
);
-- Document deletion must not silently delete storage accounting or private bytes.
-- Scope is reauthorized against the current document on each reserve/read/complete.
create index project_doc_media_owner on public.project_doc_media(user_id,project_id,doc_id);
alter table public.project_doc_media enable row level security;
create policy document_media_owner_read on public.project_doc_media
  for select to authenticated using (
    user_id = (select auth.uid()) and status = 'ready' and exists (
      select 1 from public.project_docs d where d.id = project_doc_media.doc_id
        and d.project_id = project_doc_media.project_id and d.user_id = (select auth.uid())
    )
  );
revoke all on public.project_doc_media from public, anon, authenticated;
grant select on public.project_doc_media to authenticated;
grant all on public.project_doc_media to service_role;

create function public.reserve_project_document_media(
  p_user uuid, p_project uuid, p_doc uuid, p_id uuid, p_size integer,
  p_mime text, p_sha text, p_fingerprint text, p_filename text, p_alt text
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare account public.imagine_storage_accounts%rowtype;
  asset public.project_doc_media%rowtype;
begin
  if auth.role() is distinct from 'service_role' or p_user is null then
    raise exception 'document_media_forbidden' using errcode = '42501';
  end if;
  select * into account from public.imagine_storage_accounts where user_id = p_user for update;
  if not found then raise exception 'document_media_unconfigured' using errcode = 'P0001'; end if;
  perform 1 from public.project_docs where id = p_doc and project_id = p_project and user_id = p_user for share;
  if not found then raise exception 'document_media_missing' using errcode = 'P0001'; end if;
  select * into asset from public.project_doc_media where id = p_id;
  if found then
    if asset.user_id is distinct from p_user or asset.project_id is distinct from p_project
      or asset.doc_id is distinct from p_doc or asset.byte_size is distinct from p_size
      or asset.mime_type is distinct from p_mime or asset.sha256 is distinct from p_sha
      or asset.fingerprint is distinct from p_fingerprint or asset.filename is distinct from p_filename
      or asset.alt_text is distinct from p_alt then
      raise exception 'document_media_conflict' using errcode = 'P0001';
    end if;
    return to_jsonb(asset);
  end if;
  if p_size is null or p_size < 1 or p_size > 10485760 then
    raise exception 'document_media_invalid' using errcode = 'P0001';
  end if;
  if p_size > account.capacity_bytes - account.used_bytes - account.reserved_bytes then
    raise exception 'document_media_full' using errcode = 'P0001';
  end if;
  insert into public.project_doc_media(id,user_id,project_id,doc_id,byte_size,mime_type,sha256,fingerprint,filename,alt_text)
    values(p_id,p_user,p_project,p_doc,p_size,p_mime,p_sha,p_fingerprint,p_filename,p_alt) returning * into asset;
  update public.imagine_storage_accounts set reserved_bytes = reserved_bytes + p_size where user_id = p_user;
  return to_jsonb(asset);
end $$;
create function public.complete_project_document_media(p_user uuid,p_project uuid,p_doc uuid,p_id uuid,p_fingerprint text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare asset public.project_doc_media%rowtype;
begin
  if auth.role() is distinct from 'service_role' or p_user is null then
    raise exception 'document_media_forbidden' using errcode = '42501';
  end if;
  perform 1 from public.imagine_storage_accounts where user_id = p_user for update;
  if not found then raise exception 'document_media_unconfigured' using errcode = 'P0001'; end if;
  perform 1 from public.project_docs where id = p_doc and project_id = p_project and user_id = p_user for share;
  if not found then raise exception 'document_media_missing' using errcode = 'P0001'; end if;
  select * into asset from public.project_doc_media where id = p_id for update;
  if not found or asset.user_id is distinct from p_user or asset.project_id is distinct from p_project
    or asset.doc_id is distinct from p_doc or asset.fingerprint is distinct from p_fingerprint then
    raise exception 'document_media_conflict' using errcode = 'P0001';
  end if;
  if asset.status = 'ready' then return to_jsonb(asset); end if;
  -- Trusted finalization has verified the actual private bytes and decoded image.
  update public.imagine_storage_accounts set reserved_bytes = reserved_bytes - asset.byte_size,
    used_bytes = used_bytes + asset.byte_size where user_id = p_user;
  update public.project_doc_media set status = 'ready', completed_at = now() where id = p_id returning * into asset;
  return to_jsonb(asset);
end $$;
revoke all on function public.reserve_project_document_media(uuid,uuid,uuid,uuid,integer,text,text,text,text,text),
  public.complete_project_document_media(uuid,uuid,uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.reserve_project_document_media(uuid,uuid,uuid,uuid,integer,text,text,text,text,text),
  public.complete_project_document_media(uuid,uuid,uuid,uuid,text) to service_role;
commit;
