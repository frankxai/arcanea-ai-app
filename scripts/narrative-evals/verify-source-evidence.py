"""Offline literal-source checks for an untrusted narrative review.

A passing result verifies citation integrity only. It never approves the review's
claims, canon, a manuscript, a model, an agent foundation or a public release.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import sys

CONTRACT = 'arcanea.narrative-source-evidence.v1'
MAX_JSON_BYTES = 2 * 1024 * 1024
MAX_SOURCE_BYTES = 2 * 1024 * 1024
MAX_TOTAL_SOURCE_BYTES = 8 * 1024 * 1024
MAX_CITATIONS = 256
AUTHORITIES = {'locked', 'staging', 'draft', 'reference'}


class EvidenceError(ValueError):
    """A stable denial code; never include source content in the exception."""


def require(condition, code):
    if not condition:
        raise EvidenceError(code)


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def unique_json_object(pairs):
    result = {}
    for key, value in pairs:
        require(key not in result, 'duplicate-json-key')
        result[key] = value
    return result


def read_bytes(path, limit):
    with path.open('rb') as handle:
        raw = handle.read(limit + 1)
    require(len(raw) <= limit, 'input-too-large')
    return raw


def load_json(path):
    raw = read_bytes(path, MAX_JSON_BYTES)
    def reject_constant(_value):
        raise EvidenceError('nonfinite-json-number')
    try:
        value = json.loads(raw.decode('utf-8'), object_pairs_hook=unique_json_object,
                           parse_constant=reject_constant)
    except EvidenceError:
        raise
    except (UnicodeError, ValueError) as error:
        raise EvidenceError('invalid-utf8-json') from error
    except RecursionError as error:
        raise EvidenceError('json-nesting-too-deep') from error
    return value, digest(raw)


def source_path(value):
    require(isinstance(value, str) and 0 < len(value) <= 512, 'invalid-source-path')
    require(not any(ord(char) < 32 for char in value) and '\\' not in value and ':' not in value,
            'invalid-source-path')
    path = PurePosixPath(value)
    require(bool(path.parts) and not path.is_absolute() and path.as_posix() == value
            and all(part not in {'.', '..'} for part in path.parts), 'invalid-source-path')
    require(not any(re.fullmatch(r'(?i)(?:\.env(?:\..*)?|credentials|secrets)', part)
                    for part in path.parts), 'credential-source-denied')
    return path


def validate_manifest(manifest):
    require(isinstance(manifest, dict), 'invalid-manifest')
    allowed = {'contract', 'editionId', 'head', 'base', 'sourceHashes', 'sourceAuthority', 'maxFindings'}
    require(set(manifest) <= allowed and manifest.get('contract') == CONTRACT, 'invalid-manifest-contract')
    require(isinstance(manifest.get('editionId'), str) and 0 < len(manifest['editionId']) <= 128,
            'invalid-edition-id')
    for name in ('head', 'base'):
        require(isinstance(manifest.get(name), str) and re.fullmatch(r'[a-f0-9]{40}', manifest[name]),
                'invalid-source-revision')
    hashes = manifest.get('sourceHashes')
    require(isinstance(hashes, dict) and 1 <= len(hashes) <= 64, 'invalid-source-manifest')
    for name, expected in hashes.items():
        source_path(name)
        require(isinstance(expected, str) and re.fullmatch(r'[a-f0-9]{64}', expected), 'invalid-source-hash')
    authority = manifest.get('sourceAuthority')
    require(isinstance(authority, dict) and set(authority) == set(hashes), 'invalid-authority-manifest')
    require(all(isinstance(value, str) and value in AUTHORITIES for value in authority.values()),
            'invalid-source-authority')
    maximum = manifest.get('maxFindings', 10)
    require(type(maximum) is int and 1 <= maximum <= 100, 'invalid-finding-limit')
    return hashes


def binding_digest(manifest):
    """Match the existing public-source review packet's canonical binding."""
    payload = {name: manifest[name] for name in ('head', 'base', 'sourceHashes')}
    return digest(json.dumps(payload, sort_keys=True).encode('utf-8'))


