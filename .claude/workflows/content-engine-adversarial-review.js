export const meta = {
  name: 'content-engine-adversarial-review',
  description: 'Deep adversarial VP-of-GTM review of the Content Engine PRD across 12 lenses, with per-lens refutation, consolidation, gap-finding, and document drafting',
  phases: [
    { title: 'Recon', detail: 'ground the review in 2026 LinkedIn distribution and AI-content-tool reality' },
    { title: 'Find', detail: '12 adversarial lenses read the PRD and attack it' },
    { title: 'Refute', detail: 'a skeptic per lens tries to kill each finding' },
    { title: 'Consolidate', detail: 'dedup, rank, resolve contradictions between lenses' },
    { title: 'Gaps', detail: 'completeness critic, then targeted gap finders' },
    { title: 'Draft', detail: 'compose the review and fixes documents on disk' },
  ],
}

const PRD = '/Users/josephavula/Desktop/content engine/content-engine-PRD.md'
const DIR = '/Users/josephavula/Desktop/content engine'
const TODAY = '2026-08-17'

const PERSONA = `You are a VP of GTM at a company of Ramp's or Anthropic's caliber, in August 2026. You have personally built and operated agentic content systems that produce organic LinkedIn content that actually travels -- not engagement bait, but writing that senior operators screenshot and forward to each other. You have also personally killed three internal content tools that looked great in a doc and died in week three.

You are reviewing a PRD, not praising it. Your reputation rests on being right, not agreeable.

Rules for your output:
- Be specific to THIS document. Cite section numbers and quote the exact language you are attacking. A finding that could apply to any content tool is worthless.
- No generic advice. "Add more testing" or "consider user research" is noise. Name the mechanism, the threshold, the filename, the schema field, the number.
- Every finding must name a concrete failure scenario: a specific person, doing a specific thing, on a specific day, getting a specific bad outcome.
- Price your fixes. The two hard product requirements are (1) it must be a breeze to use for technical AND non-technical people, and (2) the content must be genuinely excellent -- the kind that earns respect from a skeptical senior audience. If your recommendation adds friction, say so explicitly and justify the trade. Recommending more process is the default failure mode of reviewers like you. Resist it.
- Distinguish a real defect from a preference. If you are asserting taste, label it as taste.
- You may conclude that a mechanism the PRD is proud of is actively harmful. Say so plainly.
- Never invent a statistic. If you need a number you do not have, say what would have to be measured.`

const FINDINGS_SCHEMA = {
  type: 'object',
  properties: {
    lens: { type: 'string' },
    lens_verdict: { type: 'string', description: 'One paragraph: on this dimension, does the PRD pass, and what is the single biggest problem?' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'lens code + two digits, e.g. L1-01' },
          title: { type: 'string', description: 'Under 12 words, states the defect not the topic' },
          severity: { type: 'string', enum: ['blocker', 'major', 'minor'] },
          sections: { type: 'array', items: { type: 'string' }, description: 'PRD sections implicated, e.g. ["§7","§14"]' },
          claim: { type: 'string', description: 'The defect in two or three sentences' },
          evidence: { type: 'string', description: 'Direct quote or exact reference from the PRD that establishes it' },
          failure_scenario: { type: 'string', description: 'Specific person, specific action, specific day, specific bad outcome' },
          recommendation: { type: 'string', description: 'The concrete fix. Name the mechanism, threshold, file, or schema change. Implementable as written.' },
          friction_delta: { type: 'string', enum: ['reduces-friction', 'neutral', 'adds-friction'] },
          cost_of_fix: { type: 'string', enum: ['trivial', 'moderate', 'significant'] },
          is_taste: { type: 'boolean', description: 'true if this is a taste judgment rather than a defect' },
        },
        required: ['id', 'title', 'severity', 'sections', 'claim', 'evidence', 'failure_scenario', 'recommendation', 'friction_delta', 'cost_of_fix', 'is_taste'],
      },
    },
  },
  required: ['lens', 'lens_verdict', 'findings'],
}

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          verdict: { type: 'string', enum: ['confirmed', 'overstated', 'refuted'] },
          reasoning: { type: 'string', description: 'Why. If refuted, quote the PRD text that already handles it.' },
          corrected_severity: { type: 'string', enum: ['blocker', 'major', 'minor'] },
          sharpened_recommendation: { type: 'string', description: 'A better version of the fix, or the original if it was already right.' },
        },
        required: ['id', 'verdict', 'reasoning', 'corrected_severity', 'sharpened_recommendation'],
      },
    },
  },
  required: ['verdicts'],
}

// ---------------------------------------------------------------- Phase: Recon

phase('Recon')

