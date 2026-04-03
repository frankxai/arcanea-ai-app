# Taste Engineering — Deep Reference

## The 10 Principles (Extended)

### Principle 1: Constraint Is Quality
- Azuki limits 12-18 colors per piece
- Doodles uses ONE line weight (4px black)
- Checks VV uses ONE shape (check mark)
- **Implementation**: Style Pack defines hard palette limits, line rules, material constraints
- **Pipeline enforcement**: Palette checker rejects images with off-palette colors

### Principle 2: The 64px Thumbnail Test
- DeGods explicitly tests silhouette at 64x64
- Invisible Friends: silhouette IS the character
- **Implementation**: Downscale → edge detection → flood fill from corners → measure foreground ratio
- **Threshold**: Character must fill >15% (standard) or >20% (premium) of thumbnail

### Principle 3: Curated Palette, Never Random
- No great collection assigns colors from HSL ranges
- All use 40-80 pre-harmonized colors
- Colors tested in LAB space (perceptually uniform)
- **Implementation**: Master palette defined in CIELAB. Delta-E 2000 distance scoring.
- **Post-processing**: Remap off-palette colors edge-aware

### Principle 4: Light Has A Contract
- Azuki: always upper-left (10 o'clock)
- Pudgy: soft ambient with consistent AO
- Captainz: dramatic cinematic, never flat
- **Implementation**: Lighting baked into LoRA training + prompt engineering
- **Never changes within a collection**

### Principle 5: Trait Interaction > Trait Quantity
- Azuki manually removed 30% of valid combinations
- Clone X restricts traits by DNA type
- **Implementation**: Compatibility matrix. IncompatibilityRule[] in CollectionSchema.
- **Example**: Nero Shard crystal can't pair with Lumina House in Arcanea packs

### Principle 6: Material Consistency
- One rendering style across ALL traits
- Never flat-fill hat on soft-shaded face
- **Implementation**: Style LoRA enforces material rendering uniformity
- **Style Pack**: MaterialRule[] defines how each material renders + prompt keywords

### Principle 7: Proportion Is Sacred
- Fixed head-to-body ratio, eye placement, shoulder width
- ProportionTemplate: headRatio, shoulderToHead, eyeLine, fillRatio, crop
- **Implementation**: ControlNet pose enforcement + framing prompt

### Principle 8: Narrow Mood Range
- Azuki = confident/neutral (never fearful)
- Pudgy = cute/friendly (never aggressive)
- **Implementation**: MoodRange.rejected → negative prompt
- **Quality gate**: Classify expression, reject out-of-band

### Principle 9: Designed Negative Space
- Azuki: flat color backgrounds push attention to character
- Captainz: environmental art adds narrative
- **Implementation**: BackgroundRule in Style Pack defines relationship type

### Principle 10: Rarity Serves Aesthetics
- Rare traits = unusual-but-harmonious, never rule-breaking
- A rare Azuki has unusual color combo, not a different style
- **Implementation**: Rare traits designed more carefully, still follow same rules

## Collection Analysis: What Each Top Project Got Right

| Collection | Stars | Key Insight | Applicable To Our Pipeline |
|-----------|-------|-------------|---------------------------|
| Azuki | 7K | Three-tier line weight (3/2/1px) | Style Pack line rules |
| Pudgy Penguins | N/A | 60-30-10 color rule per piece | Palette distribution scoring |
| DeGods | N/A | High contrast as identity | Style Pack contrast parameters |
| Clone X | N/A | Helmet as bounded canvas for variation | "Zone" system for trait placement |
| Doodles | N/A | Max 3 "visual events" per piece | Complexity limiter in trait selection |
| Invisible Friends | N/A | Negative space IS character | Background rule: figure-ground contract |
| Deadfellaz | N/A | Mood never breaks (even rare traits) | MoodRange enforcement in quality gate |
| Checks VV | N/A | Reductionism as rarity | Inverse complexity-rarity mapping |
| Captainz | N/A | Cinematic camera (24-35mm, low angle) | Framing template in Style Pack |

## Style DNA Specification

Style DNA is a mathematical fingerprint extracted from reference images:

```typescript
interface StyleDNA {
  // Palette distribution (histogram in LAB space)
  paletteDistribution: {
    dominantHues: number[];      // Top 5 hue angles
    saturationRange: [number, number]; // Min-max saturation
    lightnessRange: [number, number];  // Min-max lightness
    warmthBias: number;          // -1 (cool) to 1 (warm)
  };

  // Edge characteristics
  edgeProfile: {
    avgLineWeight: number;       // In pixels at 1024x1024
    lineWeightVariance: number;  // How much line weight varies
    edgeDensity: number;         // Edges per area unit
    edgeSharpness: number;       // Blur vs crisp edges
  };

  // Contrast profile
  contrastProfile: {
    globalContrast: number;      // 0-1 (low to high)
    localContrast: number;       // Detail-level contrast
    valueDistribution: number[]; // Histogram of brightness values
  };

  // Material rendering
  materialProfile: {
    flatFillRatio: number;       // % of area using flat fills
    gradientRatio: number;       // % using gradients
    textureRatio: number;        // % using textures
    specularHighlights: boolean; // Has shiny spots
  };

  // Composition
  compositionProfile: {
    subjectPosition: [number, number]; // Center of mass
    symmetryScore: number;       // How symmetric
    fillRatio: number;           // Subject vs background
    depthLayers: number;         // Foreground/mid/background
  };
}
```

Extraction: Analyze 10-50 reference images, compute per-image DNA, average. Store as JSON alongside Style Pack.

Use for: Quality gate comparison. Generated images must match DNA within thresholds.
