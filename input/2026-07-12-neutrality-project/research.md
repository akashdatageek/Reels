# The Neutrality Project — research (v2: full source harvest)

> ✅ **Verified from primary pages.** The user supplied both full primary pages as
> PDFs (staged in `assets/homepage.pdf` [home, 9pp] and `assets/results.pdf`
> [results, 7pp]). Everything below is read directly from those two pages;
> independent web search earlier corroborated the project's nature and
> existence. Results are the project's **own self-published Release 01** —
> reported as such, not as third-party-verified truth.
> Sources: `https://neutralityproject.org/` · `https://neutralityproject.org/results.html`

## SOURCE INVENTORY (every figure, number, entity, and quotable line — USE/SKIP)

### Figures & charts

| # | Type | Item | Where | USE/SKIP | Reason (one line) |
|---|------|------|-------|----------|-------------------|
| F1 | chart | **Neutrality Map** — leaning × intelligence scatter, Grok 4.5 ringed "MOST NEUTRAL", ±SE whiskers | results p2–3 | **USE** | the proof beat — already cropped as `neutrality_map.png` |
| F2 | chart | **Aggregate positions strip** — all 18 dots on one −1…+1 line, AVERAGE −0.41 marker | home p2 | **USE** | the "almost all left" shot in one glance — cropped as `aggregate_scale.png` |
| F3 | chart | **Per-dimension strips ×6** — every model plotted per topic, each axis labeled in plain words (see T-row translations) | results p4–5 | **USE** | names the six topics visually; the source pre-translated each axis — fixes the "six topics = unexplained" gap |
| F4 | chart | Leaderboard list 1–18 with exact leanings | results p2–3 | **USE** | receipts for the map; source of the full ranking |
| F5 | figure | Fig 1 — neutral answers on each model's own −1…+1 ruler | results p5 | SKIP | duplicates F2's story at higher complexity |
| F6 | figure | Fig 2 — self-anchoring instrument (bar = far-left↔far-right persona span; dot = neutral run) | results p5 | SKIP | method deep-dive; too abstract for a 60–90s reel — link in caption |
| F7 | figure | Fig 3 — **Claude Fable 5 refusal probe: all 38 genuine refusals, on named political actors** | results p5 | SKIP (this reel) | strong future-reel seed ("what makes an AI refuse?"); off this reel's spine |
| F8 | figure | Fig 4 — 5 unanchored raw dimensions (no calibrated zero, 95% CI bands) | results p5 | SKIP | expert nuance; would need its own explainer |
| F9 | graphic | Hero six-slider axes visual | home p1 | SKIP | decorative; F3 shows the same idea with data |
| F10 | graphic | 3D model map (three composite axes, live viewer) | results p3 | SKIP | interactive-only; not croppable as evidence |

### Numbers

