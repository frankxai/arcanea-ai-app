"""No-network regressions for the actual public review admission boundary."""

import copy
import importlib.util
import json
from pathlib import Path
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

    def valid_review(self):
        return {"head": HEAD, "base": BASE, "manifestSha256": "manifest",
                "coveredFiles": ["a.ts", "context.ts"], "verdict": "pass", "findings": [],
                "observations": [
                    {"path": "a.ts", "line": 1, "quote": "// guard", "behavior": "Guard annotation"},
                    {"path": "a.ts", "line": 2, "quote": "return false;", "behavior": "False result"},
                    {"path": "context.ts", "line": 1, "quote": "Context", "behavior": "Context value"},
                ],
                "acceptanceGaps": ["Static only"], "limitations": ["No runtime execution"]}

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
        for priority in ("P0", "P1", "P2", "P3"):
            contradictory = copy.deepcopy(valid)
            contradictory["verdict"] = "pass"
            contradictory["findings"][0]["priority"] = priority
            with self.subTest(priority=priority), self.assertRaises(REVIEW.Denied):
                REVIEW.validate(contradictory, HEAD, BASE, "manifest", content)
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
        self.assertNotIn("Replace ALL", request["messages"][0]["content"])

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
                 patch.object(REVIEW, "public_pin"), \
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

    def test_followup_reviews_all_context_without_empty_domain_calls(self):
        changed = ["apps/web/components/chat/chat-welcome.tsx",
                   "apps/web/components/chat/agent-header.tsx",
                   "scripts/verify-companion-browser.cjs",
                   "scripts/review-companion.py",
                   "scripts/tests/test_review_companion.py",
                   "planning-with-files/CURRENT_STATE_2026-10-11_CHAT_COMPANION.md"]
        content = {path: "Complete source" for path in set(changed) | set(REVIEW.CONTEXTS)}
        primary, planned = REVIEW.modules(changed, content)
        self.assertEqual(set(primary), {"experience", "composer", "companion-browser", "review-protocol"})
        self.assertTrue(all(primary.values()))
        self.assertEqual(sum(len(paths) for paths in primary.values()), len(changed))
        self.assertEqual(set().union(*(set(paths) for paths in planned.values())), set(content))
        self.assertIn("apps/web/components/saga/chapter-reader.tsx", planned["companion-browser"])
        self.assertIn("apps/web/app/api/ai/chat/route.ts", planned["companion-browser"])
        self.assertIn("apps/web/lib/luminors/config.ts", planned["experience"])
        for workflow in (".github/workflows/companion.yml", ".github/workflows/ci.yml"):
            self.assertIn(workflow, planned["review-protocol"])
            with self.subTest(missing_workflow=workflow), self.assertRaises(REVIEW.Denied):
                REVIEW.modules(changed, {path: value for path, value in content.items()
                                         if path != workflow})
        with self.assertRaises(REVIEW.Denied):
            REVIEW.modules(changed, {path: value for path, value in content.items()
                                     if path != "apps/web/lib/luminors/config.ts"})
        with self.assertRaises(REVIEW.Denied):
            REVIEW.modules([], {path: content[path] for path in REVIEW.CONTEXTS})
        with self.assertRaises(REVIEW.Denied):
            REVIEW.modules(changed, {**content, "unassigned.ts": "Unregistered context"})

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
