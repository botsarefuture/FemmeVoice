# FemmeVoice Product Vision

**Status:** product direction, not an implementation commitment  
**Last reviewed:** 17 July 2026  
**Companion document:** [Research and Practice Guide](research-guide.md)

## The promise

FemmeVoice is the private, research-literate place where a person can learn a voice and communication style that feels more like them. It helps people listen, experiment, practise, reflect, and carry skills into ordinary life without treating a number, a range, or an algorithmic judgment as a verdict on their identity.

It is not a replacement for a voice-specialized speech-language pathologist (SLP), ENT/laryngologist, or urgent care. It does not diagnose vocal health, infer gender, or promise how a listener will perceive someone.

## What makes FemmeVoice different

Most voice-training products optimize for content volume, pitch targets, or engagement. FemmeVoice optimizes for:

1. **Agency.** The learner chooses the goal, pace, language, practice context, and privacy level. The coach offers reasons and choices, never a hidden score.
2. **Understanding before imitation.** It teaches how to notice and safely explore sound, rather than asking people to copy a creator or chase a note.
3. **Transfer over isolated exercise performance.** The meaningful destination is a comfortable conversation, meeting, game, stream, or quiet moment in daily life.
4. **Evidence with limits.** Every recommendation says why it exists, what supports it, and what remains uncertain.
5. **Privacy by default.** Live analysis stays on-device. Recording, sharing, reminders, and community participation are explicit choices.
6. **Return without shame.** A missed day, a lower-energy day, or a difficult week is ordinary learning data, not failure.

Gender-affirming voice work is inherently multidimensional. Pitch can matter, but listener perception also involves resonance-related cues, quality, articulation, loudness, and prosody. No single measurement can stand in for the learner's communication goals or identity. [R1](#sources)

## Product principles

Every feature, lesson, metric, and business decision must satisfy these principles.

### 1. Comfort is a hard boundary

The app never asks a person to work through pain, persistent hoarseness, unusual fatigue, difficulty breathing or swallowing, or loss of voice. It offers a lower-intensity route, pause, and clinically appropriate guidance. It never teaches forced larynx movement or swallowing drills.

### 2. The learner is the authority

The app can measure a limited set of acoustic signals. The learner decides whether a sound is comfortable, useful, affirming, appropriate for a context, or worth keeping. Completion is based on participation and reflection, never on sounding a particular way.

### 3. Explain the recommendation

Any adaptive suggestion must show its basis in plain language: for example, "You marked this as effortful yesterday, so this session starts with a shorter reset." A person can always change, skip, or turn off the suggestion.

### 4. No engagement by pressure

No leaderboards, public streaks, loss aversion, manipulative notifications, artificial scarcity, or messages implying that taking time away loses progress. A notification is an invitation that can be paused or tailored.

### 5. Design for many ways of learning

Each important concept has a concise text explanation, an audio or visual example where useful, an interactive experience, and an optional reflection. This follows Universal Design for Learning's emphasis on multiple means of engagement, representation, and expression. [R2](#sources)

### 6. Preserve the right to be private

The default profile is private and pseudonymous. Voice recordings are opt-in, encrypted before upload, and never shared by default. Analytics use data minimization, aggregation, short raw retention, and clear export/deletion.

### 7. Treat uncertainty honestly

Do not turn clinical consensus, a coach's technique, or lived experience into a scientific fact. State the evidence level and limitations next to the lesson claim that relies on it.

## Product review and redesign

The earlier academy proposal is a strong foundation, but it has risks that need active redesign.

| Risk in the earlier model | Why it creates friction | Better product decision |
| --- | --- | --- |
| A long linear course | New learners may feel behind or overwhelmed before they begin. | Present a single next session, with the full map available but quiet. Use a curriculum graph underneath. |
| A baseline recording as a first step | Recording can feel exposing, dysphoria-inducing, technically difficult, or unsafe at home. | Make it optional, explain its benefit, and offer a no-recording path. |
| Estimated completion date | It can become a deadline and punish real life. | Show a flexible forecast based on actual pace, labelled as a planning aid. |
| Acoustic checks as progression gates | A microphone cannot assess resonance, vocal weight, comfort, or identity. Noise and variability create false failures. | Use acoustic feedback only for bounded tasks such as pitch stability. Allow self-confirm, repeat, lower intensity, or continue. |
| "Learning styles" as fixed categories | People are not fixed visual/auditory/kinesthetic types, and labels can restrict choice. | Offer multiple representations and actions for every learner without assigning a type. |
| Full community from launch | It requires costly moderation, safeguarding, reporting, and privacy controls. | Start with structured, moderated, opt-in community moments. Do not add DMs or public profiles initially. |
| Drag-and-drop authoring from day one | It is a complex product before the content model is validated. | Start with structured lesson templates and versioned review; add visual composition later. |
| "AI coach" as a black box | It could overstate certainty, expose sensitive data, and feel judgmental. | Launch a transparent rules-based coach. Any future AI must be optional, bounded, and never diagnose or gender-score. |

