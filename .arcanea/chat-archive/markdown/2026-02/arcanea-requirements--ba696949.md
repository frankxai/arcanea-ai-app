---
title: "Arcanea requirements"
uuid: ba696949-a03d-4db5-919d-e282b832878b
created: 2026-02-28T22:28:47.070840Z
updated: 2026-02-28T22:28:58.166178Z
source: claude.ai export
---

# Arcanea requirements

**Frank**:

do we need for arcanea?

[attached file: 1772317719463_image.png -- no extractable text, e.g. an image; verify by hand if relevant]

**Claude**:

Dynamic client registration (RFC 7591) — do they need it for Arcanea?**No, cancel it.**

Dynamic client registration (RFC 7591) is for platforms where *unknown third parties* programmatically register OAuth clients at runtime — think Zapier-style ecosystems or federated identity networks.

Arcanea's auth surface is controlled: known clients (web, mobile, AI agents), pre-registered, finite set. You own the registration layer.

The attack vector is real and not theoretical — public `/register` endpoint with no pre-auth means anyone can spin up a convincing "Arcanea Guardian Portal" OAuth app against your own server.

**Enable it only when** you're building a marketplace where external developers need to self-register integrations programmatically *without* going through you. That's a future state, not now.
