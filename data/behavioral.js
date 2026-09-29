/* Practice behavioral questions modeled on the HireVue-style format candidates
   report for Capital One (30s think time, then a timed response, STAR-format
   answers). See README.md for sources. Written for practice; not verbatim
   real questions.

   The pool below has more questions than any one session asks —
   window.buildBehavioralSet() randomly picks and shuffles a subset into
   window.BEHAVIORAL (6 of 8 STAR questions + 4 of 6 Motivation questions)
   so repeated practice runs don't always ask the same 10 in the same order. */

window.BEHAVIORAL_POOL = {
  star: [
    {
      section: "Behavioral (STAR)",
      q: "Tell me about a time you had too many things to do and had to prioritize your work.",
      tip: "Name the competing priorities explicitly and explain the criteria you used to rank them.",
    },
    {
      section: "Behavioral (STAR)",
      q: "Tell me about a time you had to go above and beyond to get a job done.",
      tip: "Be specific about what 'beyond' meant — extra hours, scope, or initiative outside your role.",
    },
    {
      section: "Behavioral (STAR)",
      q: "Describe a time you disagreed with your manager or had to push back on a decision.",
      tip: "Show you disagreed respectfully and with data, and how the disagreement was resolved.",
    },
    {
      section: "Behavioral (STAR)",
      q: "Tell me about a time you had to learn something new quickly to accomplish a task.",
      tip: "Emphasize your learning process, not just the outcome.",
    },
    {
      section: "Behavioral (STAR)",
      q: "Describe a time you had to resolve a conflict with a teammate.",
      tip: "Focus on the steps you personally took to de-escalate and reach resolution.",
    },
    {
      section: "Behavioral (STAR)",
      q: "Tell me about a time you made a mistake. How did you handle it?",
      tip: "Own the mistake plainly, then pivot quickly to what you did about it and what changed after.",
    },
    {
      section: "Behavioral (STAR)",
      q: "Tell me about a time you had to work with incomplete or ambiguous requirements.",
      tip: "Explain how you filled the gaps — what you assumed, and how you checked those assumptions.",
    },
    {
      section: "Behavioral (STAR)",
      q: "Describe a time you had to give difficult feedback to a peer.",
      tip: "Focus on how you made the feedback specific and actionable, not just honest.",
    },
  ],
  motivation: [
    {
      section: "Motivation & Mini Case",
      q: "Tell me about a major goal you accomplished and how you achieved it.",
      tip: "Pick a goal with a measurable result, and walk through your plan, not just the win.",
    },
    {
      section: "Motivation & Mini Case",
      q: "Tell me about a time you had to solve a problem by influencing others, without having direct authority over them.",
      tip: "Explain how you built buy-in — the persuasion tactic matters more than the final decision.",
    },
    {
      section: "Motivation & Mini Case",
      q: "Why do you want to work at Capital One?",
      tip: "Connect a specific, researched detail about Capital One (tech culture, products, mission) to your own goals.",
    },
    {
      section: "Motivation & Mini Case",
      q: "Why are you interested in the Technology Development Program specifically?",
      tip: "Speak to the rotational structure and how it fits where you want to grow as an engineer.",
    },
    {
      section: "Motivation & Mini Case",
      q: "What does 'ownership' mean to you in an engineering role?",
      tip: "Ground it in a specific example rather than answering in the abstract.",
    },
    {
      section: "Motivation & Mini Case",
      q: "Tell me about a time you balanced speed and quality under a tight deadline.",
      tip: "Be honest about the trade-off you made and why, not just that you 'did both.'",
    },
  ],
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

window.BEHAVIORAL = shuffle(window.BEHAVIORAL_POOL.star)
  .slice(0, 6)
  .concat(shuffle(window.BEHAVIORAL_POOL.motivation).slice(0, 4));

window.buildBehavioralSet = function () {
  const picked = shuffle(window.BEHAVIORAL_POOL.star)
    .slice(0, 6)
    .concat(shuffle(window.BEHAVIORAL_POOL.motivation).slice(0, 4));
  window.BEHAVIORAL.length = 0;
  window.BEHAVIORAL.push(...picked);
};