## Experience by person

### First-time learner

They see: "Start with a small, private exploration. You do not need to sound any particular way today." They choose a goal, time available, language, and whether to use the microphone now, later, or never. The first success is noticing one change, not hitting a target.

### Someone who has tried training before

They can select "I know some basics" and take a short, non-scored orientation. The coach asks what has felt confusing, tiring, or useful, then unlocks the relevant foundation and intermediate material without requiring them to repeat beginner content.

### Someone overwhelmed, fatigued, anxious, or with ADHD

The home screen has one clear action: `Continue for 3 minutes`. It shows the exact next action, hides the rest until requested, remembers where they stopped, allows pausing mid-block, and offers a low-stimulation mode. No countdown pressure or surprise autoplay.

### Someone with little free time

They receive a complete micro-session, not a truncated lesson: arrive, one focused experiment, one transfer phrase, leave. The system saves the next safe breakpoint and does not pretend that a five-minute session should contain a 30-minute lesson.

### Phone-only learner

The lesson is one-hand friendly, does not rely on hover, keeps controls in reach, works in portrait, exposes the microphone state clearly, and does not require a large visualizer to understand an exercise.

### Learner with no anatomy knowledge

Anatomy is introduced only when it answers an immediate practical question. Simple diagrams, plain language, and a "deeper explanation" drawer prevent the opening experience from becoming a lecture.

## The journey over time

### Discovery and landing

The landing page makes three things obvious before account creation: FemmeVoice is for voluntary transfeminine voice exploration; recording is not required; and the app explains its research and limitations. The primary action is `Try a private first session`, with a visible `How it works` alternative.

### Account and first launch

An account is requested only when sync, reminders, encrypted recording storage, or long-term progress is useful. Anonymous local practice remains possible. Setup asks one question per screen and includes `Not sure yet` throughout.

### First lesson and first success

The first lesson uses an experience-explanation-experience loop:

1. Try a tiny, easy sound or listening contrast.
2. Notice what changed.
3. Explain only the relevant idea.
4. Try again with one choice.
5. Reflect and stop while it still feels easy.

The first success message is specific: "You noticed a change in your sound." It must not say "You sounded feminine."

### First setback

When attempts are inconsistent or a learner marks discomfort, the coach does not repeat the same demand. It offers: lower intensity, hear an example, return to an earlier contrast, practise a non-voice listening task, or stop for the day. Pain triggers a safety route, not a troubleshooting drill.

### First skipped week and return after months

There is no broken streak screen. The return screen says where they left off, offers a short reorientation, and asks whether the goal or context changed. A person's old range graph stays a record, never a benchmark they must recreate.

### One year and maintenance

The home screen becomes quieter: chosen contexts, maintenance routines, periodic self-review, optional recordings, and new situation-specific modules. The learner can keep practising, explore a different path, contribute feedback, or simply use FemmeVoice as a private warmup tool.

## The personal coach

The coach is a transparent planner, not a simulated clinician or friend. It takes only explicit and necessary inputs:

- current goal and context;
- time available today;
- completed and revisited skills;
- voluntary ease, confidence, and energy check-ins;
- explicitly marked difficult concepts;
- safety status.

