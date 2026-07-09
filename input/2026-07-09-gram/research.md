# Research — GRAM: modular pretraining for access control (2026-07-09)

## Story
AE Studio + Anthropic researchers introduce **GRAM (Gradient-Routed Auxiliary
Modules)**: a pretraining method that isolates each dual-use capability
(virology, cyber, nuclear, specialized code) into its own small, removable
module. Delete a module at inference and the model behaves like it never
learned that data — an "off-switch" for dangerous capabilities, in ONE
training run instead of many.

## Verified facts (primary = uploaded paper unless noted)

| # | Fact | Source |
|---|------|--------|
| 1 | The dual-use dilemma: an AI capability that helps cure a disease can help synthesize one; virology knowledge → vaccines OR pathogens. Deploying it risks misuse; withholding forfeits benefits — today an all-or-nothing choice | paper §1 (Abstract/Intro) |
| 2 | GRAM = Gradient-Routed Auxiliary Modules: augments each MLP block with small auxiliary modules, one per dual-use capability; gradient routing directs capability-specific learning into its module during pretraining | paper §1, §3, Fig.1 |
| 3 | At inference, ablating (deleting) a module removes its capability while preserving the rest; the ablated model resists malicious finetuning better than post-hoc unlearning, and better than data filtering, on the removed domain | paper Abstract, §1 |
| 4 | Tested models from 50M to 5B parameters; knowledge separation gets BETTER with scale — larger models forget removed subjects more thoroughly and resist retraining better | paper Abstract §"scaling"; AE Studio X thread (chart, uploaded) |
| 5 | GRAM (1 model) approximates N separately data-filtered models; in the 5-profile setting it's a **5× reduction** in compute vs data filtering | paper Abstract |
| 6 | Realistic dual-use domains evaluated: virology (Europe PMC), cybersecurity (arXiv), nuclear physics (OSTI/arXiv), specialized code (Lisp) | paper §5 |
| 7 | Benchmark (bar chart, uploaded IMG_0206): Core ↑ GRAM 0.96 / Filtering 0.99 / Filter+LoRA 0.99; Forget ↓ GRAM 0.60 / Filtering 0.85 / Filter+LoRA 0.85; Elicit ↓ GRAM 0.76 / 0.85 / 0.86. Lower Forget = more thoroughly removed → GRAM removes best | uploaded chart |
| 8 | Core performance stays near baseline (GRAM ~0.94–0.96); retained capabilities stay near baseline; only the forgotten ones drop | paper §4, §5 |
| 9 | Anthropic framing: an "off-switch" for dual-use; serve the full model to trusted deployments, a capability-removed variant to everyone else (least-privilege / access control) | https://www.anthropic.com/research/off-switch-dual-use ; paper §1 |
| 10 | Authors: AE Studio (Ethan Roland, Murat Cubuktepe, Erick Martinez, et al.) + Anthropic (Cem Anil, Alex Cloud) | paper title page |

## Killer numbers
1. **5×** cheaper than training 5 separate filtered models (fact 5)
2. **50M → 5B** params, separation improves with scale (fact 4)
3. Forget **0.60** vs filtering's 0.85 — removes the capability most thoroughly (fact 7; lower = better)

## Hook angles (ranked)
1. **"Scientists built an off-switch for an AI's most dangerous knowledge"** —
   Anthropic's own framing; concrete, high-stakes, not the generic "new method" take.
2. "The same AI that helps cure a disease can help make one — here's the fix."
3. "You can now delete what an AI knows, permanently."
Chosen: hook with #2's dilemma → resolve with #1's off-switch.

## Theme analysis
AI-safety / frontier-research story with a danger edge → **bold** vibe,
research/models duotone: violet `#8B5CF6` + hot pink `#FF4D9D`.
imageStyle: "iridescent neural chrome, violet and magenta holographic glow,
dark research-lab atmosphere". Backdrops: virology lab (hook), server/training
hall (scale), control room (off-switch).

## ⚠️ Unverified / excluded
- ⚠️ Real-world deployment / product use — this is research, not shipped. Say "researchers showed", not "you can now".
- ⚠️ Exact Forget "lower is better" needs on-screen labeling so 0.60 doesn't read as a weakness.
- ⚠️ Don't overclaim safety guarantees — paper says "resists" retraining better, not "impossible to recover". Script uses "harder to bring back", not "gone forever".
- ⚠️ Elicited-forget numbers vary by compute budget — omit precise figure, use trend.

## Source credit for caption.txt
Source: AE Studio & Anthropic — "Modular Pretraining Enables Access Control" (GRAM). Charts: AE Studio.