const [linkedinBrief, toolingBrief] = await parallel([
  () => agent(`You are researching for an August 2026 review of a LinkedIn content engine. Use WebSearch and WebFetch aggressively.

Produce a tight operator's brief, max 1200 words, on how organic LinkedIn distribution actually works as of mid-2026. Cover, with dates on anything that changed recently:
- What the feed algorithm currently rewards and punishes. Dwell time, early engagement windows, comment weighting, reposts vs shares, outbound links, edit penalties.
- Relative reach by format right now: text-only short post, document/carousel post, single image, native video, LinkedIn article, poll. If document posts have declined or risen in reach, say which and when.
- What has changed about how the feed treats obviously-AI-written content, if anything. Any labeling, downranking, or reader-side backlash that a serious operator has to account for.
- Realistic cadence. What posting frequency actually maximizes total reach for a sub-5k-follower account versus a 20k+ account, and whether there is a penalty for posting more than once a day.
- The comment surface: does replying to your own commenters materially change reach, how long does the window stay open, does comment length matter.
- Anything about follower growth mechanics that would bear on a goal of 1.4k to 20k followers in six months for one person posting roughly 4 times a week.

Label anything you could not verify as UNVERIFIED and say what you searched. Do not pad. Facts and numbers only, each with a source domain in parentheses. Your output is consumed by other agents as ground truth, so mark confidence honestly.`, { label: 'recon:linkedin-2026', phase: 'Recon' }),

  () => agent(`You are researching for an August 2026 review of a self-hosted, Claude-Code-based LinkedIn content engine aimed at both technical and non-technical individuals.

Use WebSearch and WebFetch. Produce a tight brief, max 1200 words, covering:
- The competitive landscape for AI LinkedIn content tools as of mid-2026: Taplio, Shield, AuthoredUp, Supergrow, Kleo, Typefully, and any newer agentic entrants. For each, what it actually does, price, and the specific complaint users make about it. Focus hardest on the complaints.
- What buyers of these tools say about voice fidelity: why does AI-written LinkedIn content still read as AI to readers in 2026, in concrete linguistic terms beyond the em dash.
- The current state of AI-text detection from the reader's side. What tells do sophisticated readers report noticing now that they did not two years ago. Has the tell inventory shifted as models got better?
- Whether anyone has shipped something comparable to a personal "inventory of real material" mechanism, and what happened to it.
- What the actual retention killer is for these tools. Why do people stop using AI content tools after a few weeks? Be concrete about the reported reasons.
- Any published data on whether AI-assisted LinkedIn content underperforms or outperforms human-written content on engagement.

Label anything unverified. Each claim gets a source domain in parentheses. Your output is consumed by other agents as ground truth, so mark confidence honestly. No filler.`, { label: 'recon:tooling-2026', phase: 'Recon' }),
])

log('Recon complete. Fanning out 12 adversarial lenses.')

const RECON = `
=== GROUND TRUTH BRIEF A: LinkedIn organic mechanics, mid-2026 ===
${linkedinBrief || '(recon failed -- do your own WebSearch to ground any platform claim)'}

=== GROUND TRUTH BRIEF B: AI content tooling landscape and voice-fidelity reality, mid-2026 ===
${toolingBrief || '(recon failed -- do your own WebSearch to ground any market claim)'}
=== END BRIEFS ===

Treat these briefs as your grounding. Where a brief marks something UNVERIFIED, do not build a blocker finding on it alone -- instead make the verification itself the finding.
`

// ---------------------------------------------------------- Phase: Find/Refute

