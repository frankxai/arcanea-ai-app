# Before the Road

An authoring proposal from Book One, Chapters Two and Three. All added dialogue and session consequences are proposed; the source manuscripts and locked lore are unchanged. This is an editable encounter, not an engine import or playable release.

Kael has already chosen Atlantean. The player chooses a first practice and a local boundary for new personal observation notes. Deferring notes leaves the journey viable. Source-local labels await the existing Realm Graph owner; they are not approved graph IDs.

Read the opening, follow one counsel route, continue to its private discussion, then choose one ending. The [JSON packet](encounter.json) carries the exact state/effect configuration. The [source manifest](source-manifest.json) records proposal status, source hashes and remaining gates.

## Before the road (`threshold`)

Sirvaine's white card is in Kael's coat. Bren is leaving. Sela is packed and waits apart. Kael has chosen Atlantean. There is time for one last request for counsel before Kael and Sela leave Ashenmere.

Kael: “Everyone knows what I might become. I still need to know what to do when I am afraid.”

Torven: “Then ask that. You have a little time before they go.”

Kael: “There is time for one first lesson.”

Choices:

- Ask Sirvaine for help naming the fear; accept being heard before being taught. → `care` (`ask-care`).
- Ask Bren for a stopping agreement; accept that a boundary is not proof of control. → `control` (`ask-control`).
- Ask Sela to separate records from theory; accept that the answer may remain unknown. → `evidence` (`ask-evidence`).

## Ask Sirvaine how to name the fear (`care`)

Kael catches Sirvaine before she mounts. The card's edge presses against the inside of the coat. Asking for this help means admitting that choosing another Academy has not made her advice unnecessary.

Kael: “If I go with Sela, will you still answer me?”

Sirvaine: “That is what the card is for.”

Kael: “I wanted to save the people on the ship. Now, every time someone looks at my eyes, I wonder whether they are counting the ways I could hurt them.”

Sirvaine: “Before you try to make that fear useful, say what it is. To a person, if you can. A teacher cannot help with the thing a student has decided to conceal.”

Kael: “What if they hear it as weakness?”

Sirvaine: “Then you will have learned something about that teacher. Ask another.”

Kael: “I am afraid I will hurt someone while trying to help.”

Sirvaine: “Yes. That is a question we can work on. You need not answer it on the lighthouse steps.”

Choices:

- Speak to Sela alone about the next questions; keep the counsel conversation out of her notes. → `private_care` (`private-care`).

## Ask Bren how to stop (`control`)

Kael calls Bren back. There will be no elemental demonstration beside the lighthouse. This is a request for a first training boundary, not proof that Kael has acquired control.

Kael: “You asked me to hit you. I still cannot promise what would happen to the lighthouse.”

Bren: “Good. You remembered the part that mattered.”

Kael: “I thought the part that mattered was hitting you.”

Bren: “For me, perhaps. For you, it was saying why you would not. We can start with that.”

Kael: “Show me something that does not involve fire.”

Bren: “Say stop before you need it. Put your hand up. Make me acknowledge it. If I go on after that, walk away from me. I can take an honest refusal.”

Kael: “Stop.”

Bren: “Stopped.”

Kael: “That was all?”

Bren: “That was the agreement. Learning to keep it is longer work. When you are ready for that work, you know where I am.”

Choices:

- Speak to Sela alone about the next questions; keep the counsel conversation out of her notes. → `private_control` (`private-control`).

## Ask Sela what she knows (`evidence`)

Kael stays beside Sela's pack. She has told the hardest thing directly. That does not make every line in her notebook equally certain.

Kael: “Before we leave, show me where what you know stops and what you think begins.”

Sela: “Your mother registered for an assessment. She declined further study. Those are records. Your sensitivity escaped detection. That is a problem. Suppression is my theory about the problem.”

Kael: “You called it a theory. How will you know if it is the wrong one?”

Sela: “By finding something it cannot explain. That is part of why I want to hear what you perceive. I may have to abandon it.”

Kael: “You read her file before you met me.”

Sela: “Yes. Her registration is in the records. Your answer to me now is about what I may ask of you next. It cannot change that file or become an agreement for the Academy.”

Kael: “Then I want to know why you ask a question before I answer it.”

Sela: “Ask me which part I observed and which I inferred.”

Choices:

- Speak to Sela alone about the next questions; keep the counsel conversation out of her notes. → `private_evidence` (`private-evidence`).

## A question out of earshot (`private_care`)

Kael and Sela step away from the other emissaries before discussing any new personal observation notes. The counsel just received is not being offered as research data.

Kael: “I spoke privately to Sirvaine. That conversation is not something I am offering for your study.”

Sela: “It will not become my notes. I am asking about something different: if you later choose to describe a new observation, may I record it after checking with you?”

Kael: “And if I change my mind?”

Sela: “Say stop and I stop writing. Those new notes stay in my own notebook; I will not share them. If you want the page back later, tell me. That is my promise about my new notes, not the old file or the Academy.”

Choices:

- Allow new observations with a check each time; keep the fear conversation private while giving Sela data. → `care_allow` (`care-allow`).
- Defer new observation notes; choose a listener before choosing what belongs in a notebook. → `care_defer` (`care-defer`).

## Carry the question (`care_allow`)

