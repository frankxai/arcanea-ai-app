param(
  [string]$RunRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$ErrorActionPreference = 'Stop'

$ledgerPath = Join-Path $RunRoot 'ledger.csv'
$oversightPath = Join-Path $RunRoot 'oversight.md'
$updateScript = Join-Path $PSScriptRoot 'Update-ArcaneaImageRun.ps1'

if (!(Test-Path -LiteralPath $ledgerPath)) { throw "Missing ledger: $ledgerPath" }
if (!(Test-Path -LiteralPath $updateScript)) { throw "Missing update script: $updateScript" }

$columns = @(
  'batch_id',
  'asset_id',
  'status',
  'lane',
  'use_case',
  'asset_type',
  'quality_score',
  'canon_score',
  'design_score',
  'photography_score',
  'text_score',
  'gate_30_score',
  'gate_verdict',
  'ship_status',
  'recalibrated_at',
  'failure_modes',
  'quality_bar',
  'overall_grade',
  'generated_at',
  'workspace_path',
  'source_path',
  'prompt_ref',
  'prompt_summary',
  'recap',
  'critic_notes',
  'next_improvement',
  'next_prompt_delta',
  'skill_mode'
)

$now = (Get-Date).ToString('s')

$calibration = @{
  'batch-000-01' = @{ Gate = '24'; Verdict = 'iterate'; Status = 'concept keeper'; Grade = 'B+'; Quality = '8.0'; Failure = 'Effect density, generic hero-poster polish, needs stronger body mechanics.'; Critic = 'Good confluence read, but not competition-final. Simplify element orbits and make bending anatomy-led.'; Next = 'Regenerate with one grounded stance, fewer rings, sharper costume construction.' }
  'batch-000-02' = @{ Gate = '23'; Verdict = 'iterate'; Status = 'concept keeper'; Grade = 'B'; Quality = '7.7'; Failure = 'Ensemble density, small faces, distant world collage.'; Critic = 'Useful story board, but the crew needs clearer hierarchy and less background mythology in one frame.'; Next = 'Create separate hero trio and mentor/dragon plates before final ensemble.' }
  'batch-000-03' = @{ Gate = '24'; Verdict = 'iterate'; Status = 'concept keeper'; Grade = 'B+'; Quality = '7.9'; Failure = 'Fake book typography risk, ornate publishing render, small world details.'; Critic = 'Premium object direction is right, but final publishing visuals need deterministic cover/text design.'; Next = 'Use generated art as background only; compose exact book covers in HTML/Figma/Canva.' }
  'batch-000-04' = @{ Gate = '20'; Verdict = 'restart'; Status = 'do not publish'; Grade = 'C'; Quality = '6.7'; Failure = 'Generated infographic text risk, too many labels, low exactness.'; Critic = 'Generated-image infographics are the wrong tool for exact text-heavy systems.'; Next = 'Rebuild as deterministic SVG/HTML infographic with generated art only as texture.' }
  'batch-001-01' = @{ Gate = '24'; Verdict = 'iterate'; Status = 'concept keeper'; Grade = 'B+'; Quality = '8.0'; Failure = 'Hero density, architecture leans generic academy, crop still needs surface test.'; Critic = 'Promising site mood, but needs fewer spires and stronger first-read object.'; Next = 'Regenerate with one creator portal, larger negative space, and simpler academy silhouette.' }
  'batch-001-02' = @{ Gate = '24'; Verdict = 'iterate'; Status = 'concept keeper'; Grade = 'B+'; Quality = '8.0'; Failure = 'Character-select density, tiny label risk, uneven class distinctiveness.'; Critic = 'Good campaign direction; not final until each Origin Class has a cleaner individual design.'; Next = 'Generate one-class-per-image posters with consistent silhouette rules.' }
  'batch-001-03' = @{ Gate = '25'; Verdict = 'iterate'; Status = 'near approval'; Grade = 'B+'; Quality = '8.2'; Failure = 'Fake UI/data risk, decorative glow, not enough exact product evidence.'; Critic = 'Useful product-marketing visual; exact UI should be coded, not image-generated.'; Next = 'Create deterministic screenshot mock and use generated art as thumbnails only.' }
  'batch-001-04' = @{ Gate = '24'; Verdict = 'iterate'; Status = 'concept keeper'; Grade = 'B+'; Quality = '8.0'; Failure = 'Rainbow overload risk, civic detail density, needs one craft scene.'; Critic = 'Prisma City has strong lore potential, but needs a more specific body-led craft moment.'; Next = 'Street-level color-bending workshop with one artisan and one built object.' }
  'batch-002-01' = @{ Gate = '19'; Verdict = 'restart'; Status = 'do not publish'; Grade = 'C'; Quality = '6.5'; Failure = 'Text-heavy generated diagram, ceremonial clutter, exactness risk.'; Critic = 'Wrong production method for final lore diagram.'; Next = 'Rebuild as SVG/HTML 10-node ring with exact labels.' }
  'batch-002-02' = @{ Gate = '25'; Verdict = 'iterate'; Status = 'near approval'; Grade = 'B+'; Quality = '8.2'; Failure = 'Crest details may not survive vector/small-size tests, house names need exact composition.'; Critic = 'Strongest system asset, but logo/crest work must become vector-first before approval.'; Next = 'Trace and simplify each crest into one-color vector masters.' }
  'batch-002-03' = @{ Gate = '25'; Verdict = 'iterate'; Status = 'near approval'; Grade = 'B+'; Quality = '8.1'; Failure = 'Label exactness, specimen count density, possible material sameness.'; Critic = 'Useful material mood board; final educational plate needs deterministic labels.'; Next = 'Create separate specimen boards with exact HTML/SVG labels.' }
  'batch-002-04' = @{ Gate = '24'; Verdict = 'iterate'; Status = 'concept keeper'; Grade = 'B+'; Quality = '8.0'; Failure = 'Dark fantasy cliche risk, ornate armor, needs more specific tragic mechanism.'; Critic = 'Emotion is useful, but final Malachar should show the Source Gate failure more concretely.'; Next = 'Regenerate as story scene with one failed consent/control action.' }
  'batch-003-01' = @{ Gate = '23'; Verdict = 'iterate'; Status = 'concept keeper'; Grade = 'B'; Quality = '7.6'; Failure = 'Underwater skyline too dense, generic luminous Atlantis, glow ribbons overused.'; Critic = 'The idea is excellent, but the render reads like AI maximalist fantasy wallpaper rather than a crisp world-class keyframe.'; Next = 'Closer archive chamber, one memory-water ribbon, real caustics, fewer towers.' }
  'batch-003-02' = @{ Gate = '26'; Verdict = 'approved with notes'; Status = 'approved concept asset'; Grade = 'A-'; Quality = '8.5'; Failure = 'Could use stronger foreground human emotion and cleaner atmospheric separation.'; Critic = 'Best world vista in the set. The landscape-implied dragonform feels ownable and less generic.'; Next = 'Create ridge-level explorer shot with same worldform but stronger foreground story.' }
  'batch-003-03' = @{ Gate = '22'; Verdict = 'iterate'; Status = 'concept keeper'; Grade = 'B-'; Quality = '7.3'; Failure = 'Postcard/temple shorthand risk, cultural specificity needs more abstract care.'; Critic = 'Respectful direction, but needs more symbolic environmental abstraction.'; Next = 'Reduce built forms; emphasize mist, water, bridge, resonance, and stewardship.' }
  'batch-003-04' = @{ Gate = '23'; Verdict = 'iterate'; Status = 'concept keeper'; Grade = 'B'; Quality = '7.6'; Failure = 'Generic sci-fi team poster risk, crowded staging, title/text risk.'; Critic = 'Good campaign seed, but needs one crew per image and more ownable uniform/tool language.'; Next = 'Generate individual crew posters for Solara, Ninth Flame, and Hollow Stars.' }
  'batch-004-01' = @{ Gate = '23'; Verdict = 'iterate'; Status = 'concept keeper'; Grade = 'B'; Quality = '7.6'; Failure = 'Over-ornate armor, random gold filigree, too many element rings, not enough practical fieldwear.'; Critic = 'Arion reads, but the design is still game-splash ornate instead of studio-final modelable.'; Next = 'Simpler fieldwear, one prism bracer, one effect cluster, clean full-body model plate.' }
  'batch-004-02' = @{ Gate = '23'; Verdict = 'iterate'; Status = 'concept keeper'; Grade = 'B'; Quality = '7.5'; Failure = 'Gown-like silhouette, too many memory bubbles, jewelry/noise, practical movement weak.'; Critic = 'Mera has emotion and beauty, but not enough crisp field-gear credibility.'; Next = 'Regenerate with one water lens, boots, layered short coat, and clean underwater corridor.' }
  'batch-004-03' = @{ Gate = '25'; Verdict = 'iterate'; Status = 'near approval'; Grade = 'B+'; Quality = '8.2'; Failure = 'Lab clutter, ornament density, prism/tool function could be clearer.'; Critic = 'Strongest character-system bridge. Needs one engineered prop-forward pass to become final.'; Next = 'Half-body lab portrait with one prism instrument and deterministic product-language workbench.' }
  'batch-004-04' = @{ Gate = '22'; Verdict = 'iterate'; Status = 'concept keeper'; Grade = 'B-'; Quality = '7.2'; Failure = 'Ceremonial-heavy mentor trope, costume practicality weak, dragon presence may overpower.'; Critic = 'Mentor energy is usable, but the design needs a grounded training-court version.'; Next = 'Field mentor at dragon training court with practical riding details and less robe ceremony.' }
  'batch-005-01' = @{ Gate = '23'; Verdict = 'iterate'; Status = 'concept keeper'; Grade = 'B'; Quality = '7.6'; Failure = 'Mobile hero still ornate, small details, insufficient flat copy area.'; Critic = 'Usable exploration asset; not final for live mobile hero without crop and simplification.'; Next = 'Lower clutter, larger desk object, more clean top/left negative space.' }
  'batch-005-02' = @{ Gate = '26'; Verdict = 'approved with notes'; Status = 'approved practical asset'; Grade = 'A-'; Quality = '8.5'; Failure = 'Small note/text artifacts possible, should be cropped for final surface.'; Critic = 'Best practical marketing asset. It feels like a real making-of production layer.'; Next = 'Create horizontal blog hero crop and exact overlay text in code/design tool.' }
  'batch-006-01' = @{ Gate = '27'; Verdict = 'approved with notes'; Status = 'approved lore keyframe'; Grade = 'A'; Quality = '8.8'; Failure = 'Minor generic underwater-city silhouette in the distance, right-side ornament density, field gear still slightly robe-like.'; Critic = 'Best Thal''Maris pass so far: one readable archive chamber, strong memory-water apparatus, crisp figure, and no skyline wallpaper overload.'; Next = 'Create alternate crop with more negative space and an even clearer practical archive-restoration bridge.' }
  'batch-006-02' = @{ Gate = '25'; Verdict = 'iterate'; Status = 'near approval'; Grade = 'B+'; Quality = '8.3'; Failure = 'Element orbs still read slightly game-symbolic and detached from body mechanics; face/costume drift toward perfect fantasy model.'; Critic = 'Huge costume improvement and crisp render, but final Arion needs elements emerging from stance, breath, joints, and pressure rather than decorative satellites.'; Next = 'Regenerate in academy training action pose with less symmetry, fewer floating icons, and more tactile fieldwear wear.' }
  'batch-006-03' = @{ Gate = '26'; Verdict = 'approved with notes'; Status = 'approved character concept'; Grade = 'A-'; Quality = '8.5'; Failure = 'Hair color drift, charm/jewelry density, and slight fashion-portrait polish still need canon lock.'; Critic = 'Mera now has a clear ethical memory-water lens, practical coat/boots, readable face, and stronger field credibility.'; Next = 'Lock hair/costume canon and make the next version less fashion-beauty, more truth-witness operator.' }
  'batch-006-04' = @{ Gate = '25'; Verdict = 'iterate'; Status = 'near approval direction'; Grade = 'B+'; Quality = '8.4'; Failure = 'Generated text and diagram labels cannot be trusted as final; bottom/right information panels should be rebuilt deterministically.'; Critic = 'Excellent product-system direction for Emilia and the prism instrument, but it must become a designed infographic with exact text over this visual language.'; Next = 'Rebuild as HTML/Canva/Figma infographic using the character and tool language, with exact copy and vector labels.' }
  'batch-007-01' = @{ Gate = '27'; Verdict = 'approved with notes'; Status = 'approved character action'; Grade = 'A'; Quality = '8.8'; Failure = 'Still has a slight premium game-poster finish, but the effects now attach to stance and pressure rather than detached icons.'; Critic = 'Best Arion so far. The body mechanics, floor pressure, costume construction, and confluence read finally work together.'; Next = 'Create a calmer model-sheet turnaround from this design, preserving the same fieldwear and bracer language.' }
  'batch-007-02' = @{ Gate = '27'; Verdict = 'approved with notes'; Status = 'approved character-product asset'; Grade = 'A'; Quality = '8.8'; Failure = 'Rainbow beam is a little literal, and the face still reads beauty-editorial, but the no-text constraint succeeded.'; Critic = 'Best Emilia usable asset: clean product-photography logic, crisp instrument, clear prism-to-tool action, no generated labels.'; Next = 'Create a deterministic companion infographic using this instrument language and exact vector labels.' }
  'batch-007-03' = @{ Gate = '26'; Verdict = 'approved with notes'; Status = 'approved mentor concept'; Grade = 'A-'; Quality = '8.6'; Failure = 'Coat and dragon scale still carry some ornate fantasy density; dragon presence is large but not dominant.'; Critic = 'Akamoto is finally grounded: practical rider layers, credible saddle context, age and authority, and no robe-heavy wizard cliche.'; Next = 'Create a simpler training-instruction scene with students for story use.' }
  'batch-007-04' = @{ Gate = '28'; Verdict = 'approved with notes'; Status = 'approved story keyframe'; Grade = 'A'; Quality = '9.0'; Failure = 'Source chamber ornament is dense, and Malachar silhouette should be canon-locked before reuse.'; Critic = 'Strongest tragic canon image in the run. It shows forced communion, corrupted grip, witnesses, and Source rejection without cheap dark-lord signals.'; Next = 'Create a second version from Shinkami/witness perspective for the canon dossier.' }
  'batch-008-01' = @{ Gate = '28'; Verdict = 'approved with notes'; Status = 'approved canon keyframe'; Grade = 'A'; Quality = '9.0'; Failure = 'Witness silhouette design should be canon-locked before repeated Shinkami use; chamber ornament remains dense.'; Critic = 'Excellent witness-POV continuation. It adds mercy, refusal, and cosmic law without making the scene a battle.'; Next = 'Use this and batch-007-04 as paired canon dossier plates with exact text added outside the image.' }
  'batch-008-02' = @{ Gate = '26'; Verdict = 'approved with notes'; Status = 'approved model plate'; Grade = 'A-'; Quality = '8.6'; Failure = 'Still slightly idealized and decorative; faint trails could be reduced for a true production model sheet.'; Critic = 'Clean Arion continuity plate: full silhouette, costume construction, bracer language, and restrained confluence traces are all usable.'; Next = 'Create orthographic front/back design in deterministic layout or handoff to human art direction.' }
  'batch-008-03' = @{ Gate = '28'; Verdict = 'approved with notes'; Status = 'approved product hero'; Grade = 'A'; Quality = '9.0'; Failure = 'Beam remains slightly literal rainbow, but no text and product material logic are excellent.'; Critic = 'Top-tier product asset for Emilia. The instrument reads as manufacturable luxury hardware with clear prism function.'; Next = 'Use as site/product hero; build exact labels and diagrams separately in HTML/Figma/Canva.' }
  'batch-008-04' = @{ Gate = '27'; Verdict = 'approved with notes'; Status = 'approved social/mobile asset'; Grade = 'A'; Quality = '8.8'; Failure = 'Distant skyline still leans generic Atlantis, and Mera costume remains slightly robe-like; top copy area is strong.'; Critic = 'Best vertical Thal''Maris crop so far: strong phone readability, clean upper negative space, and one clear archive-water action.'; Next = 'Create a crop-tested mobile hero with deterministic overlay text outside the image.' }
}

$rows = @(Import-Csv -LiteralPath $ledgerPath)
$rows = @($rows | ForEach-Object {
  $normalized = [ordered]@{}
  foreach ($column in $columns) {
    $property = $_.PSObject.Properties[$column]
    $normalized[$column] = if ($null -ne $property) { [string]$property.Value } else { '' }
  }
  [pscustomobject]$normalized
})

foreach ($row in $rows) {
  $entry = $calibration[$row.asset_id]
  if ($null -eq $entry) { continue }

  $row.quality_score = $entry.Quality
  $row.gate_30_score = $entry.Gate
  $row.gate_verdict = $entry.Verdict
  $row.ship_status = $entry.Status
  $row.recalibrated_at = $now
  $row.failure_modes = $entry.Failure
  $row.quality_bar = '30 point generated asset gate: 26+ approve, 22-25 iterate, 0-21 restart'
  $row.overall_grade = $entry.Grade
  $row.critic_notes = $entry.Critic
  $row.next_improvement = $entry.Next
}

$rows |
  Sort-Object batch_id, asset_id |
  Select-Object $columns |
  Export-Csv -LiteralPath $ledgerPath -NoTypeInformation

$latestBatch = ($rows | Sort-Object batch_id -Descending | Select-Object -First 1).batch_id
& $updateScript -RunRoot $RunRoot -BatchId $latestBatch -SkipCopy | Out-Host

$generatedCount = @($rows | Where-Object { $_.status -eq 'generated' }).Count
$approvedAssets = @($rows | Where-Object { $_.gate_verdict -eq 'approved with notes' } | Sort-Object asset_id | Select-Object -ExpandProperty asset_id)
$nearApprovalAssets = @($rows | Where-Object { $_.gate_verdict -eq 'iterate' -and $_.ship_status -like 'near approval*' } | Sort-Object asset_id | Select-Object -ExpandProperty asset_id)
$restartAssets = @($rows | Where-Object { $_.gate_verdict -eq 'restart' } | Sort-Object asset_id | Select-Object -ExpandProperty asset_id)
$note = @"

## Quality Recalibration - $now

The previous 9.x score interpretation is deprecated. The current $generatedCount generated images were rescored with the 30 point generated asset gate.

- Approved with notes: $($approvedAssets -join ', ').
- Near approval / iterate: $($nearApprovalAssets -join ', ').
- Concept keepers needing iteration: most lore, character, and hero assets.
- Restart: $($restartAssets -join ', ').

Primary correction: future batches must optimize for crisp art direction, fewer motifs, modelable material logic, body-led bending, and actual artifact inspection before approval.

"@

Add-Content -LiteralPath $oversightPath -Value $note -Encoding UTF8

Write-Host "Recalibrated ledger: $ledgerPath"
