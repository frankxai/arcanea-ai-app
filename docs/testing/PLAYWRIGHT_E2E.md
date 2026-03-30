# Playwright E2E

Run the web smoke suite from the repo root:

```bash
pnpm --dir apps/web test:e2e
```

The current smoke spec uses browser-local storage seeding and route interception to validate the project continuity flow without depending on live Supabase auth.
