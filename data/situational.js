/* Practice Situational Judgment scenarios modeled on the "Virtual Job Tryout"
   style assessment Capital One's real OA email describes: untimed, multiple
   choice / most-effective-least-effective format, testing work style and
   judgment rather than coding ability. This is the common "SJT" (situational
   judgment test) pattern used by many corporate assessment vendors.

   Format: each scenario gives 4 possible responses. You pick the response
   you think is MOST effective and the one you think is LEAST effective —
   the same two-choice format real SJTs commonly use instead of a single
   "right answer." Original scenarios; not real Capital One questions.

   The pool below has more scenarios than any one session shows —
   window.buildSituationalSet() randomly picks and shuffles a subset into
   window.SITUATIONAL so repeated practice runs don't always show the same
   8 questions in the same order. */

window.SITUATIONAL_POOL = [
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
  {
    id: "sj9",
    competency: "Time Management",
    scenario:
      "You realize two days before a deadline that your original estimate was off, and you won't finish everything you committed to.",
    options: [
      { id: "a", text: "Keep quiet and work overtime alone, trying to finish everything without telling anyone.", rank: 3 },
      { id: "b", text: "Tell your manager right away, explain what's at risk, and propose which pieces to prioritize or what could slip.", rank: 1 },
      { id: "c", text: "Quietly drop some of the requirements without telling anyone, hoping it goes unnoticed.", rank: 4 },
      { id: "d", text: "Hand the whole task off to a teammate at the last minute without much context.", rank: 2 },
    ],
  },
  {
    id: "sj10",
    competency: "Cross-Team Collaboration",
    scenario:
      "You notice another team's upcoming change is about to break an API your service depends on, and they don't seem aware of the impact on you.",
    options: [
      { id: "a", text: "Reach out to them directly and proactively, explain the dependency, and work out a plan together.", rank: 1 },
      { id: "b", text: "Wait to see if it actually breaks before saying anything.", rank: 4 },
      { id: "c", text: "Escalate straight to both managers without first talking to the other team.", rank: 3 },
      { id: "d", text: "Post a general warning in a wide company channel without directly contacting the team making the change.", rank: 2 },
    ],
  },
  {
    id: "sj11",
    competency: "Handling Ambiguity",
    scenario:
      "You're assigned a project with a vague goal and no clear success criteria, and your manager is out for the week.",
    options: [
      { id: "a", text: "Make reasonable assumptions, document them clearly, and start moving forward while flagging what you assumed.", rank: 1 },
      { id: "b", text: "Wait until your manager is back before doing anything.", rank: 4 },
      { id: "c", text: "Guess quietly and proceed without writing down or sharing your assumptions.", rank: 3 },
      { id: "d", text: "Ask a teammate for a detailed spec they don't actually have, and wait for them to produce one.", rank: 2 },
    ],
  },
  {
    id: "sj12",
    competency: "Confidentiality",
    scenario:
      "A friend who works at a different company casually asks you general questions about how your bank's fraud-detection systems work, out of curiosity.",
    options: [
      { id: "a", text: "Politely decline to discuss internal system details and explain you can't share that.", rank: 1 },
      { id: "b", text: "Share only \"high level, obviously public\" details since it seems harmless.", rank: 2 },
      { id: "c", text: "Share a fair amount of detail since your friend isn't a competitor and it's just curiosity.", rank: 3 },
      { id: "d", text: "Share full detail since it's an interesting technical problem worth discussing.", rank: 4 },
    ],
  },
  {
    id: "sj13",
    competency: "Delegation",
    scenario:
      "You're the most experienced person on a small project team, and a junior teammate keeps sending you their work-in-progress for review well before it's ready, slowing you down on your own tasks.",
    options: [
      { id: "a", text: "Have a quick, kind conversation with them about when it's most useful to send you something, and offer a couple of checkpoints they can self-check against first.", rank: 1 },
      { id: "b", text: "Keep reviewing everything they send right away so they don't feel ignored, even though it's costing you time.", rank: 3 },
      { id: "c", text: "Start replying slower and vaguer to discourage them without saying anything directly.", rank: 4 },
      { id: "d", text: "Tell your manager the teammate is slowing you down and ask for the reviews to be reassigned.", rank: 2 },
    ],
  },
  {
    id: "sj14",
    competency: "Innovation & Process Improvement",
    scenario:
      "You notice your team manually repeats the same multi-step deployment checklist every release, and you think a script could automate most of it, but nobody asked you to build one.",
    options: [
      { id: "a", text: "Spend a small amount of your own slack time prototyping a script, then show the team and ask if it's worth adopting.", rank: 1 },
      { id: "b", text: "Say nothing and keep doing the manual checklist like everyone else, since it's not officially your job.", rank: 3 },
      { id: "c", text: "Quietly replace the checklist with your own script without telling anyone, to save time immediately.", rank: 4 },
      { id: "d", text: "Mention the idea once in a retro and drop it if nobody responds right away.", rank: 2 },
    ],
  },
  {
    id: "sj15",
    competency: "Handling Pressure",
    scenario:
      "It's the last hour before a release freeze, several small things are going wrong at once, and your manager keeps asking for status updates every few minutes.",
    options: [
      { id: "a", text: "Take a breath, quickly triage what actually blocks the release versus what can wait, and give your manager one clear, honest status update with a plan.", rank: 1 },
      { id: "b", text: "Answer every single status ping in detail the instant it arrives, even if it means constantly context-switching away from fixing anything.", rank: 3 },
      { id: "c", text: "Stop responding to your manager entirely until everything is fixed, to avoid the distraction.", rank: 4 },
      { id: "d", text: "Tell your manager everything is fine without checking, to reduce the pressure in the moment.", rank: 2 },
    ],
  },
  {
    id: "sj16",
    competency: "Vendor / External Communication",
    scenario:
      "A third-party vendor's API your team depends on is returning inconsistent data, and their support contact has been slow to respond for a few days.",
    options: [
      { id: "a", text: "Document the specific inconsistencies with examples, escalate through the proper vendor-management channel, and add a temporary safeguard on your side in the meantime.", rank: 1 },
      { id: "b", text: "Keep emailing the same slow contact repeatedly and wait, without looping in anyone internally.", rank: 3 },
      { id: "c", text: "Quietly work around it by hardcoding assumptions about their data without flagging the underlying issue to your team.", rank: 4 },
      { id: "d", text: "Mention it to your manager once, then wait passively for the vendor to eventually respond.", rank: 2 },
    ],
  },
  {
    id: "sj17",
    competency: "Inclusion & Respect",
    scenario:
      "In a group meeting, you notice one teammate's ideas keep getting talked over before they can finish explaining them.",
    options: [
      { id: "a", text: "Politely redirect the conversation — \"I don't think we heard the rest of that, go ahead\" — so they can finish their point.", rank: 1 },
      { id: "b", text: "Say nothing during the meeting, but mention it to them privately afterward.", rank: 2 },
      { id: "c", text: "Assume they'll speak up for themselves eventually and don't get involved.", rank: 3 },
      { id: "d", text: "Bring it up publicly and pointedly call out whoever interrupted, mid-meeting.", rank: 4 },
    ],
  },
  {
    id: "sj18",
    competency: "Resource Constraints",
    scenario:
      "You're asked to deliver a feature in half the time you'd normally estimate, with no additional headcount, and the request came from a director.",
    options: [
      { id: "a", text: "Propose a scoped-down version that fits the timeline, clearly stating what's cut and why, rather than silently agreeing to the full original scope.", rank: 1 },
      { id: "b", text: "Agree to the original timeline and scope outright to avoid pushback, and hope it works out.", rank: 3 },
      { id: "c", text: "Refuse the request outright without offering any alternative.", rank: 4 },
      { id: "d", text: "Quietly plan to cut corners on testing to hit the date, without telling anyone.", rank: 2 },
    ],
  },
  {
    id: "sj19",
    competency: "Regulatory / Compliance Awareness",
    scenario:
      "You're building a feature that stores a new field of customer data, and you're not sure whether it falls under a data-retention policy your company has for sensitive financial information.",
    options: [
      { id: "a", text: "Pause and check with your team lead or the compliance/privacy point of contact before storing the data, even if it adds a short delay.", rank: 1 },
      { id: "b", text: "Assume it's probably fine since it's a small, seemingly low-risk field, and proceed without checking.", rank: 3 },
      { id: "c", text: "Store it exactly like other similar fields already in the codebase, without checking whether those were reviewed either.", rank: 2 },
      { id: "d", text: "Store the data and plan to remove it later if someone raises a concern.", rank: 4 },
    ],
  },
  {
    id: "sj20",
    competency: "Remote / Async Collaboration",
    scenario:
      "You work with teammates in a very different time zone, and you just found a bug that isn't urgent but will need their input to fix, and they won't be online for another 8 hours.",
    options: [
      { id: "a", text: "Write up a clear, detailed async message now — what you found, why it matters, and what you need from them — so they can act on it as soon as they're online.", rank: 1 },
      { id: "b", text: "Wait until they're online to explain it live, even though that delays things by many hours for no real reason.", rank: 3 },
      { id: "c", text: "Try to fix it yourself without their input, even though it's outside your area of context.", rank: 4 },
      { id: "d", text: "Send a one-line message like \"can we talk about that bug later\" with no other detail.", rank: 2 },
    ],
  },
];

window.SITUATIONAL = window.SITUATIONAL_POOL.slice(0, 8);

window.buildSituationalSet = function () {
  const pool = window.SITUATIONAL_POOL.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const picked = pool.slice(0, 8);
  window.SITUATIONAL.length = 0;
  window.SITUATIONAL.push(...picked);
};
