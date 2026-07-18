# Script — Claude Fable 5 goes standard on top plans

Hook archetype: **stakes / winners-and-losers** (neutrality used number-shock +
named-result; Codex used problem-first — rotated ✓). Register: bold, brisk news.

## V1 draft

| # | Frame | Voice (V1) |
|---|-------|-----------|
| 1 | hook | Anthropic just split Claude users into winners and losers. Which side are you on? |
| 2 | winners | Starting July twentieth, Anthropic's newest and most powerful AI, Fable 5, comes included with the top plans — Max and Team Premium — at half your weekly allowance. |
| 3 | losers | The cheaper plans, Pro and Team Standard? Pay as you go — plus a one-time hundred dollar credit. |
| 4 | catch | A hundred dollars sounds generous. At Fable's prices, that's about one long automated coding job. Then the meter runs. |
| 5 | price | Fable's answers cost about double Anthropic's next-best model — the priciest Claude they've ever sold. |
| 6 | chaos | Why the mess? First a government block, then demand nobody could predict. Access got three expiry dates in three weeks. |
| 7 | receipt | Anthropic's own reply to frustrated users: quote — we know this has been frustrating. The announcement hit sixteen million views. |
| 8 | stakes | If you pay for Claude, your plan just changed. Check what's included before July twentieth. |
| 9 | outro | Winners get the best AI included. Everyone else gets a meter. Which side are you on? Follow for daily AI receipts. |

## Critique

- **Frame 7 carries two ideas** (quote + 16M views) — split: quote stays with
  the follow-up figure; 16M moves to frame 8 where it powers the stakes.
- **Frame 9 is 21 words** — over the text-scene cap. Tighten to the
  winners/meter contrast + callback only.
- **Frame 3**: "pay as you go" is right, but the table's prepaid-phone-card
  analogy makes it *felt* — add it (FigureScene, room exists).
- **Frame 5**: "Fable's answers cost" — make the unit human: "each Fable
  answer costs…".
- Hook check: concrete nouns in first 3s (Anthropic, Claude) ✓; question sets
  up the outro callback ✓. Problem-before-announcement: the *split* IS the
  problem framing ✓.
- Jargon sweep vs translation table: "usage credits" never spoken (pay-as-you-
  go ✓), "export controls" → "government block" ✓, "50% of limits" → "half
  your weekly allowance" ✓, no "tokens" in the voice ✓. No missing table rows.

## V2 (final — one voiceSegment per frame)

| # | Frame | Voice (V2) | words |
|---|-------|-----------|-------|
| 1 | hook (HookCard) | Anthropic just split Claude subscribers into winners and losers. Which side are you on? | 14 ✓ |
| 2 | winners (FigureScene) | Starting July twentieth, Anthropic's newest, most powerful AI — Fable 5 — comes included with the top plans, Max and Team Premium. Up to half your weekly allowance. | — |
| 3 | losers (FigureScene) | The cheaper plans — Pro and Team Standard — pay as you go, like a prepaid phone card. Plus a one-time hundred-dollar credit. | — |
| 4 | catch (StatCallout) | A hundred dollars sounds generous. At Fable's prices, that's roughly one long automated coding job. Then the meter runs. | 19 ✓ |
| 5 | price (StatCallout) | Each Fable answer costs about double their next-best model — the priciest Claude ever sold. | 14 ✓ |
| 6 | chaos (HookCard) | Why the mess? First a government block. Then demand nobody could predict — three expiry dates in three weeks. | 18 ✓ |
| 7 | receipt (FigureScene) | Anthropic's reply to frustrated subscribers, on the record: "We know this has been frustrating." | — |
| 8 | stakes (HookCard) | Sixteen million people saw the announcement. If you pay for Claude, check your plan before July twentieth. | 17 ✓ |
| 9 | outro (OutroCard) | Best AI included — or a meter. Which side are you on? Follow for daily AI receipts. | 16 ✓ |

~167 words ≈ 65–70s at brisk pace. Outro calls back the hook's exact question ✓.

## Source cross-check (V2 → research.md)

- July 20 · included · Max/Team Premium · half of limits → tweet ¶1 + techtimes
  + dawn + willison ✓
- Pro/Team Standard · pay-as-you-go · one-time $100 → tweet ¶2 + techtimes +
  androidheadlines ✓
- "$100 ≈ one long automated coding job" → derived: $100 ÷ $50/M output = 2M
  output tokens; matches techtimes arithmetic ✓ ("roughly" hedges it honestly)
- "about double their next-best model / priciest Claude ever sold" → finout +
  ayautomate + openrouter ($10/$50 ≈ 2× Opus 4.8, steepest GA) ✓
