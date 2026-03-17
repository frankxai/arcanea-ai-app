---
arc: "1.0"
id: "arc_data_scientist_baker"
type: "character"
stage: "manifestation"
created: "2026-03-15T11:00:00Z"
creator: "frankx"

apl:
  spark: "A woman who quit her data science job at a Fortune 500 to open a bakery — and she still thinks in datasets. She measures customer satisfaction by how long people close their eyes on the first bite. She tracks it in a spreadsheet she'll never show anyone."
  palette: "root"
  sharpen:
    - "quirky career-change rom-com character"
    - "she 'found herself' through baking"
    - "corporate world was toxic and baking is pure"
    - "love interest who teaches her to stop analyzing"
    - "she misses her old life"

history:
  - stage: "potential"
    at: "2026-03-15T11:00:00Z"
    input: "A character who quit tech to open a bakery"
    model: null
    note: "This premise is a rom-com cliche. The APL needs to save it from itself."

  - stage: "potential"
    at: "2026-03-15T11:20:00Z"
    input: "SPARK: She didn't quit data science. She applied it somewhere the data is warm. She knows her croissants have a 94% first-bite-eye-close rate and she knows this makes her a lunatic. She does not care. SHAPE: ROOT — packed earth, weight in the chest, amber light, low hum of the oven, smell of flour and patience. SHARPEN: NOT quirky. NOT 'finding herself.' NOT corporate-bad/baking-good. She loved the data job. She loves this more. Both are true."
    model: "claude-opus-4.6"
    quality: 91
    note: "The 'data is warm' reframe changed the character from cliche to specific"

  - stage: "manifestation"
    at: "2026-03-15T12:00:00Z"
    input: "Full character profile. Name: Maren Okafor-Singh. Age: 38. Build her psychology around the idea that she doesn't see analytics and baking as different — she sees pattern recognition in both. Her croissant process has 47 variables she tracks. She can tell you the humidity that produces the best lamination to two decimal places. She is not whimsical. She is precise about soft things."
    model: "claude-opus-4.6"
    output: "text/data-scientist-baker-profile.md"
    quality: 93
    note: "The phrase 'precise about soft things' became the character's thesis statement"

bonds:
  - target: "arc_last_lesson"
    relation: "inspired_by"
    note: "Maren could have been a student in that classroom — someone who learned math and found a way to make it smell like butter"
  - target: "arc_flammable_memories"
    relation: "inhabits"
    note: "In The Combustible, Maren's spreadsheet is a fire hazard — every data point is a memory of watching someone's face"
  - target: "arc_kaels_ascent"
    relation: "illustrates"
    note: "Maren's career shift parallels Kael's transformation arc — mastery reapplied, not abandoned"

agent:
  context: "Maren Okafor-Singh is not a woman who left data science. She is a data scientist who changed her dataset. Her bakery is her lab. Her customers are her study population. Her sourdough starter is a living time-series with 14 months of daily observations. She is the most rigorous person in any room and the room smells like cinnamon."
  instructions: "When writing Maren, never make her analytical nature the butt of a joke. It is her superpower. She is funny, but the humor comes from the precision being applied to something 'unserious' — and the reader gradually realizing it IS serious. A perfect croissant IS worth 47 variables."
  next_step: "Write the scene where Maren explains her spreadsheet to a friend over wine. The friend says 'You know that's insane, right?' Maren says 'The 94% says otherwise.' She is not joking."
  constraints:
    - "She does not regret leaving tech — she does not feel she left at all"
    - "The analytical behavior is never presented as a flaw to be overcome"
    - "She loved her data science job. She loves the bakery more. Both statements are fully true."
    - "She is precise about soft things — this is the core tension and it is not a contradiction"
    - "The spreadsheet exists. It has columns for: customer age range, first visit vs return, item ordered, bite-to-eye-close latency (seconds), ambient temperature, day of week"
    - "She is 38, Nigerian-Indian heritage, lives alone with a sourdough starter she has named Dr. Chen after her favorite statistics professor"

provenance:
  models_used:
    - id: "claude-opus-4.6"
      role: "character development and psychology"
  license: "CC-BY-4.0"

tags:
  - "character"
  - "root-palette"
  - "data-science"
  - "bakery"
  - "career-change"
  - "specificity"
  - "apl-showcase"
gate: 1
element: "earth"
---

# Maren Okafor-Singh — Character Bible

## The Thesis

"Precise about soft things."

This is the entire character in four words. She doesn't see a contradiction between spreadsheets and sourdough. Both are about understanding a system well enough to produce something excellent. The dough doesn't know it's being measured. The customers don't know they're data points. The croissants are not less delicious because she can explain exactly why they work.

## The Spreadsheet

Columns:
- `customer_id` (anonymized, she's not a monster)
- `age_range` (estimated, 5-year bands)
- `first_visit` (boolean)
- `item` (product SKU she invented herself)
- `eye_close_latency_s` (time from first bite to eyes closing, in seconds, measured by wall clock)
- `eye_close_duration_s` (how long the eyes stay closed)
- `ambient_temp_c` (she has a thermometer by the register)
- `day_of_week`
- `weather` (categorical: clear/overcast/rain/snow)
- `notes` (free text, she allows herself one sentence)

14 months of daily data. 3,847 rows. She has never shown it to anyone. She will never show it to anyone. It is not for showing. It is for knowing.

## The Sourdough Starter

Named Dr. Chen, after her favorite statistics professor at Georgia Tech. Dr. Chen (the starter) is 14 months old and has been measured daily: temperature, rise rate, smell (categorical scale she invented: yeasty/vinegary/floury/sweet/complex), and bubble density per square inch.

Dr. Chen (the professor) does not know about this. Maren will never tell him.

## What She Misses (Nothing You'd Expect)

She doesn't miss the salary. She doesn't miss the prestige. She misses the massive datasets — the feeling of a million rows loading into memory. Her bakery generates maybe 40 data points a day. It's like going from conducting an orchestra to playing a ukulele.

She loves the ukulele. But sometimes she misses the orchestra.

## Why ROOT

The ROOT palette (packed earth, bark, weight in chest, amber, bone, dark wood) is Maren's world. The bakery smells like flour and patience. The counter is worn smooth. The oven hums at a frequency she can identify by pitch. Everything in her space has been there long enough to earn its place. She does not decorate. She arranges. There's a difference and she can explain it with data.
