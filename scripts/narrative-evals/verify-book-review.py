"""Verify rich book-review citations while preserving the complete original JSON.

Chapter notes, event ordering and ending assessments remain unverified editorial
annotations. Passing never approves their meaning, a manuscript or a release.
"""
import argparse
import importlib.util
import json
from pathlib import Path
import sys

SOURCE_VERIFIER = Path(__file__).with_name('verify-source-evidence.py')
spec = importlib.util.spec_from_file_location('book_source_evidence', SOURCE_VERIFIER)
evidence = importlib.util.module_from_spec(spec)
spec.loader.exec_module(evidence)

CONTRACT = 'arcanea.book-review-evidence.v1'
RICH_SECTIONS = ('chapterNotes', 'eventLedger', 'endingAssessment')
MAX_ANNOTATIONS = 100
MAX_ANNOTATION_CHARS = 16384


def annotation_text(value):
    evidence.require(isinstance(value, str) and len(value) <= MAX_ANNOTATION_CHARS,
                     'invalid-book-annotation-text')


def validate_annotations(review, manifest):
    evidence.require(isinstance(review, dict), 'invalid-review')
    evidence.require(all(name in review for name in RICH_SECTIONS), 'missing-book-review-sections')
    notes = review['chapterNotes']
    evidence.require(isinstance(notes, list) and 1 <= len(notes) <= MAX_ANNOTATIONS,
                     'invalid-chapter-notes')
    for entry in notes:
        evidence.require(isinstance(entry, dict)
                         and set(entry) == {'path', 'choice', 'consequence', 'unresolved'},
                         'invalid-chapter-note-fields')
        evidence.require(isinstance(entry['path'], str) and entry['path'] in manifest['sourceHashes'],
                         'unknown-chapter-note-source')
        for name in ('choice', 'consequence', 'unresolved'):
            annotation_text(entry[name])
    events = review['eventLedger']
    evidence.require(isinstance(events, list) and len(events) <= MAX_ANNOTATIONS,
                     'invalid-event-ledger')
    for entry in events:
        evidence.require(isinstance(entry, dict) and set(entry) == {'event', 'chapter', 'relativeTime'},
                         'invalid-event-ledger-fields')
        evidence.require(type(entry['chapter']) is int and 1 <= entry['chapter'] <= 10000,
                         'invalid-event-chapter')
        annotation_text(entry['event'])
        annotation_text(entry['relativeTime'])
    ending = review['endingAssessment']
    evidence.require(isinstance(ending, dict) and set(ending) == {'paidOff', 'unresolved', 'recommendation'},
                     'invalid-ending-assessment')
    for value in ending.values():
        annotation_text(value)
    return {'chapterNotes': len(notes), 'eventLedger': len(events), 'endingAssessment': 1}


def verify_book_review(manifest, review, sources):
    evidence.require(evidence.CONTRACT == 'arcanea.narrative-source-evidence.v1',
                     'unsupported-source-verifier-contract')
    evidence.validate_manifest(manifest)
    annotations = validate_annotations(review, manifest)
    # Only the three explicitly named annotation sections leave the citation
    # projection. The CLI retains the complete original review bytes separately.
    projection = {name: value for name, value in review.items() if name not in RICH_SECTIONS}
    report = evidence.verify(manifest, projection, sources)
    report.update(contract=CONTRACT, sourceVerifierContract=evidence.CONTRACT,
                  annotationCounts=annotations, unverifiedAnnotationSections=list(RICH_SECTIONS),
                  bookAnnotationsVerified=False, independentReviewVerified=False)
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--manifest', required=True, type=Path)
    parser.add_argument('--review', required=True, type=Path, help='Unmodified rich JSON book review')
    parser.add_argument('--source-root', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path, help='New private report outside the source snapshot')
    args = parser.parse_args()
    identities = {}
    raw_review = None
    try:
        manifest, identities['manifestFileSha256'] = evidence.load_json(args.manifest)
        review, identities['rawReviewFileSha256'] = evidence.load_json(args.review)
        raw = evidence.read_bytes(args.review, evidence.MAX_JSON_BYTES)
        evidence.require(evidence.digest(raw) == identities['rawReviewFileSha256'], 'review-changed-during-read')
        raw_review = raw.decode('utf-8')
        result = verify_book_review(manifest, review, evidence.load_sources(args.source_root, manifest))
    except evidence.EvidenceError as error:
        result = {'contract': CONTRACT, 'state': 'rejected-input',
                  'citationIntegrityPassed': False, 'inputIssue': str(error)}
    except (OSError, UnicodeError):
        result = {'contract': CONTRACT, 'state': 'rejected-input',
                  'citationIntegrityPassed': False, 'inputIssue': 'input-unavailable'}
    result.update(identities)
    result.update(sourceAuthorityVerified=False, semanticClaimsVerified=False,
                  bookAnnotationsVerified=False, independentReviewVerified=False,
                  humanDispositionRequired=True, promotionAllowed=False,
                  releaseApproved=False, providerCalls=0, credentialsRead=False)
    if raw_review is not None:
        result['rawReviewUTF8'] = raw_review
        result['rawReviewBytesPreserved'] = True
    else:
        result['rawReviewBytesPreserved'] = False
    result['limits'] = ('Literal source binding and finding/age-ledger citations only. The complete valid '
                        'raw review is retained as UTF-8 text and bound by its byte hash. Chapter notes, '
                        'event ordering, ending assessments, authority, independence, literary quality '
                        'and release/model/tenant acceptance are unverified. This is an offline operator '
                        'tool, not a tenant sandbox or an automatic promotion path.')
    try:
        evidence.write_report(args.output, result, args.source_root)
    except (OSError, evidence.EvidenceError):
        print(json.dumps({'state': 'report-not-written', 'promotionAllowed': False, 'releaseApproved': False}))
        return 3
    print(json.dumps({'state': result['state'], 'citationIntegrityPassed': result['citationIntegrityPassed'],
                      'findings': result.get('findings'), 'citationChecks': len(result.get('checks', [])),
                      'rawReviewBytesPreserved': result['rawReviewBytesPreserved'],
                      'bookAnnotationsVerified': False, 'promotionAllowed': False,
                      'releaseApproved': False, 'providerCalls': 0}))
    return 0 if result['citationIntegrityPassed'] else 2


if __name__ == '__main__':
    sys.exit(main())
