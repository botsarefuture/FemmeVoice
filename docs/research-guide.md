# FemmeVoice Research and Practice Guide

**Status:** living document  
**Last reviewed:** 15 July 2026  
**Purpose:** the evidence, safety boundaries, and product decisions that guide FemmeVoice.

FemmeVoice is an open-source practice companion for people exploring a transfeminine voice. This is not a definition of a feminine voice, a clinical protocol, or a promise about how anyone will be perceived. It is a transparent starting point for building exercises, interpreting app data, and reviewing contributions.

## Contents

1. [How to read this guide](#how-to-read-this-guide)
2. [What FemmeVoice measures](#what-femmevoice-measures)
3. [Pitch and vocal range](#pitch-and-vocal-range)
4. [Intonation, prosody, and expression](#intonation-prosody-and-expression)
5. [Practice design and progression](#practice-design-and-progression)
6. [Vocal health and safer practice](#vocal-health-and-safer-practice)
7. [Privacy and recordings](#privacy-and-recordings)
8. [Product decisions derived from this guide](#product-decisions-derived-from-this-guide)
9. [Contributing research or lived experience](#contributing-research-or-lived-experience)
10. [Source library](#source-library)

## How to read this guide

Each section separates three things:

- **Evidence:** what a cited study, review, or clinical source supports.
- **Product choice:** how FemmeVoice translates that evidence into an app feature.
- **Limit:** what the feature cannot determine or guarantee.

Research on gender-affirming voice is useful but incomplete. Many studies are small, English-language, use binary listener ratings, and describe social expectations as well as vocal acoustics. Treat results as context for voluntary exploration, not a pass/fail target.

## What FemmeVoice measures

### Evidence

Microphone-based pitch tracking can estimate fundamental frequency (F0), pitch stability, and sound level. Consistent measurement conditions make repeated range observations more interpretable. Voice Range Profile research uses sustained phonation and standardized collection, rather than treating a single instantaneous reading as a complete range assessment [R1](#r1) [R2](#r2).

### Product choice

- **Explored pitch** is a short, sufficiently steady detected sound. It makes the daily map responsive without requiring a perfect long note.
- **Verified hold** is a longer, steady sound near the current reference. It is used only to move a guided pitch step forward.
- The app groups close frequencies around a note instead of demanding an exact hertz value. A range map is a record of observed sounds, not a grade.
- The app shows day-to-day trends and lets people remove an obvious false outlier.

### Limit

FemmeVoice does **not** measure resonance, vocal weight, vocal-fold health, identity, or femininity. Microphone quality, noise, hydration, stress, sleep, warmup, and distance from the mic can change a reading. The app is not a clinical Voice Range Profile or medical assessment.

## Pitch and vocal range

### Evidence

Pitch contributes to listener perception, but it is one cue among resonance, vocal quality, articulation, loudness, prosody, language, and listener expectations. Reviews of gender-related voice perception and gender-affirming voice work support treating these cues as interconnected rather than chasing one number [R3](#r3) [R4](#r4).

### Product choice

FemmeVoice begins guided work from an easy detected hum when possible. It advances in small steps after a comfortable hold, and it retains a user's accessible upper point for later exercises rather than continually asking for an unreachable note. The coloured pitch map is orientation only: it must never imply that a band is required to be valid or feminine.

### Limit

No F0, note name, vocal-range span, or colour band can predict how every listener will gender a voice. A high note is not automatically useful speech, and a lower day is not regression.

## Intonation, prosody, and expression

### Evidence

Prosody includes pitch movement, rhythm, emphasis, pacing, pauses, and sentence endings. Research suggests listeners may use intonation alongside other cues, but its effects are contextual and smaller than a universal "feminine contour" would imply [R5](#r5) [R6](#r6). Some clinical guidance explicitly recommends goal-led gender-affirming communication rather than binary standards [R7](#r7).

### Product choice

Intonation exercises ask people to explore meaning: a settled statement, an inviting question, or emphasis on a chosen word. FemmeVoice should describe these as communication choices, never score a contour as feminine, and always offer a skip or repeat path.

### Limit

Prosody varies by language, culture, accent, age, context, and individual style. The app must not interpret a pitch contour as a person's gender, personality, or authenticity.

## Practice design and progression

### Evidence

Gender-affirming voice intervention research generally considers several dimensions together, including pitch, resonance, quality, prosody, articulation, and the person's communication goals [R4](#r4) [R8](#r8). Evidence is still heterogeneous; an app should avoid claiming that one drill causes a defined outcome.

### Product choice

- Start with a soft hum, vowel, lip trill, or other easy sound.
- Change one variable at a time and use short, repeatable exercises.
- Progress guided pitch after a comfortable hold, not after a single loud or momentary peak.
- If a step is not accessible today, keep the session useful below that point and offer an easy reset, listening task, or speech carryover instead.
- For speech transfer, use an easy-hum or verified comfortable area as the reference. Never derive a speech reference from the lowest pitch detected in a range map; a low range boundary is observation data, not a speaking recommendation.
- Let people choose Starter, Steady, or Deep practice and remind them to rest.

### Limit

An algorithm cannot know whether a sound feels sustainable, fits a person's goals, or is technically healthy. The person practising remains the authority on comfort and identity.

## Vocal health and safer practice

### Evidence

Voice-care guidance supports hydration, rest, avoiding overuse, and seeking professional assessment for persistent changes. Pain, recurring fatigue, difficulty breathing or swallowing, coughing blood, a neck lump, sudden severe voice loss, or lasting hoarseness should not be trained through [R9](#r9) [R10](#r10) [R11](#r11).

### Product choice

FemmeVoice uses comfort-first wording, breaks, and a voice-feeling check-in. It must not add instructions to force the larynx, swallow as a drill, practise through pain, or deliberately sustain strain. When someone reports pain or hoarseness, the app should de-intensify practice and point to appropriate clinical care.

### Limit

The app cannot diagnose vocal-fold injury, reflux, infection, neurological conditions, or any other medical cause of voice change. Persistent or worrying symptoms need a voice-specialized speech-language pathologist and/or ENT clinician.

## Privacy and recordings

### Evidence and ethics

Voice recordings can be sensitive personal data. Privacy is not an optional polish feature: recording and syncing must be voluntary, understandable, and reversible.

### Product choice

- Live pitch analysis happens locally in the browser.
- Recording is off until the person explicitly enables their private vault.
- Saved recordings are encrypted in the browser before upload; the server stores ciphertext rather than playable audio.
- Retention choices, deletion, export, and storage limits must be visible in Settings.

### Limit

Encryption reduces server exposure but does not remove all risk. Users need clear recovery and deletion information, and contributors must never include personal recordings or account data in public issues.

## Product decisions derived from this guide

Use this checklist before adding or changing a feature:

1. Does it support a self-chosen communication goal rather than impose a gender target?
2. Does it state exactly what is measured and what is inferred?
3. Does it tolerate ordinary noisy or variable practice rather than reward a single extreme reading?
4. Can someone pause, repeat, lower intensity, or continue below an inaccessible step?
5. Could it encourage strain, shame, unnecessary recording, or risky data collection? If yes, redesign it.
6. Is the user-facing explanation simple enough for a beginner, while the evidence and limitations stay available here?

## Contributing research or lived experience

### Suggest a source

Use the **Research source** issue form. Include a stable link or DOI, the exact claim it supports, relevant population/context, publication date, limitations, and conflicts of interest where known. Prefer peer-reviewed research, primary sources, or official clinical guidance.

### Report an error or harmful wording

Use the **Content correction** issue form. Name the heading or URL, quote the current text, propose the correction, and add supporting sources. Do not post recordings, health details, account data, or identifying information.

### Submit a pull request

Discuss substantial proposals in an issue first. Keep a pull request focused, link the issue, update citations beside affected claims, and complete the evidence, limitations, privacy, accessibility, and vocal-health prompts.

### Evidence standard

- Make no claim stronger than its source supports.
- Label lived experience as lived experience, not universal proof.
- Do not use AI-generated summaries, unsourced social posts, or promotional copy as evidence.
- Respect self-described goals, pronouns, language, accent, culture, and privacy.
- Do not add exercises that encourage pain, forced larynx manipulation, swallowing drills, or practising through fatigue.

## Source library

<a id="r1"></a>**R1.** Pabon, P. et al. (2020). *Standardization of the European Phonetogram (Voice Range Profile).* [PubMed](https://pubmed.ncbi.nlm.nih.gov/32402662/)

<a id="r2"></a>**R2.** Baken, R. et al. (2021). *A shortened Voice Range Profile protocol.* [PubMed](https://pubmed.ncbi.nlm.nih.gov/34099353/)

<a id="r3"></a>**R3.** Papp, V. G. (2018). *Voice, articulation, and prosody in gender perception: A systematic review.* [Journal of Speech, Language, and Hearing Research](https://pubs.asha.org/doi/10.1044/2017_JSLHR-S-17-0067)

<a id="r4"></a>**R4.** *Speech therapy for transgender and gender-diverse people: A systematic review.* [PubMed Central](https://pmc.ncbi.nlm.nih.gov/articles/PMC10363306/)

<a id="r5"></a>**R5.** *Intonation and gender perception.* [PubMed](https://pubmed.ncbi.nlm.nih.gov/24094799/)

<a id="r6"></a>**R6.** Hancock, A. B., Colton, L., & Douglas, F. (2014). *Intonation and gender perception in transgender speakers.* [Journal of Voice](https://www.sciencedirect.com/science/article/pii/S0892199713001768)

<a id="r7"></a>**R7.** American Speech-Language-Hearing Association. *Gender affirming voice and communication.* [ASHA Practice Portal](https://www.asha.org/practice-portal/professional-issues/gender-affirming-voice-and-communication/)

<a id="r8"></a>**R8.** *Gender-affirming voice modification for transgender women: a review.* [PubMed Central](https://pmc.ncbi.nlm.nih.gov/articles/PMC10387149/)

<a id="r9"></a>**R9.** UCSF Gender Affirming Health Program. *Vocal health.* [UCSF](https://transcare.ucsf.edu/guidelines/vocal-health)

<a id="r10"></a>**R10.** National Institute on Deafness and Other Communication Disorders. *Taking care of your voice.* [NIDCD](https://www.nidcd.nih.gov/health/taking-care-your-voice)

<a id="r11"></a>**R11.** National Institute on Deafness and Other Communication Disorders. *Hoarseness.* [NIDCD](https://www.nidcd.nih.gov/health/hoarseness)
