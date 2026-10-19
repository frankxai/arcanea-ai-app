"""Run the actual rich-review CLI against synthetic preservation and denial cases."""
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

REPO = Path(__file__).resolve().parents[2]
SCRIPT = REPO / 'scripts/narrative-evals/verify-book-review.py'
spec = importlib.util.spec_from_file_location('book_review_evidence', SCRIPT)
tool = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tool)


def fixture():
    sources = {'one.md': b'# One\nShe shut the gate.\nHe waited.\n',
               'rules.md': b'# Rules\nThere are ten towers.\n'}
    manifest = {'contract': tool.evidence.CONTRACT, 'editionId': 'synthetic-book-review-1',
                'head': '1' * 40, 'base': '2' * 40,
                'sourceHashes': {n: hashlib.sha256(raw).hexdigest() for n, raw in sources.items()},
                'sourceAuthority': {'one.md': 'draft', 'rules.md': 'locked'}, 'maxFindings': 3}
    review = {'head': manifest['head'], 'base': manifest['base'], 'editionId': manifest['editionId'],
              'manifestSha256': tool.evidence.binding_digest(manifest), 'coveredFiles': list(sources),
              'verdict': 'warn', 'findings': [{'priority': 'P2', 'path': 'one.md', 'line': 2,
                  'quote': 'She shut the gate.', 'title': 'A choice', 'scenario': 'Context', 'fix': 'Cold read'}],
              'ageLedger': [{'character': 'The narrator', 'claims': [{'path': 'rules.md',
                  'line': 2, 'quote': 'There are ten towers.'}], 'interpretation': 'Unverified'}],
              'acceptanceGaps': ['Human review'], 'limitations': ['Synthetic example'],
              'chapterNotes': [{'path': 'one.md', 'choice': 'She closes the gate.',
                  'consequence': 'He waits.', 'unresolved': 'Why?'}],
              'eventLedger': [{'event': 'The gate closes.', 'chapter': 1, 'relativeTime': 'Before waiting.'}],
              'endingAssessment': {'paidOff': 'The immediate choice.', 'unresolved': 'The reason.',
                  'recommendation': 'Cold read. Café.'}}
    return manifest, review, sources