| # | Item | Where | USE/SKIP | Reason |
|---|------|-------|----------|--------|
| N1 | **97 of 108** positions left of center | results p1 | **USE** | headline shock stat |
| N2 | **18 models · 12 labs · 4 regions** | results p1 | **USE** | scale of the test in one breath |
| N3 | **3,987** real survey questions | results p1 / home p1 | **USE** | "almost 4,000" — makes it feel rigorous |
| N4 | 6 anchored axes (+ **5 raw/unanchored**) | home p4 | **USE** (6) / SKIP (5 raw) | six topics structure the finding; the 5 raw need Fig 4's caveats |
| N5 | Average position **−0.41** | results p2 | **USE** | "the average AI sits ~40% toward its own far left" |
| N6 | **Environment −0.82** — strongest lean | results p2 | **USE** | most extreme per-topic number; instantly graspable topic |
| N7 | Foreign policy **−0.11** — closest to center | results p2 | **USE** | the contrast partner for N6 — "hardest on climate, mildest on war & peace" |
| N8 | **Grok 4.5 = −0.02 ± 0.047 SE**, only error band containing 0 | results p2 | **USE** | the twist; the ± band is *why* "most neutral" is defensible |
| N9 | Grok 4.3 = **−0.11** (2nd place) | results p3 | **USE** | "even the runner-up is a Grok" — strengthens the twist |
| N10 | **Phi-4 −0.59**, refused **26%** of all questions | results p1–3 | **USE** | the outlier + the dodge angle |
| N11 | **7 of 18** models trip the refusal flag ≥1 dimension; **Phi-4 AND GLM-5.2 on all six** | results p1, p5 | **USE** (7 of 18) | refusals are a pattern, not one bad apple; GLM-5.2 optional detail |
| N12 | Full leaderboard 3–17: MiniMax M3 −0.25 · Gemma 3 27B abl −0.28 · EuroLLM −0.35 · Mistral Small −0.41 · GLM-5.2 −0.42 · Nemotron −0.45 · GPT-OSS −0.46 · **GPT-5.6 Luna −0.46** · Qwen3.6 −0.47 · **Claude Fable 5 −0.48** · Granite −0.53 · Llama 3.3 abl −0.54 · OLMo −0.54 · Llama 3.3 −0.55 · Gemma 3 −0.56 | results p3 | **USE** (the two bolded) | the AIs a viewer actually knows (OpenAI's GPT, Anthropic's Claude) land mid-pack ~−0.46/−0.48 — makes it personal; rest stay as figure content |
| N13 | Country mix: US 13 · China 3 · France 1 · EU 1 | results p4 | SKIP | detail; N2's "4 regions" carries it |
| N14 | **48 of 54** positions hold the progressive lean across stock/abliterated/clean/diluted | results p6 | SKIP | ⚠️ its card says "six labs across two countries" while p1 says 12 labs/4 regions — appears to be an earlier subset; don't put a possibly-stale number on screen |
| N15 | 14 of 18 runs are clean targets; Gemma/Mistral/Qwen families reference-diluted ("mildly circular") | results p6 | **USE** (caption caveat) | honesty caveat — belongs in caption.txt, not narration |
| N16 | Refusal halo threshold: declined **>5%** of a dimension's questions | results p5 | SKIP | technical footnote behind N11 |
| N17 | Intelligence axis = Artificial Analysis Intelligence Index **v4.1, July 2026**; EuroLLM unplotted (no score); "we never estimate" | results p3 | SKIP | chart plumbing; matters only if we show the map's y-axis |
| N18 | Kai Stephens: **>500k** model downloads on Hugging Face | home p8 | SKIP | team credibility, not story |
| N19 | Fig 3 count: **38 genuine refusals**, all on named political actors | results p5 | SKIP (this reel) | goes with F7's future reel |

### Named entities

| # | Item | Where | USE/SKIP | Reason |
|---|------|-------|----------|--------|
| E1 | **The Neutrality Project** — open, reproducible benchmarks; Release 01 = Political Neutrality Benchmark | home p1 | **USE** | the WHO; must be named + credited |
| E2 | **xAI Grok 4.5 / Grok 4.3** (US) | results | **USE** | the twist subject |
| E3 | **Microsoft Phi-4** (US) | results | **USE** | the outlier subject |
| E4 | **OpenAI GPT-5.6 Luna · Anthropic Claude Fable 5** | results p3–4 | **USE** | household-name stakes: "the ones you actually use" |
| E5 | Other labs: Meta, Google, Mistral, Alibaba, Zhipu, IBM, MiniMax, NVIDIA, Ai2, EuroLLM | results p4 | SKIP (by name) | covered as "12 labs"; figure shows them |
| E6 | Founders: Samuel Cardillo (ex-CTO RTFKT→Nike, ex-Google) · Daniel Lougen (PhD, U Toronto) · Kai Stephens (Carnice) · Andrew Zavala (PhD U Oregon) | home p7–8 | SKIP | credibility color, not the story; "independent group" carries it |
| E7 | Roadmap: **Subject & topic benchmarks · Censorship detection** (both NEXT) | home p6 | SKIP (this reel) | future-reel seeds; outro stays on this release |
| E8 | Funding: actively seeking grants + donations; "independence from the labs we measure is the point" | home p7 / results p7 | SKIP | worthy but a different (support-them) story |
| E9 | Anti-scam: "no cryptocurrency, token, or NFT, and never will" | footers | SKIP | protective note; irrelevant on screen |
| E10 | Discoveries page teaser: "two-layer analysis separating guardrail suppression from lean baked into the weights" | results p2 | SKIP (this reel) | fascinating but unexplainable in one line; future deep-dive |

