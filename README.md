# TDP Practice OA

A self-contained, browser-based practice simulation of the hiring pipeline
candidates report for **Capital One's Technology Development Program (TDP)**:
an untimed situational-judgment round (matching the real "Virtual Job Tryout"
step), a timed coding round (matching the real CodeSignal step), and — if you
clear those — prep for the onsite "Power Day" loop that follows.

**This is an unofficial, fan-made study tool.** It is not affiliated with,
endorsed by, or sourced from Capital One. All scenarios, problems, and
questions are original content written to match the *style and format*
candidates have publicly described — they are not real exam questions, and
passing this practice tool is not a guarantee of anything about the real
assessment. Capital One's own candidate emails explicitly prohibit using
generative AI or outside assistance *during* the actual assessments — this
tool is meant for practice beforehand, not for use during the real thing.

## Running it

No build step or install needed — it's plain HTML/CSS/JS.

```
open index.html          # macOS
# or just double-click index.html
```

If your browser restricts `file://` pages, serve it locally instead:

```
python3 -m http.server 8000
# then visit http://localhost:8000
```

## What's inside

- **A 60-question practice bank.** 20 situational-judgment scenarios, 20
  behavioral questions (12 STAR + 8 motivation), and 20 coding problems (5
  variants across each of the 4 difficulty slots) — enough variety that
  repeated practice runs rarely look the same twice.
- **Round 1 — Situational Judgment (untimed).** Each run draws 8 scenarios
  from the 20-scenario pool. For each, you pick the response you think is
  most effective and the one you think is least effective — the common
  "most/least" format real situational-judgment tests use, matching the
  "Virtual Job Tryout" step Capital One's OA invite email describes. Covers
  competencies like ownership, customer focus, integrity/risk-awareness,
  adaptability, delegation, handling pressure, and more.
- **Round 2 — Coding (70 min, 100 pts).** Each run draws one problem per
  difficulty slot (Easy/Easy/Medium/Hard) from a 20-problem bank themed
  around bank transactions, statement formatting, account/budget/bill
  management classes, and ATM/login/workflow state machines. Your code runs
  in a sandboxed Web Worker against visible and hidden test cases (with a
  timeout, so an infinite loop can't hang the page).
- **OA Results screen** with separate situational-judgment and coding scores,
  a per-scenario breakdown (your pick vs. the recommended most/least
  effective response), and a per-problem coding breakdown.
- **Power Day Prep.** Candidate reports describe an onsite loop after the OA:
  1 behavioral interview, 2 (lighter, live) coding interviews, and 1 case
  interview. This section gives you a way to re-run the behavioral and coding
  practice, plus a short case-interview framework (Clarify → Structure →
  Analyze → Recommend → Sanity-check) with a sample prompt to practice out
  loud.
- **Behavioral practice (used from Power Day Prep).** Each run draws 10
  questions (6 STAR + 4 motivation/mini-case) from the 20-question pool.
  Each question gives 30 seconds of silent prep time, then a timed typed
  response window, mirroring a "prep, then answer" interview structure.
  Answers are self-graded at the end against a Situation/Task/Action/Result
  checklist.
- **OA Bucks & Reward Shop.** Purely cosmetic gamification, scaled so a full
  practice run can earn up to **$60**: $3 for every situational scenario you
  get fully right (Most *and* Least correct, up to $24), $4–$8 for every
  coding problem you fully solve depending on difficulty (up to $24), an up
  to $8 speed bonus for finishing coding with time to spare, and $4 for
  completing a Power Day behavioral practice. Spend the balance on 16 cute
  emoji "companions" in the Reward Shop, from a $8 coffee up to a $60 "TDP
  Offer Trophy." Balance and collection persist in `localStorage`, so they
  carry over between practice runs in the same browser — nothing here
  affects your actual score.
- **Goals.** Six achievement-style goals (first run, strong situational score,
  strong coding score, a Power Day behavioral practice, collecting 3 shop
  items, 3 full practice runs) that each pay a one-time OA Bucks bonus the
  moment you hit them. Progress persists in `localStorage`.
- **Date & deadline banner.** Shows today's date and a live countdown to an
  editable application deadline on the home screen.

## Why it's built this way (sources)

The format modeled here — an untimed multiple-choice situational-judgment
assessment, a CodeSignal-based coding OA with bank/business "string,
simulation, state-machine" flavored problems (explicitly *not* LeetCode-style
graph/DP puzzles) across four questions of increasing difficulty, and an
onsite "Power Day" loop of behavioral + coding + case interviews — is a
synthesis of public candidate reports and a real Capital One recruiting email
describing the "Virtual Job Tryout" + CodeSignal OA structure, primarily:

- Blind (teamblind.com) threads discussing Capital One's HackerRank/CodeSignal
  OA, scoring, and question style.
- Interview-prep write-ups (e.g. InterviewFox, FinalRound AI, OA VO Service,
  RoadToOffer) summarizing recent candidate experiences with Capital One's
  CodeSignal GCA, Virtual Job Tryout, and Power Day onsite loop.

None of the actual scenario text, problem text, test data, or interview
questions in this repo were copied from any of those sources, or from any
real Capital One assessment content — everything here is original, written
only to match the reported *shape* (format, difficulty spread, timing,
question categories) of the real process.

## Customizing

- Add/edit coding problems in `data/problems.js`. Each problem needs an
  `entryName`, a `callTemplate` (a snippet that calls into whatever the
  candidate writes, with `__INPUT__` substituted per test case), a `reward`
  (OA Bucks paid for fully solving it), and a list of `tests` (`hidden: true`
  tests aren't shown to the user in detail). `window.PROBLEM_SLOTS` groups
  variants by difficulty; add a new variant to a slot's array to grow the
  bank further, and give it the same `points`/`reward` as its slot so a run's
  total stays consistent no matter which variant gets picked.
- Add/edit situational judgment scenarios in `data/situational.js`. Each
  scenario needs 4 `options`, each with a unique `rank` (1 = most effective,
  4 = least effective).
- Add/edit behavioral questions in `data/behavioral.js`.
- Timing constants live in `js/app.js` (`CODING_SECONDS`) and
  `js/behavioralUI.js` (`THINK_SECONDS`, `ANSWER_SECONDS`). The situational
  round is untimed by design, matching the real Virtual Job Tryout (though
  a stopwatch tracks how long you spend, just for your own info).
- Add/edit reward-shop items in `data/shop.js`. Wallet balance and ownership
  are managed by `js/wallet.js` (`window.OAWallet`), stored under the
  `tdpPracticeWallet` `localStorage` key.