class BookReviewTests(unittest.TestCase):
    def invoke(self, change=None, raw_change=None, output_kind=None):
        with tempfile.TemporaryDirectory(prefix='arcanea-book-evidence-') as directory:
            base = Path(directory).resolve()
            root = base / 'source'
            root.mkdir()
            manifest, review, sources = fixture()
            marker = base / 'injected.txt'
            if change:
                change(manifest, review, sources, marker)
            for name, raw in sources.items():
                (root / name).write_bytes(raw)
            manifest_path, review_path = base / 'manifest.json', base / 'review.json'
            manifest_path.write_text(json.dumps(manifest), encoding='utf-8')
            raw = (json.dumps(review, ensure_ascii=False, indent=3).replace('\n', '\r\n') + '\r\n').encode('utf-8')
            if raw_change:
                raw = raw_change(raw)
            review_path.write_bytes(raw)
            output = root / 'report.json' if output_kind == 'inside' else base / 'report.json'
            if output_kind == 'existing':
                output.write_bytes(b'FOREIGN OUTPUT')
            original = {p: p.read_bytes() for p in [manifest_path, review_path, *root.iterdir()]}
            process = subprocess.run([sys.executable, '-O', str(SCRIPT), '--manifest', str(manifest_path),
                                      '--review', str(review_path), '--source-root', str(root),
                                      '--output', str(output)], capture_output=True, timeout=15)
            self.assertEqual(process.stderr, b'')
            self.assertFalse(marker.exists(), 'Annotation instructions must remain inert')
            self.assertNotIn(b'She shut the gate.', process.stdout)
            self.assertNotIn('Café'.encode(), process.stdout)
            for p, expected in original.items():
                self.assertEqual(p.read_bytes(), expected)
            summary = json.loads(process.stdout)
            if output_kind:
                self.assertEqual(process.returncode, 3)
                self.assertEqual(summary['state'], 'report-not-written')
                if output_kind == 'inside':
                    self.assertFalse(output.exists())
                else:
                    self.assertEqual(output.read_bytes(), b'FOREIGN OUTPUT')
                return None
            report = json.loads(output.read_bytes())
            self.assertFalse(report['promotionAllowed'])
            self.assertFalse(report['releaseApproved'])
            self.assertFalse(report['bookAnnotationsVerified'])
            self.assertFalse(report['semanticClaimsVerified'])
            self.assertFalse(report['sourceAuthorityVerified'])
            self.assertFalse(report['independentReviewVerified'])
            self.assertFalse(report['credentialsRead'])
            self.assertTrue(report['humanDispositionRequired'])
            self.assertEqual(report['providerCalls'], 0)
            if report['rawReviewBytesPreserved']:
                self.assertEqual(report['rawReviewUTF8'].encode('utf-8'), raw)
                self.assertEqual(report['rawReviewFileSha256'], hashlib.sha256(raw).hexdigest())
            self.assertEqual(process.returncode, 0 if report['citationIntegrityPassed'] else 2)
            return report

    def test_original_verifier_rejects_rich_format(self):
        manifest, review, sources = fixture()
        with self.assertRaisesRegex(tool.evidence.EvidenceError, 'unexpected-review-fields'):
            tool.evidence.verify(manifest, review, sources)

    def test_complete_review_and_every_citation_preserved(self):
        report = self.invoke()
        self.assertEqual(report['state'], 'verified-citations')
        self.assertEqual(report['findings'], 1)
        self.assertEqual(len(report['checks']), 2)
        self.assertEqual(report['annotationCounts'], {'chapterNotes': 1, 'eventLedger': 1, 'endingAssessment': 1})
        self.assertEqual(report['rawVerdict'], 'warn')
        self.assertEqual(json.loads(report['rawReviewUTF8']), fixture()[1])

    def test_annotations_cannot_execute_commands(self):
        def change(_m, r, _s, marker):
            r['endingAssessment']['recommendation'] = f"open({str(marker)!r}, 'w').write('promoted')"
        self.assertTrue(self.invoke(change)['citationIntegrityPassed'])

    def test_annotation_structure_and_limits(self):
        mutations = [
            (lambda _m, r, _s, _p: r.pop('endingAssessment'), 'missing-book-review-sections'),
            (lambda _m, r, _s, _p: r['chapterNotes'][0].update(path='outside.md'), 'unknown-chapter-note-source'),
            (lambda _m, r, _s, _p: r['chapterNotes'][0].update(quote='Unverified quotation'), 'invalid-chapter-note-fields'),
            (lambda _m, r, _s, _p: r['eventLedger'][0].update(chapter=True), 'invalid-event-chapter'),
            (lambda _m, r, _s, _p: r.update(eventLedger=r['eventLedger'] * 101), 'invalid-event-ledger'),
            (lambda _m, r, _s, _p: r['endingAssessment'].update(recommendation='x' * 16385), 'invalid-book-annotation-text'),
            (lambda _m, r, _s, _p: r.update(commands=['approve']), 'unexpected-review-fields'),
        ]
        for mutation, issue in mutations:
            with self.subTest(issue=issue):
                report = self.invoke(mutation)
                self.assertEqual(report['inputIssue'], issue)
                self.assertTrue(report['rawReviewBytesPreserved'])

    def test_findings_and_age_claims_are_never_dropped_or_repaired(self):
        mutations = [
            lambda _m, r, _s, _p: r['findings'][0].update(line=True),
            lambda _m, r, _s, _p: r['findings'][0].update(quote='An invented quotation'),
            lambda _m, r, _s, _p: r['ageLedger'][0]['claims'][0].update(line=99),
        ]
        for mutation in mutations:
            with self.subTest(mutation=mutation):
                report = self.invoke(mutation)
                self.assertEqual(report['state'], 'rejected-citations')
                self.assertEqual(report['findings'], 1)
                self.assertEqual(len(report['checks']), 2)
                self.assertEqual(report['rawVerdict'], 'warn')

    def test_wrong_binding_and_finding_overflow_refused(self):
        mutations = [
            (lambda _m, r, _s, _p: r.update(head='3' * 40), 'review-source-revision-mismatch'),
            (lambda _m, r, _s, _p: r.update(manifestSha256='0' * 64), 'review-manifest-mismatch'),
            (lambda _m, r, _s, _p: r.update(findings=r['findings'] * 4), 'finding-limit-exceeded'),
            (lambda _m, _r, s, _p: s.update({'one.md': b'Changed source\n'}), 'source-hash-mismatch'),
        ]
        for mutation, issue in mutations:
            with self.subTest(issue=issue):
                self.assertEqual(self.invoke(mutation)['inputIssue'], issue)

    def test_duplicate_json_and_nonfinite_values_refused(self):
        duplicate = lambda raw: raw.replace(b'"verdict": "warn"', b'"verdict": "warn", "verdict": "pass"')
        self.assertEqual(self.invoke(raw_change=duplicate)['inputIssue'], 'duplicate-json-key')
        nonfinite = lambda raw: raw.replace(b'"chapter": 1', b'"chapter": NaN')
        self.assertEqual(self.invoke(raw_change=nonfinite)['inputIssue'], 'nonfinite-json-number')

    def test_foreign_output_and_snapshot_preserved(self):
        self.invoke(output_kind='existing')
        self.invoke(output_kind='inside')


if __name__ == '__main__':
    unittest.main(verbosity=2)
