# Domain Configuration

## Production Domains

### Active Domains
- **Primary:** `www.arcanea.ai` (production app)
- **Apex redirect:** `arcanea.ai` → redirects to `www.arcanea.ai`
- **Vercel domain:** `arcanea-ai-app.vercel.app` (public, no auth wall)

### Domain Configuration in Vercel

The production deployment (from `main` branch) should have these domains attached:

1. **www.arcanea.ai** (primary)
2. **arcanea.ai** (with redirect to www)
3. **arcanea-ai-app.vercel.app** (automatic Vercel domain)

## Broken/Legacy Domains

### app.arcanea.ai (Currently Broken)

**Status:** DNS exists but deployment is broken
- TLS handshake fails (`curl: (35) unexpected eof`)
- HTTP returns `DEPLOYMENT_NOT_FOUND` (Vercel 404)
- DNS points to Vercel (216.150.1.1)

**Root Cause:** The DNS record was created but the domain was never attached to a production deployment in the Vercel dashboard.

**Fix Required:** One of the following options:

#### Option A: Redirect to www (Recommended)
1. In Vercel dashboard → Project Settings → Domains
2. Add domain: `app.arcanea.ai`
3. Configure as redirect to `www.arcanea.ai` (301 permanent)
4. This will fix the TLS issue and provide a proper redirect

#### Option B: Remove DNS (If Not Needed)
1. In Vercel dashboard → Project Settings → Domains
2. If `app.arcanea.ai` is listed, remove it
3. In DNS provider (Cloudflare/Vercel DNS), remove the DNS record for `app`
4. This prevents the broken state entirely

**Recommended:** Option A, since the DNS already exists and users may have bookmarked the URL.

### arcanea.vercel.app (Leftover Site)

**Status:** Different deployment (not the main product)
- Shows raw "Privacy Policy" HTML (last updated Mar 19, 2025)
- Not the production app

**Issue:** This is a leftover Vercel project from an older deployment or test.

**Fix Required:**
1. In Vercel dashboard, identify the project serving `arcanea.vercel.app`
2. Either:
   - Delete the old project if it's no longer needed
   - Redirect it to `www.arcanea.ai`
   - Or update it to show a proper redirect page

## Preview Deployments

**Protection:** Standard Protection should be enabled on preview deployments only
**Production:** Keep production deployments public (no Vercel auth wall)

## Environment Variables

### NEXT_PUBLIC_APP_URL

Set in Vercel environment variables:
```
NEXT_PUBLIC_APP_URL=https://www.arcanea.ai
```

This ensures:
- Correct canonical URLs in sitemaps
- Proper OG tags and metadata
- Correct OAuth callback URLs

## DNS Records (Reference)

Current DNS configuration (managed in Vercel or Cloudflare):

```
CNAME www.arcanea.ai     → cname.vercel-dns.com (✅ working)
ALIAS arcanea.ai         → 76.76.21.21 (Vercel) (✅ working, redirects to www)
CNAME app.arcanea.ai     → 216.150.1.1 (Vercel) (❌ broken, needs fix)
CNAME arcanea.vercel.app → auto (Vercel) (⚠️ leftover project)
```

## Verification

After applying fixes, verify:

```bash
# Should return 200
curl -I https://www.arcanea.ai

# Should return 301/302 redirect to www
curl -I https://arcanea.ai

# Should return 301 redirect to www (after fix)
curl -I https://app.arcanea.ai

# Should work without TLS errors
curl https://app.arcanea.ai
```

## Related Files

- `/vercel.json` - Vercel project configuration
- `/apps/web/next.config.js` - Next.js configuration
- `/apps/web/.env.example` - Environment variable template
