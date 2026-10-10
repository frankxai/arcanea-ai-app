#!/usr/bin/env bash
set -euo pipefail
# Only the disposable CI database initialized by billing-kernel.sql.
export PGHOST=127.0.0.1 PGUSER=postgres PGDATABASE=postgres
u=00000000-0000-0000-0000-000000000001
psql -v ON_ERROR_STOP=1 -c "BEGIN; SELECT 1 FROM billing_accounts WHERE user_id='$u' FOR UPDATE; SELECT pg_sleep(2); COMMIT;" > /tmp/billing-blocker.log &
blocker=$!
# Wait for the lock-holder to reach its sleep, not an arbitrary server-readiness delay.
for i in $(seq 1 100); do
  ready=$(psql -Atc "SELECT count(*) FROM pg_stat_activity WHERE wait_event='PgSleep' AND query LIKE '%billing_accounts%'")
  if [ "$ready" -gt 0 ]; then break; fi
  sleep 0.02
done
[ "$ready" -gt 0 ]
psql -v ON_ERROR_STOP=1 -c "SELECT billing_settle_reservation('$u','race:target',10);" > /tmp/billing-settle.log &
a=$!
psql -v ON_ERROR_STOP=1 -c "SELECT billing_release_reservation('$u','race:target');" > /tmp/billing-release.log 2>&1 &
b=$!
wait "$blocker"; wait "$a"
# Refund either observes the completed terminal or is refused on staged output.
if ! wait "$b"; then grep -q 'cannot release staged result' /tmp/billing-release.log; fi
psql -v ON_ERROR_STOP=1 <<'SQL'
DO $$ BEGIN
  IF (SELECT count(*) FROM credit_ledger WHERE reference='race:target' AND kind IN ('settle','release')) <> 1 THEN RAISE EXCEPTION 'double finalization'; END IF;
  IF (SELECT reserved FROM billing_accounts WHERE user_id='00000000-0000-0000-0000-000000000001') <> 30 THEN RAISE EXCEPTION 'other operation reserve consumed'; END IF;
END $$;
SQL
# Concurrent duplicates must both succeed, with a single mutation.
for i in 1 2; do
  psql -v ON_ERROR_STOP=1 -c "SELECT billing_grant_credits('$u',100,'purchase','race:purchase'); SELECT billing_reserve_credits('$u',10,'image.standard','race:reserve');" > "/tmp/billing-duplicate-$i.log" &
  pids[$i]=$!
done
wait "${pids[1]}"; wait "${pids[2]}"
psql -v ON_ERROR_STOP=1 <<'SQL'
DO $$ BEGIN
  IF (SELECT count(*) FROM credit_ledger WHERE reference='race:purchase') <> 1 OR (SELECT count(*) FROM credit_ledger WHERE reference='race:reserve') <> 1 THEN RAISE EXCEPTION 'duplicate ledger write'; END IF;
END $$;
SQL
