/* Practice Situational Judgment scenarios modeled on the "Virtual Job Tryout"
   style assessment Capital One's real OA email describes: untimed, multiple
   choice / most-effective-least-effective format, testing work style and
   judgment rather than coding ability. This is the common "SJT" (situational
   judgment test) pattern used by many corporate assessment vendors.

   Format: each scenario gives 4 possible responses. You pick the response
   you think is MOST effective and the one you think is LEAST effective —
   the same two-choice format real SJTs commonly use instead of a single
   "right answer." Original scenarios; not real Capital One questions. */

window.SITUATIONAL = [
  {
    id: "sj1",
    competency: "Prioritization & Ownership",
    scenario:
      "You're midway through a task your manager asked for by end of day when a teammate messages that a different, unrelated deliverable they own is now blocked and needs your input to move forward. You don't have time to fully do both before end of day.",
    options: [
      { id: "a", text: "Keep working on your manager's task and reply to your teammate that you'll help once you're done, even if that's tomorrow.", rank: 3 },
      { id: "b", text: "Pause your task, quickly assess how blocking your teammate's issue really is, and if it's urgent, give them a fast unblock and tell your manager you may need a bit more time.", rank: 1 },
      { id: "c", text: "Drop your own task immediately and fully switch to your teammate's issue without telling your manager.", rank: 4 },
      { id: "d", text: "Ignore the teammate's message until your own task is done, since your manager's request came first.", rank: 2 },
    ],
  },
  {
    id: "sj2",
    competency: "Customer Focus",
    scenario:
      "A customer-facing feature you built is technically working as designed, but you're seeing early signs that real users find it confusing and are contacting support more than expected.",
    options: [
      { id: "a", text: "Point out that the feature meets its original spec, so any confusion is a support or documentation problem, not an engineering one.", rank: 4 },
      { id: "b", text: "Wait for a formal bug report or ticket before looking into it further, since nothing is technically broken.", rank: 3 },
      { id: "c", text: "Raise it proactively with your team, look at the support contacts for patterns, and suggest a small fix or clarification even though it wasn't required.", rank: 1 },
      { id: "d", text: "Mention it once in passing to your manager and move on to your next assigned task.", rank: 2 },
    ],
  },
  {
    id: "sj3",
    competency: "Integrity & Risk Awareness",
    scenario:
      "While testing, you notice your change could expose a small amount of customer data in an internal log file under a rare edge case. It's unlikely to be hit in practice, and flagging it will likely delay your release by a day.",
    options: [
      { id: "a", text: "Ship on schedule since the edge case is unlikely to occur, and revisit it later if it actually comes up.", rank: 4 },
      { id: "b", text: "Quietly patch the log line yourself without mentioning it, to avoid raising concern.", rank: 3 },
      { id: "c", text: "Flag it immediately to your team/lead, explain the risk clearly, and let the release timeline adjust if needed.", rank: 1 },
      { id: "d", text: "Add a comment in the code about the risk for a future engineer to fix, and ship as planned.", rank: 2 },
    ],
  },
  {
    id: "sj4",
    competency: "Team Conflict",
    scenario:
      "A teammate publicly disagrees with a technical approach you proposed in a team channel, in a way that feels a bit dismissive. You're confident in your reasoning.",
    options: [
      { id: "a", text: "Respond in the same channel defending your approach point by point to make sure others see you're right.", rank: 3 },
      { id: "b", text: "Say nothing in the channel, but privately feel frustrated and avoid working with that person going forward.", rank: 4 },
      { id: "c", text: "Suggest moving the discussion to a quick call to understand their concern and find the best solution together.", rank: 1 },
      { id: "d", text: "Ask a manager to weigh in and settle who's right.", rank: 2 },
    ],
  },
  {
    id: "sj5",
    competency: "Adaptability",
    scenario:
      "Halfway through a two-week project, priorities shift and your manager asks the team to pivot to a different approach that makes some of your work obsolete.",
    options: [
      { id: "a", text: "Push back strongly, arguing the team should finish the original plan first since work has already been done.", rank: 3 },
      { id: "b", text: "Ask clarifying questions about the new direction, note what can be reused, and adjust your plan accordingly.", rank: 1 },
      { id: "c", text: "Go along with the change outwardly, but privately keep working on the original approach in case leadership changes its mind again.", rank: 4 },
      { id: "d", text: "Comply immediately without asking any questions, even if the reasoning behind the change is unclear.", rank: 2 },
    ],
  },
  {
    id: "sj6",
    competency: "Attention to Detail / Risk (Banking Context)",
    scenario:
      "You're reviewing a teammate's pull request that touches how transaction amounts are calculated. The logic looks mostly right, but one rounding edge case seems slightly off in a way that could very rarely misstate a customer's balance by a cent.",
    options: [
      { id: "a", text: "Approve it since the issue is extremely rare and the PR is otherwise solid and already late.", rank: 4 },
      { id: "b", text: "Leave a comment flagging the edge case clearly and ask them to address it or explain why it's safe, before approving.", rank: 1 },
      { id: "c", text: "Approve it, then mention the concern verbally later so it doesn't block their merge.", rank: 3 },
      { id: "d", text: "Fix the rounding issue yourself directly in their branch without discussing it with them.", rank: 2 },
    ],
  },
  {
    id: "sj7",
    competency: "Initiative",
    scenario:
      "You finish your assigned tasks for the sprint two days early with no new work assigned yet.",
    options: [
      { id: "a", text: "Message your manager that you're available, and in the meantime look for a small improvement, bug, or piece of tech debt you can proactively tackle.", rank: 1 },
      { id: "b", text: "Wait quietly until someone assigns you something new.", rank: 3 },
      { id: "c", text: "Start a large new feature on your own initiative without checking with anyone first.", rank: 4 },
      { id: "d", text: "Use the time to review open PRs from teammates if there are any waiting.", rank: 2 },
    ],
  },
  {
    id: "sj8",
    competency: "Receiving Feedback",
    scenario:
      "In a code review, a senior engineer leaves several comments on your PR that feel more critical in tone than you expected, though the technical points seem fair.",
    options: [
      { id: "a", text: "Thank them for the detailed review, address the valid points, and ask questions on anything you're unsure about.", rank: 1 },
      { id: "b", text: "Address the comments but avoid that reviewer's PRs going forward.", rank: 3 },
      { id: "c", text: "Reply defensively explaining why your original approach was fine.", rank: 4 },
      { id: "d", text: "Silently make the changes without engaging or asking any follow-up questions.", rank: 2 },
    ],
  },
];
