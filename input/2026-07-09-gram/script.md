# GRAM — script development

## V1 (draft)
> HOOK: "New AI safety research: GRAM puts dual-use capabilities in removable modules."
> → method → benchmarks → scales → follow.

## Critique of V1
1. Opens like a press release ("New research"). No stake.
2. The dual-use dilemma — the actual drama — is buried in jargon.
3. "Removable modules" means nothing without the payoff: delete it → behaves like it never learned it.
4. Benchmarks listed, not felt; the keep-vs-remove separation is the whole point.
5. "Off-switch" (Anthropic's own framing) is the strongest image and V1 omits it.
6. No callback.

## V2 (extended, ~60s: problem → stakes → method → receipt → proof → scale → so-what → callback)
| # | Beat | Scene | Visual |
|---|------|-------|--------|
| 1 | PROBLEM | HookCard | "The same AI that helps *cure* a disease can help *make* one" — backdrop: virology lab |
| 2 | STAKES | SplitCompare | Today = all-or-nothing: ship it (misuse risk) vs withhold it (lose the good) |
| 3 | METHOD | ImageScene(gen) | modular brain: one core + small capability modules (virology/cyber/nuclear) |
| 4 | RECEIPT | ImageScene(gen) | pull the module out → the knowledge goes dark; "acts like it never learned it" |
| 5 | PROOF | SplitCompare | KEEPS core skill (0.96) / REMOVES the danger (forget 0.60, lower = more gone) |
| 6 | SCALE | StatCallout | 5B — bigger models separate cleaner; harder to bring the capability back |
| 7 | SO-WHAT | ImageScene(gen) | an off-switch: trusted labs get the full model, everyone else the safe one — 5× cheaper than training 5 |
| 8 | OUTRO | OutroCard | callback: "a switch for what AI is allowed to know" |

### V2 voiceover (~110 words ≈ 58s brisk)
1. "The same AI knowledge that helps cure a disease can help make one. That's the dual-use problem."
2. "Until now it was all or nothing: ship the powerful model and risk misuse, or hold it back and lose the good it can do."
3. "Researchers at A E Studio and Anthropic built a fix, called GRAM. During training, each dangerous skill — like virology or cyber — gets packed into its own small, removable module."
4. "Delete that module, and the model acts like it never learned the subject at all."
5. "And it keeps its normal abilities almost perfectly, while the removed capability drops away — cleaner than just filtering the data or trying to make it forget later."
6. "They tested it up to five billion parameters, and it only gets better with scale — bigger models are harder to trick back into the deleted knowledge."
7. "It's basically an off-switch: trusted labs get the full model, everyone else gets the safe one — from a single training run, five times cheaper than training separate models."
8. "A switch for what an AI is allowed to know. Follow for daily AI news."

### Cross-check vs research.md
- dual-use cure/make → fact 1 ✓
- all-or-nothing → fact 1 ✓
- AE Studio + Anthropic, GRAM, per-capability removable modules → facts 2,10 ✓
- delete module → acts like never learned → fact 3 ✓
- keeps core ~0.96, removed drops, better than filtering/unlearning → facts 3,7,8 ✓ ("cleaner" hedges; on-screen labels the direction)
- 50M–5B, improves with scale, resists retraining → fact 4 ✓ ("harder to trick back" = resists elicitation)
- off-switch, trusted vs everyone, 5× cheaper, 1 run → facts 5,9 ✓
- "researchers built" (not shipped product) per ⚠️ ✓