const LENSES = [
  {
    code: 'L1',
    label: 'cold-start-onboarding',
    name: 'Cold start and time to first post',
    brief: `Attack the onboarding path for a NON-TECHNICAL user. The PRD claims in §1.3 that the user "gets the repo, opens Claude Code, says Start" and in §12 that a stranger gets a publishable post "within 45 minutes of running setup, with no help from Joseph."

Walk the real path step by step and find every place it breaks for someone who has never used a terminal: getting Claude Code installed and authenticated, finding and cloning a GitHub repo, node and npm, Playwright and its browser binaries, knowing that skills exist, knowing what to type, what happens when the interview is interrupted, what happens when they close the laptop mid-setup.

Then attack the 45-minute claim directly. §6's stop condition requires 15 to 25 inventory items each an instance not a category, 3 to 5 corrected theses, voice extracted from real samples, plus a sample post they confirm sounds like them. Time that honestly. What is the real number? What is the abandonment rate at that length, and where exactly does a person quit?

Also attack: what does the engine do when the user has no writing samples, no company website, no palette, and only four inventory items because they gave up? Is there a graceful degraded mode, or does the engine just keep interviewing?`,
  },
  {
    code: 'L2',
    label: 'content-ceiling',
    name: 'Content quality ceiling',
    brief: `The hard requirement is content so good a skeptical senior reader stops scrolling and forwards it. Judge whether this architecture can actually produce that, or whether its ceiling is competent-and-forgettable.

Attack the generative core: §7's "angle generation = one inventory item, crossed with one thesis, aimed at one audience anxiety" and the instruction to generate 5 angles and let the human pick. Is a three-way crossing actually where great posts come from, or is it a combinatorial machine that reliably produces reasonable-but-flat output? What do genuinely excellent LinkedIn posts have that this crossing cannot generate? Name the missing ingredients precisely: tension, stakes, a named antagonist, an admission that costs the author something, a claim the reader disagrees with on first read, timing against something happening this week.

Attack §14's "Never invent a fact, number, story, or credential" and "One inventory item per post" against the quality goal. Does an inventory of 15 to 25 items constrain the engine to the person's greatest hits, producing a narrow catalog rather than range? Note that §14's no-exceptions rule directly contradicts the queued per-format counts and the carousel needing multiple items.

Attack the hook layer: 35 named hook patterns in reference/hooks.md. Does drawing from a fixed pattern library make output MORE templated, not less -- the same failure the PRD attacks Canva for in §10? Is there a lock on hook pattern reuse that actually prevents a reader from recognizing the machine?

Then say what you would change to raise the ceiling. Be specific about the mechanism, not the aspiration.`,
  },
  {
    code: 'L3',
    label: 'platform-reality',
    name: 'LinkedIn platform reality 2026',
    brief: `Grade the PRD against how LinkedIn actually distributes content right now, using Brief A.

Attack: the PRD's entire format portfolio is short post, carousel, infographic, article. Check that against current reach by format. If document/carousel reach has moved, or if native video or another format now dominates, the PRD is investing its largest build (§4 item 5, the Playwright render pipeline) in a declining surface. Say so with the evidence.

Attack §14's "No auto-post. Output is copy-paste." Price what that costs: posting time is a real reach variable, the first-60-minute engagement window matters, and a human copy-pasting when they get around to it forfeits scheduling. Is the no-auto-post rule right for safety and wrong for performance, and what is the middle option?

Attack what the PRD does not build at all. The comment surface is entirely absent from this engine even though it may be the highest-leverage reach lever on the platform, and Joseph apparently already has a separate daybreak-comment-engine (referenced in §15). Reply-to-commenter behavior, seeding the first comment, commenting on others' posts as a distribution strategy -- none of it is here. Is that a scope decision or a hole?

Attack the §12 growth math: 1.4k to 20k followers in six months, 1M cumulative impressions, at 4 posts a week. Is that achievable on current mechanics? What would actually have to be true? What is the honest number?

Attack reference/linkedin-algorithm.md as a design object: a markdown file "reviewed quarterly" describing a system that changes monthly, loaded at draft time as if it were fact. What is the failure mode when it goes stale, and how would the user ever know?`,
  },
  {
    code: 'L4',
    label: 'enforceability',
    name: 'Enforceability and determinism',
    brief: `The PRD's central promise in §3 is "an enforced mechanism, not a reminder." Attack whether any of it is actually enforced.

Every mechanism here is prose in a markdown file interpreted by a language model. Go through each §3 row and ask: what physically stops a model from skipping this? Specifically:
- The three locks in §3. Checking a 60-day anchor lock requires reading dates and comparing them. What happens when the model miscounts, or when the inventory file has 200 lines and it pattern-matches instead of checking? Is there any deterministic component?
- "Every draft is diffed against the last 20 shipped pieces. Any shared run of 8+ words, or more than ~15% sentence-level similarity." That is a real string algorithm. Who computes it? A model eyeballing similarity is not a diff. Does this need to be a script, and if so, where does it live and what runs it?
- The AI-tell gate in §9 includes "Flag if stdev of sentence length is low" with no threshold and no computation. Same problem.
- The single-router argument in §1.1 says a directly-entered format skill bypasses all three locks. But a user can also just ask Claude Code to write a LinkedIn post without invoking the skill at all, or invoke a workflow file directly. What actually prevents bypass?
- §7a says "only named commands write." What enforces that inside a single Claude session that has Write access to the whole directory?

Then: state integrity. runs/index.md, posts.csv, and the used: dates are the entire memory of this system, appended by a model. What happens when an append is malformed, a run crashes after drafting but before logging, or the user edits a file by hand? Is there any validation, any recovery, any way to detect that the memory has silently diverged from reality?

Recommend the minimum set of deterministic components -- scripts, structured files, validators -- that would make §3 true rather than aspirational. Keep the recommendation cheap; do not turn this into a database.`,
  },
  {
    code: 'L5',
    label: 'token-economics',
    name: 'Token economics and Pro-plan viability',
    brief: `Audit the token claims. §4 item 9 targets roughly 15k tokens for a short post run and 35 to 50k for a carousel, and asserts the engine must be usable on a Claude Pro plan.

Build a real bottom-up estimate. Enumerate what a short-post run must load: SKILL.md router, reference/pipeline files for the three shared steps, identity.md, voice.md, thesis.md, audience.md, learnings.md, the inventory index, ai-tells.md (§9 alone is a long list and it is described as only a seed that grows forever), hooks.md at 35 named patterns, linkedin-algorithm.md, plus the last 20 shipped pieces for the verbatim diff, plus the drafting, plus the gate rewrite, plus the diff report. Estimate each. Does 15k survive contact?

Note especially: §3 requires diffing every draft against the last 20 shipped pieces. Twenty full LinkedIn posts is real token weight loaded on every single run, and it grows.

Then attack the setup interview cost. §6 requires 15 to 25 extracted items, fetching 3 to 5 posts from an inspiration creator, palette lookup from a website, and iterating a sample post to yes. That is a long multi-turn conversation. Estimate the total and say whether it fits a Pro plan's limits in one sitting, and what happens when the user hits a limit mid-interview and the context compacts.

Attack the carousel path: iterating slide HTML, the design gate, and the render-look-adjust loop §10 explicitly wants. If the model never looks at a rendered image, how does render-look-adjust work at all? If it does look, price it.

Give a defensible target range for each format, name where the budget actually goes, and name the three highest-leverage cuts. Be honest if Pro-viability requires cutting something the PRD currently treats as non-negotiable.`,
  },
  {
    code: 'L6',
    label: 'longitudinal-decay',
    name: 'Longitudinal decay: week 3 to month 6',
    brief: `Everything in this PRD is designed for the first run. Attack month three.

Do the inventory arithmetic explicitly. §12 targets 4 posts a week. Every post consumes an anchor item (§14) locked 60 days (§3). Setup seeds 15 to 25 items. Compute the exact week at which the engine runs out of legal anchors, assuming the top-up interview yields a realistic number of new items per week. State the week number. Then ask what the engine does that week -- §7 says it "says the inventory is thin and runs a top-up interview," which means the user is now being interviewed to feed the machine rather than served by it. Name that inversion and price it.

Attack the top-up itself: "after each run, offer a two-minute top-up: anything happen this week worth writing down?" What is the honest yield of that question in week 8 for someone whose week was ordinary? Does the engine have any way to manufacture legitimate new inventory -- from their calendar, their Slack, a customer call, an article they reacted to -- or is it fully dependent on unprompted recall?

Attack learnings.md as a slow poison. §11 writes hypotheses about what performs, loads them at draft time, and caps the risk with "one post in five ignores the learnings." Is one in five enough to prevent convergence? What does a profile look like at month six if the learnings are wrong, or right about a local maximum?

Attack voice drift in both directions: the gate rewrites toward its own preferences run after run, and §12 rewards a 70%-zero-human-edit rate. Over 100 posts, does the voice converge on the model's taste while the metric reports success? Name the instrument that would catch it.

Attack staleness: §3 flags any file past 60 days at run start. After six months every file is perpetually flagged and the user has learned to ignore the warning. What replaces it?

Attack archive and file growth: §7's 400-line trigger, retirement eligibility requiring a logged performance number, and the fact that §11's analytics loop is post-MVP -- meaning during MVP no performance numbers exist, so nothing is ever eligible to retire. Confirm or refute that deadlock.`,
  },
  {
    code: 'L7',
    label: 'gate-collateral',
    name: 'The gate as a liability',
    brief: `§9 calls ai-tells.md "the single highest-value asset in the repo." Attack it as a liability.

Go through the seed list and find every rule that will damage good writing. Concretely: "Em dash and en dash. Zero tolerance." "Rule of three in any list where three wasn't required." "Antithesis: it's not X, it's Y." "No fragments anywhere. Humans use fragments" -- note this is written as a tell but reads as a requirement, which is ambiguous, and consider whether the ambiguity is a real spec defect. "Uniform sentence length ... Flag if stdev of sentence length is low" with no threshold. Banned lexical items including navigate, leverage, landscape, realm -- some of which have legitimate literal uses.

Then attack the deeper problem: a blocklist of AI tells is a trailing indicator. It catches the previous generation of model output. §9's maintenance model is "when Joseph spots a new tell in the wild, he says so and it gets appended. The list only grows." A monotonically growing blocklist maintained by one person's noticing, applied by the same model family that generates the tells. Is the gate structurally capable of catching current-generation tells, or does it only catch 2024-era ones while the actual 2026 tells pass through untouched? Use Brief B on what sophisticated readers notice now. Name the 2026 tells this list misses.

Attack the mechanism: "catch, rewrite, then show a diff." A model rewriting to escape a blocklist produces avoidance artifacts -- writing contorted around forbidden constructions, which is its own detectable signature. Is there a point at which the gate makes output MORE identifiably machine-made? What replaces or supplements a blocklist -- a positive voice fingerprint from the person's real samples, measured deviation from it, adversarial detection, something else?

Attack §12's metric "percentage shipped with zero human edits to the language (target 70%+ by week 4)" as a proxy for voice fidelity. What behavior does that metric actually reward?`,
  },
  {
    code: 'L8',
    label: 'differentiation',
    name: 'Differentiation and alternative cost',
    brief: `Answer the question a VP asks in the first two minutes: why would anyone use this instead of the cheap alternative?

Use Brief B. Compare honestly against: a single well-written Claude Project or custom GPT with the person's material pasted in; Taplio and Shield and the rest of the incumbent tools; and a person just writing their own posts with light AI help.

§4 asserts "three things make this beat a plain ChatGPT prompt: the gate, the inventory, and the repetition guard." Test that assertion. For each of the three, ask whether a good prompt plus a pasted document actually fails at it, and by how much. Be honest where the PRD is right and brutal where it is flattering itself.

Then attack the distribution of the engine itself. §2 says the secondary audience is "anyone outside Daybreak," and §1 says "anyone can install it." A GitHub repo requiring Claude Code, a terminal, node, and Playwright has an addressable audience. Estimate it honestly. If the answer is that the real audience is Joseph plus three colleagues plus a handful of technical friends, then every portability cost in this PRD is being paid for a user who will not arrive -- and that changes what should be built. Make that argument or refute it.

Attack the strategic risk: what happens to this engine when Claude ships native long-term memory and voice-matching that makes the profile files redundant? Which parts of this PRD are durable and which are a wrapper around a temporary model limitation? Name them specifically.

Finally: what is the one thing this engine could do that no alternative can, and is the PRD actually building it? If it is not, say what it should be building instead.`,
  },
  {
    code: 'L9',
    label: 'measurement-rigor',
    name: 'Measurement rigor and the learning loop',
    brief: `Attack §11 and §12 as an analyst would.

Attack the score: engagement_score = comments x 3 + reposts x 2 + reactions x 1, divided by follower count at time of posting. Are those weights defensible or invented? Note that dividing by follower count when followers are growing from 1.4k to 20k means the denominator moves 14x over the measurement period, and the vast majority of LinkedIn reach is not from followers at all. Does normalizing by followers do what §11 claims -- keep account growth from reading as content improvement -- or does it actively corrupt the comparison? Propose a better denominator or say why none is available.

Attack the learning threshold: "a pattern qualifies when it holds across at least 5 posts on each side of the comparison, or when a single post beats the trailing 20-post median by 2x or more." At 4 posts a week, compute how long it takes to accumulate 5 posts on each side of even one comparison, and how many candidate variables §11 lists (hook pattern, inventory item type, format, opening line length, presence of a number, day, time). With that many variables and that few observations, what is the false-discovery rate? Is the second clause -- a single post beating the median by 2x -- a hole that lets pure variance in as a finding, given that LinkedIn engagement is heavy-tailed and one lucky repost by a big account produces exactly that?

Attack attribution: every post differs from every other post on every variable at once. There is no held-out variable. Can this loop ever learn anything causal? If not, say what it CAN honestly do, and what the PRD should promise instead.

Attack §12's leading indicators one at a time for gameability. Especially "gate catch rate trending down over time, which means the drafting model is internalizing the constraints" -- name at least two other explanations for a falling catch rate that are not learning.

Attack the data plumbing: the engine has no impressions during MVP, §11 is post-MVP, but §7's inventory schema has a performance field and §7's retirement rule requires a logged performance number. Trace what actually gets logged during MVP and what breaks downstream.`,
  },
  {
    code: 'L10',
    label: 'spec-integrity',
    name: 'Spec integrity and undefined behavior',
    brief: `Read the PRD as a contract that someone else has to implement without asking questions. Find every contradiction, gap, and undefined behavior. Be exhaustive and mechanical.

Known starting points to confirm and extend:
- §13 puts the render pipeline at step 5, but §6 requires setup to "show two rendered examples rather than describing the options" and write theme.json. Setup cannot render before the renderer exists.
- §14 says "One inventory item per post, named in the brief. No exceptions" while §3 and the carousel design imply multiple items, and revision note 2 says per-format counts are queued.
- §5 places runs/ and analytics/ at repo root while §1.3 and §12 require every run to write only inside profiles/<handle>/.
- §5's tree is missing workflows/, reference/pipeline/, hooks.md is listed in §5 but inventory-prompts.md is not, and §1.2 lists files §5 omits.
- §3 says "runs older than 30 days archive automatically" while §7a says only named commands write to a profile and a draft run never modifies one. If runs live inside the profile, what archives them, and does that violate the write rule?

Then go find the rest yourself. Look for: commands in §8 with no defined behavior anywhere (review, inventory, as <handle>, what happens with an unknown handle); the learnings.md schema, which is loaded at draft time but never specified; theme.json's actual token list, never specified; brief.md and gate-report.md formats, never specified; runs/index.md, referenced in §4 but absent from the §5 tree; what "review" workflow means in §1.2 versus §8; the structural job taxonomy in §3 with no definition of what each job means or how a run picks one; the hook pattern names required for the thesis-x-hook lock, which §5 does not say hooks.md contains; error and interruption behavior anywhere in the document; and what happens on a second profile for the same person.

For each finding, state the ambiguity, what an implementer would guess, and what the resolution should be. Rank by how much rework the ambiguity causes if guessed wrong.`,
  },
  {
    code: 'L11',
    label: 'multi-persona',
    name: 'Multi-persona, team, and company page',
    brief: `§2 names four accounts on day one: Joseph, Fallon, Tim, and the Daybreak company page. §15 leaves their structure open. Attack that.

Attack the collision problem, which the PRD never mentions: Joseph, Fallon, and Tim work at the same company and share source material -- the same customers, the same launches, the same internal numbers. All three locks in §3 are scoped to a single profile directory. Nothing stops Fallon posting the same customer story Joseph posted on Tuesday, or all three arguing the same thesis in the same week. On a platform where their audiences overlap heavily, that is a visible and embarrassing failure. Design the cross-profile mechanism, and be careful: it must not require a shared server or break the portability model in §1.

Attack the company page as a profile. §7's inventory is built from personal instances -- "a story from before this job," "what did you believe six months ago." A company page has no personal history, no single voice, and different distribution mechanics. Does the profile schema even apply? What actually changes for a Page, and is treating it as just another profiles/<handle>/ directory correct or a category error?

Attack the org layer question in §15 concretely. Recommend one structure, with the file layout, and state what breaks in the other.

Attack the review-before-publish question in §15: with three people and a company page, who approves, and does the engine have any concept of a draft awaiting another human's review? Right now output is copy-paste to an individual, which means there is no review surface at all.

Attack the agency and multi-tenant case: if this works, someone will run it for ten clients. What breaks first at ten profiles?`,
  },
  {
    code: 'L12',
    label: 'loop-ergonomics',
    name: 'The daily loop and its ergonomics',
    brief: `Attack what using this actually feels like on a Tuesday, four times a week, for six months. The requirement is that it be a breeze.

Trace the ceremony the PRD mandates for one short post: staleness flags at run start, lock checks, 5 angles presented and a human pick, a draft plus two alternate hooks (§14 "Never show one draft"), a gate diff report explaining what changed and why, a log step, and a top-up interview offer at the end. Count the human decision points. Count the reading the human has to do before they get a post. Is that a breeze or is it homework? §8 claims the default "should feel like one keystroke to a finished post" -- reconcile that with the mandated ceremony or declare it a contradiction.

Attack the 5-angle menu specifically. Choosing between 5 angles is real cognitive load, four times a week, forever. Does the human actually add value at that step, or is it a decision the engine should make with a single opt-out? Note the tension with §3's "not agentic" row, which demands "one command goes idea to finished asset ... without being re-prompted at each step," and §14's rule forcing a human pick. Those two rules contradict. Resolve it.

Attack the gate-report.md diff as a deliverable. Who reads a diff of what the gate rewrote, on the fourth post of the week? If nobody reads it, it is a token cost and a file that accumulates. What should it be instead?

Attack the failure ergonomics: what does the user see and do when the engine refuses -- inventory thin, all anchors locked, repurpose blocked, a gate that cannot pass after three rewrites? A refusal on a Tuesday morning when the person just wanted to post is the single most likely churn moment in this entire product. The PRD has no defined behavior for a hard stop. Design it.

Then design the version of the daily loop that is actually a breeze, and say explicitly which PRD rules you are breaking to get there.`,
  },
]

