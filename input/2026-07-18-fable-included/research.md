# Claude Fable 5 goes standard on top plans — verified facts

Story: On July 17, 2026 (9:14 PM), Anthropic's official @claudeai account
announced that **beginning July 20, Claude Fable 5 is included in all Max and
Team Premium plans at 50% of limits**, while Pro and Team Standard keep
pay-per-use access via usage credits plus a **one-time $100 credit** — ending
five weeks of on-again/off-again access to Anthropic's most powerful model.

## SOURCE INVENTORY

| # | Type | Item | Where | USE/SKIP | Reason (one line) |
|---|------|------|-------|----------|-------------------|
| 1 | screenshot | Main @claudeai post (July 20 / 50% / $100) | assets/tweet_announcement.jpeg | USE | THE primary evidence — goes on screen |
| 2 | number | "included in all Max and Team Premium plans, at 50% of limits" | tweet ¶1 | USE | the headline change |
| 3 | number | July 20 start date | tweet ¶1 | USE | when it kicks in |
| 4 | number | one-time $100 credit for Pro + Team Standard | tweet ¶2 | USE | the consolation prize — and its catch |
| 5 | quote | "Demand for Fable has been challenging to predict… extending access several times" | tweet ¶3 | USE | Anthropic's own admission of the chaos |
| 6 | screenshot | Follow-up post ("We know this has been frustrating… 50% standard for plans that use Fable most intensively") | assets/tweet_announcement.jpeg lower | USE | the apology beat, in their words |
| 7 | number | 16M views on main post, 46K likes | screenshot footer | USE | scale of attention |
| 8 | number | API price $10/M input · $50/M output tokens | openrouter.ai/anthropic/claude-fable-5 · ayautomate.com · finout.io · techtimes | USE | what "usage credits" actually cost — steepest GA Claude pricing |
| 9 | number | ~2× the price of Claude Opus 4.8 | finout.io · ayautomate.com | USE | scale anchor for the price |
| 10 | fact | Access deadline extended repeatedly: July 7 → July 12 → July 19 → now permanent | digitalapplied.com (×2) · bleepingcomputer.com · tweet ¶3 | USE | the "limbo" the announcement ends |
| 11 | fact | June 12 US export controls suspended Fable 5/Mythos 5; lifted June 30; redeployed July 1 with new cybersecurity classifiers | aljazeera.com · x.com/AnthropicAI (redeploy post) · cryptobriefing.com | USE | why access was chaotic in the first place (one background beat) |
| 12 | fact | Fable 5 = Anthropic's most intelligent GA model, new Mythos-class tier above Opus | anthropic.com/news/claude-fable-5-mythos-5 · platform.claude.com docs | USE | one line of "what is Fable" for zero-background viewers |
| 13 | arithmetic | $100 credit ÷ $50/M output = 2M output tokens — one long agentic session | derived from #8; same math in techtimes | USE | makes the $100 concrete |
| 14 | claim | Weekly limits themselves shrink July 20 (Claude Code +50% boost ends), so 50% is of a smaller base | simonwillison.net 2026/Jul/18 | SKIP | ⚠️ single source — not confirmed independently; don't put on screen |
| 15 | claim | "Reviewer burned $100 credit in 9 minutes" | aiweekly.co | SKIP | ⚠️ single-source anecdote, unverifiable |
| 16 | opinion | GPT-5.6 Sol competition made API-only plan untenable | simonwillison.net | SKIP | analyst opinion, not fact — needs attribution space we don't have |
| 17 | fact | 90% prompt-caching input discount, 1.1× US-only inference | openrouter/platform docs | SKIP | API-developer detail, off-story for plan subscribers |
| 18 | entity | Amazon researchers' jailbreak report triggered the June export controls | aljazeera · enterpriseaiworld | SKIP | fascinating but a second story; the redeploy beat (#11) covers enough |
| 19 | number | Follow-up post: 5.2K likes, 967K views | screenshot footer | SKIP | main post's 16M is the stronger stat |

## TRANSLATION TABLE