def load_sources(root, manifest):
    hashes = validate_manifest(manifest)
    root = root.resolve(strict=True)
    require(root.is_dir(), 'invalid-source-root')
    result, total = {}, 0
    for name in hashes:
        path = root.joinpath(*source_path(name).parts).resolve(strict=True)
        require(path.is_relative_to(root) and path.is_file(), 'source-outside-root')
        raw = read_bytes(path, MAX_SOURCE_BYTES)
        total += len(raw)
        require(total <= MAX_TOTAL_SOURCE_BYTES, 'source-set-too-large')
        result[name] = raw
    return result


def citation(item, location, texts, manifest):
    issues = []
    if not isinstance(item, dict):
        return {'location': location, 'integrityPassed': False, 'issues': ['invalid-citation']}
    path, quote, line = item.get('path'), item.get('quote'), item.get('line')
    text = texts.get(path) if isinstance(path, str) else None
    if text is None:
        issues.append('unknown-source-path')
    if type(line) is not int or line < 1:
        issues.append('invalid-line-number')
    if not isinstance(quote, str) or not quote.strip() or len(quote) > 16384:
        issues.append('invalid-literal-quote')
    offsets = []
    start = 0
    if text is not None and isinstance(quote, str) and quote.strip() and len(quote) <= 16384:
        # Two occurrences suffice to reject ambiguity; do not retain an unbounded list.
        while len(offsets) < 2:
            found = text.find(quote, start)
            if found < 0:
                break
            offsets.append(found)
            start = found + 1
        if len(offsets) != 1:
            issues.append('missing-or-ambiguous-quote')
        if type(line) is int and line >= 1:
            if len(offsets) != 1 or text[:offsets[0]].count('\n') + 1 != line:
                issues.append('declared-line-mismatch')
    if text is not None and 'authority' in item and item['authority'] != manifest['sourceAuthority'][path]:
        issues.append('declared-authority-mismatch')
    return {'location': location, 'rawCitation': item, 'integrityPassed': not issues,
            'issues': issues, 'literalOccurrences': len(offsets),
            'literalOccurrenceCountExact': len(offsets) < 2,
            'actualStartLines': [text[:offset].count('\n') + 1 for offset in offsets],
            'declaredSourceAuthority': manifest['sourceAuthority'].get(path) if isinstance(path, str) else None}


def verify(manifest, review, sources):
    hashes = validate_manifest(manifest)
    require(isinstance(sources, dict) and set(sources) == set(hashes), 'source-set-mismatch')
    texts, total = {}, 0
    for name, expected in hashes.items():
        raw = sources[name]
        require(isinstance(raw, bytes) and len(raw) <= MAX_SOURCE_BYTES, 'invalid-source-bytes')
        total += len(raw)
        require(total <= MAX_TOTAL_SOURCE_BYTES, 'source-set-too-large')
        require(digest(raw) == expected, 'source-hash-mismatch')
        try:
            texts[name] = raw.decode('utf-8')
        except UnicodeError as error:
            raise EvidenceError('invalid-source-utf8') from error
    require(isinstance(review, dict), 'invalid-review')
    allowed = {'head', 'base', 'manifestSha256', 'coveredFiles', 'verdict', 'findings',
               'acceptanceGaps', 'limitations', 'ageLedger', 'editionId'}
    require(set(review) <= allowed, 'unexpected-review-fields')
    require(review.get('head') == manifest['head'] and review.get('base') == manifest['base'],
            'review-source-revision-mismatch')
    require('editionId' not in review or review['editionId'] == manifest['editionId'], 'review-edition-mismatch')
    require(review.get('manifestSha256') == binding_digest(manifest), 'review-manifest-mismatch')
    coverage = review.get('coveredFiles')
    require(isinstance(coverage, list) and all(isinstance(name, str) for name in coverage)
            and len(coverage) == len(hashes) and set(coverage) == set(hashes), 'review-coverage-mismatch')
    require(review.get('verdict') in ('pass', 'warn', 'fail'), 'invalid-review-verdict')
    findings = review.get('findings')
    require(isinstance(findings, list) and len(findings) <= manifest.get('maxFindings', 10), 'finding-limit-exceeded')
    checks = []
    for number, item in enumerate(findings):
        check = citation(item, f'findings[{number}]', texts, manifest)
        if not isinstance(item, dict) or item.get('priority') not in ('P0', 'P1', 'P2', 'P3'):
            check['issues'].append('invalid-finding-priority')
            check['integrityPassed'] = False
        checks.append(check)
    age_ledger = review.get('ageLedger', [])
    require(isinstance(age_ledger, list) and len(age_ledger) <= 100, 'invalid-age-ledger')
    for number, entry in enumerate(age_ledger):
        require(isinstance(entry, dict) and isinstance(entry.get('claims'), list)
                and len(entry['claims']) <= 100, 'invalid-age-ledger')
        require(len(checks) + len(entry['claims']) <= MAX_CITATIONS, 'citation-limit-exceeded')
        for index, item in enumerate(entry['claims']):
            checks.append(citation(item, f'ageLedger[{number}].claims[{index}]', texts, manifest))
    passed = all(check['integrityPassed'] for check in checks)
    return {'contract': CONTRACT, 'state': 'verified-citations' if passed else 'rejected-citations',
            'citationIntegrityPassed': passed, 'editionId': manifest['editionId'],
            'head': manifest['head'], 'base': manifest['base'], 'bindingSha256': binding_digest(manifest),
            'sourceHashes': hashes, 'declaredSourceAuthority': manifest['sourceAuthority'],
            'rawVerdict': review['verdict'], 'findings': len(findings), 'checks': checks,
            'sourceAuthorityVerified': False, 'semanticClaimsVerified': False,
            'humanDispositionRequired': True, 'promotionAllowed': False, 'releaseApproved': False,
            'providerCalls': 0,
            'limits': 'Literal source binding and quotation locations only. Authority labels are operator declarations; no canon, literary, human, model-quality, tenant, permission or release acceptance.'}