phase('Find')

const lensResults = await pipeline(
  LENSES,
  (lens) => agent(`${PERSONA}

Read the PRD in full before you write anything: ${PRD}

${RECON}

YOUR LENS: ${lens.name}

${lens.brief}

Produce between 4 and 10 findings. Quality over count -- do not pad to hit a number, and do not split one defect into three findings. Every finding must be something a competent implementer would change their plan because of.

Reserve "blocker" for defects that make the product fail at one of its two stated requirements (a breeze to use / content that earns respect from senior readers) or that cause significant rework if discovered later. Be sparing with it.

Number your findings ${lens.code}-01, ${lens.code}-02, and so on.`, {
    label: `find:${lens.label}`,
    phase: 'Find',
    schema: FINDINGS_SCHEMA,
  }),

  (found, lens) => {
    if (!found || !found.findings || !found.findings.length) return { lens, found, verdicts: [] }
    return agent(`${PERSONA}

You are the skeptic. Another reviewer produced the findings below about this PRD: ${PRD}

Read the PRD yourself first. Your job is to KILL findings that do not survive scrutiny. You are rewarded for refutations, not for agreement. Default to skepticism.

For each finding, decide:
- "refuted" -- the PRD already handles this (quote the exact text that does), or the reasoning is wrong, or the failure scenario would not actually occur.
- "overstated" -- there is something real here but the severity is inflated or the claim overreaches. Correct it.
- "confirmed" -- it holds. Only after you genuinely tried to break it.

Also judge each recommendation against the two product requirements: a breeze to use for technical and non-technical people, and content that earns respect from skeptical senior readers. If a recommendation would fix the defect but make the product materially worse to use, say so in your reasoning and supply a better fix in sharpened_recommendation. Reviewers systematically over-recommend process; strip that out.

Findings to judge:
${JSON.stringify(found.findings, null, 1)}

Return a verdict for every id. Do not skip any.`, {
      label: `refute:${lens.label}`,
      phase: 'Refute',
      schema: VERDICT_SCHEMA,
    }).then((v) => ({ lens, found, verdicts: (v && v.verdicts) || [] }))
  },
)