- "government block… three expiry dates in three weeks" → aljazeera (Jun 12
  block, Jun 30 lift) + digitalapplied (Jul 7→12) + bleepingcomputer (Jul 19) ✓
- "We know this has been frustrating" → verbatim from follow-up post ✓
- "Sixteen million people saw" → screenshot views counter ✓


## Comprehension gate round 1: FAIL — revision V2.1

Fresh-context viewer failed it on: (1) "why the mess" — the mess was never
established and "government block"/"expiry dates" were unexplainable shorthand;
(2) "half your weekly allowance" — allowance of what; (3) "check your plan
before July 20" had no mechanism; (4) "one long automated coding job" assumed
insider knowledge; (5) 16M views attached to nothing. All five map to
translation-table rows the compression dropped — script defect, not research.

### V2.1 (final)

| # | Frame | Voice (V2.1) | words |
|---|-------|-------------|-------|
| 1 | hook (HookCard) | Anthropic just split Claude subscribers into winners and losers. Which side are you on? | 14 ✓ |
| 2 | winners (FigureScene) | Starting July twentieth, Anthropic's newest, most powerful AI — Fable 5 — comes included with the top plans, Max and Team Premium. Subscribers can spend up to half their plan's weekly usage on it. | — |
| 3 | losers (FigureScene) | The cheaper plans — Pro and Team Standard — pay as you go, like a prepaid phone card. Plus a one-time hundred-dollar credit. | — |
| 4 | catch (StatCallout) | A hundred dollars sounds generous — until you know one big AI work session can eat all of it. | 18 ✓ |
| 5 | price (StatCallout) | Each Fable answer costs about double their next-best model — the priciest Claude ever sold. | 14 ✓ |
| 6 | chaos (HookCard) | This ends weeks of chaos — Fable's shutoff date changed three times in three weeks. | 14 ✓ |
| 7 | why+receipt (FigureScene) | Why? First the US government briefly blocked the model. Then demand outran capacity. Anthropic's reply, on the record: "We know this has been frustrating." | — |
| 8 | stakes (HookCard) | Sixteen million people saw the post. If you pay for Claude, know which side you're on when July twentieth hits. | 20 ✓ |
| 9 | outro (OutroCard) | Best AI included — or a meter. Which side are you on? Follow for daily AI receipts. | 16 ✓ |