| Term / number (source's words) | Plain English (grade 6–8) | Analogy (if scale needs it) |
|---|---|---|
| "Claude Fable 5" | Anthropic's newest, most powerful AI — the top model of the Claude family | — |
| "included at 50% of limits" | subscribers can spend half their plan's weekly allowance on it | like a buffet where the premium dish is capped at half your plate |
| "Max / Team Premium plans" | Claude's most expensive subscriptions | — |
| "Pro / Team Standard" | the cheaper paid plans | — |
| "usage credits" | pay-as-you-go — you buy credit and every answer eats some of it | like a prepaid phone card |
| "one-time $100 credit" | $100 of free pay-as-you-go use, once | at Fable's prices, one big automated coding job can eat all $100 |
| "$10 / $50 per million tokens" | its answers cost about twice Anthropic's next-best model | the priciest Claude ever offered to the public |
| "export controls" | the US government temporarily blocked the model | — |
| "classifiers" | safety filters | — |
| "staged rollout / extending access several times" | access kept getting a new expiry date — three deadlines in three weeks | — |

## Verified facts (each with source)

- Beginning **July 20**, Fable 5 included in **all Max and Team Premium plans at
  50% of limits**. [primary: assets/tweet_announcement.jpeg; confirmed:
  https://www.techtimes.com/articles/320905/20260718/claude-fable-5-ends-subscription-limbo-permanent-max-credits-only-pro.htm ·
  https://www.dawn.com/news/2016483 · https://simonwillison.net/2026/Jul/18/claude-make-fable-5-permanent/]
- **Pro and Team Standard**: access continues via usage credits + **one-time
  $100 credit**. [primary: tweet; confirmed: techtimes (above) ·
  https://www.androidheadlines.com/2026/07/claude-fable-5-drops-subscriptions-pay-per-use-credits.html]
- Fable 5 API pricing: **$10/M input · $50/M output tokens** — ~2× Opus 4.8,
  the steepest pricing for any GA Claude model.
  [https://openrouter.ai/anthropic/claude-fable-5 ·
  https://www.ayautomate.com/blog/claude-fable-5-pricing-explained ·
  https://www.finout.io/blog/claude-fable-5-mythos-5-pricing-benchmarks]
- The saga: subscription access was repeatedly extended — through July 7, then
  July 12, then July 19 — before this permanent arrangement.
  [https://www.digitalapplied.com/blog/anthropic-fable-5-access-extended-july-12-2026 ·
  https://www.bleepingcomputer.com/news/artificial-intelligence/claude-fable-5-stays-free-for-paid-users-until-july-19-as-anthropic-buys-more-time/ ·
  tweet ¶3 "extending access several times"]
- Background: US export controls hit Fable 5/Mythos 5 on June 12; lifted June
  30; redeployed globally July 1 with added cybersecurity safety filters.
  [https://www.aljazeera.com/economy/2026/7/1/us-lifts-restrictions-on-powerful-ai-models-fable-mythos-anthropic-says ·
  https://x.com/AnthropicAI/status/2072163884430229756 ·
  https://cryptobriefing.com/anthropic-claude-fable-5-global-redeployment/]
- Fable 5 is Anthropic's most intelligent generally available model — a new
  "Mythos-class" tier above Opus.
  [https://www.anthropic.com/news/claude-fable-5-mythos-5 ·
  https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5]
- Anthropic's own words: "Demand for Fable has been challenging to predict…
  extending access several times as we secured additional capacity" and "We
  know this has been frustrating." [primary: tweet + follow-up, on screen]
- Main post reach: **16M views** at capture. [primary: screenshot]
- ⚠️ EXCLUDED (single source): weekly base limits shrink July 20 as the Claude
  Code +50% boost ends (Willison); "$100 burned in 9 minutes" (AI Weekly);
  GPT-5.6 Sol competitive-pressure theory (Willison).

## Killer numbers

- **50% of limits** — how much of a Max plan Fable can now eat (the headline)
- **$100, once** — Pro's consolation credit
- **$50 per million output tokens** — why $100 vanishes fast: 2M output tokens
  = one long automated coding session (derived, techtimes-matched arithmetic)
- **3 deadlines in 3 weeks** (July 7 → 12 → 19) — the limbo this ends
- **16M views** — the announcement's reach

## Hook angles (ranked)

1. **Winners and losers** — "Anthropic just split its users in two": Max gets
   the best AI included; Pro gets $100 and a meter. Clear, personal, checkable.
2. **Fine-print shock** — "$100 free credit sounds generous — it's one coding
   session": leads with the derived arithmetic; strong sendable frame.
3. **The limbo ends** — banned by the government, redeployed, three expiry
   dates, now finally permanent: the chaos arc as story (needs the most
   background, hardest under 75s).
4. **Number-shock** — "the most expensive Claude ever is now *included*" —
   $50/M framing first; risks confusing plan users vs API pricing.

Angle check: most coverage leads with "permanent for Max / credits for Pro"
(techtimes, decoder, aiweekly all ran it); the winners/losers frame is common
but the **$100-is-one-session arithmetic** is the beat most posts bury — combine
angle 1 structure with angle 2's payoff for a hook nobody's leading with.
