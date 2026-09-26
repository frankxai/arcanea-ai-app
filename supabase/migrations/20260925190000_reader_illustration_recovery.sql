-- A request may end after the debit or the creation is stored but before its
-- final RPC response. Every 5 minutes, resolve reservations older than the
-- route's 120-second maximum lifetime. Completed creations remain chargeable;
-- those without a creation are refunded exactly once under the ledger lock.
create or replace function public.reconcile_reader_illustrations()
returns integer language plpgsql security invoker set search_path = '' as $$
declare v_request record; v_creation_id uuid; v_count integer := 0;
begin
  for v_request in
    select id, user_id from public.reader_illustration_requests
    where status = 'pending' and created_at < now() - interval '15 minutes'
    order by created_at limit 100 for update skip locked
  loop
    select id into v_creation_id from public.creations
      where user_id = v_request.user_id and type = 'image'
        and metadata->>'source' = 'reader'
        and metadata->>'requestId' = v_request.id::text
      order by created_at desc limit 1;
    perform public.settle_reader_illustration(v_request.user_id, v_request.id, v_creation_id);
    v_count := v_count + 1;
  end loop;
  return v_count;
end $$;
revoke all on function public.reconcile_reader_illustrations() from public, anon, authenticated;

do $$ begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule('reconcile-reader-illustrations', '*/5 * * * *',
      'select public.reconcile_reader_illustrations()');
  end if;
end $$;
