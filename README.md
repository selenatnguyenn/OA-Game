# TDP Practice OA

A self-contained, browser-based practice simulation of the online assessment
format that candidates commonly report for **Capital One's Technology
Development Program (TDP)**: a timed coding round followed by a HireVue-style
timed behavioral round.

**This is an unofficial, fan-made study tool.** It is not affiliated with,
endorsed by, or sourced from Capital One. All problems and questions are
original content written to match the *style and difficulty pattern*
candidates have publicly described — they are not real exam questions, and
passing this practice tool is not a guarantee of anything about the real
assessment.

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

- **Round 1 — Coding (70 min, 100 pts).** Four problems (Easy/Easy/Medium/Hard)
  themed around bank transactions, statement formatting, an account-management
  class, and an ATM state machine. Your code runs in a sandboxed Web Worker
  against visible and hidden test cases (with a timeout, so an infinite loop
  can't hang the page).
- **Round 2 — Behavioral (HireVue-style).** Ten questions across two sections
  (STAR behavioral + motivation/mini-case). Each question gives 30 seconds of
  silent prep time, then a timed typed response window, mirroring the
  "prep, then it auto-records" structure candidates describe. Answers are
  self-graded at the end against a Situation/Task/Action/Result checklist.
- **Results screen** with a coding score/percentage, time used, a per-problem
  breakdown, and your behavioral answers for self-review.

## Why it's built this way (sources)

The format modeled here — CodeSignal-based coding OA with bank/business
"string, simulation, state-machine" flavored problems (explicitly *not*
LeetCode-style graph/DP puzzles), roughly a 70-minute window across four
questions of increasing difficulty, and a separate HireVue behavioral stage
with STAR-format "tell me about a time…" questions plus motivation/mini-case
questions — is a synthesis of public candidate reports, primarily:

- Blind (teamblind.com) threads discussing Capital One's HackerRank/CodeSignal
  OA, scoring, and question style.
- Interview-prep write-ups (e.g. InterviewFox, FinalRound AI, OA VO Service,
  RoadToOffer) summarizing recent candidate experiences with Capital One's
  CodeSignal GCA and HireVue rounds.

None of the actual problem text, test data, or interview questions in this
repo were copied from any of those sources — the four coding problems and ten
behavioral prompts here are original, written only to match the reported
*shape* (topic themes, difficulty spread, timing, question categories) of the
real process.

## Customizing

- Add/edit coding problems in `data/problems.js`. Each problem needs an
  `entryName`, a `callTemplate` (a snippet that calls into whatever the
  candidate writes, with `__INPUT__` substituted per test case), and a list of
  `tests` (`hidden: true` tests aren't shown to the user in detail).
- Add/edit behavioral questions in `data/behavioral.js`.
- Timing constants live in `js/app.js` (`CODING_SECONDS`) and
  `js/behavioralUI.js` (`THINK_SECONDS`, `ANSWER_SECONDS`).