// ---------------------------------------------------- Merge survivors

const survivors = []
const lensVerdicts = []
let refutedCount = 0

for (const r of lensResults) {
  if (!r || !r.found) continue
  lensVerdicts.push({ lens: r.lens.name, code: r.lens.code, verdict: r.found.lens_verdict })
  const byId = {}
  for (const v of r.verdicts) byId[v.id] = v
  for (const f of r.found.findings) {
    const v = byId[f.id]
    if (v && v.verdict === 'refuted') { refutedCount++; continue }
    survivors.push({
      ...f,
      lens: r.lens.name,
      lens_code: r.lens.code,
      severity: (v && v.corrected_severity) || f.severity,
      recommendation: (v && v.sharpened_recommendation) || f.recommendation,
      verdict: (v && v.verdict) || 'unverified',
      skeptic_note: (v && v.reasoning) || '',
    })
  }
}

log(`${survivors.length} findings survived refutation; ${refutedCount} killed. Consolidating.`)

// ------------------------------------------------------- Phase: Consolidate

phase('Consolidate')

const CONSOLIDATED_SCHEMA = {
  type: 'object',
  properties: {
    duplicate_groups: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          keep_id: { type: 'string' },
          merge_ids: { type: 'array', items: { type: 'string' } },
          merged_title: { type: 'string' },
          merged_claim: { type: 'string' },
          merged_recommendation: { type: 'string' },
        },
        required: ['keep_id', 'merge_ids', 'merged_title', 'merged_claim', 'merged_recommendation'],
      },
    },
    contradictions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ids: { type: 'array', items: { type: 'string' } },
          tension: { type: 'string' },
          resolution: { type: 'string', description: 'Which side wins and why, or the synthesis that satisfies both' },
        },
        required: ['ids', 'tension', 'resolution'],
      },
    },
    top_ranked: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          rank: { type: 'number' },
          id: { type: 'string' },
          why_this_rank: { type: 'string' },
        },
        required: ['rank', 'id', 'why_this_rank'],
      },
      description: 'The 15 findings that matter most, ranked 1 to 15 by damage-if-ignored',
    },
    verdict: { type: 'string', description: 'Three paragraphs. Does this PRD, as written, produce a product that is a breeze to use and produces content that earns respect? What is structurally right about it? What is the single change with the most leverage?' },
  },
  required: ['duplicate_groups', 'contradictions', 'top_ranked', 'verdict'],
}

