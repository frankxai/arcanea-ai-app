"""Sequential OpenRouter development screen, dry by default, with durable receipts.

No tools or private draft inputs. Paid execution requires independently verified
operator authority plus a non-resetting provider-side key cap. This local runner
does not authenticate the approval signer or enforce production tenant isolation.
"""
import argparse
import hashlib
import json
import os
import pathlib
import re
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation

API = 'https://openrouter.ai/api/v1'

def require(condition, message='Execution refused an invalid or unauthorized input'):
    if not condition:
        raise ValueError(message)

def digest(data):
    return hashlib.sha256(data).hexdigest()

def stamp():
    return datetime.now(timezone.utc).isoformat()

def money(value):
    if isinstance(value, bool):
        raise ValueError('Boolean is not money')
    try:
        result = Decimal(str(value))
    except InvalidOperation as error:
        raise ValueError('Invalid monetary amount') from error
    if not result.is_finite() or result < 0:
        raise ValueError('Invalid monetary amount')
    return result

def validate(plan):
    require(plan['contract'] == 'arcanea.development-screen.v1')
    require(plan['partition'] == 'development')
    require(plan['referencesIncluded'] is False and plan['holdoutTasksIncluded'] is False)
    require(plan['maxCalls'] == len(plan['jobs']) <= 24)
    require(0 < money(plan['maxTotalUSD']) <= 10)
    seen = set()
    total = Decimal(0)
    for job in plan['jobs']:
        require(re.fullmatch('[A-Za-z0-9_.-]+', job['id']) and job['id'] not in seen)
        seen.add(job['id'])
        wire = job['request']
        require(wire['model'] == job['model'] and wire['model'] in plan['models'])
        require(job['taskId'] in plan['taskIds'])
        require(wire['stream'] is False and wire['max_tokens'] == 4096)
        require(set(wire) == {'model', 'messages', 'stream', 'max_tokens', 'provider'})
        require([m['role'] for m in wire['messages']] == ['system', 'user'])
        require(all((set(m) == {'role', 'content'} and isinstance(m['content'], str) for m in wire['messages'])))
        provider = wire['provider']
        require(set(provider) == {'allow_fallbacks', 'require_parameters', 'data_collection', 'sort', 'max_price'})
        require(provider['allow_fallbacks'] is False and provider['require_parameters'] is True)
        require(provider['data_collection'] == 'deny' and provider['sort'] == 'price')
        prices = provider['max_price']
        require(set(prices) == {'prompt', 'completion', 'request'} and money(prices['request']) == 0)
        payload = json.dumps(wire, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
        require(digest(payload) == job['requestSha256'])
        require(job['inputTokenEstimateUpper'] == len(payload) + 4096)
        expected = (money(prices['prompt']) * job['inputTokenEstimateUpper'] + money(prices['completion']) * 4096) / 1000000
        require(money(job['reservationUSD']) == expected and expected > 0)
        total += expected
    require(total == money(plan['estimatedReservationTotalUSD']) <= money(plan['maxTotalUSD']))
    return total

def authorize(plan, plan_hash, approval, now=None):
    now = now or datetime.now(timezone.utc)
    require(approval['planSha256'] == plan_hash)
    require(approval['authorizedBy'] == 'Frank' and approval['authorizationSource'].strip())
    require(approval['scope'] == 'one-public-source-development-screen')
    require(money(approval['maxTotalUSD']) == money(plan['maxTotalUSD']))
    require(approval['maxCalls'] == plan['maxCalls'])
    require(approval['allowTopup'] is False and approval['allowKeyCreation'] is False)
    expires = datetime.fromisoformat(approval['expiresAt'])
    require(expires.tzinfo is not None and expires > now)

def capped_key(data, cap):
    require(0 < money(data['limit']) <= cap)
    require(data['limit_reset'] is None and data['include_byok_in_limit'] is True)
    require(0 < money(data['limit_remaining']) <= cap)
    return money(data['limit_remaining'])

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise RuntimeError('Redirect denied; credentials stay on the fixed API origin')

def request(path, key, body=None):
    require(path in ('/key', '/chat/completions'))
    headers = {'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json',
               'X-OpenRouter-Title': 'Arcanea private development screen'}
    req = urllib.request.Request(API + path, data=body, headers=headers, method='POST' if body is not None else 'GET')
    with urllib.request.build_opener(NoRedirect).open(req, timeout=180) as response:
        raw = response.read(5 * 1024 * 1024 + 1)
        if len(raw) > 5 * 1024 * 1024:
            raise RuntimeError('Response exceeded private artifact size cap')
        return json.loads(raw), raw

def append(path, event):
    event = {'at': stamp(), **event}
    with path.open('a', encoding='utf-8') as handle:
        handle.write(json.dumps(event, ensure_ascii=False) + '\n')
        handle.flush()
        os.fsync(handle.fileno())

def progress(path, plan_hash, jobs):
    if not path.exists():
        return set(), Decimal(0)
    rows = [json.loads(line) for line in path.read_text(encoding='utf-8').splitlines()]
    states = {}
    spent = Decimal(0)
    for row in rows:
        require(row['planSha256'] == plan_hash and row['jobId'] in jobs)
        ident = row['jobId']
        if row['kind'] == 'reserved':
            require(ident not in states)
            require(money(row['reservationUSD']) == money(jobs[ident]['reservationUSD']))
            states[ident] = 'reserved'
        elif row['kind'] == 'completed':
            require(states.get(ident) == 'reserved')
            states[ident] = 'completed'
            spent += money(row['actualUSD'])
            require(money(row['actualUSD']) <= money(jobs[ident]['reservationUSD']))
        else:
            raise RuntimeError('Retained uncertain/failed attempt; reconcile it before further calls')
    if any(value != 'completed' for value in states.values()):
        raise RuntimeError('Unsettled reservation; do not replay or release it automatically')
    return set(states), spent

def execute(plan, plan_hash, approval, root, key, transport=request):
    validate(plan)
    authorize(plan, plan_hash, approval)
    require(key, 'Provision the separately authorized capped key through the operator environment')
    lock = root / 'writer.lock'
    # Never delete another writer's lock, including one left by a crash.
    fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    lock_token = str(os.getpid()) + ':' + plan_hash
    os.write(fd, lock_token.encode('ascii'))
    os.fsync(fd)
    os.close(fd)
    ledger = root / 'attempts.jsonl'
    try:
        jobs = {job['id']: job for job in plan['jobs']}
        completed, spent = progress(ledger, plan_hash, jobs)
        for job in plan['jobs']:
            if job['id'] in completed:
                artifact = root / (job['id'] + '.response.json')
                rows = [json.loads(s) for s in ledger.read_text(encoding='utf-8').splitlines()]
                record = next(r for r in rows if r['jobId'] == job['id'] and r['kind'] == 'completed')
                require(digest(artifact.read_bytes()) == record['responseSha256'])
                continue
            authorize(plan, plan_hash, approval)
            reservation = money(job['reservationUSD'])
            require(spent + reservation <= money(plan['maxTotalUSD']))
            key_info, _ = transport('/key', key)
            remaining = capped_key(key_info['data'], money(plan['maxTotalUSD']))
            require(reservation <= remaining)
            base = {'planSha256': plan_hash, 'jobId': job['id']}
            append(ledger, {**base, 'kind': 'reserved', 'reservationUSD': str(reservation)})
            try:
                payload = json.dumps(job['request'], ensure_ascii=False, separators=(',', ':')).encode('utf-8')
                started = time.monotonic()
                result, raw = transport('/chat/completions', key, payload)
                elapsed = time.monotonic() - started
                artifact = root / (job['id'] + '.response.json')
                with artifact.open('xb') as handle:
                    handle.write(raw)
                    handle.flush()
                    os.fsync(handle.fileno())
                actual = money(result['usage']['cost'])
                require(actual <= reservation)
                require(result['model'] == job['model'], 'Returned model does not match the pinned candidate')
                choice = result['choices'][0]
                require(choice['finish_reason'] == 'stop', 'Truncated or tool-request output needs explicit review')
                message = choice['message']
                require(isinstance(message['content'], str) and message['content'].strip())
                require(not message.get('tool_calls'))
                append(ledger, {**base, 'kind': 'completed', 'actualUSD': str(actual),
                               'responseSha256': digest(raw), 'generationId': result['id'],
                               'returnedModel': result['model'], 'usage': result['usage'],
                               'responseLatencySeconds': elapsed, 'returnedProvider': result.get('provider')})
                spent += actual
                completed.add(job['id'])
            except Exception as error:
                failure = {**base, 'kind': 'uncertain-or-rejected',
                           'errorType': type(error).__name__, 'reservationRetainedUSD': str(reservation)}
                if isinstance(error, urllib.error.HTTPError):
                    failure['httpStatus'] = error.code
                    error_raw = error.read(5 * 1024 * 1024)
                    error_path = root / (job['id'] + '.error.bin')
                    with error_path.open('xb') as handle:
                        handle.write(error_raw)
                        handle.flush()
                        os.fsync(handle.fileno())
                    failure['errorBodySha256'] = digest(error_raw)
                append(ledger, failure)
                raise RuntimeError('Stopped after a retained attempt; no retry or fallback was made') from error
        return {'completedCalls': len(completed), 'actualUSD': str(spent), 'humanQualityAccepted': False}
    finally:
        if lock.exists() and lock.read_text(encoding='ascii') == lock_token:
            lock.unlink()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--plan', type=pathlib.Path, default=pathlib.Path(__file__).resolve().parent / 'plan.json')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--approval', type=pathlib.Path)
    args = parser.parse_args()
    raw = args.plan.read_bytes()
    plan = json.loads(raw)
    total = validate(plan)
    if not args.execute:
        print(json.dumps({'status': 'dry-run', 'callsPlanned': len(plan['jobs']), 'candidateCalls': 0,
                          'planSha256': digest(raw), 'reservationEstimateUSD': str(total),
                          'authorization': 'pending', 'apiCredentialRead': False}))
        return
    require(args.approval is not None, 'Paid execution requires a verified explicit approval receipt')
    approval = json.loads(args.approval.read_text(encoding='utf-8'))
    print(json.dumps(execute(plan, digest(raw), approval, args.plan.resolve().parent, os.environ.get('OPENROUTER_API_KEY', ''))))

if __name__ == '__main__':
    main()
