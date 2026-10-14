"""Offline recovery and authorization checks; never uses a provider credential."""
import copy
import hashlib
import json
import pathlib
import tempfile
import unittest
from unittest.mock import patch
from datetime import datetime, timedelta, timezone
from decimal import Decimal
import importlib.util
import io

ROOT = pathlib.Path(__file__).resolve().parent
SCRIPT = ROOT.parent / 'narrative-evals/openrouter-screen.py'
spec = importlib.util.spec_from_file_location('narrative_screen', SCRIPT)
run = importlib.util.module_from_spec(spec)
spec.loader.exec_module(run)

# Synthetic offline fixture. No manuscript, evaluation answer, key or live output.
def fixture_plan():
    models = ['fixture/alpha', 'fixture/beta', 'fixture/gamma', 'fixture/delta']
    tasks = ['DB-EVAL-05', 'DB-EVAL-06', 'DB-EVAL-13']
    jobs = []
    for repeat in (1, 2):
        for task in tasks:
            for model in models:
                wire = {'model': model, 'messages': [{'role': 'system', 'content': 'OFFLINE SYSTEM'}, {'role': 'user', 'content': 'OFFLINE INPUT'}], 'stream': False, 'max_tokens': 4096,
                        'provider': {'allow_fallbacks': False, 'require_parameters': True, 'data_collection': 'deny', 'sort': 'price', 'max_price': {'prompt': 1, 'completion': 2, 'request': 0}}}
                raw = json.dumps(wire,ensure_ascii=False,separators=(',', ':')).encode('utf-8')
                upper = len(raw) + 4096
                reserve = (Decimal(upper) + Decimal(8192)) / 1000000
                jobs.append({'id': task + '-r' + str(repeat) + '-' + model.replace('/', '--'), 'taskId': task, 'repeat': repeat, 'model': model, 'request': wire,
                             'requestSha256': hashlib.sha256(raw).hexdigest(), 'inputTokenEstimateUpper': upper, 'reservationUSD': str(reserve)})
    return {'contract': 'arcanea.development-screen.v1', 'partition': 'development', 'referencesIncluded': False, 'holdoutTasksIncluded': False,
            'maxCalls': 24, 'maxTotalUSD': '10', 'jobs': jobs, 'models': models, 'taskIds': tasks,
            'estimatedReservationTotalUSD': str(sum(Decimal(j['reservationUSD']) for j in jobs))}

PLAN = fixture_plan()