const consolidated = await agent(`${PERSONA}

Twelve independent reviewers attacked this PRD from twelve lenses: ${PRD}

Read the PRD. Then consolidate their surviving findings.

Per-lens summary verdicts:
${JSON.stringify(lensVerdicts, null, 1)}

All surviving findings:
${JSON.stringify(survivors, null, 1)}

Do four things:

1. DEDUPLICATE. Different lenses will have found the same defect from different angles. Group them. For each group, pick the id with the sharpest framing to keep, list the others as merged, and write a merged title, claim, and recommendation that is better than any single version. Only group things that are genuinely the same defect -- two findings about the same PRD section are not automatically duplicates.

2. FIND CONTRADICTIONS between findings. Reviewers optimizing for different things will have recommended incompatible fixes -- for example, one lens wants less human involvement for ergonomics while another wants more human judgment for quality; one wants the gate strengthened while another wants it weakened. Name each real tension and resolve it. A resolution that just says "balance both" is a failure; pick a side or name the specific synthesis.

3. RANK the top 15 by damage-if-ignored -- how much this defect costs if it ships unfixed, weighted by how likely it is to actually bite. Not by how interesting it is.

4. Write the overall verdict.

Be willing to conclude that a highly-rated finding is actually minor, and that something the reviewers ranked low is the real problem.`, {
  label: 'consolidate',
  phase: 'Consolidate',
  schema: CONSOLIDATED_SCHEMA,
})