Changes: frame 2 speaks the full plain form ("half their plan's weekly usage");
frame 4 drops the insider "automated coding job" for "one big AI work session";
frame 6 now only STATES the chaos (shutoff date moved 3×), frame 7 EXPLAINS it
(government block → demand outran capacity) before the apology quote; frame 8
ties 16M to "the post" (shown on screen) and gives the check-your-plan action a
reason (which side you're on when it hits).


## Comprehension gate round 2: FAIL — revision V2.2

Round-2 viewer caught a real contradiction: "shutoff date" (frame 6) vs the
launch framing of frames 2-3 — the script never established that Fable was
ALREADY available temporarily, so July 20 read as launch and shutoff at once.
Also: "the post" was a dangling reference, the government block had no reason,
"weekly usage" was an undefined quota, and "AI work session" stayed abstract.

### V2.2 (final)

| # | Frame | Voice (V2.2) | words |
|---|-------|-------------|-------|
| 1 | hook (HookCard) | Anthropic just split Claude subscribers into winners and losers. Which side are you on? | 14 ✓ |
| 2 | winners (FigureScene) | Starting July twentieth, Anthropic's newest, most powerful AI — Fable 5 — comes included with the top plans, Max and Team Premium. Claude plans cap weekly use; Fable can now fill up to half that cap. | — |
| 3 | losers (FigureScene) | The cheaper plans — Pro and Team Standard — pay as you go, like a prepaid phone card. Plus a one-time hundred-dollar credit. | — |
| 4 | catch (StatCallout) | A hundred dollars sounds generous — until you learn one job, an AI coding your app overnight, can eat it. | 19 ✓ |
| 5 | price (StatCallout) | Each Fable answer costs about double their next-best model — the priciest Claude ever sold. | 14 ✓ |
| 6 | chaos (HookCard) | Until this week, Fable was only temporary — its end date moved three times in three weeks. | 16 ✓ |
| 7 | why+receipt (FigureScene) | Why? The US government briefly blocked the model over safety concerns. Then demand outran capacity. Anthropic's reply, on the record: "We know this has been frustrating." | — |
| 8 | stakes (HookCard) | Anthropic's announcement hit sixteen million views. If you pay for Claude, know which side you're on when July twentieth hits. | 20 ✓ |
| 9 | outro (OutroCard) | Best AI included — or a meter. Which side are you on? Follow for daily AI receipts. | 16 ✓ |

Changes: frame 2 defines the quota before halving it ("Claude plans cap weekly
use; Fable can now fill up to half that cap"); frame 4 makes the session
concrete ("an AI coding your app overnight"); frame 6 establishes Fable was
TEMPORARY until now (end date moved 3×) — no more launch/shutoff clash; frame 7
gives the block a reason ("over safety concerns" — matches the cybersecurity-
classifier redeploy, research #11); frame 8 names the referent ("Anthropic's
announcement hit sixteen million views").


## Comprehension gate round 3: FAIL — revision V2.3 (3rd and final revision)

Round-3 retell was substantively right but two load-bearing mechanics were
still guesses: line 3 never said WHAT is pay-as-you-go (Fable vs the whole
plan), and "fill up to half that cap" stayed ambiguous. Also: permanence only
inferable, government block still shapeless, "reply to whom" dangling.

### V2.3 (final)

| # | Frame | Voice (V2.3) | words |
|---|-------|-------------|-------|
| 1 | hook (HookCard) | Anthropic just split Claude subscribers into winners and losers. Which side are you on? | 14 ✓ |
| 2 | winners (FigureScene) | Starting July twentieth, Anthropic's newest, most powerful AI — Fable 5 — is included on the top plans, Max and Team Premium. Every Claude plan has a weekly usage allowance; up to half of yours can now go to Fable. | — |
| 3 | losers (FigureScene) | On the cheaper plans — Pro and Team Standard — your subscription stays, but Fable costs extra: pay as you go, like a prepaid phone card. Anthropic starts you off with a one-time hundred-dollar credit. | — |
| 4 | catch (StatCallout) | A hundred dollars sounds generous — until you learn one job, an AI coding your app overnight, can eat it. | 19 ✓ |
| 5 | price (StatCallout) | Each Fable answer costs about double their next-best model — the priciest Claude ever sold. | 14 ✓ |
| 6 | chaos (HookCard) | Until now, Fable was temporary — its end date moved three times in three weeks. July twentieth makes it permanent. | 19 ✓ |
| 7 | why+receipt (FigureScene) | Why the drama? In June, the US government briefly blocked the model over safety concerns, then cleared it with extra safeguards. After that, demand outran capacity. Anthropic, on the record: "We know this has been frustrating." | — |
| 8 | stakes (HookCard) | Anthropic's announcement hit sixteen million views. If you pay for Claude, know which side you're on when July twentieth hits. | 20 ✓ |
| 9 | outro (OutroCard) | Best AI included — or a meter. Which side are you on? Follow for daily AI receipts. | 16 ✓ |

Changes: frame 2 defines the allowance then allocates it ("every Claude plan
has a weekly usage allowance; up to half of yours can now go to Fable"); frame
3 pins the meter to Fable only ("your subscription stays, but Fable costs
extra"); frame 6 states permanence outright ("July twentieth makes it
permanent"); frame 7 gives the block a shape (June · briefly · safety concerns
· cleared with extra safeguards) and drops the dangling "reply".


## Resolution after 3 failed iterations: SIMPLIFY (cut the backstory beat)

Per the gate rule, work stopped after 3 revisions. Decision: rather than
explain the government-block saga in a 70s reel (the concept that failed all
rounds), CUT it — the confusion arc is carried by the moved deadlines + the
apology, both self-explanatory. Also fixed round-4's wording collision
("half of yours" → scoped to the two top plans). 8 frames, ~58s.

### V3 (final — one voiceSegment per frame)

| # | Frame | Voice (V3) | words |
|---|-------|-----------|-------|
| 1 | hook (HookCard) | Anthropic just split Claude subscribers into winners and losers. Which side are you on? | 14 ✓ |
| 2 | winners (FigureScene) | Starting July twentieth, Anthropic's newest, most powerful AI — Fable 5 — is included on the two top plans, Max and Team Premium. On those plans, up to half your weekly usage allowance can now go to Fable. | — |
| 3 | losers (FigureScene) | On the cheaper plans — Pro and Team Standard — your subscription stays, but Fable costs extra: pay as you go, like a prepaid phone card. Anthropic starts you off with a one-time hundred-dollar credit. | — |
| 4 | catch (StatCallout) | A hundred dollars sounds generous — until you learn one job, an AI coding your app overnight, can eat it. | 19 ✓ |
| 5 | price (StatCallout) | That's because each Fable answer costs about double their next-best AI — the priciest Claude ever sold. | 16 ✓ |
| 6 | receipt (FigureScene) | And this deal ends a month of confusion. The date Fable access was supposed to END moved three times in three weeks — until Anthropic went on the record: "We know this has been frustrating." Now it's permanent. | — |
| 7 | stakes (HookCard) | Anthropic's announcement hit sixteen million views. If you pay for Claude, know which side you're on when July twentieth hits. | 20 ✓ |
| 8 | outro (OutroCard) | Best AI included — or a meter. Which side are you on? Follow for daily AI receipts. | 16 ✓ |

Changes vs V2.3: government-block beat CUT entirely (frames.md updated with the
justified drop of inventory #11); old frames 6+7 merged into one FigureScene on
the apology post — "the date Fable access was supposed to end" explains
"temporary" concretely, "now it's permanent" closes it; frame 2 scopes the
half-allowance to "on those plans"; frame 5 opens "that's because", linking the
price to the vanished $100.


## Comprehension gate round 5 (V3): FAIL — revision V3.1 (saga fully cut)

Round 5 retold everything correctly EXCEPT the one recurring beat: "the date
Fable access was supposed to END" still forced viewers to invent a
preview-period backstory. Terminal fix: the saga is cut completely (inventory
#10 joins #11 as a justified drop). The apology beat survives as the follow-up
post's OWN framing — confusion about plans — which needs zero backstory. Also
fixed: Fable↔Claude relationship ("newest, most powerful Claude model").

### V3.1 (final)

| # | Frame | Voice (V3.1) | words |
|---|-------|-------------|-------|
| 1 | hook (HookCard) | Anthropic just split Claude subscribers into winners and losers. Which side are you on? | 14 ✓ |
| 2 | winners (FigureScene) | Starting July twentieth, Anthropic's newest, most powerful Claude model — Fable 5 — is included on the two top plans, Max and Team Premium. On those plans, up to half your weekly usage allowance can now go to Fable. | — |
| 3 | losers (FigureScene) | On the cheaper plans — Pro and Team Standard — your subscription stays, but Fable costs extra: pay as you go, like a prepaid phone card. Anthropic starts you off with a one-time hundred-dollar credit. | — |
| 4 | catch (StatCallout) | A hundred dollars sounds generous — until you learn one job, an AI coding your app overnight, can eat it. | 19 ✓ |
| 5 | price (StatCallout) | That's because each Fable answer costs about double their next-best AI — the priciest Claude ever sold. | 16 ✓ |
| 6 | receipt (FigureScene) | Even Anthropic admits this has been confusing. Their words, on the record: "We know this has been frustrating, and we want to give you more certainty about what your plan includes." | — |
| 7 | stakes (HookCard) | That announcement hit sixteen million views. If you pay for Claude, know which side you're on when July twentieth hits. | 20 ✓ |
| 8 | outro (OutroCard) | Best AI included — or a meter. Which side are you on? Follow for daily AI receipts. | 16 ✓ |


## Comprehension gate round 6 (V3.1): FAIL — revision V3.2 (apology beat cut)

Round 6 retold the story fully but exposed a catch-22: the apology quote
references confusion the reel (post-simplification) never shows — while
showing the confusion failed rounds 2-5. The beat is structurally unsalvageable
at this length: CUT (inventory #6 → justified drop). Remaining fixes: frame 2
states perk + fine print explicitly; frame 5 leads with the rank ("priciest
ever") instead of deriving from an unknown price; 16M anchored to "Anthropic's
post on this". 7 frames, ~52s.

### V3.2 (final)

| # | Frame | Voice (V3.2) | words |
|---|-------|-------------|-------|
| 1 | hook (HookCard) | Anthropic just split Claude subscribers into winners and losers. Which side are you on? | 14 ✓ |
| 2 | winners (FigureScene) | Starting July twentieth, Anthropic's newest, most powerful Claude model — Fable 5 — is included on the two top plans, Max and Team Premium, at no extra cost. The fine print: Fable can take up at most half your plan's weekly usage. | — |
| 3 | losers (FigureScene) | On the cheaper plans — Pro and Team Standard — your subscription stays, but Fable costs extra: pay as you go, like a prepaid phone card. Anthropic starts you off with a one-time hundred-dollar credit. | — |
| 4 | catch (StatCallout) | A hundred dollars sounds generous — until you learn one job, an AI coding your app overnight, can eat it. | 19 ✓ |
| 5 | price (StatCallout) | Because Fable is the priciest Claude ever sold — each answer costs about double their next-best model. | 16 ✓ |
| 6 | stakes (HookCard) | Anthropic's post on this hit sixteen million views. If you pay for Claude, know your side before July twentieth. | 19 ✓ |
| 7 | outro (OutroCard) | Best AI included — or a meter. Which side are you on? Follow for daily AI receipts. | 16 ✓ |