def approval(plan, sha='bound-plan'):
    return {'planSha256': sha, 'authorizedBy': 'Frank', 'authorizationSource': 'OFFLINE TEST ONLY',
            'scope': 'one-public-source-development-screen', 'maxTotalUSD': plan['maxTotalUSD'],
            'maxCalls': plan['maxCalls'], 'allowTopup': False, 'allowKeyCreation': False,
            'payer': 'openrouter-credits', 'byokEligibilityVerifiedAbsent': True,
            'fundingConfigurationReceipt': 'OFFLINE TEST ONLY; no eligible account BYOK configuration',
            'credentialSha256': hashlib.sha256(b'TEST ONLY').hexdigest(),
            'expiresAt': (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat()}

def one_job():
    plan = copy.deepcopy(PLAN)
    plan['jobs'] = plan['jobs'][:1]
    plan['maxCalls'] = 1
    plan['estimatedReservationTotalUSD'] = plan['jobs'][0]['reservationUSD']
    return plan

def key_data():
    return {'data': {'limit': 10, 'limit_reset': None, 'include_byok_in_limit': True, 'limit_remaining': 10}}

def billing_data(plan):
    return {'data': {'id': 'gen-OFFLINE-generation', 'model': plan['jobs'][0]['model'],
                     'is_byok': False, 'total_cost': 0.01, 'provider_name': 'OFFLINE FIXTURE'}}

class RunnerChecks(unittest.TestCase):
    def test_plan_valid_and_no_reference_or_holdout_delivery(self):
        self.assertGreater(run.validate(PLAN), Decimal('0'))
        self.assertLess(run.validate(PLAN), Decimal('10'))
        self.assertEqual(len(PLAN['jobs']), 24)
        self.assertEqual(set(PLAN['taskIds']), {'DB-EVAL-05', 'DB-EVAL-06', 'DB-EVAL-13'})
        self.assertFalse(PLAN['referencesIncluded'])
        self.assertFalse(PLAN['holdoutTasksIncluded'])

    def test_request_tampering_rejected(self):
        plan = copy.deepcopy(PLAN)
        plan['jobs'][0]['request']['messages'][1]['content'] += '\nInjected alteration'
        with self.assertRaises(ValueError):
            run.validate(plan)

    def test_budget_reservation_cannot_be_reduced(self):
        plan = copy.deepcopy(PLAN)
        plan['jobs'][0]['reservationUSD'] = '0.0001'
        with self.assertRaises(ValueError):
            run.validate(plan)

    def test_total_cap_and_job_count_cannot_expand(self):
        for field, value in [('maxTotalUSD', '11'), ('maxCalls', 25)]:
            with self.subTest(field=field):
                plan = copy.deepcopy(PLAN)
                plan[field] = value
                with self.assertRaises(ValueError):
                    run.validate(plan)

    def test_fallback_tools_and_data_collection_expansion_rejected(self):
        mutations = [lambda w: w.update({'tools': []}),
                     lambda w: w['provider'].update({'allow_fallbacks': True}),
                     lambda w: w['provider'].update({'data_collection': 'allow'})]
        for mutate in mutations:
            plan = copy.deepcopy(PLAN)
            mutate(plan['jobs'][0]['request'])
            with self.assertRaises(ValueError):
                run.validate(plan)

    def test_approval_wrong_plan_or_expired_or_money_action_rejected(self):
        for mutate in [lambda a: a.update({'planSha256': 'other'}),
                       lambda a: a.update({'expiresAt': '2000-01-01T00:00:00+00:00'}),
                       lambda a: a.update({'allowTopup': True}),
                       lambda a: a.update({'allowKeyCreation': True}),
                       lambda a: a.update({'maxTotalUSD': '20'})]:
            item = approval(PLAN)
            mutate(item)
            with self.assertRaises(ValueError):
                run.authorize(PLAN, 'bound-plan', item)

    def test_nonresetting_capped_key_required(self):
        for mutate in [lambda k: k.update({'limit': None}),
                       lambda k: k.update({'limit': 11}),
                       lambda k: k.update({'limit_reset': 'daily'}),
                       lambda k: k.update({'include_byok_in_limit': False}),
                       lambda k: k.update({'limit_remaining': 0})]:
            data = key_data()['data']
            mutate(data)
            with self.assertRaises(ValueError):
                run.capped_key(data, Decimal('10'))

    def test_unverified_payer_and_different_credential_stop_before_transport(self):
        plan = one_job()
        for mutate in [lambda a: a.update({'payer': 'provider-byok'}),
                       lambda a: a.update({'byokEligibilityVerifiedAbsent': False}),
                       lambda a: a.update({'fundingConfigurationReceipt': ''}),
                       lambda a: a.update({'credentialSha256': 'different'})]:
            item = approval(plan)
            mutate(item)
            with self.with_root() as directory:
                with self.assertRaises(ValueError):
                    run.execute(plan, 'bound-plan', item, pathlib.Path(directory), 'TEST ONLY', lambda *a: self.fail('Transport reached'))

    def test_nan_infinity_negative_and_boolean_money_rejected(self):
        for value in ['NaN', 'Infinity', '-1', True, None]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                run.money(value)

    def with_root(self):
        return tempfile.TemporaryDirectory(prefix='offline-', dir=ROOT)

    def test_no_approval_or_key_makes_no_transport_call(self):
        plan = one_job()
        calls = []
        def transport(*args):
            calls.append(args[0])
            raise AssertionError('Network must not be reached')
        with self.with_root() as directory:
            root = pathlib.Path(directory).resolve()
            self.assertEqual(root.parent, ROOT)
            bad = approval(plan)
            bad['planSha256'] = 'wrong'
            with self.assertRaises(ValueError):
                run.execute(plan, 'bound-plan', bad, root, 'TEST ONLY', transport)
            with self.assertRaises(ValueError):
                run.execute(plan, 'bound-plan', approval(plan), root, '', transport)
            self.assertEqual(calls, [])
            self.assertFalse((root / 'attempts.jsonl').exists())

    def test_foreign_lock_is_preserved_and_no_transport_call(self):
        plan = one_job()
        with self.with_root() as directory:
            root = pathlib.Path(directory).resolve()
            lock = root / 'writer.lock'
            lock.write_text('another-owner', encoding='ascii')
            with self.assertRaises(FileExistsError):
                run.execute(plan, 'bound-plan', approval(plan), root, 'TEST ONLY', lambda *a: self.fail('Transport reached'))
            self.assertEqual(lock.read_text(encoding='ascii'), 'another-owner')

    def test_failed_lock_initialization_closes_descriptor_and_preserves_lock(self):
        plan = one_job()
        with self.with_root() as directory:
            root = pathlib.Path(directory)
            with patch.object(run.os, 'fsync', side_effect=OSError('OFFLINE lock initialization failure')), patch.object(run.os, 'close', wraps=run.os.close) as closer:
                with self.assertRaises(OSError):
                    run.execute(plan, 'bound-plan', approval(plan), root, 'TEST ONLY', lambda *a: self.fail('Transport reached'))
                closer.assert_called_once()
            self.assertTrue((root / 'writer.lock').exists())
            self.assertFalse((root / 'attempts.jsonl').exists())

    def test_lost_response_retains_reservation_and_resume_does_not_replay(self):
        plan = one_job()
        calls = []
        def transport(path, key, body=None):
            calls.append(path)
            if path == '/key':
                return key_data(), b'{}'
            raise TimeoutError('OFFLINE injected lost response')
        with self.with_root() as directory:
            root = pathlib.Path(directory).resolve()
            with self.assertRaises(RuntimeError):
                run.execute(plan, 'bound-plan', approval(plan), root, 'TEST ONLY', transport)
            self.assertEqual(calls, ['/key', '/chat/completions'])
            rows = [json.loads(s) for s in (root / 'attempts.jsonl').read_text(encoding='utf-8').splitlines()]
            self.assertEqual([r['kind'] for r in rows], ['reserved', 'uncertain-or-rejected'])
            with self.assertRaises(RuntimeError):
                run.execute(plan, 'bound-plan', approval(plan), root, 'TEST ONLY', transport)
            self.assertEqual(calls, ['/key', '/chat/completions'])

    def test_crash_after_reservation_stops_before_network(self):
        plan = one_job()
        job = plan['jobs'][0]
        with self.with_root() as directory:
            root = pathlib.Path(directory).resolve()
            run.append(root / 'attempts.jsonl', {'planSha256': 'bound-plan', 'jobId': job['id'],
                       'kind': 'reserved', 'reservationUSD': job['reservationUSD']})
            with self.assertRaises(RuntimeError):
                run.execute(plan, 'bound-plan', approval(plan), root, 'TEST ONLY', lambda *a: self.fail('Transport reached'))

    def test_completed_call_is_preserved_and_not_repeated_on_resume(self):
        plan = one_job()
        calls = []
        def transport(path, key, body=None):
            calls.append(path)
            if path == '/key':
                return key_data(), b'{}'
            if path.startswith('/generation?'):
                data = billing_data(plan)
                return data, json.dumps(data).encode('utf-8')
            data = {'id': 'gen-OFFLINE-generation', 'model': plan['jobs'][0]['model'],
                    'usage': {'cost': 0.01}, 'choices': [{'finish_reason': 'stop', 'message': {'content': 'OFFLINE SAMPLE'}}]}
            return data, json.dumps(data).encode('utf-8')
        with self.with_root() as directory:
            root = pathlib.Path(directory).resolve()
            result = run.execute(plan, 'bound-plan', approval(plan), root, 'TEST ONLY', transport)
            self.assertEqual(result['completedCalls'], 1)
            self.assertEqual(run.execute(plan, 'bound-plan', approval(plan), root, 'TEST ONLY', transport), result)
            self.assertEqual(calls, ['/key', '/chat/completions', '/generation?id=gen-OFFLINE-generation'])

    def test_changed_completed_response_stops_resume(self):
        plan = one_job()
        job = plan['jobs'][0]
        with self.with_root() as directory:
            root = pathlib.Path(directory).resolve()
            (root / (job['id'] + '.response.json')).write_bytes(b'altered')
            (root / (job['id'] + '.billing.json')).write_bytes(b'original-billing')
            ledger = root / 'attempts.jsonl'
            common = {'planSha256': 'bound-plan', 'jobId': job['id']}
            run.append(ledger, {**common, 'kind': 'reserved', 'reservationUSD': job['reservationUSD']})
            run.append(ledger, {**common, 'kind': 'completed', 'actualUSD': '0.01', 'responseSha256': hashlib.sha256(b'original').hexdigest(), 'billingSha256': hashlib.sha256(b'original-billing').hexdigest()})
            with self.assertRaises(ValueError):
                run.execute(plan, 'bound-plan', approval(plan), root, 'TEST ONLY', lambda *a: self.fail('Transport reached'))

    def test_changed_completed_billing_receipt_stops_resume(self):
        plan = one_job()
        job = plan['jobs'][0]
        with self.with_root() as directory:
            root = pathlib.Path(directory)
            (root / (job['id'] + '.response.json')).write_bytes(b'original-response')
            (root / (job['id'] + '.billing.json')).write_bytes(b'altered-billing')
            common = {'planSha256': 'bound-plan', 'jobId': job['id']}
            ledger = root / 'attempts.jsonl'
            run.append(ledger, {**common, 'kind': 'reserved', 'reservationUSD': job['reservationUSD']})
            run.append(ledger, {**common, 'kind': 'completed', 'actualUSD': '0.01',
                       'responseSha256': hashlib.sha256(b'original-response').hexdigest(),
                       'billingSha256': hashlib.sha256(b'original-billing').hexdigest()})
            with self.assertRaises(ValueError):
                run.execute(plan, 'bound-plan', approval(plan), root, 'TEST ONLY', lambda *a: self.fail('Transport reached'))

    def test_model_drift_truncation_tools_and_missing_cost_stop_without_retry(self):
        for mutate in [lambda r: r.update({'model': 'another-model'}),
                       lambda r: r['choices'][0].update({'finish_reason': 'length'}),
                       lambda r: r['choices'][0]['message'].update({'tool_calls': [{'id': 'forbidden'}]}),
                       lambda r: r.update({'usage': {}}),
                       lambda r: r['usage'].update({'cost': 100})]:
            plan = one_job()
            calls = []
            def transport(path, key, body=None):
                calls.append(path)
                if path == '/key':
                    return key_data(), b'{}'
                if path.startswith('/generation?'):
                    data = billing_data(plan)
                    return data, json.dumps(data).encode('utf-8')
                data = {'id': 'gen-OFFLINE-generation', 'model': plan['jobs'][0]['model'],
                        'usage': {'cost': 0.01}, 'choices': [{'finish_reason': 'stop', 'message': {'content': 'OFFLINE SAMPLE'}}]}
                mutate(data)
                return data, json.dumps(data).encode('utf-8')
            with self.with_root() as directory:
                root = pathlib.Path(directory).resolve()
                with self.assertRaises(RuntimeError):
                    run.execute(plan, 'bound-plan', approval(plan), root, 'TEST ONLY', transport)
                self.assertEqual(calls[:2], ['/key', '/chat/completions'])
                self.assertLessEqual(len(calls), 3)
                self.assertTrue((root / (plan['jobs'][0]['id'] + '.response.json')).exists())

    def test_billing_payer_model_id_or_cost_drift_is_retained_and_never_replayed(self):
        for mutate in [lambda b: b['data'].update({'is_byok': True}),
                       lambda b: b['data'].update({'model': 'another-model'}),
                       lambda b: b['data'].update({'id': 'gen-other'}),
                       lambda b: b['data'].update({'total_cost': 0.02})]:
            plan = one_job()
            calls = []
            def transport(path, key, body=None):
                calls.append(path)
                if path == '/key':
                    return key_data(), b'{}'
                if path.startswith('/generation?'):
                    data = billing_data(plan)
                    mutate(data)
                else:
                    data = {'id': 'gen-OFFLINE-generation', 'model': plan['jobs'][0]['model'], 'usage': {'cost': 0.01},
                            'choices': [{'finish_reason': 'stop', 'message': {'content': 'OFFLINE SAMPLE'}}]}
                return data, json.dumps(data).encode('utf-8')
            with self.with_root() as directory:
                root = pathlib.Path(directory)
                with self.assertRaises(RuntimeError):
                    run.execute(plan, 'bound-plan', approval(plan), root, 'TEST ONLY', transport)
                self.assertEqual(len(calls), 3)
                self.assertTrue((root / (plan['jobs'][0]['id'] + '.billing.json')).exists())
                with self.assertRaises(RuntimeError):
                    run.execute(plan, 'bound-plan', approval(plan), root, 'TEST ONLY', transport)
                self.assertEqual(len(calls), 3)

    def test_credentials_cannot_follow_redirects(self):
        with self.assertRaises(RuntimeError):
            run.NoRedirect().redirect_request(None, None, 307, 'redirect', {}, 'https://unapproved.example/')

    def test_actual_request_constructor_preserves_fixed_generation_url_without_encoding_calls(self):
        captured = []
        class OfflineOpener:
            def open(self, request, timeout):
                captured.append((request.full_url, request.get_method(), request.data, timeout))
                return io.BytesIO(b'{"data":{"id":"gen-OFFLINE-123"}}')
        with patch.object(run.urllib.request, 'build_opener', return_value=OfflineOpener()):
            result, raw = run.request('/generation?id=gen-OFFLINE-123', 'TEST ONLY')
        self.assertEqual(result['data']['id'], 'gen-OFFLINE-123')
        self.assertEqual(captured, [('https://openrouter.ai/api/v1/generation?id=gen-OFFLINE-123', 'GET', None, 180)])
        self.assertEqual(json.loads(raw), result)

    def test_request_rejects_foreign_origin_query_injection_and_wrong_methods_before_transport(self):
        for path, body in [('https://unapproved.example/', None), ('/generation?id=gen-123&other=value', None),
                           ('/generation?id=../private', None), ('/key', b'{}'), ('/chat/completions', None)]:
            with patch.object(run.urllib.request, 'build_opener', side_effect=AssertionError('Network must not be reached')):
                with self.assertRaises(ValueError):
                    run.request(path, 'TEST ONLY', body)

if __name__ == '__main__':
    unittest.main(verbosity=2)