### Quotable lines

| # | Quote | Where | USE/SKIP | Reason |
|---|-------|-------|----------|--------|
| Q1 | "AI does more than answer questions. **It frames how we think.**" | home p2 | **USE** | the stakes in eight words — concept frame |
| Q2 | "When people delegate research, reasoning, and writing to an assistant, its assumptions become part of their decisions." | home p2 | **USE** | the why-you-care, ready-made |
| Q3 | "A model rarely announces a position. It leans through which options it validates… That is measurable." | home p3 | **USE** (paraphrase) | defines "hidden lean" plainly |
| Q4 | "'Trust us, it's neutral' is not verifiable. A benchmark anyone can read, rerun, and challenge is." | home p3 | **USE** (outro flavor) | why open-source matters, one line |
| Q5 | "−0.7 on social means 70% toward this model's own far-left" | home p4 | **USE** (as translation) | the source's own decoder for the scale — feeds T4 |
| Q6 | "No company should get 'trust us' as its standard of proof." | home p3 | SKIP | Q4 covers it more concretely |
| Q7 | "An assistant is only as trustworthy as it is legible." | home p9 | SKIP | poster line; too abstract for voice |
| Q8 | "Every number on this page is reproducible from the raw result files." | results p7 | **USE** (outro/caption) | backs "check the rest yourself" |
| Q9 | Mission: "Humanity's future with AI depends on making its influence visible, and its makers openly accountable." | home p3 | SKIP | grand; Q1+Q2 are tighter |

## TRANSLATION TABLE (decided once — frames & script INHERIT these)

