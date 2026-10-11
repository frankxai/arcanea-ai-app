-- Private retained images. No public grant, quota default, existing-object
-- migration or deletion. Capacity must be approved and provisioned separately.
begin;

create table public.imagine_storage_accounts (
  user_id uuid primary key references auth.users(id),
  capacity_bytes bigint not null check (capacity_bytes between 0 and 9007199254740991),
  used_bytes bigint not null default 0 check (used_bytes >= 0),
  reserved_bytes bigint not null default 0 check (reserved_bytes >= 0),
  check (used_bytes <= capacity_bytes and reserved_bytes <= capacity_bytes - used_bytes)
);
create table public.imagine_private_assets (
  id uuid primary key,
  user_id uuid not null references auth.users(id),
  byte_size integer not null check (byte_size between 1 and 3145728),
  mime_type text not null check (mime_type in ('image/png','image/jpeg','image/webp')),
  sha256 text not null check (sha256 ~ '^[a-f0-9]{64}$'),
  fingerprint text not null check (fingerprint ~ '^[a-f0-9]{64}$'),
  prompt text not null check (length(prompt) <= 2000),
  alt_text text not null check (length(alt_text) between 1 and 2000),
  source_id text not null check (length(source_id) between 1 and 160),
  provider text check (length(provider) <= 100),
  source_status text not null default 'creator_supplied_unverified'
    check (source_status = 'creator_supplied_unverified'),
  rights_status text not null default 'unverified' check (rights_status = 'unverified'),
  visibility text not null default 'private' check (visibility = 'private'),
  status text not null default 'reserved' check (status in ('reserved','ready')),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  check ((status = 'ready') = (completed_at is not null))
);
create index imagine_private_assets_gallery on public.imagine_private_assets
  (user_id, created_at desc, id desc) where status = 'ready';
alter table public.imagine_storage_accounts enable row level security;
alter table public.imagine_private_assets enable row level security;
create policy imagine_capacity_owner_read on public.imagine_storage_accounts
  for select to authenticated using (user_id = (select auth.uid()));
create policy imagine_asset_owner_read on public.imagine_private_assets
  for select to authenticated using (user_id = (select auth.uid()) and status = 'ready');
revoke all on public.imagine_storage_accounts, public.imagine_private_assets from public, anon, authenticated;
grant select on public.imagine_storage_accounts, public.imagine_private_assets to authenticated;
grant all on public.imagine_storage_accounts, public.imagine_private_assets to service_role;

create function public.imagine_reserve_private_asset(
  p_user uuid, p_id uuid, p_size integer, p_mime text, p_sha text, p_fingerprint text,
  p_prompt text, p_alt text, p_source text, p_provider text
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  account public.imagine_storage_accounts%rowtype;
  asset public.imagine_private_assets%rowtype;
begin
  if auth.role() is distinct from 'service_role' or p_user is null then
    raise exception 'private_asset_forbidden' using errcode = '42501';
  end if;
  -- Serialize all admission for this account, including retries and completion.
  select * into account from public.imagine_storage_accounts where user_id = p_user for update;
  if not found then raise exception 'private_storage_unconfigured' using errcode = 'P0001'; end if;
  select * into asset from public.imagine_private_assets where id = p_id;
  if found then
    if asset.user_id is distinct from p_user or asset.fingerprint is distinct from p_fingerprint
      or asset.sha256 is distinct from p_sha or asset.byte_size is distinct from p_size
      or asset.mime_type is distinct from p_mime or asset.prompt is distinct from p_prompt
      or asset.alt_text is distinct from p_alt or asset.source_id is distinct from p_source
      or asset.provider is distinct from p_provider then
      raise exception 'private_asset_conflict' using errcode = 'P0001';
    end if;
    return to_jsonb(asset);
  end if;
  if p_size is null or p_size < 1 or p_size > 3145728 then
    raise exception 'private_asset_invalid' using errcode = 'P0001';
  end if;
  if p_size > account.capacity_bytes - account.used_bytes - account.reserved_bytes then
    raise exception 'private_storage_full' using errcode = 'P0001';
  end if;
  insert into public.imagine_private_assets
    (id,user_id,byte_size,mime_type,sha256,fingerprint,prompt,alt_text,source_id,provider)
    values (p_id,p_user,p_size,p_mime,p_sha,p_fingerprint,p_prompt,p_alt,p_source,p_provider)
    returning * into asset;
  update public.imagine_storage_accounts set reserved_bytes = reserved_bytes + p_size where user_id = p_user;
  return to_jsonb(asset);
end $$;

create function public.imagine_complete_private_asset(p_user uuid, p_id uuid, p_fingerprint text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare asset public.imagine_private_assets%rowtype;
begin
  if auth.role() is distinct from 'service_role' or p_user is null then
    raise exception 'private_asset_forbidden' using errcode = '42501';
  end if;
  perform 1 from public.imagine_storage_accounts where user_id = p_user for update;
  if not found then raise exception 'private_storage_unconfigured' using errcode = 'P0001'; end if;
  select * into asset from public.imagine_private_assets where id = p_id for update;
  if not found or asset.user_id is distinct from p_user or asset.fingerprint is distinct from p_fingerprint then
    raise exception 'private_asset_conflict' using errcode = 'P0001';
  end if;
  if asset.status = 'ready' then return to_jsonb(asset); end if;
  -- Only the trusted server completes, after reading and hashing actual private bytes.
  update public.imagine_storage_accounts set reserved_bytes = reserved_bytes - asset.byte_size,
    used_bytes = used_bytes + asset.byte_size where user_id = p_user;
  update public.imagine_private_assets set status = 'ready', completed_at = now()
    where id = p_id returning * into asset;
  return to_jsonb(asset);
end $$;

create function public.imagine_read_private_asset(p_id uuid)
returns jsonb language sql security invoker set search_path = '' stable as $$
  select to_jsonb(asset) from public.imagine_private_assets asset
  where id = p_id and user_id = (select auth.uid()) and status = 'ready';
$$;
create function public.imagine_private_gallery(p_before timestamptz default null, p_id uuid default null)
returns jsonb language sql security invoker set search_path = '' stable as $$
  select coalesce(jsonb_agg(to_jsonb(asset) order by created_at desc, id desc), '[]'::jsonb)
  from (
    select * from public.imagine_private_assets
    where user_id = (select auth.uid()) and status = 'ready'
      and (p_before is null or (created_at,id) < (p_before,p_id))
    order by created_at desc,id desc limit 51
  ) asset;
$$;
revoke all on function public.imagine_reserve_private_asset(uuid,uuid,integer,text,text,text,text,text,text,text) from public, anon, authenticated;
revoke all on function public.imagine_complete_private_asset(uuid,uuid,text) from public, anon, authenticated;
grant execute on function public.imagine_reserve_private_asset(uuid,uuid,integer,text,text,text,text,text,text,text),
  public.imagine_complete_private_asset(uuid,uuid,text) to service_role;
revoke all on function public.imagine_read_private_asset(uuid), public.imagine_private_gallery(timestamptz,uuid) from public, anon;
grant execute on function public.imagine_read_private_asset(uuid), public.imagine_private_gallery(timestamptz,uuid) to authenticated;
commit;