It returns one recommended session, one optional review, and one optional stretch. Recommendations use a small auditable rule set, such as spaced review after a chosen interval, an easier route after reported effort, or transfer practice after repeated isolated success. Spaced revisiting and self-regulation scaffolds are educational design choices with broad support, but FemmeVoice must not claim they are a validated transfeminine-voice prescription. [R3](#sources) [R4](#sources)

### Plateaus

The coach never declares a plateau from pitch data alone. It may say: "Your recent sessions look similar. Want to change the task?" Options include different context, lower duration, listening-only review, a new transfer prompt, or rest. The person can dismiss the observation permanently.

### Reminders

Reminders are opt-in, locally timed, editable, and easy to pause. They describe a small invitation, not an obligation: "A three-minute reset is ready when you are." Prompt research is mixed and context-dependent, so reminder frequency must be user-controlled and evaluated carefully. [R5](#sources)

## The ideal lesson

Lessons are short, composable learning experiences, not videos cut into chapters. A standard flow is:

1. **Arrive:** goal, estimated active time, safety note, and a choice of text/audio/visual introduction.
2. **Experiment:** an easy sound, listening comparison, or interactive diagram before the theory.
3. **Understand:** concise explanation with an optional deeper layer.
4. **Practise:** one controlled variable at a time, with replay and lower-intensity paths.
5. **Transfer:** phrase, reading line, or context challenge.
6. **Reflect:** self-rated ease/confidence and optional note.
7. **Leave well:** cooldown, homework choice, and saved resume point.

Useful interactive blocks include live pitch only where it can be honest; animated anatomy diagrams; guided listening pairs; hum-to-vowel transfer; accessible reading prompts; conversation simulations; optional encrypted before/after recordings; mini quizzes that correct misconceptions; and review cards. Video is used when a moving demonstration conveys something text or an animation cannot, never as the default teaching format.

## Practice outside lessons

FemmeVoice helps practice enter life without turning every interaction into homework:

- private daily invitations matched to available time;
- reading prompts in the selected language and context;
- optional "one sentence today" challenges;
- rehearsal for a chosen meeting, call, game, or stream;
- a practice journal for wins and difficult situations;
- weekly reflection on what felt useful, not a compliance report.

No challenge requires public sharing, recording, or proof. Real-world tasks are suggestions and must include a private alternative.

## Accessibility and cognitive comfort

WCAG 2.2 AA is the floor, not the definition of accessibility. Every lesson must include keyboard navigation, visible focus, semantic structure, generous touch targets, non-colour cues, captions, transcript, adjustable playback speed, pause/replay, reduced motion, text scaling, and an accessible alternative for every visualizer.

The academy also supports cognitive comfort through predictable layouts, one clear primary action, optional detail layers, saved state, no surprise time limits, calming error recovery, low-stimulation presentation, and choices in how to respond. Captions and descriptive transcripts are required assets for authored media, not post-launch cleanup. [R6](#sources) [R7](#sources)

## Evidence and content governance

Each content claim carries an evidence label, citations, last review date, reviewer role, conflict-of-interest statement, and a plain-language limit. Labels are:

- **Strong evidence:** systematic review, meta-analysis, or robust controlled evidence.
- **Moderate evidence:** smaller controlled, cohort, or convergent evidence.
- **Clinical consensus:** established guidance without direct evidence for this exact learner/task.
- **Expert or lived experience:** valuable perspective, clearly not universal evidence.
- **Insufficient evidence:** a useful question with no recommendation yet.

Safety content is reviewed every 12 months; all other content every 24 months or earlier when significant evidence changes. A research or clinical reviewer can block publication. No content is published because it is popular on social media.

## Authoring and contributor experience

The authoring system should feel like an editorial workflow, not a blank CMS.

### First release: structured authoring

Authors choose an approved lesson template, add blocks, attach required evidence/safety/accessibility fields, preview mobile and keyboard flows, and submit for review. Reusable exercise templates prevent inconsistent safety language.

### Mature workflow

Roles are separate: author, translator, clinical/research reviewer, accessibility reviewer, editor, publisher, and administrator. Every change is a draft revision with review comments, diff, preview, content-version release, rollback, and audit log. Translation is a linked localized version with its own review, not a copy-paste field.

The eventual visual builder may add drag-and-drop composition, but it must preserve schema validation and accessibility checks. Publishing is blocked when a required caption, transcript, source, safety note, or translation review is missing.

## Privacy-preserving learning analytics

Analytics exist to improve explanations, not profile people. The core signal is the learner-controlled `I'm confused here` action on each block.

It records course/lesson/block version, optional media timestamp, event type, optional comment, and time. The author dashboard sees aggregates: completion/return rate, median active time, replay/skip rate, confusion frequency, optional ease ratings, and comparison between content versions.

It does not expose identities, raw recordings, inferred emotion, hidden attention scores, or public rankings. Raw activity events expire quickly (proposed: 90 days); aggregate non-identifying measures have a documented retention period; comments are rate-limited and visible only to authorized reviewers. Any text analysis must be opt-in and must not send content to a third-party AI provider by default.

## Community, carefully

Community is valuable only when safety is real. Phase one is structured and opt-in: private completion of community challenges, reviewed and consented success stories, external events with clear rules, and optional invite-only accountability pairs. No public profile, discovery, direct messages, recording sharing, follower count, or leaderboard.

Any later discussion space requires trained human moderation, report/block tools, response-time commitments, safeguarding escalation, content rules, age policy, privacy review, and a sustainable budget. Evidence on online peer support points to possible benefits but also makes active moderation and psychological safety non-negotiable. [R8](#sources)

## Architecture for five years

The academy engine must be generic:

```text
Program -> Path -> Course -> Unit -> Lesson -> Versioned learning blocks
                                         -> Evidence claims
                                         -> Accessibility assets
                                         -> Safety metadata
                                         -> Skill tags
```

Learner progress is a private skill ledger: exposure, last practice, self-rated ease, preferred contexts, and optional review date. It is not a gender gradebook. This allows additional programs such as masculinizing voice, non-binary exploration, singing, public speaking, accent work, communication confidence, and multilingual pronunciation without rebuilding the platform.

Future AI may help an author locate citations, draft an accessible transcript for human review, or help a learner find relevant completed material. It must be optional, explain its role, keep sensitive audio private, and never diagnose, prescribe treatment, assess gender, or make a high-stakes decision.

Clinical and research partnerships can add independent content review, outcome research with separate informed consent, and referral directories. They must never turn ordinary app use into research participation by default.

## Prioritized roadmap

### Foundation

1. Publish this vision, the evidence standard, accessibility standard, privacy model, and content governance policy.
2. Extract lesson/practice logic into testable modules without changing existing practice behaviour.
3. Define the versioned lesson schema, evidence claims, safety metadata, accessibility assets, and private skill ledger.

### Learner MVP

4. Build the Academy home, Course 1, transparent rules-based coach, local resume state, and optional account sync.
5. Add the accessible lesson player, micro-sessions, review queue, journal, and `I'm confused here` control.
6. Validate with mobile, keyboard, screen-reader, privacy, and safety testing before expanding content.

### Content operations

7. Add structured authoring, review roles, asset workflow, translations, publishing versions, and rollback.
8. Add privacy-preserving aggregate analytics and a content-improvement workflow.
9. Create Course 2 and rotating daily routines through the reviewed editorial process.

### Mature platform

10. Add optional context paths, calibrated reminders, accessible community pilots, and additional educational programs.
11. Consider native mobile clients and carefully bounded AI assistance only after the shared lesson engine, mobile authentication, and recording-provider boundaries are mature.

## What FemmeVoice will never compromise

- Privacy and explicit consent.
- Accessibility as a release requirement.
- Scientific integrity and clear uncertainty.
- Learner autonomy, language, accent, goals, and identity.
- Safety over engagement, conversion, or content volume.
- A humane return path after any length of absence.

## Sources

<a id="sources"></a>

- **R1.** Leung, Y., Oates, J., & Chan, S. (2018). *Voice, articulation, and prosody contribute to listener perceptions of speaker gender: A systematic review and meta-analysis.* [PubMed](https://pubmed.ncbi.nlm.nih.gov/29392290/)
- **R2.** CAST. *Universal Design for Learning Guidelines 3.0.* [CAST](https://udlguidelines.cast.org/action-expression/)
- **R3.** Maatouk, I. et al. (2022). *Supporting self-regulated learning in distance learning contexts: systematic review.* [PubMed](https://pubmed.ncbi.nlm.nih.gov/35115989/)
- **R4.** Iqbal, S. et al. (2024). *Spaced digital education: systematic review and meta-analysis.* [PubMed](https://pubmed.ncbi.nlm.nih.gov/39388234/)
- **R5.** Fry, J., & Neff, R. (2009). *Periodic prompts and reminders in health promotion and health behavior interventions: systematic review.* [PubMed](https://pubmed.ncbi.nlm.nih.gov/19632970/)
- **R6.** W3C Web Accessibility Initiative. *Making audio and video media accessible.* [W3C](https://www.w3.org/WAI/media/av/)
- **R7.** W3C Web Accessibility Initiative. *What's new in WCAG 2.2.* [W3C](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- **R8.** Marshall, P. et al. (2024). *Understanding impacts of online mental health peer support forums: realist synthesis.* [PubMed](https://pubmed.ncbi.nlm.nih.gov/38722680/)
- **Voice-specific evidence.** See FemmeVoice's [Research and Practice Guide](research-guide.md) for clinical and transfeminine voice-training evidence, safety boundaries, and product limits.
