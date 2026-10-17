"""No-network regressions for the actual public review admission boundary."""

import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import Mock, patch

SCRIPT = Path(__file__).resolve().parents[1] / "review-companion.py"
SPEC = importlib.util.spec_from_file_location("companion_review", SCRIPT)
REVIEW = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(REVIEW)
HEAD, BASE = "a" * 40, "b" * 40
KERNEL = ".arcanea/prompts/luminor-engineering-kernel.md"


class ReviewAdmission(unittest.TestCase):
    def model(self):
        return {"id": REVIEW.MODEL, "pricing": {"prompt": "0", "completion": "0"},
                "top_provider": {"max_completion_tokens": 460_800},
                "context_length": 512_000, "supported_parameters": ["response_format", "structured_outputs"]}

    def test_only_explicit_zero_price_model_fits_complete_request(self):
        REVIEW.zero_price(self.model(), 1000)
        for changes in (
            {"id": "kilo-auto/free"},
            {"pricing": {"prompt": "0.01", "completion": "0"}},
            {"pricing": {"prompt": "0", "completion": "0", "request": "1"}},
            {"pricing": {"prompt": "NaN", "completion": "0"}},
            {"pricing": {"prompt": "Infinity", "completion": "0"}},
            {"pricing": {"prompt": "0"}},
            {"context_length": 1000},
            {"top_provider": {}},
            {"top_provider": {"max_completion_tokens": 1000}},
            {"supported_parameters": []},
            {"supported_parameters": ["response_format"]},
        ):
            with self.subTest(changes=changes), self.assertRaises(REVIEW.Denied):
                REVIEW.zero_price({**self.model(), **changes}, 1000)

    def test_private_or_changed_public_pin_cannot_reach_model(self):
        repo = {"visibility": "public", "private": False}
        commit = {"sha": HEAD}
        pr = {"state": "open", "head": {"sha": HEAD, "ref": REVIEW.BRANCH,
              "repo": {"full_name": REVIEW.REPOSITORY}}, "base": {"sha": BASE}}
        for bad_repo, bad_commit, bad_pr in (
            ({"visibility": "private", "private": True}, commit, pr),
            (repo, {"sha": BASE}, pr),
            (repo, commit, {**pr, "base": {"sha": HEAD}}),
            (repo, commit, {**pr, "head": {**pr["head"], "ref": "other-lane"}}),
            (repo, commit, {**pr, "head": {**pr["head"], "repo": {"full_name": "fork/app"}}}),
        ):
            with patch.object(REVIEW, "network", side_effect=[json.dumps(x).encode()
                              for x in (bad_repo, bad_commit, bad_pr)]) as network:
                with self.assertRaises(REVIEW.Denied):
                    REVIEW.public_pin(HEAD, BASE, 591)
                self.assertTrue(all("chat/completions" not in x.args[0]
                                    for x in network.call_args_list))

    def test_nemotron_requires_explicit_selection_and_verified_zero_price_capacity(self):
        model_id = "nvidia/nemotron-3-ultra-550b-a55b:free"
        model = {"id": model_id, "pricing": {"prompt": "0", "completion": "0", "discount": 0},
                 "context_length": 1_000_000, "top_provider": {"max_completion_tokens": 65_536},
                 "supported_parameters": ["reasoning", "reasoning_effort", "max_tokens", "temperature"]}
        with self.assertRaises(REVIEW.Denied):
            REVIEW.zero_price(model, 475_000)
        REVIEW.zero_price(model, 475_000, expected_model=model_id)
        for changes in ({"id": model_id.removesuffix(":free")},
                        {"pricing": {"prompt": "0", "completion": "0.01"}},
                        {"pricing": {"prompt": "0", "completion": "0", "request": "1"}},
                        {"context_length": 490_000},
                        {"top_provider": {"max_completion_tokens": 1000}},
                        {"supported_parameters": ["max_tokens", "temperature"]}):
            with self.subTest(changes=changes), self.assertRaises(REVIEW.Denied):
                REVIEW.zero_price({**model, **changes}, 475_000, expected_model=model_id)
        with self.assertRaises(REVIEW.Denied):
            REVIEW.zero_price(model, 1000, expected_model="kilo-auto/free")

    def test_nemotron_request_preserves_strict_report_contract_without_native_schema_claim(self):
        model_id = "nvidia/nemotron-3-ultra-550b-a55b:free"
        content = {KERNEL: "Accepted kernel", "a.ts": "return false;"}
        request = json.loads(REVIEW.request_for("world-client", HEAD, BASE, "c" * 64,
                                               content, {path: "hash" for path in content},
                                               "Changed a.ts", model_id=model_id))
        self.assertEqual(request["model"], model_id)
        self.assertNotIn("response_format", request)
        self.assertEqual(request["tools"], [])
        self.assertTrue(request["stream"])
        self.assertEqual(request["stream_options"], {"include_usage": True})
        self.assertEqual(request["reasoning"], {"effort": "high", "exclude": True})
        self.assertEqual(request["max_tokens"], REVIEW.WORLD_CLIENT_OUTPUT)
        prompt = request["messages"][0]["content"]
        self.assertIn('"additionalProperties":false', prompt)
        self.assertIn('"observations"', prompt)
        self.assertIn("Copy the binding values exactly", prompt)
        response = {"model": model_id, "choices": [{"finish_reason": "stop", "message": {
            "content": json.dumps(self.valid_review())}}]}
        parsed = REVIEW.parse_response(response, model_id=model_id)
        REVIEW.validate(parsed, HEAD, BASE, "manifest", {"a.ts": "// guard\nreturn false;\n", "context.ts": "Context\n"})
        with self.assertRaises(REVIEW.Denied):
            REVIEW.parse_response(response)
        with self.assertRaises(REVIEW.Denied):
            REVIEW.parse_response({**response, "choices": [{"finish_reason": "length", "message": {
                "content": json.dumps(self.valid_review())}}]}, model_id=model_id)

    def test_post_validation_enforces_nested_schema_and_text_bounds_for_every_model(self):
        content = {"a.ts": "// guard\nreturn false;\n", "context.ts": "Context\n"}
        for mutate in (
            lambda report: report["observations"][0].update(unexpectedApproval=True),
            lambda report: report["limitations"].append(""),
            lambda report: report["acceptanceGaps"].append("x" * 3001),
        ):
            report = self.valid_review()
            mutate(report)
            with self.assertRaises(REVIEW.Denied):
                REVIEW.validate(report, HEAD, BASE, "manifest", content)
        report = {**self.valid_review(), "verdict": "warn", "findings": [{
            "priority": "P2", "path": "a.ts", "line": 2, "quote": "return false;",
            "title": "Guard", "scenario": "Concrete failure", "fix": "Check actor",
            "unexpectedApproval": True}]}
        with self.assertRaises(REVIEW.Denied):
            REVIEW.validate(report, HEAD, BASE, "manifest", content)

    def test_alternative_model_cannot_dispatch_from_legacy_or_unowned_lane(self):
        env = {"GITHUB_ACTIONS": "true", "GITHUB_REPOSITORY": REVIEW.REPOSITORY,
               "GITHUB_ACTOR": "frankxai"}
        args = [str(SCRIPT), "--head", HEAD, "--base", BASE, "--pull-request", "597",
                "--model", "nvidia/nemotron-3-ultra-550b-a55b:free"]
        with patch.dict(REVIEW.os.environ, env, clear=True), \
             patch.object(REVIEW.sys, "argv", args), \
             patch.object(REVIEW, "public_pin", return_value=REVIEW.BRANCH), \
             patch.object(REVIEW, "network") as network, self.assertRaises(REVIEW.Denied):
            REVIEW.main()
        network.assert_not_called()

    def stream_bytes(self, content="{\"scene\":\"Leyla\"}", finish="stop", usage=True):
        model = "nvidia/nemotron-3-ultra-550b-a55b:free"
        chunks = [
            {"model": model, "choices": [{"index": 0, "delta": {"content": content}, "finish_reason": None}]},
            {"model": model, "choices": [{"index": 0, "delta": {}, "finish_reason": finish}]},
        ]
        if usage:
            chunks.append({"usage": {"cost": 0, "prompt_tokens": 10, "completion_tokens": 20}, "choices": []})
        return b": keepalive\r\n\r\n" + b"".join(
            ("data: " + json.dumps(chunk, ensure_ascii=False) + "\r\n\r\n").encode()
            for chunk in chunks
        ) + b"data: [DONE]\r\n\r\n"

    def test_stream_reassembles_split_unicode_and_preserves_actual_model_usage(self):
        decoder = REVIEW.ReviewStream(REVIEW.NEMOTRON_MODEL)
        raw = self.stream_bytes(content='{"scene":"Thal’Maris"}')
        for byte in raw:
            decoder.feed(bytes([byte]))
        result = decoder.finish()
        self.assertEqual(result["model"], REVIEW.NEMOTRON_MODEL)
        self.assertEqual(result["choices"][0]["message"]["content"], '{"scene":"Thal’Maris"}')
        self.assertEqual(result["choices"][0]["finish_reason"], "stop")
        self.assertEqual(result["usage"]["cost"], 0)

    def test_stream_cannot_accept_truncation_errors_tools_missing_usage_or_model_drift(self):
        for raw in (
            self.stream_bytes(finish="length"), self.stream_bytes(finish="error"),
            self.stream_bytes(usage=False), self.stream_bytes().replace(b"data: [DONE]\r\n\r\n", b""),
            self.stream_bytes().replace(REVIEW.NEMOTRON_MODEL.encode(), b"other/model"),
            b'data: {"error":{"code":502},"choices":[]}\n\n',
            b'data: {"model":"nvidia/nemotron-3-ultra-550b-a55b:free","choices":[{"index":0,"delta":{"tool_calls":[{"id":"x"}]},"finish_reason":null}]}\n\n',
        ):
            with self.subTest(raw=raw[:45]), self.assertRaises(REVIEW.Denied):
                decoder = REVIEW.ReviewStream(REVIEW.NEMOTRON_MODEL)
                decoder.feed(raw)
                decoder.finish()

    def test_stream_denies_late_content_and_oversized_response(self):
        with self.assertRaises(REVIEW.Denied):
            decoder = REVIEW.ReviewStream(REVIEW.NEMOTRON_MODEL)
            decoder.feed(self.stream_bytes() + b'data: {"choices":[]}\n\n')
        with self.assertRaises(REVIEW.Denied):
            decoder = REVIEW.ReviewStream(REVIEW.NEMOTRON_MODEL)
            decoder.feed(b"x" * 8_000_001)

    def test_gateway_usage_can_repeat_normal_stop_without_new_content(self):
        # Retained708 gateway evidence has a normal terminal choice followed by
        # the same empty terminal choice carrying usage, then [DONE].
        raw = self.stream_bytes(usage=False)
        usage_chunk = {"model": REVIEW.NEMOTRON_MODEL, "usage": {"cost": 0},
                       "choices": [{"index": 0, "delta": {"content": "", "role": "assistant"},
                                    "finish_reason": "stop"}]}
        repeated = ("data: " + json.dumps(usage_chunk) + "\r\n\r\n").encode()
        raw = raw.replace(b"data: [DONE]", repeated + b"data: [DONE]")
        decoder = REVIEW.ReviewStream(REVIEW.NEMOTRON_MODEL)
        decoder.feed(raw)
        self.assertEqual(decoder.finish()["usage"], {"cost": 0})
        for invalid in (
            {**usage_chunk, "usage": None},
            {**usage_chunk, "choices": [{"index": 0, "delta": {"content": "late"}, "finish_reason": "stop"}]},
            {**usage_chunk, "choices": [{"index": 0, "delta": {}, "finish_reason": "length"}]},
        ):
            with self.subTest(invalid=invalid), self.assertRaises(REVIEW.Denied):
                decoder = REVIEW.ReviewStream(REVIEW.NEMOTRON_MODEL)
                bad = ("data: " + json.dumps(invalid) + "\r\n\r\n").encode()
                decoder.feed(self.stream_bytes(usage=False).replace(b"data: [DONE]", bad + b"data: [DONE]"))
                decoder.finish()

    def test_stream_network_has_one_absolute_deadline_and_always_closes(self):
        connection = Mock()
        response = Mock(status=200)
        response.headers = {"Content-Type": "text/event-stream; charset=utf-8"}
        connection.getresponse.return_value = response
        response.read1.return_value = self.stream_bytes()
        body = json.dumps({"model": "nvidia/nemotron-3-ultra-550b-a55b:free", "stream": True, "tools": []}).encode()
        # Connect/send/headers consume part of one deadline; the next read is
        # refused once it expires, even with a synthetically available response.
        with tempfile.TemporaryDirectory() as directory, \
             patch.object(REVIEW.http.client, "HTTPSConnection", return_value=connection), \
             patch.object(REVIEW.time, "monotonic", side_effect=[0, 1, 2, 11]), \
             self.assertRaises(REVIEW.Denied):
            REVIEW.stream_completion(body, Path(directory) / "response.sse", timeout=10)
        connection.close.assert_called_once()
        response.read1.assert_not_called()

    def test_stream_transport_retains_raw_success_and_failure_and_closes_without_retry(self):
        for raw, fails in ((self.stream_bytes(), False),
                           (b'data: {"error":{"code":502},"choices":[]}\n\n', True)):
            with self.subTest(fails=fails), tempfile.TemporaryDirectory() as directory:
                connection = Mock()
                response = Mock(status=200)
                response.headers = {"Content-Type": "text/event-stream; charset=utf-8"}
                response.read1.return_value = raw
                connection.getresponse.return_value = response
                body = json.dumps({"model": REVIEW.NEMOTRON_MODEL,
                                   "stream": True, "tools": []}).encode()
                target = Path(directory) / "response.sse"
                with patch.object(REVIEW.http.client, "HTTPSConnection", return_value=connection), \
                     patch.object(REVIEW.time, "monotonic", return_value=0):
                    if fails:
                        with self.assertRaises(REVIEW.Denied):
                            REVIEW.stream_completion(body, target, timeout=10)
                    else:
                        result = REVIEW.stream_completion(body, target, timeout=10)
                        self.assertEqual(result["model"], REVIEW.NEMOTRON_MODEL)
                        self.assertEqual(result["usage"]["cost"], 0)
                self.assertEqual(target.read_bytes(), raw)
                connection.request.assert_called_once()
                connection.close.assert_called_once()
                response.read1.assert_called_once()

    def valid_review(self):
        return {"head": HEAD, "base": BASE, "manifestSha256": "manifest",
                "coveredFiles": ["a.ts", "context.ts"], "verdict": "pass", "findings": [],
                "observations": [
                    {"path": "a.ts", "line": 1, "quote": "// guard", "behavior": "Guard annotation"},
                    {"path": "a.ts", "line": 2, "quote": "return false;", "behavior": "False result"},
                    {"path": "context.ts", "line": 1, "quote": "Context", "behavior": "Context value"},
                ],
                "acceptanceGaps": ["Static only"], "limitations": ["No runtime execution"]}

    def test_pinned_world_pr_is_admitted_without_opening_other_lanes(self):
        repo = {"visibility": "public", "private": False}
        commit = {"sha": HEAD}
        pr = {"state": "open", "head": {"sha": HEAD,
              "ref": "agent/codex/chat-world-handoff-20261011",
              "repo": {"full_name": REVIEW.REPOSITORY}}, "base": {"sha": BASE}}
        with patch.object(REVIEW, "network", side_effect=[json.dumps(x).encode()
                          for x in (repo, commit, pr)]) as network:
            self.assertEqual(REVIEW.public_pin(HEAD, BASE, 602), pr["head"]["ref"])
            self.assertEqual(network.call_count, 3)
        legacy_pr = {**pr, "head": {**pr["head"], "ref": REVIEW.BRANCH}}
        with patch.object(REVIEW, "network", side_effect=[json.dumps(x).encode()
                          for x in (repo, commit, legacy_pr)]):
            self.assertEqual(REVIEW.public_pin(HEAD, BASE, 597), REVIEW.BRANCH)
        for number, bad_pr in (
            (601, pr),
            (602, {**pr, "state": "closed"}),
            (602, {**pr, "head": {**pr["head"], "ref": REVIEW.BRANCH}}),
            (602, {**pr, "head": {**pr["head"], "repo": {"full_name": "fork/app"}}}),
        ):
            with self.subTest(number=number, pr=bad_pr), \
                 patch.object(REVIEW, "network", side_effect=[json.dumps(x).encode()
                              for x in (repo, commit, bad_pr)]), self.assertRaises(REVIEW.Denied):
                REVIEW.public_pin(HEAD, BASE, number)

    def test_world_review_covers_complete_callers_and_rejects_missing_context(self):
        changed = ["apps/web/app/api/worlds/generate/route.ts",
                   "apps/web/components/chat/chat-notices.tsx",
                   "apps/web/hooks/use-chat-world-mode.ts",
                   "apps/web/lib/chat/world-handoff.ts",
                   "apps/web/lib/chat/world-character-mode.ts",
                   "apps/web/lib/worlds/generation.ts",
                   "scripts/tests/chat-world-handoff.test.cjs",
                   "scripts/test-world-generation.cjs", "scripts/verify-companion-browser.cjs",
                   "scripts/review-companion.py", "scripts/tests/test_review_companion.py",
                   ".github/workflows/companion.yml",
                   "planning-with-files/CURRENT_STATE_2026-10-11_CHAT_WORLD_HANDOFF.md",
                   "apps/web/app/worlds/loading.tsx", "apps/web/app/worlds/create/loading.tsx",
                   "apps/web/app/worlds/[slug]/loading.tsx", "apps/web/app/worlds/[slug]/page.tsx",
                   "apps/web/app/worlds/worlds-client.tsx", "scripts/tests/world-landmarks.test.cjs"]
        contexts = getattr(REVIEW, "WORLD_CONTEXTS", REVIEW.CONTEXTS)
        content = {path: "Complete source" for path in set(changed) | set(contexts)}
        branch = "agent/codex/chat-world-handoff-20261011"
        primary, planned = REVIEW.modules(changed, content, branch=branch)
        self.assertEqual(set(primary), {"world-client", "world-server", "world-browser", "world-navigation", "world-review"})
        self.assertEqual(set().union(*primary.values()), set(changed))
        self.assertEqual(sum(len(paths) for paths in primary.values()), len(changed))
        self.assertEqual(set().union(*(set(paths) for paths in planned.values())), set(content))
        self.assertTrue(all(primary[name] <= set(planned[name]) for name in primary))
        required = {"apps/web/app/worlds/create/page.tsx",
                    "apps/web/components/worlds/world-draft-editor.tsx",
                    "apps/web/lib/worlds/draft.ts", "apps/web/app/chat/page.tsx",
                    "apps/web/lib/auth/context.tsx", "apps/web/lib/ai/provider-preferences.ts",
                    ".github/workflows/ci.yml", ".github/workflows/companion.yml"}
        self.assertTrue(required <= set().union(*(set(paths) for paths in planned.values())))
        for name in ("world-client", "world-browser"):
            self.assertTrue({"apps/web/app/worlds/create/page.tsx", "apps/web/lib/chat/world-handoff.ts",
                             "apps/web/lib/worlds/draft.ts", "apps/web/lib/auth/context.tsx"} <= set(planned[name]))
        self.assertIn("apps/web/app/layout.tsx", planned["world-browser"])
        reader = {"apps/web/components/saga/chapter-reader.tsx",
                  "apps/web/components/saga/reading-toolbar.tsx",
                  "apps/web/components/saga/reading-toolbar.module.css"}
        self.assertTrue(reader <= set(planned["world-browser"]))
        self.assertFalse(reader & set(planned["world-review"]))
        navigation = {"apps/web/app/worlds/loading.tsx", "apps/web/app/worlds/create/loading.tsx",
                      "apps/web/app/worlds/[slug]/loading.tsx", "apps/web/app/worlds/[slug]/page.tsx",
                      "apps/web/app/worlds/worlds-client.tsx", "scripts/tests/world-landmarks.test.cjs"}
        self.assertEqual(primary["world-navigation"], navigation)
        self.assertTrue(navigation | {"apps/web/app/layout.tsx", "apps/web/app/worlds/layout.tsx",
                                     "apps/web/app/worlds/create/layout.tsx",
                                     "apps/web/app/worlds/[slug]/layout.tsx"}
                        <= set(planned["world-navigation"]))
        for path in required:
            incomplete = {key: value for key, value in content.items() if key != path}
            with self.subTest(path=path), self.assertRaises(REVIEW.Denied):
                REVIEW.modules(changed, incomplete, branch=branch)
        for extra_path in ("apps/web/app/api/billing/route.ts", "private-memory.txt"):
            with self.subTest(path=extra_path), self.assertRaises(REVIEW.Denied):
                REVIEW.modules([*changed, extra_path], {**content, extra_path: "Other lane"}, branch=branch)

    def test_incomplete_fabricated_and_misbound_review_is_rejected(self):
        content = {"a.ts": "// guard\nreturn false;\n", "context.ts": "Context\n"}
        REVIEW.validate(self.valid_review(), HEAD, BASE, "manifest", content)
        for changes in (
            {"head": BASE}, {"base": HEAD}, {"manifestSha256": "other"},
            {"coveredFiles": ["a.ts"]},
            {"coveredFiles": ["a.ts", "context.ts", "a.ts"]},
            {"verdict": "APPROVE"}, {"limitations": None},
            {"observations": []},
            {"head": "afa570a8", "base": "f6e3870e"},
            {"unexpectedApproval": True},
        ):
            with self.subTest(changes=changes), self.assertRaises(REVIEW.Denied):
                REVIEW.validate({**self.valid_review(), **changes}, HEAD, BASE, "manifest", content)
        finding = {"priority": "P2", "path": "a.ts", "line": 2, "title": "Guard",
                   "quote": "return false;", "scenario": "Explicit trigger", "fix": "Check actor"}
        valid = {**self.valid_review(), "verdict": "warn", "findings": [finding]}
        REVIEW.validate(valid, HEAD, BASE, "manifest", content)
        for changes in ({"line": True}, {"line": 99}, {"line": 1},
                        {"quote": "// guard\nreturn false;"},
                        {"quote": "// guard return false;"},
                        {"quote": "return  false;"}, {"quote": "invented;"},
                        {"path": "unseen.ts"}, {"scenario": ""}):
            bad = copy.deepcopy(valid)
            bad["findings"][0].update(changes)
            with self.subTest(changes=changes), self.assertRaises(REVIEW.Denied):
                REVIEW.validate(bad, HEAD, BASE, "manifest", content)
        with self.assertRaises(REVIEW.Denied):
            REVIEW.validate({**valid, "verdict": "pass"}, HEAD, BASE, "manifest", content)
        with self.assertRaises(REVIEW.Denied):
            REVIEW.validate(self.valid_review(), HEAD, BASE, "manifest", content, ["changed.ts"])

    def test_actual_request_pins_structured_output_and_literal_bindings(self):
        content = {KERNEL: "Accepted kernel", "a.ts": "return false;"}
        request = json.loads(REVIEW.request_for("experience", HEAD, BASE, "c" * 64,
                                               content, {path: "hash" for path in content}, "Changed a.ts"))
        output = request["response_format"]
        self.assertEqual(output["type"], "json_schema")
        self.assertIs(output["json_schema"]["strict"], True)
        schema = output["json_schema"]["schema"]
        for key, literal in (("head", HEAD), ("base", BASE), ("manifestSha256", "c" * 64)):
            self.assertEqual(schema["properties"][key]["enum"], [literal])
            self.assertIn(literal, request["messages"][-1]["content"])
        finding = schema["properties"]["findings"]["items"]
        self.assertEqual(set(finding["required"]), {"priority", "path", "line", "title", "quote", "scenario", "fix"})
        self.assertFalse(finding["additionalProperties"])
        self.assertEqual(set(schema["properties"]["coveredFiles"]["items"]["enum"]), set(content))
        self.assertEqual(request["tools"], [])
        self.assertEqual(request["max_tokens"], REVIEW.MAX_OUTPUT)
        self.assertNotIn("Replace ALL", request["messages"][0]["content"])

    def test_world_client_completion_reserve_cannot_exceed_model_or_context(self):
        content = {KERNEL: "Accepted kernel", "a.ts": "return false;"}
        request = json.loads(REVIEW.request_for("world-client", HEAD, BASE, "c" * 64,
                                               content, {path: "hash" for path in content}, "Changed a.ts"))
        limit = request["max_tokens"]
        self.assertEqual(limit, 36_000)
        self.assertEqual(request["reasoning"], {"enabled": True, "exclude": True})
        REVIEW.zero_price(self.model(), 1000, limit)
        fits_original = {**self.model(), "context_length": 1000 + 1024 + REVIEW.MAX_OUTPUT}
        REVIEW.zero_price(fits_original, 1000)
        with self.assertRaises(REVIEW.Denied):
            REVIEW.zero_price(fits_original, 1000, limit)
        with self.assertRaises(REVIEW.Denied):
            REVIEW.zero_price({**self.model(), "top_provider": {"max_completion_tokens": REVIEW.MAX_OUTPUT}},
                              1000, limit)
        for unadmitted in (True, 0, 500_000):
            with self.subTest(limit=unadmitted), self.assertRaises(REVIEW.Denied):
                REVIEW.zero_price(self.model(), 1000, unadmitted)

    def test_actual_orchestration_denies_scan_price_and_context_before_generation(self):
        env = {"GITHUB_ACTIONS": "true", "GITHUB_REPOSITORY": REVIEW.REPOSITORY,
               "GITHUB_ACTOR": "frankxai"}
        content = {KERNEL: "Engineering kernel", "a.ts": "return false;"}
        args = [str(SCRIPT), "--head", HEAD, "--base", BASE, "--pull-request", "591"]
        primary = {name: {"a.ts"} for name in ("experience", "account-transport", "verification")}
        planned = {name: content for name in primary}
        for code, model in ((1, self.model()),
                            (0, {**self.model(), "pricing": {"prompt": "1", "completion": "0"}}),
                            (0, {**self.model(), "context_length": 1000})):
            with patch.dict(REVIEW.os.environ, env, clear=True), patch.object(REVIEW.sys, "argv", args), \
                 patch.object(REVIEW, "public_pin", return_value=REVIEW.BRANCH), \
                 patch.object(REVIEW, "sources", return_value=(["a.ts"], content, {KERNEL: "k", "a.ts": "a"}, "diff")), \
                 patch.object(REVIEW, "modules", return_value=(primary, planned)), \
                 patch.object(REVIEW, "git", return_value=b"Fixture delta"), \
                 patch.object(REVIEW.subprocess, "run", return_value=Mock(returncode=code)), \
                 patch.object(REVIEW, "network", return_value=json.dumps({"data": [model]}).encode()) as network:
                with self.assertRaises(REVIEW.Denied):
                    REVIEW.main()
                self.assertEqual(network.call_count, 0 if code else 1)
                self.assertTrue(all(call.args[0].endswith("/models") for call in network.call_args_list))

    def test_modules_cover_every_changed_and_context_file_without_hiding_source(self):
        changed = ["apps/web/components/lumina/companion-chat.tsx",
                   "apps/web/components/lumina/lumina-bubble.tsx", "apps/web/app/chat/page.tsx",
                   "apps/web/components/chat/chat-welcome.tsx", "apps/web/components/chat/chat-overlays.tsx",
                   "apps/web/components/chat/chat-area.tsx",
                   "apps/web/components/chat/chat-input-bar.tsx", "apps/web/components/chat/agent-header.tsx",
                   "packages/design-system/src/companion.module.css",
                   "apps/web/hooks/use-conversation.ts", "scripts/review-companion.py",
                   "scripts/verify-companion-browser.cjs", "scripts/verify-reading-scene-browser.cjs"]
        content = {path: "Complete source" for path in set(changed) | set(REVIEW.CONTEXTS)}
        primary, planned = REVIEW.modules(changed, content)
        self.assertEqual(set().union(*primary.values()), set(changed))
        self.assertEqual(sum(len(x) for x in primary.values()), len(changed))
        self.assertEqual(set().union(*(set(x) for x in planned.values())), set(content))
        self.assertTrue(all(set(primary[name]) <= set(planned[name]) for name in primary))
        self.assertEqual(tuple(planned), REVIEW.MODULE_NAMES)
        self.assertEqual(primary["reading-browser"], {"scripts/verify-reading-scene-browser.cjs"})
        self.assertEqual(primary["composer"], {"apps/web/components/chat/chat-input-bar.tsx",
                                             "apps/web/components/chat/agent-header.tsx",
                                             "packages/design-system/src/companion.module.css"})
        self.assertIn("apps/web/components/chat/model-selector.tsx", planned["composer"])
        self.assertIn("apps/web/components/saga/chapter-reader.tsx", planned["reading-browser"])
        for data, paths in (({**content, "unassigned-context.ts": "Unseen"}, changed),
                            (content, [*changed, "unowned.txt"]),
                            ({path: value for path, value in content.items() if path != KERNEL}, changed)):
            with self.assertRaises(REVIEW.Denied):
                REVIEW.modules(paths, data)

    def test_truncated_empty_tool_and_wrong_model_responses_cannot_be_accepted(self):
        valid = {"model": REVIEW.MODEL, "choices": [{"finish_reason": "stop", "message": {
            "content": json.dumps(self.valid_review())}}]}
        self.assertEqual(REVIEW.parse_response(valid), self.valid_review())
        for update in ({"finish_reason": "length"},
                       {"message": {"content": ""}},
                       {"message": {"content": json.dumps(self.valid_review()), "tool_calls": [{}]}}):
            invalid = copy.deepcopy(valid)
            invalid["choices"][0].update(update)
            with self.subTest(update=update), self.assertRaises(REVIEW.Denied):
                REVIEW.parse_response(invalid)
        with self.assertRaises(REVIEW.Denied):
            REVIEW.parse_response({**valid, "model": "different/model"})
        exhausted = {"model": REVIEW.MODEL, "choices": [{"finish_reason": "length",
                     "message": {"content": None}}],
                     "usage": {"completion_tokens": 24_000, "cost": 0}}
        with self.assertRaisesRegex(REVIEW.Denied, "exhausted output limit"):
            REVIEW.parse_response(exhausted)

    def test_unadmitted_actor_does_not_access_public_or_provider_network(self):
        with patch.dict(REVIEW.os.environ, {"GITHUB_ACTIONS": "true", "GITHUB_ACTOR": "other"}, clear=True), \
             patch.object(REVIEW.sys, "argv", [str(SCRIPT), "--head", HEAD, "--base", BASE, "--pull-request", "591"]), \
             patch.object(REVIEW, "network") as network:
            with self.assertRaises(REVIEW.Denied):
                REVIEW.main()
            network.assert_not_called()

    def test_full_source_collection_rejects_private_paths_binary_and_kernel_changes(self):
        code = "Unchanged context\nChanged implementation\nComplete trailing context\n"

        def fake_git(*args):
            if args[:2] == ("rev-parse", "HEAD"):
                return HEAD.encode()
            if args[0] in {"status", "merge-base"} or "--diff-filter=D" in args:
                return b""
            if args[:2] == ("diff", "--name-only"):
                return b"src/a.ts\n"
            if args[0] == "show":
                return b"Accepted kernel" if args[1].endswith(KERNEL) else code.encode()
            return b"Only changed diff line"

        with patch.object(REVIEW, "CONTEXTS", (KERNEL,)), patch.object(REVIEW, "git", side_effect=fake_git):
            changed, content, hashes, delta = REVIEW.sources(HEAD, BASE)
            self.assertEqual(changed, ["src/a.ts"])
            self.assertEqual(content["src/a.ts"], code)
            self.assertEqual(set(hashes), {"src/a.ts", KERNEL})
            self.assertNotEqual(content["src/a.ts"], delta)
        for variant in ("private", "binary", "kernel"):
            def bad_git(*args):
                if variant == "private" and args[:2] == ("diff", "--name-only") and "--diff-filter=D" not in args:
                    return b".env.local\n"
                if variant == "binary" and args == ("show", f"{HEAD}:src/a.ts"):
                    return b"\x00binary"
                if variant == "kernel" and args == ("show", f"{BASE}:{KERNEL}"):
                    return b"Different kernel"
                return fake_git(*args)
            with self.subTest(variant=variant), patch.object(REVIEW, "CONTEXTS", (KERNEL,)), \
                 patch.object(REVIEW, "git", side_effect=bad_git), self.assertRaises(REVIEW.Denied):
                REVIEW.sources(HEAD, BASE)

    def test_network_refuses_other_destinations_and_does_not_inherit_credentials(self):
        response = Mock()
        response.read.return_value = b"{}"
        response.__enter__ = Mock(return_value=response)
        response.__exit__ = Mock(return_value=False)
        opener = Mock()
        opener.open.return_value = response
        with patch.dict(REVIEW.os.environ, {"KILO_API_KEY": "dummy", "GITHUB_TOKEN": "dummy"}), \
             patch.object(REVIEW.urllib.request, "build_opener", return_value=opener):
            for url in ("https://example.invalid", f"https://api.github.com/repos/{REVIEW.REPOSITORY}-other"):
                with self.assertRaises(REVIEW.Denied):
                    REVIEW.network(url)
            opener.open.assert_not_called()
            REVIEW.network(f"{REVIEW.GATEWAY}/chat/completions", b'{"tools":[]}')
            request = opener.open.call_args.args[0]
            self.assertNotIn("Authorization", request.headers)
            self.assertEqual(request.data, b'{"tools":[]}')
            self.assertEqual(request.get_method(), "POST")


if __name__ == "__main__":
    unittest.main()
