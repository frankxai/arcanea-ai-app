# The last crossing

Request: Adapt Mira's rescue into one short interactive scene. Accepted F1–F3 from `tideglass-note-v1`: glass grows only at low tide, bridges dissolve at the turn, Mira cannot grow glass. The tide is turning when play begins.

Goal: get the last traveler aboard while keeping the ferry secured.

Variables: `ropeSecured=true`, `travelerAboard=false`. States: `landing`, `reaching`, `rescued`, `missed`. Start at `landing`.

| From     | Action                     | Condition        | Effect              | To       |
| -------- | -------------------------- | ---------------- | ------------------- | -------- |
| landing  | Call traveler toward ferry | ropeSecured=true | none                | reaching |
| landing  | Untie before calling       | ropeSecured=true | ropeSecured=false   | missed   |
| reaching | Offer empty hand           | ropeSecured=true | travelerAboard=true | rescued  |
| reaching | Wait for bridge to recover | true             | none                | missed   |

Dialogue at `reaching`: “The bridge is going. Take my hand.” Choices are physical help or delay. “Grow a permanent bridge” is unavailable because it contradicts F1, F2 and F3.

Replay cases:

- Call, offer hand: rescued; travelerAboard=true; ropeSecured=true.
- Untie: missed; travelerAboard=false; ropeSecured=false.
- Call, wait: missed; travelerAboard=false; ropeSecured=true.
- Attempt permanent bridge: reject without changing state or variables.

Failure is a proposed game outcome; it does not establish a death or rewrite a published story. No engine import or playtest has occurred. Confirm understandable choices and a recoverable retry before implementation.

Asset needs: landing, ferry, dissolving bridge, two characters. No art/audio is supplied or generated; rights and visual identities remain open.

Scope control: F3 limits Mira's glass growth, not every traveler's abilities. An unnamed traveler is not automatically Mira or a named relative. Keep that identity open and bind any ability check to its actual actor. A dropped keepsake or missed departure can be a proposed game consequence, but is not an accepted event merely because the packet needs an ending. If a creator supplies a JSON envelope, use that complete envelope rather than the illustrative table above.