def write_report(path, report, source_root):
    require(not path.resolve().is_relative_to(source_root.resolve()), 'report-inside-source-root')
    encoded = (json.dumps(report, indent=2) + '\n').encode('utf-8')
    descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(descriptor, 'wb') as handle:
        handle.write(encoded)
        handle.flush()
        os.fsync(handle.fileno())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--manifest', required=True, type=Path, help='Operator-provided frozen source manifest')
    parser.add_argument('--review', required=True, type=Path, help='Unmodified untrusted JSON review')
    parser.add_argument('--source-root', required=True, type=Path, help='Read-only frozen UTF-8 source snapshot')
    parser.add_argument('--output', required=True, type=Path, help='New report path outside the source snapshot; never overwritten')
    args = parser.parse_args()
    identities = {}
    try:
        manifest, identities['manifestFileSha256'] = load_json(args.manifest)
        review, identities['rawReviewFileSha256'] = load_json(args.review)
        result = verify(manifest, review, load_sources(args.source_root, manifest))
    except EvidenceError as error:
        result = {'contract': CONTRACT, 'state': 'rejected-input', 'citationIntegrityPassed': False,
                  'inputIssue': str(error), 'humanDispositionRequired': True,
                  'sourceAuthorityVerified': False, 'semanticClaimsVerified': False,
                  'promotionAllowed': False, 'releaseApproved': False, 'providerCalls': 0}
    except (OSError, UnicodeError):
        result = {'contract': CONTRACT, 'state': 'rejected-input', 'citationIntegrityPassed': False,
                  'inputIssue': 'input-unavailable', 'humanDispositionRequired': True,
                  'sourceAuthorityVerified': False, 'semanticClaimsVerified': False,
                  'promotionAllowed': False, 'releaseApproved': False, 'providerCalls': 0}
    result.update(identities)
    try:
        write_report(args.output, result, args.source_root)
    except (OSError, EvidenceError):
        print(json.dumps({'state': 'report-not-written', 'promotionAllowed': False, 'releaseApproved': False}))
        return 3
    print(json.dumps({'state': result['state'], 'citationIntegrityPassed': result['citationIntegrityPassed'],
                      'findings': result.get('findings'), 'promotionAllowed': False, 'releaseApproved': False,
                      'providerCalls': 0}))
    return 0 if result['citationIntegrityPassed'] else 2


if __name__ == '__main__':
    sys.exit(main())
