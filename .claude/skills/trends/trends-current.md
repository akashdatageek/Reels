# Trends — current data for a faceless AI-news channel

Updated: 2026-07-14
Next refresh due: 2026-07-28 (preflight warns at 14 days)
Scope: Instagram Reels · faceless, credibility-first AI/tech news · @startups.ai

## Currently hot (each mapped to OUR scene system)

### 1. The sendable stat card ("DM this to someone")
- **What:** one frame engineered to be screenshotted/sent — a single shocking,
  self-contained number with its context ON the frame, readable in isolation.
- **Why:** sends-per-reach is the heaviest Reels ranking signal in 2026 (DM
  shares weigh ~3–5× likes; ~694k reels/min shared via DM). A frame that works
  out of context is what people forward.
- **Ours:** the `content` skill's required **`sendable` frame role** → realize
  as `StatCallout` with `statVariant: donut|bar` (the fill makes the number
  feel proven) or a tight `FigureScene` crop with one `circleDraw` highlight +
  the claim as on-frame text. Also: make this frame the **`cover.png`** export
  in `editor` — same shot does thumbnail duty.

### 2. Infographic/data-explainer reels (saves 3× talking heads)
- **What:** clean chart-led explainers; data presented beautifully, no face.
- **Why:** infographic-style reels get saved ~3× more than talking-head
  content in the same niche; saves + watch-time are what the 2026 algorithm
  rewards for educational content. 30–90s educational reels engage best.
- **Ours:** already our core format — `FigureScene` with plain-language
  `annotations` + `figureFocus` walk-through, `theme: light` editorial look.
  Lean INTO it: prefer one more real figure over one more HookCard.

### 3. High cut density, no dead air (8–15 cuts / 30s)
- **What:** a visible change every ~2–4s — cut, zoom step, camera move —
  fast-paced but not chaotic.
- **Why:** retention: dead air is where viewers swipe; watch-time is a top-3
  ranking signal.
- **Ours:** the `author` skill's **~4s cut-density rule** — every scene enters
  with a `transition` (auto-rotated), and long `FigureScene`s carry 2–3
  `figureFocus` steps so the camera moves *within* the scene. `BeatPunch` +
  `CutFlash` add free motion on top when `music` is set.

### 4. Anti-overproduction bias (real > rendered)
- **What:** Instagram is actively deprioritizing glossy AI-generated-looking
  content as AI slop floods the platform; raw/real visuals outperform.
- **Why:** originality signals; accounts spamming recycled/synthetic content
  get excluded from recommendations.
- **Ours:** our "show the real thing" rule is now also an algorithm play —
  real source figures (`FigureScene`) and real screenshots beat `imagePrompt`
  scenes; when generating, our anti-slop photographic BASE_RULES (no CGI
  blobs/hologram cliché) keep us out of the penalized look. Film `Grain` +
  restrained `CinemaGrade` read as "made by a person."

### 5. One genuine comment question (comments as content)
- **What:** comment sections engineered as part of the reel — ONE real,
  answerable question, not "comment YES" bait (bait is penalized).
- **Why:** comments-per-reach still feed distribution; a genuine question on a
  data story ("which one do you use?") converts viewers who won't DM.
- **Ours:** `OutroCard.text` or its `voiceSegment` carries the question, and
  `caption.txt`'s first line repeats it after the keyword phrase. Keep it
  checkable against the reel's data — credibility first.

### 6. Keyword-first discovery (Instagram as search engine)
- **What:** captions written like search queries; the first sentence carries
  the exact phrase a person would type ("most neutral AI 2026").
- **Why:** Instagram SEO now outranks hashtags for discovery; the algorithm
  weighs the caption's first line most; Meta's own guidance is 3–5 relevant
  hashtags max (more dilutes).
- **Ours:** hardcoded in `editor` (caption = keyword-rich first line + 3–5
  hashtags + series tag). When REFRESHING, re-check the working keyword
  phrases for our niche: currently "AI news", "AI explained", "<model name>
  benchmark", "is AI biased".

### 7. Episodic series branding
- **What:** recurring named series ("… · Ep. 12") so viewers binge backwards
  and follow for the next one.
- **Why:** consistent series convert casual viewers to followers, and repeat
  watch of the back catalog compounds watch-time.
- **Ours:** hardcoded in `editor` — a stable series name + episode number in
  `caption.txt` (e.g. **"AI Receipts · Ep. N"** for benchmark/data stories).
  Optionally echo the series name as a small `lowerThird` on scene 1 for
  punchy (non-serious) stories.

## Stale / avoid (binding — do not apply)

- **Talking-head / selfie-cam formats** — outperforming studio content for
  *personality* channels, but we are faceless by design; not our lane.
- **Lip-sync, dance, GRWM, headphone-swap, reality-commentary trends** —
  incompatible with a credibility-first news channel.
- **Hashtag stuffing (8–30 tags)** — dead; dilutes relevance signals, reads as
  spam. 3–5 max, and captions do the SEO work now.
- **Engagement bait** ("comment YES", "tag 3 friends") — penalized; use one
  genuine question instead (see #5).
- **Reposting/recycling clips** — 10+ reposts in 30 days excludes the account
  from recommendations entirely; every reel stays original.
- **Pixel-stretch / anime-grade novelty edits** — hot for aesthetic channels,
  wrong register for data journalism; would undercut the light editorial theme.
- **Over-produced glossy CGI look** — actively deprioritized as AI slop (see #4).

## Sources (retrieved 2026-07-14)

- creatorflow.so/blog/instagram-algorithm-2026 · blog.hootsuite.com/instagram-algorithm
- buffer.com/resources/instagram-algorithms · sproutsocial.com/insights/instagram-algorithm
- socialync.io/blog/instagram-shares-algorithm-complete-guide-2026
- napoleoncat.com/blog/instagram-reels-trends · later.com/blog/instagram-reels-trends
- newengen.com/insights/instagram-trends · lightreel.ai/blogs/whats-trending-on-instagram
- fluxnote.io/guides/faceless-instagram-reels-tech-niche · flowshorts.app/faceless-reels/technology
- lamplightcreatives.com/captions-vs-hashtags-instagram-2026
- divemedia.com.au/marketing-tips-and-insights/social-seo-keywords-vs-hashtags
- skedsocial.com/blog/how-to-use-hashtags-on-instagram-in-2026
- toptal.com/creator/post/instagram-seo · quso.ai/blog/instagram-reels-best-practices
