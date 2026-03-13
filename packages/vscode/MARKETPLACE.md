# VS Code Marketplace — Publish Instructions

## Short Description (for marketplace listing)
Guardian-routed AI intelligence for creators — 10 Guardians, 5 Elements, 10 Gates of creative progression

## Detailed Description (for marketplace "Overview" tab)
The README.md serves as the marketplace overview page automatically.

## Pre-Publish Checklist
- [x] `package.json` — publisher: "frankxai", categories, keywords, icon, engines
- [x] `README.md` — marketplace-ready with features, commands, Guardian table (canonical Hz)
- [x] `media/arcanea-icon.png` — 128x128 extension icon
- [x] `media/arcanea-icon.svg` — activity bar icon
- [x] `LICENSE` — Arcanea Proprietary License v1.0
- [x] `dist/extension.js` — built and minified (39KB)
- [x] Tests — 40/40 passing
- [ ] VSIX packaged (run `npm run package` from this directory)

## Steps to Publish

### Option A: Publish via CLI (recommended)

```bash
# 1. Create a publisher at https://marketplace.visualstudio.com/manage
#    - Sign in with Microsoft account
#    - Publisher ID: frankxai
#    - Display name: FrankX AI

# 2. Create a Personal Access Token (PAT)
#    - Go to https://dev.azure.com/frankxai/_usersSettings/tokens
#    - (Or: Azure DevOps → User Settings → Personal Access Tokens)
#    - Scope: Marketplace → Manage
#    - Expiration: 90 days or custom

# 3. Login from this directory
cd packages/vscode
npx @vscode/vsce login frankxai
# Paste your PAT when prompted

# 4. Package and publish
npx @vscode/vsce publish
# This builds, packages, and publishes in one step

# 5. Verify at:
# https://marketplace.visualstudio.com/items?itemName=frankxai.arcanea-code
```

### Option B: Upload VSIX manually

```bash
# 1. Build the VSIX
cd packages/vscode
npx @vscode/vsce package

# 2. Go to https://marketplace.visualstudio.com/manage
# 3. Click your publisher → "New Extension" → "VS Code"
# 4. Upload arcanea-code-0.1.1.vsix
# 5. Fill in any additional fields
```

### Post-Publish

1. Verify the listing at the marketplace URL
2. Install from VS Code: `ext install frankxai.arcanea-code`
3. Test activation, Guardian panel, and routing commands
4. Update version in `package.json` for future releases (0.2.0, etc.)

## Version Bumping for Future Releases

```bash
# Bump version
npx @vscode/vsce publish minor  # 0.1.1 → 0.2.0
npx @vscode/vsce publish patch  # 0.1.1 → 0.1.2
```