Kael gives Sela permission to note new personal observations only when she checks before recording. Sirvaine's card remains a way to ask for help, not evidence of a different allegiance. On the road, Kael's first declared practice is to name a fear before attempting to turn it into a working. Kael and Sela leave Ashenmere for Atlantean. The agreement covers only Sela's new notes of Kael's personal observations, never the mother's file or the Academy. Kael may stop a question or writing at any time; new notes are personally held, unshared, and a new page may be requested back.

Kael: “You may note a new observation after checking with me before you record it.”

Sela: “I will ask what you notice before fear, if you want that question. The conversation with Sirvaine stays out of my record.”

End of this proposed encounter.

## Keep the question private for now (`care_defer`)

Kael keeps Sirvaine's card and defers new personal observation notes until a later discussion. The first declared practice is to name a fear to a chosen listener; that listener need not be the person carrying a notebook. Kael and Sela leave Ashenmere for Atlantean. The agreement covers only Sela's new notes of Kael's personal observations, never the mother's file or the Academy. Kael may stop a question or writing at any time; new notes are personally held, unshared, and a new page may be requested back.

Kael: “Not yet. Ask again after we discuss what the question is for.”

Sela: “Then no new observation notes. We can talk without the notebook, or not talk for a while.”

End of this proposed encounter.

## A question out of earshot (`private_control`)

Kael and Sela step away from the other emissaries before discussing any new personal observation notes. The counsel just received is not being offered as research data.

Kael: “Bren agreed to stop when I said it. On the road, I need you to agree too.”

Sela: “During a question or an observation, yes. Say stop and I stop the question and stop writing. I cannot promise that a word will halt your magic. I can promise what I do.”

Kael: “You want a record of what I notice.”

Sela: “Only new observations you choose to give, checked before recording. My notebook, no sharing. Withdraw permission or ask for my new page back. My agreement, not an Academy rule or a change to the old file.”

Choices:

- Allow new observations with a check each time; test the agreed stop boundary in ordinary questions. → `control_allow` (`control-allow`).
- Defer new observation notes; establish the stop agreement before deciding whether to be studied. → `control_defer` (`control-defer`).

## Carry a stopping agreement (`control_allow`)

Kael permits Sela to note new personal observations with a check before each record. The first training boundary is a spoken stop acknowledged by the person teaching. This records an intended practice; it grants no new ability and says nothing about whether Kael can yet halt an elemental eruption. Kael and Sela leave Ashenmere for Atlantean. The agreement covers only Sela's new notes of Kael's personal observations, never the mother's file or the Academy. Kael may stop a question or writing at any time; new notes are personally held, unshared, and a new page may be requested back.

Kael: “You may note a new observation after checking with me before you record it.”

Sela: “I will ask what you notice and whether you want to continue. Your stop ends my question as well as my writing.”

End of this proposed encounter.

## Keep training and study separate (`control_defer`)

Kael defers new personal observation notes until another discussion and carries Bren's stopping agreement as the first intended training boundary. Refusing a notebook entry is not refusing the journey or forfeiting Bren's offer of later training. Kael and Sela leave Ashenmere for Atlantean. The agreement covers only Sela's new notes of Kael's personal observations, never the mother's file or the Academy. Kael may stop a question or writing at any time; new notes are personally held, unshared, and a new page may be requested back.

Kael: “Not yet. Ask again after we discuss what the question is for.”

Sela: “No new observation notes. The stopping agreement still applies to any question. You do not have to earn it by agreeing to the study.”

End of this proposed encounter.

## A question out of earshot (`private_evidence`)

Kael and Sela step away from the other emissaries before discussing any new personal observation notes. The counsel just received is not being offered as research data.

Kael: “I want the purpose of the first question before the question itself.”

Sela: “To compare what you perceive with what my theory predicts. A note must distinguish the observation from my interpretation.”

Kael: “And agreeing to that does not give you every answer after it.”

Sela: “I check before each new record. Say stop and I stop asking and writing. My new notes stay unshared in my notebook; you can withdraw and request the page. I speak for myself, not the archive.”

Choices:

- Allow new observations with a check each time; give Sela evidence while keeping her interpretation open to challenge. → `evidence_allow` (`evidence-allow`).
- Defer new observation notes; understand the purpose of the questions before supplying data. → `evidence_defer` (`evidence-defer`).

## A notebook with room for uncertainty (`evidence_allow`)

Kael permits new personal observation notes with a check before each record, and asks Sela to distinguish an observation from its interpretation. The existing theory remains unproved. The theory is a question to test, not an accepted explanation of Kael's childhood. Kael and Sela leave Ashenmere for Atlantean. The agreement covers only Sela's new notes of Kael's personal observations, never the mother's file or the Academy. Kael may stop a question or writing at any time; new notes are personally held, unshared, and a new page may be requested back.

Kael: “You may note a new observation after checking with me before you record it.”

Sela: “The first question will distinguish your observation from my interpretation. You can challenge the purpose before I record an answer.”

End of this proposed encounter.

## A question before an answer (`evidence_defer`)

Kael defers new personal observation notes until the purpose of the questions is discussed. Sela does not close the road or rewrite the mother's file. The first intended practice is to separate what a person has seen from what that person has inferred. Kael and Sela leave Ashenmere for Atlantean. The agreement covers only Sela's new notes of Kael's personal observations, never the mother's file or the Academy. Kael may stop a question or writing at any time; new notes are personally held, unshared, and a new page may be requested back.

Kael: “Not yet. Ask again after we discuss what the question is for.”

Sela: “No new observation notes. I can explain a question's purpose before you decide whether to answer; explanation does not obligate an answer.”

End of this proposed encounter.
