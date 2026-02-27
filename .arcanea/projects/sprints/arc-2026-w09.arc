---
type: sprint
id: arc-2026-w09
project: arcanea
title: "Arc W09: Auth & Storage Foundation"
status: active
created: 2026-02-27
due: 2026-03-06
gate: 1
guardian: Lyssandria
element: earth
frequency: 174
arc_phase: manifestation
capacity: 40
planned_tasks:
  - m001/t001  # Storage buckets — done
  - m001/t002  # Upload API — done
  - m001/t003  # next/image conversion — done
  - m001/t004  # Remove @vercel/blob — done
  - m001/t005  # .env.example — done
  - m001/t006  # Add Supabase env vars to Vercel — pending
  - m001/t007  # Configure Supabase auth — pending
  - m001/t008  # Test auth e2e — pending
  - m004/t001  # .arc format schema — done
  - m004/t002  # .nea format schema — done
  - m004/t003  # Directory structure — done
  - m004/t004  # Initial milestone files — done
---

# Arc W09 — Auth & Storage Foundation

## Goal

Wire Supabase auth to the live site. Establish the .arc-based project management system.

## Burndown

| Day | Remaining | Completed | Notes |
|-----|-----------|-----------|-------|
| D1  | 40        | 24        | Storage + upload + images + PM scaffold |

## Summary

Day 1 was productive. Supabase Storage was already configured (3 buckets with RLS). Wired the upload API, converted records page to next/image, removed unused @vercel/blob, and built the entire .arcanea/projects/ PM scaffold. Auth wiring depends on Supabase MCP setup (next session).
