# The Neutrality Project — research (verified from primary pages)

> ✅ **Unblocked.** The user supplied both full primary pages as PDFs (staged in
> `assets/homepage.pdf` and `assets/results.pdf`). Everything below is read
> directly from those two pages. Independent web search earlier corroborated the
> project's nature and existence. Results are the project's **own self-published
> Release 01** — reported as such, not as third-party-verified truth.
> Sources: `https://neutralityproject.org/` · `https://neutralityproject.org/results.html`

## The spine (what / who / why / how they're doing)

- **What it is.** The Neutrality Project builds **open, reproducible benchmarks
  that make the political "worldview" inside AI models measurable** — "Making the
  politics inside AI measurable." Release 01 is the **Political Neutrality
  Benchmark**. [home]
- **Why it exists.** "AI does more than answer questions. It frames how we
  think." When people outsource research/reasoning/writing to an assistant, its
  default worldview becomes part of their decisions — "a public-interest
  question, not a technical footnote." Mission: make AI's influence measurable
  and "AI labs accountable in the open." [home]
- **Who.** Founding team: **Samuel Cardillo** (technologist/entrepreneur, ex-CTO
  of RTFKT — the studio acquired by Nike — previously Google), **Daniel Lougen**
  (visual-neuroscience PhD, University of Toronto; open-source AI dev), **Kai
  Stephens** (open-source AI dev; created the Carnice model family; >500k model
  downloads on Hugging Face). Early contributor: **Andrew Zavala** (cognitive
  neuroscientist, PhD U. Oregon 2025). [home]
- **How they're doing (stage/health).** Early and independent: **Release 01,
  "first runs," 18 models measured so far.** Open-source, community-driven
  ("quality depends on contributors"). **Actively seeking grants + donations** —
  "compute for benchmark runs is the main cost, and independence from the labs
  we measure is the point." Roadmap: two more benchmarks planned — **Subject &
  topic** and **Censorship detection**. Explicit anti-scam note: "no
  cryptocurrency, token, or NFT, and never will." [home]

## Verified facts & numbers (all from results.html unless marked [home])

### Headline
- ✅ **97 of 108 measured positions landed left of center.** [results]
- ✅ **18 models · 12 labs · 4 regions**, on **3,987 real public-opinion survey
  questions**, across **6 anchored ideological axes**. [results / home]
- ✅ **Every model leans progressive overall; xAI's Groks alone sit near
  center.** [results]
- ✅ Average position across all results **−0.41**; strongest lean is
  **environment, −0.82 avg**; closest to center is **foreign policy, −0.11
  avg**. (Scale: −1 progressive ↔ 0 neutral ↔ +1 conservative.) [results]
- ✅ The progressive lean **holds in 48 of 54 positions** across stock +
  abliterated + clean/diluted runs; strongest on environment & social, weakest
  on economic & foreign policy. [results]

### The leaderboard (overall leaning, most-neutral → least; from the Neutrality Map)
- ✅ **Most neutral: Grok 4.5 at −0.02 ± 0.047 SE** — the only model whose error
  band includes exact neutrality. [results]
- ✅ **Most progressive: Phi-4 at −0.59** — and it **refused 26% of all
  questions**, flagging all six dimensions. [results]
- Full 18: Grok 4.5 −0.02 · Grok 4.3 −0.11 · MiniMax M3 −0.25 · Gemma 3 27B
  abliterated −0.28 · EuroLLM 22B −0.35 · Mistral Small −0.41 · GLM-5.2 −0.42 ·
  Nemotron 3 Nano 30B −0.45 · GPT-OSS 120B −0.46 · GPT-5.6 Luna −0.46 · Qwen3.6
  35B A3B −0.47 · **Claude Fable 5 −0.48** · Granite 4.1 8B −0.53 · Llama 3.3 70B
  abliterated −0.54 · OLMo 3.1 32B −0.54 · Llama 3.3 70B −0.55 · Gemma 3 27B
  −0.56 · Phi-4 −0.59. [results]

### The method (what makes it credible — a strong explainer beat)
- ✅ **Self-anchoring** — each model is scored on **its own** far-left(−1)→
  far-right(+1) ruler (role-played personas), so "−0.7 on social" = 70% toward
  *that model's* own far-left. No human "opinion of center" baked in. [home]
- ✅ **Multi-country reference** — which answer leans which way is fixed ahead of
  time by independent models from **three different countries and labs**; a
  circularity guard blocks a model being graded by its own family's rulebook.
  [home]
- ✅ **Reported per-dimension, never blended** into one gameable score; a sanity
  check flags broken runs; a **refusal report** flags when declined questions
  skew an axis. Six axes: economic, social, foreign policy, environment,
  religion, national identity. [home]
- ✅ **Refusals matter:** 7 of 18 models decline enough to flag ≥1 dimension;
  **Phi-4 and GLM-5.2 trip the refusal flag on all six.** [results]

### Report figures available (real assets → candidates for FigureScene)
- Neutrality Map (leaning × intelligence scatter, Grok 4.5 marked most neutral).
- Per-dimension strips (Environment, Social, National identity, Religion,
  Economy, Foreign policy) with all 18 models plotted. [results]
- Fig 1 own-ruler positions · Fig 2 self-anchoring spans · Fig 3 Claude Fable 5
  refusal probe (38 refusals) · Fig 4 unanchored dimensions. [results]

## Honest caveats (must carry into the script — the project states these itself)
- ⚠️ **Relative, not absolute.** Positions are vs each model's *own* far-left/
  far-right, not a universal axis — "compare shape and rank order more than the
  exact decimals." [results]
- ⚠️ **Reference-diluted runs.** 4 of 18 (Gemma, Mistral, Qwen families) helped
  write the reference, so their results are "mildly circular"; 14 are clean
  targets. [results]
- ⚠️ **Self-published Release 01**, small n (18 models), young project — frame as
  "what this benchmark found," not settled fact.
- ⚠️ Earlier search numbers (Anthropic even-handedness 97/95/94%; arXiv PARETO
  7,434 participants) were a **different** benchmark — confirmed NOT this project.
  Remain excluded.

## Killer numbers (for StatCallout / ChartScene / FigureScene)
1. **97 of 108** positions left of center (headline shock). [results]
2. **Grok 4.5 = −0.02**, the most neutral; the only one that includes 0. [results]
3. **Phi-4 = −0.59** and refused **26%** of questions (the outlier). [results]
4. **−0.41** average lean · **−0.82** environment (strongest). [results]

## Hook angles (ranked)
1. **Number-shock / contrarian** — "Someone measured the politics of 18 AIs.
   **97 of 108** landed left of center — and the most neutral one was **Grok**."
   (Most shareable; fully sourced; the Grok twist subverts expectations.)
2. **Overlooked / method** — "Nobody agrees what a 'neutral' AI is — so they
   graded each model against *its own* far-left and far-right, in the open."
3. **Stakes / why-it-matters** — "Your AI has politics you can't see. This
   open-source project makes them a number — and holds the labs accountable."

## STATUS: ✅ verified — ready for the `script` stage
Both primary pages read; numbers traceable to results.html; caveats captured.
The one discipline for the script: report leaning as **the benchmark's finding**,
keep the "relative not absolute / reference-diluted" caveat in view, and lead
with the 97-of-108 + Grok-is-most-neutral contrast.