// ------------------------------------------------------------- Phase: Gaps

phase('Gaps')

const GAPS_SCHEMA = {
  type: 'object',
  properties: {
    gaps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          area: { type: 'string' },
          why_it_matters: { type: 'string' },
          investigation_brief: { type: 'string', description: 'A full adversarial brief, written the way the twelve lens briefs were written, that another reviewer can execute directly' },
        },
        required: ['area', 'why_it_matters', 'investigation_brief'],
      },
      description: 'At most 3. Only genuine blind spots, not thin coverage of ground already covered.',
    },
  },
  required: ['gaps'],
}

const critic = await agent(`${PERSONA}

Read this PRD: ${PRD}

Twelve lenses have already reviewed it: cold-start onboarding, content quality ceiling, LinkedIn platform reality, enforceability and determinism, token economics, longitudinal decay, the AI-tell gate as a liability, competitive differentiation, measurement rigor, spec integrity, multi-persona and team use, and daily-loop ergonomics.

Here is what they collectively found, deduplicated and ranked:
${JSON.stringify({ top: consolidated && consolidated.top_ranked, contradictions: consolidated && consolidated.contradictions, all: survivors.map((s) => ({ id: s.id, title: s.title, sections: s.sections, severity: s.severity })) }, null, 1)}

Your job is the question those twelve did not think to ask. Name at most three genuine blind spots -- dimensions of this product where a serious failure could occur and no lens looked.

Think about what is missing entirely rather than under-examined. Candidates worth considering, though do not limit yourself to these: legal, privacy, and confidentiality (this engine ingests a person's unpublished customer stories and internal numbers into files in a git repo, and §7's inventory explicitly wants named customer specifics -- what happens when someone commits it, or writes about a customer who did not consent, or an employee builds a profile on company IP and then leaves); the reputational blast radius of one bad post published in someone's real name under their real credentials, and whether any part of this engine is accountable for a claim that turns out to be false; what happens to the profile when the person changes jobs; whether the engine has any concept of not posting; the second-order effect on the person themselves of outsourcing their voice; whether the PRD's own success metrics would be satisfied by a product the user quietly hates.

If a candidate area is genuinely already covered by the findings above, do not include it. Returning two real gaps beats three padded ones. Returning zero is acceptable if the coverage is truly complete -- but look hard first.

For each gap, write an investigation_brief detailed and specific enough that another reviewer can execute it against this PRD without further instruction.`, {
  label: 'completeness-critic',
  phase: 'Gaps',
  schema: GAPS_SCHEMA,
})

const gapFindings = []
if (critic && critic.gaps && critic.gaps.length) {
  log(`Critic named ${critic.gaps.length} blind spot(s). Running gap finders.`)
  const gapResults = await parallel(
    critic.gaps.slice(0, 3).map((g, i) => () =>
      agent(`${PERSONA}

Read the PRD in full: ${PRD}

${RECON}

YOUR LENS: ${g.area}

Why this matters: ${g.why_it_matters}

${g.investigation_brief}

Produce between 3 and 8 findings. Number them G${i + 1}-01, G${i + 1}-02, and so on. Same standards as any other lens: specific to this document, concrete failure scenarios, implementable recommendations, no generic advice, and price any friction your fix adds.`, {
        label: `gap:${g.area.slice(0, 28)}`,
        phase: 'Gaps',
        schema: FINDINGS_SCHEMA,
      }),
    ),
  )
  for (let i = 0; i < gapResults.length; i++) {
    const r = gapResults[i]
    if (!r || !r.findings) continue
    for (const f of r.findings) {
      gapFindings.push({ ...f, lens: critic.gaps[i].area, lens_code: `G${i + 1}`, verdict: 'unverified', skeptic_note: '' })
    }
  }
  log(`Gap finders added ${gapFindings.length} findings.`)
}

const allFindings = survivors.concat(gapFindings)

// ------------------------------------------------------------ Phase: Draft

phase('Draft')

const PAYLOAD = JSON.stringify({
  findings: allFindings,
  lens_verdicts: lensVerdicts,
  duplicate_groups: consolidated && consolidated.duplicate_groups,
  contradictions: consolidated && consolidated.contradictions,
  top_ranked: consolidated && consolidated.top_ranked,
  overall_verdict: consolidated && consolidated.verdict,
  gap_areas: (critic && critic.gaps && critic.gaps.map((g) => ({ area: g.area, why: g.why_it_matters }))) || [],
}, null, 1)

