# The Neutrality Project — research

> ⚠️ **Sourcing caveat.** Both primary URLs the user provided
> (`neutralityproject.org/` and `/results.html`) are **blocked by this
> session's egress policy** (HTTP 403 on the proxy CONNECT), and direct fetches
> of arXiv were blocked too. Everything below comes from **web-search results
> and snippets**, not from reading the primary pages. Facts confirmed by ≥2
> independent search sources are marked ✅; anything I could not verify to the
> pipeline's standard is marked ⚠️ and must **not** go on screen until confirmed.

## The spine (what / who / why)

- **What it is** ✅ — The Neutrality Project is an **open-source, reproducible
  benchmark that measures political bias / the "worldview" inside AI language
  models**, so people can see how a model may be shaping their judgment. Its
  framing: when you delegate research, reasoning, and writing to an assistant,
  the model's default worldview becomes part of your decisions — so that
  worldview is a *public-interest question*.
  [source: https://neutralityproject.org/ (search snippet); corroborated by
  multiple results for "Neutrality Project"]
- **What it measures** ✅ — where a model sits across ideological axes,
  **self-anchored and scored against a multi-country reference**, with
  **refusal detection** built in (how often a model declines to engage).
  [source: https://neutralityproject.org/ (search snippet)]
- **How it's built** ✅ — open source; explicitly community-driven — "quality
  depends on contributors who challenge the methodology, benchmark more models,
  review results, and build better tools." First release described as the
  **Political Neutrality Benchmark**.
  [source: https://neutralityproject.org/ (search snippet)]
- **Who is behind it** ⚠️ — **UNCONFIRMED.** Search ties the broader "open-source
  AI bias test" story to **Anthropic's** even-handedness eval (Nov 2025), but
  the Neutrality Project site presents as a contributor-driven project. Whether
  neutralityproject.org *is* Anthropic's release, uses its methodology, or is
  independent could **not** be verified — do not state an owner on screen.
  [context: https://winbuzzer.com/2025/11/13/anthropic-releases-open-source-ai-bias-test-pitting-claude-against-gpt-5-gemini-grok-in-race-for-ai-neutrality-xcxwbn/]

## Results — NOT YET VERIFIED (this is the user's core question)

The specific `results.html` numbers (per-model scores / rankings) could not be
read. Numbers that surfaced in search **appear to belong to adjacent
benchmarks**, not confirmed as this project's results page:

- ⚠️ Even-handedness: **Gemini 2.5 Pro 97%, Claude Opus 4.1 95%, Claude Sonnet
  4.5 94%** — these read as **Anthropic's even-handedness eval**, *not*
  confirmed as neutralityproject.org/results.html. EXCLUDE until confirmed.
  [source: search snippet citing Anthropic's benchmark]
- ⚠️ "Acknowledging opposing viewpoints": Claude Opus 4.1 46%, Grok 4 34%,
  Llama 4 31%, Claude Sonnet 4.5 28% — source/benchmark unclear. EXCLUDE.
- ⚠️ Associated paper *"Political Neutrality as Balanced Approval"*
  (arXiv 2605.28911): **PARETO dataset — 7,434 participants, 208,152
  evaluations, 200 Reddit-sourced prompts, 1,600 frontier-model responses.**
  Strong, citable numbers, but **not confirmed to be this project's results** —
  could be a separate study. Verify before use. [source: arxiv.org/abs/2605.28911]
- ⚠️ General consensus (multiple lower-authority blogs): Claude and Gemini lead
  on measured even-handedness in 2026; GPT-5 behind; Grok inconsistent; Llama 4
  lags. Directional only — not citable per pipeline rules.

## Killer numbers (candidates — ALL currently gated on verification)

- The multi-country reference + refusal detection method (a *how-it-works*
  hook, not a stat) ✅ is the one safely usable angle right now.
- Any model score / ranking → **blocked** until results.html is readable.

## Hook angles (ranked)

1. **"Your AI has politics — and now you can measure them."** (what-it-is;
   fully supported without any contested number) ✅
2. **Contrarian / transparency** — "Nobody agrees what a *neutral* AI is, so
   they built an open scoreboard and let anyone check the math." ✅
3. **Number-shock / leaderboard** — "Which AI is the most politically neutral?"
   ⚠️ needs the verified results.html ranking; do NOT build this yet.

## STATUS: blocked on results — needs user input before script stage

Per the research skill ("every on-screen stat traces to a source; ≥2 sources or
stop and ask"), I can fully support **what the project is**, but **not its
results**. To unblock, either:
- paste the text/screenshot of `results.html` (drop into `assets/`), or
- confirm I may attribute the arXiv PARETO numbers / Anthropic even-handedness
  numbers explicitly to *their* sources (not to "the Neutrality Project").
