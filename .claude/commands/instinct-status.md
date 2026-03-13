# /instinct-status — Starlight Vault Fragment Status

Show the current state of all Starlight Fragments (learned instincts) in the vault.

## What to do

1. Run `bash skills/starlight-vault/scripts/instinct-cli.sh status` to get fragment counts and listing
2. If the vault directory doesn't exist yet (`~/.arcanea/starlight-vault/`), report that the vault is empty and ready for first observations
3. Display results in a clean table format:
   - Fragment ID, confidence level, domain, scope (project/global)
   - Use visual indicators: dim (0.3), glowing (0.5), bright (0.7), radiant (0.85+)
4. Show observation count (pending fragments not yet crystallized)
5. If any fragments have confidence >= 0.8, highlight them as candidates for crystallization (promotion to global)

## Output Format

```
Starlight Vault — Fragment Status

Global:    X fragments (Y inherited, Z arcanean)
Project:   X fragments (project-name)
Pending:   X observations

Fragments:
  [radiant]  prefer-server-components    conf=0.85  code-style
  [bright]   cinzel-for-headings         conf=0.70  design-system
  [glowing]  test-before-push            conf=0.50  testing
```