const [reviewDoc, fixesDoc] = await parallel([
  () => agent(`Write the review document for the Content Engine PRD adversarial review.

Read the PRD first so your section references are correct: ${PRD}

Write the file to exactly this path: ${DIR}/content-engine-REVIEW.md

Here is the full reviewed material -- twelve adversarial lenses, per-lens refutation verdicts, deduplication groups, cross-lens contradictions, rankings, and gap-finder output:
${PAYLOAD}

Requirements for the document:

- Open with a dated header and a one-paragraph note on method: twelve adversarial lenses, each finding independently attacked by a skeptic, findings that did not survive were dropped, then deduplicated and ranked. State the counts.
- Then a section titled "The verdict" carrying the overall verdict, edited for tightness.
- Then "The fifteen that matter" -- the ranked top findings, each as a compact entry: id, title, severity, PRD sections, the claim, the failure scenario, and the fix. Keep each to a tight block a reader can absorb in 20 seconds.
- Then "Contradictions the reviewers could not both have" -- the cross-lens tensions and how each resolves. This is one of the most valuable sections; do not compress it into bullets.
- Then "Full findings by lens" -- every remaining finding, grouped under its lens heading, each with id, severity, sections, claim, failure scenario, recommendation. Apply the deduplication groups: where findings were merged, present the merged version once under the lens of the kept id and note the merged ids inline. Do not silently drop anything that was not refuted.
- Then "What no lens found until asked" -- the gap areas and their findings, if any.
- Close with "Where the PRD is right" -- an honest, specific list of what this document gets structurally correct and should not be touched. Not a courtesy section; a real one. If a reviewer's finding was refuted because the PRD already handled it well, that belongs here.

Style rules, follow them exactly:
- No em dashes or en dashes anywhere. Use commas, periods, or restructure. This document is being read by someone whose product bans them.
- No "it's not X, it's Y" constructions. No rule-of-three lists unless three is what there is. No "The result?" or "Here's the thing." Do not open with "I've been thinking about."
- Markdown tables are welcome where they compress well. Vary sentence length. Write like a senior operator writing to a peer, not like a consultant.
- Every severity label and section reference must match the source data. Do not invent findings, do not invent numbers, and do not soften a finding to make the document pleasant.

Length is whatever completeness requires. Do not truncate the full findings section to save space.

After writing the file, return only a two-line summary: the path and the finding count you wrote.`, { label: 'write:review-doc', phase: 'Draft' }),

  () => agent(`Write the action document for the Content Engine PRD adversarial review.

Read the PRD first, closely, especially §4 and §13 which hold the current MVP scope and build order: ${PRD}

Write the file to exactly this path: ${DIR}/content-engine-FIXES.md

Here is the full reviewed material from twelve adversarial lenses, with refutation verdicts, contradictions, rankings, and gap findings:
${PAYLOAD}

This document is not a findings list. The findings live in content-engine-REVIEW.md. This one answers: what do I change, in what order, and what do I decide myself?

Structure it as:

1. **Header and a five-line orientation.** What this file is, what it is not, and how to use it alongside the review.

2. **Fix now, before any code.** The changes to the PRD itself that must land before implementation starts, because guessing wrong causes rework. For each: the PRD section, what it says now, what it should say, and one sentence on why. Write the replacement language where it is short enough to write. Be concrete enough that someone could apply these as edits.

3. **The revised build order.** §13 and §4 currently hold a build order the review found problems with, including a setup-versus-render sequencing conflict and mechanisms that cannot be enforced by prose alone. Produce a corrected build order as a numbered sequence, with what gates what, and mark which steps are new versus already in §4. Where the review found that something needs a deterministic script rather than a markdown rule, name the script and where it lives.

4. **Fix during build.** Things that must be true by the time a given step lands, but do not need a PRD edit today. Group by build step.

5. **Deliberate deferrals.** Real findings that should NOT be fixed now, with the reason. A review that recommends everything recommends nothing. Be willing to say "this is real and you should ship without fixing it, here is the trigger that changes that."

6. **Decisions only Joseph can make.** The open calls that are genuinely his: taste, risk appetite, scope, who this is for. Frame each as a question with the options and their consequences, and give your recommendation with reasoning. Fold in §15's existing open decisions where the review bears on them. Do not pad this section with things the review already answered.

7. **The five numbers to instrument first.** What has to get measured from run one, and the threshold that would tell him something is wrong. Tie each to a specific finding.

Style rules, follow them exactly:
- No em dashes or en dashes anywhere. Use commas, periods, or restructure.
- No "it's not X, it's Y" constructions, no rule-of-three padding, no "The result?" or "Here's the thing."
- Every recommendation must be specific and implementable. If you cannot make it specific, cut it.
- Where two findings recommended incompatible fixes, this document takes a position. Say which and why. Do not present both and leave it open unless it genuinely belongs in section 6.
- Reference finding ids so a reader can trace any recommendation back to the review document.
- Do not invent numbers. Where a threshold is needed and unknown, say what to measure to set it.

After writing the file, return only a two-line summary: the path and the number of fix items you wrote.`, { label: 'write:fixes-doc', phase: 'Draft' }),
])

return {
  findings_total: allFindings.length,
  refuted_and_dropped: refutedCount,
  lenses_run: LENSES.length,
  gap_lenses: (critic && critic.gaps && critic.gaps.length) || 0,
  gap_findings: gapFindings.length,
  contradictions: (consolidated && consolidated.contradictions && consolidated.contradictions.length) || 0,
  blockers: allFindings.filter((f) => f.severity === 'blocker').length,
  majors: allFindings.filter((f) => f.severity === 'major').length,
  top_ranked: consolidated && consolidated.top_ranked,
  overall_verdict: consolidated && consolidated.verdict,
  docs: [reviewDoc, fixesDoc],
}
