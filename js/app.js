/* Top-level state machine wiring the home / coding / behavioral / results
   screens together, plus the 70-minute coding-round countdown. */

(function () {
  const CODING_SECONDS = 70 * 60;

  function freshState() {
    return {
      screen: "home",
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
    coding: document.getElementById("screen-coding"),
    behavioral: document.getElementById("screen-behavioral"),
    results: document.getElementById("screen-results"),
  };
  const timerPill = document.getElementById("global-timer");

  function showScreen(name) {
    state.screen = name;
    Object.entries(screens).forEach(([key, el]) => {
      el.classList.toggle("active", key === name);
    });
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
    startBehavioral();
  }

  function startBehavioral() {
    state.behavioral.index = 0;
    state.behavioral.phase = "think";
    state.behavioral.timeLeftSec = window.OABehavioral.THINK_SECONDS;
    state.behavioral.responses = [];
    showScreen("behavioral");
    window.OABehavioral.render(state, screens.behavioral.querySelector(".behavioral-body"), showResults);
  }

  function verdictFor(pct) {
    if (pct >= 70) return { cls: "strong", text: `Strong practice score (${pct}%). Real CodeSignal cutoffs candidates report are around 70% — you're in a competitive range.` };
    if (pct >= 40) return { cls: "mid", text: `Borderline practice score (${pct}%). Review the problems you missed and try again — aim for 70%+.` };
    return { cls: "weak", text: `Needs more practice (${pct}%). Revisit the missed problems below and rerun the tests once you've fixed your solution.` };
  }

  function showResults() {
    window.OABehavioral.clearTimer(state);
    clearCodingTimer();
    showScreen("results");

    const totalPts = window.OACoding.totalPoints();
    const earnedPts = window.OACoding.scoreEarned(state);
    const pct = Math.round((earnedPts / totalPts) * 100);
    const timeUsed = CODING_SECONDS - state.coding.timeLeftSec;
    const verdict = verdictFor(pct);

    const root = screens.results.querySelector(".results-body");
    root.innerHTML = `
      <div class="score-summary">
        <div class="score-tile"><div class="num">${earnedPts}/${totalPts}</div><div class="label">Coding score</div></div>
        <div class="score-tile"><div class="num">${pct}%</div><div class="label">Coding percentage</div></div>
        <div class="score-tile"><div class="num">${fmtClock(timeUsed)}</div><div class="label">Coding time used (of 70:00)</div></div>
      </div>
      <div class="verdict ${verdict.cls}">${verdict.text}</div>

      <h3>Coding round breakdown</h3>
      <div id="problem-breakdown"></div>

      <h3 style="margin-top:28px;">Behavioral round review</h3>
      <p style="color: var(--text-dim);">Self-grade each answer against the STAR framework — this is not auto-scored.</p>
      <div id="behavioral-breakdown"></div>

      <div class="center" style="margin-top:28px;">
        <button class="btn secondary" id="restart-btn">Restart Practice OA</button>
      </div>
    `;

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

    root.querySelector("#restart-btn").addEventListener("click", () => {
      state = freshState();
      showScreen("home");
    });
  }

  document.getElementById("start-btn").addEventListener("click", startCoding);
  document.getElementById("finish-coding-btn").addEventListener("click", finishCoding);

  showScreen("home");
})();