| Term / number (source's words) | Plain English (grade 6–8) | Analogy (if scale needs it) |
|---|---|---|
| political lean / "default worldview" | the side an AI tends to take on hot topics — baked in, usually without saying so | — |
| "politically neutral" | doesn't favor either side | sits at the middle of a seesaw |
| progressive / left ↔ conservative / right | leaning toward social change ↔ leaning toward tradition | — |
| "6 anchored ideological axes" | six topics: **climate, social values, national identity, religion, money, war & peace** (the source's own labels: protect climate vs growth · change vs tradition · open-world vs nation-first · secular vs religious · share wealth vs free markets · diplomacy vs military) | — |
| "108 measured positions" | 108 scores — 18 AIs, each graded on 6 topics | 18 students × 6 exam subjects = 108 grades |
| "3,987 real public-opinion survey questions" | almost 4,000 questions from real opinion polls — the kind people answer | the world's longest opinion survey |
| a score like **−0.41** | on a scale where 0 is dead center and −1 is that AI's own far left: 41% of the way left | a seesaw tipped almost halfway down one side |
| "self-anchored" (−1…+1 own ruler) | each AI is graded against **its own** most extreme answers — first they make it role-play a far-left and a far-right character, then see where its normal answers fall between them | measuring your posture against your own full stretch, not someone else's |
| "−0.02 ± 0.047 SE, band includes 0" | so close to center that, within the margin of error, it may be exactly neutral | a dart inside the bullseye ring |
| "refused 26% of all questions" | dodged one in four questions | — |
| "refusal report / refusal-impacted" | they also track dodged questions — because refusing to answer can hide a lean too | pleading the fifth still tells you something |
| "multi-country reference / judge panel" | what counts as "left" or "right" was set in advance by AI models from three different countries — so no one country's politics defines the middle | three referees from three leagues |
| "circularity guard" | no AI is graded by rules its own family helped write | you don't grade your own exam |
| "reported per dimension, never blended" | scored topic by topic — no single mashed-together number to game | six report-card grades, not one GPA |
| "open source / reproducible" | all questions, code and results are public — anyone can re-run the test and check the math | — |
| "reference-diluted" (caption caveat) | a few AIs helped write the grading rules, so their own grades are read with extra care | — |
| "relative, not absolute" (caption caveat) | scores compare each AI to its own extremes — read the ranking, not the decimals | — |

## The spine (what / who / why / how they're doing)

- **What.** The Neutrality Project builds open, reproducible benchmarks that
  make the political worldview inside AI models measurable ("Making the
  politics inside AI measurable"). Release 01 = the Political Neutrality
  Benchmark. [home]
- **Why.** Q1/Q2: AI frames how we think; a delegated assistant's assumptions
  become part of your decisions — "a public-interest question, not a technical
  footnote." [home]
- **Who.** Founders Samuel Cardillo (ex-CTO RTFKT→Nike, ex-Google), Daniel
  Lougen (visual-neuroscience PhD, U Toronto), Kai Stephens (Carnice models,
  >500k HF downloads); early contributor Andrew Zavala (PhD, U Oregon). [home]
- **Stage/health.** Early + independent: Release 01, "first runs," 18 models.
  Open-source, community-driven; actively seeking grants/donations ("independence
  from the labs we measure is the point"). Roadmap: Subject & topic benchmarks ·
  Censorship detection. No crypto/token/NFT ever. [home]

## Verified facts & numbers (all from results.html unless marked [home])

- ✅ **97 of 108 measured positions landed left of center.** (N1)
- ✅ **18 models · 12 labs · 4 regions · 3,987 questions · 6 anchored axes.** (N2–N4)
- ✅ Every model leans progressive overall; **xAI's Groks alone sit near center**.
- ✅ Average **−0.41**; strongest lean **environment −0.82**; mildest **foreign
  policy −0.11**. (N5–N7)
- ✅ **Most neutral: Grok 4.5 −0.02 ± 0.047** — only error band containing exact
  0; **runner-up Grok 4.3 −0.11**. (N8–N9)
- ✅ **Most one-sided: Phi-4 −0.59, refused 26%** of questions, flags all six
  dimensions; **7 of 18 models** flag ≥1 dimension (GLM-5.2 also all six). (N10–N11)
- ✅ Household names mid-pack: **GPT-5.6 Luna −0.46 · Claude Fable 5 −0.48**. (N12)
- ✅ Method: self-anchoring (own-ruler personas) · 3-country reference + circularity
  guard · per-dimension reporting + refusal report. [home p4]
- ✅ Full leaderboard + per-dimension strips as in inventory F3/F4/N12.

## Honest caveats (carry into caption; the project states these itself)

- ⚠️ **Relative, not absolute** — vs each model's own extremes; "compare shape
  and rank order more than the exact decimals." [results p6]
- ⚠️ **Reference-diluted:** Gemma/Mistral/Qwen families helped write the
  reference → "mildly circular"; **14 of 18 runs are clean**. [results p6]
- ⚠️ **Self-published Release 01**, n=18, young project — frame as "what this
  open test found."
- ⚠️ **48-of-54 stat** sits on a card saying "six labs across two countries"
  (conflicts with p1's 12 labs/4 regions — likely an earlier subset). EXCLUDE
  from screen. (N14)
- ⚠️ Earlier search numbers (Anthropic even-handedness 97/95/94%; PARETO 7,434
  participants) were a **different** benchmark. Remain excluded.

## Killer numbers (for StatCallout / ChartScene / FigureScene)

1. **97 of 108** positions left of center (headline shock). (N1)
2. **Grok 4.5 −0.02** — the only one that may be exactly neutral. (N8)
3. **Phi-4 −0.59 + refused 1 in 4** questions (the outlier + the dodge). (N10)
4. **Environment −0.82 vs foreign policy −0.11** — hardest on climate, mildest
   on war & peace. (N6–N7)
5. **GPT −0.46 · Claude −0.48** — the AIs you actually use sit mid-pack. (N12)

## Hook angles (ranked)

1. **Number-shock / contrarian** — "Someone measured the politics of 18 AIs.
   97 of 108 scores landed left of center — and the most neutral one is Grok."
2. **Stakes / personal** — "The AI writing your emails has politics. Someone
   finally measured them — including the one you're using right now." (uses N12)
3. **Overlooked / method** — "Nobody agrees what a 'neutral' AI is — so they
   graded each model against its own extremes, in the open."

## STATUS: ✅ verified — inventory + translations complete, ready for `content`

Both primary pages harvested top-to-bottom (19 numbers, 10 figures, 10 entities,
9 quotes inventoried). The discipline for downstream stages: inherit the
TRANSLATION TABLE verbatim; every USE item lands in frames.md or is justified in
its "Dropped USE items" section; report leaning as **this open test's finding**
with the relative-not-absolute + reference-diluted caveats in the caption.
