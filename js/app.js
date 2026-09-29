/* Top-level state machine wiring the home / situational / coding / results /
   power-day / behavioral screens together, plus the 70-minute coding-round
   countdown. */

(function () {
  const CODING_SECONDS = 70 * 60;

  function freshState() {
    return {
      screen: "home",
      situational: {
        index: 0,
        answers: {},
      },
      coding: {
        currentProblemId: window.PROBLEMS[0].id,
        code: {},
        results: {},
        scores: {},
        timeLeftSec: CODING_SECONDS,
        timerHandle: null,
      },
      behavioral: {
        index: 0,
        phase: "think",
        timeLeftSec: window.OABehavioral.THINK_SECONDS,
        timerHandle: null,
        responses: [],
      },
    };
  }

  let state = freshState();

  const screens = {
    home: document.getElementById("screen-home"),
    situational: document.getElementById("screen-situational"),
    coding: document.getElementById("screen-coding"),
    results: document.getElementById("screen-results"),
    powerday: document.getElementById("screen-powerday"),
    behavioral: document.getElementById("screen-behavioral"),
    behavioralReview: document.getElementById("screen-behavioral-review"),
  };
  const timerPill = document.getElementById("global-timer");

  function showScreen(name) {
    state.screen = name;
    Object.entries(screens).forEach(([key, el]) => {
      el.classList.toggle("active", key === name);
    });
    window.scrollTo(0, 0);
  }

  function fmtClock(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function clearCodingTimer() {
    if (state.coding.timerHandle) {
      clearInterval(state.coding.timerHandle);
      state.coding.timerHandle = null;
    }
  }

  function startSituational() {
    state.situational.index = 0;
    state.situational.answers = {};
    showScreen("situational");
    window.OASituational.render(state, screens.situational.querySelector(".situational-body"), startCoding);
  }

  function startCoding() {
    state.coding.timeLeftSec = CODING_SECONDS;
    clearCodingTimer();
    showScreen("coding");
    timerPill.style.display = "inline-block";
    timerPill.textContent = fmtClock(state.coding.timeLeftSec);
    window.OACoding.renderAll(state, screens.coding.querySelector(".coding-body"));

    state.coding.timerHandle = setInterval(() => {
      state.coding.timeLeftSec -= 1;
      timerPill.textContent = fmtClock(state.coding.timeLeftSec);
      timerPill.classList.toggle("low", state.coding.timeLeftSec <= 300);
      if (state.coding.timeLeftSec <= 0) {
        clearCodingTimer();
        finishCoding();
      }
    }, 1000);
  }

  function finishCoding() {
    clearCodingTimer();
    timerPill.style.display = "none";
    showResults();
  }

  function codingVerdictFor(pct) {
    if (pct >= 70) return { cls: "strong", text: `Strong coding score (${pct}%). Real CodeSignal cutoffs candidates report are around 70% — you're in a competitive range.` };
    if (pct >= 40) return { cls: "mid", text: `Borderline coding score (${pct}%). Review the problems you missed and try again — aim for 70%+.` };
    return { cls: "weak", text: `Coding needs more practice (${pct}%). Revisit the missed problems below and rerun the tests once you've fixed your solution.` };
  }

  function sjVerdictFor(pct) {
    if (pct >= 75) return { cls: "strong", text: `Strong situational judgment score (${pct}%). Your instincts line up well with the "most/least effective" responses this round expects.` };
    if (pct >= 50) return { cls: "mid", text: `Mixed situational judgment score (${pct}%). Review the scenarios below — these tests reward ownership, proactive communication, and flagging risk early.` };
    return { cls: "weak", text: `Situational judgment score (${pct}%) suggests reviewing the explanations below — look for the pattern of taking ownership without overstepping.` };
  }

  function showResults() {
    window.OABehavioral.clearTimer(state);
    clearCodingTimer();
    showScreen("results");

    const totalPts = window.OACoding.totalPoints();
    const earnedPts = window.OACoding.scoreEarned(state);
    const codingPct = Math.round((earnedPts / totalPts) * 100);
    const timeUsed = CODING_SECONDS - state.coding.timeLeftSec;
    const codingVerdict = codingVerdictFor(codingPct);

    const sj = window.OASituational.score(state);
    const sjPct = Math.round((sj.points / sj.total) * 100);
    const sjVerdict = sjVerdictFor(sjPct);

    const root = screens.results.querySelector(".results-body");
    root.innerHTML = `
      <h3>Situational Judgment</h3>
      <div class="score-summary">
        <div class="score-tile"><div class="num">${sj.points}/${sj.total}</div><div class="label">SJ points</div></div>
        <div class="score-tile"><div class="num">${sjPct}%</div><div class="label">SJ percentage</div></div>
      </div>
      <div class="verdict ${sjVerdict.cls}">${sjVerdict.text}</div>
      <div id="sj-breakdown"></div>

      <h3 style="margin-top:28px;">Coding</h3>
      <div class="score-summary">
        <div class="score-tile"><div class="num">${earnedPts}/${totalPts}</div><div class="label">Coding score</div></div>
        <div class="score-tile"><div class="num">${codingPct}%</div><div class="label">Coding percentage</div></div>
        <div class="score-tile"><div class="num">${fmtClock(timeUsed)}</div><div class="label">Time used (of 70:00)</div></div>
      </div>
      <div class="verdict ${codingVerdict.cls}">${codingVerdict.text}</div>
      <div id="problem-breakdown"></div>

      <div class="center" style="margin-top:28px; display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
        <button class="btn" id="powerday-btn">What's Next: Power Day Prep →</button>
        <button class="btn secondary" id="restart-btn">Restart Practice OA</button>
      </div>
    `;

    const sjRoot = root.querySelector("#sj-breakdown");
    sj.detail.forEach((d, i) => {
      const mostOpt = d.ans && d.ans.mostId ? d.scenario.options.find((o) => o.id === d.ans.mostId) : null;
      const leastOpt = d.ans && d.ans.leastId ? d.scenario.options.find((o) => o.id === d.ans.leastId) : null;
      const bestOpt = d.scenario.options.find((o) => o.rank === 1);
      const worstOpt = d.scenario.options.find((o) => o.rank === d.scenario.options.length);
      sjRoot.innerHTML += `
        <div class="result-answer">
          <div class="q">${i + 1}. ${d.scenario.scenario}</div>
          <div class="meta-row" style="margin-top:8px;">
            <span class="${d.mostCorrect ? "sj-correct" : "sj-incorrect"}">Your "Most": ${mostOpt ? mostOpt.text : "—"} ${d.mostCorrect ? "✓" : "✗"}</span>
          </div>
          ${!d.mostCorrect ? `<div class="meta-row"><span style="color:var(--text-dim);">Recommended most effective: ${bestOpt.text}</span></div>` : ""}
          <div class="meta-row" style="margin-top:4px;">
            <span class="${d.leastCorrect ? "sj-correct" : "sj-incorrect"}">Your "Least": ${leastOpt ? leastOpt.text : "—"} ${d.leastCorrect ? "✓" : "✗"}</span>
          </div>
          ${!d.leastCorrect ? `<div class="meta-row"><span style="color:var(--text-dim);">Recommended least effective: ${worstOpt.text}</span></div>` : ""}
        </div>
      `;
    });

    const pbRoot = root.querySelector("#problem-breakdown");
    window.PROBLEMS.forEach((p) => {
      const results = state.coding.results[p.id];
      const earned = state.coding.scores[p.id] || 0;
      const passed = results ? results.filter((r) => r.pass).length : 0;
      const total = results ? results.length : p.tests.length;
      pbRoot.innerHTML += `
        <div class="result-problem">
          <div class="row">
            <span><strong>${p.title}</strong> <span class="diff ${p.difficulty}">${p.difficulty}</span></span>
            <span>${earned}/${p.points} pts · ${passed}/${total} tests passed</span>
          </div>
        </div>
      `;
    });

    root.querySelector("#powerday-btn").addEventListener("click", showPowerDay);
    root.querySelector("#restart-btn").addEventListener("click", () => {
      state = freshState();
      showScreen("home");
    });
  }

  function showPowerDay() {
    showScreen("powerday");
    const root = screens.powerday.querySelector(".powerday-body");
    root.innerHTML = `
      <div class="card">
        <h3 style="margin-top:0;">What candidates report about Power Day</h3>
        <p style="color:var(--text-dim);">
          Capital One's onsite loop (nicknamed "Power Day") typically runs 2–4 weeks after you clear the OA,
          and candidate reports describe it as roughly:
        </p>
        <ul class="tight">
          <li><strong>1 Behavioral interview</strong> — live, conversational version of the STAR-format questions.</li>
          <li><strong>2 Coding interviews</strong> — usually Easy/Medium, live with an interviewer instead of proctored.</li>
          <li><strong>1 Case interview</strong> — a business/product scenario, not a leetcode problem.</li>
        </ul>
      </div>

      <div class="grid-2">
        <div class="card">
          <h3>Behavioral interview</h3>
          <p style="color:var(--text-dim);">Same STAR-format question bank as before, but live and conversational instead of typed. Practice saying your answers out loud.</p>
          <button class="btn" id="pd-behavioral-btn">Practice Behavioral Questions</button>
        </div>
        <div class="card">
          <h3>Coding interviews</h3>
          <p style="color:var(--text-dim);">Reported as Easy/Medium — lighter than the OA's Hard problem. Re-run the OA coding round and focus on problems 1–3, talking through your approach out loud as you go.</p>
          <button class="btn secondary" id="pd-coding-btn">Redo Coding Practice</button>
        </div>
      </div>

      <div class="card">
        <h3>Case interview</h3>
        <p style="color:var(--text-dim);">Not a coding problem — a business scenario. Use a simple framework instead of jumping to a number:</p>
        <ol class="tight" style="padding-left:20px;">
          <li><strong>Clarify</strong> the goal and constraints before answering.</li>
          <li><strong>Structure</strong> your approach into a few clear, non-overlapping buckets (MECE).</li>
          <li><strong>Analyze</strong> — quantify where you can, state assumptions explicitly.</li>
          <li><strong>Recommend</strong> a clear answer, not just analysis.</li>
          <li><strong>Sanity-check</strong> your recommendation against the original goal.</li>
        </ol>
        <div class="tip-box" style="margin-top:14px;">
          <strong>Sample prompt to practice with:</strong> "Capital One notices that new mobile-app customers who
          don't set up a direct deposit within 30 days are far more likely to close their account within a year.
          How would you decide whether to invest engineering time in a feature nudging users to set up direct
          deposit earlier?" — Walk through the 5 steps above out loud, in about 10 minutes.
        </div>
      </div>

      <div class="center" style="margin-top:10px;">
        <button class="btn secondary" id="pd-home-btn">Back to Home</button>
      </div>
    `;

    root.querySelector("#pd-behavioral-btn").addEventListener("click", startBehavioralStandalone);
    root.querySelector("#pd-coding-btn").addEventListener("click", startCoding);
    root.querySelector("#pd-home-btn").addEventListener("click", () => showScreen("home"));
  }

  function startBehavioralStandalone() {
    state.behavioral.index = 0;
    state.behavioral.phase = "think";
    state.behavioral.timeLeftSec = window.OABehavioral.THINK_SECONDS;
    state.behavioral.responses = [];
    showScreen("behavioral");
    window.OABehavioral.render(state, screens.behavioral.querySelector(".behavioral-body"), showBehavioralReview);
  }

  function showBehavioralReview() {
    window.OABehavioral.clearTimer(state);
    showScreen("behavioralReview");
    const root = screens.behavioralReview.querySelector(".behavioral-review-body");
    root.innerHTML = `
      <p style="color: var(--text-dim);">Self-grade each answer against the STAR framework — this is not auto-scored.</p>
      <div id="behavioral-breakdown"></div>
      <div class="center" style="margin-top:24px;">
        <button class="btn" id="back-to-powerday-btn">Back to Power Day Prep</button>
      </div>
    `;
    const bbRoot = root.querySelector("#behavioral-breakdown");
    window.BEHAVIORAL.forEach((q, i) => {
      const resp = state.behavioral.responses[i];
      const rid = `star-${i}`;
      bbRoot.innerHTML += `
        <div class="result-answer">
          <div class="q">${i + 1}. ${q.q}</div>
          <div class="a">${resp && resp.text.trim() ? resp.text : "(no answer submitted)"}</div>
          <div class="meta-row">
            <span>${resp ? resp.wordCount : 0} words · ${resp ? fmtClock(resp.timeSpentSec) : "0:00"} used${resp && resp.autoSubmitted ? " · auto-submitted at time limit" : ""}</span>
          </div>
          <div class="star-check">
            <label><input type="checkbox" id="${rid}-s"> Situation</label>
            <label><input type="checkbox" id="${rid}-t"> Task</label>
            <label><input type="checkbox" id="${rid}-a"> Action</label>
            <label><input type="checkbox" id="${rid}-r"> Result</label>
          </div>
        </div>
      `;
    });
    root.querySelector("#back-to-powerday-btn").addEventListener("click", showPowerDay);
  }

  document.getElementById("start-btn").addEventListener("click", startSituational);
  document.getElementById("finish-coding-btn").addEventListener("click", finishCoding);
  document.getElementById("view-powerday-btn").addEventListener("click", showPowerDay);

  showScreen("home");
})();
