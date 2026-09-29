/* Top-level state machine wiring the home / situational / coding / results /
   power-day / behavioral screens together, plus the 70-minute coding-round
   countdown. */

(function () {
  const CODING_SECONDS = 70 * 60;
  // Fallback shown until the user enters their own date via the home-screen
  // date picker (persisted to their profile from then on).
  const DEADLINE_DATE = "2026-10-02";

  const SJ_DOLLARS_PER_SCENARIO = 3;
  const SKILLCHECK_SJ_COUNT = 4;
  const SKILLCHECK_CODING_SECONDS = 5 * 60;
  const BONUS_SJ_COUNT = 4;
  const BONUS_CODING_COUNT = 2;
  const BONUS_CODING_SECONDS = 15 * 60;

  const FOCUS_OPTIONS = [
    { id: "situational", label: "Situational Judgment", desc: "Virtual Job Tryout — work-style & judgment scenarios." },
    { id: "coding", label: "Coding", desc: "CodeSignal — bank/business-flavored coding problems." },
    { id: "behavioral", label: "Behavioral / Power Day", desc: "The onsite loop — STAR-format interview practice." },
    { id: "balanced", label: "Balanced", desc: "Even practice across all three." },
  ];

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function greetingWord() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }

  function freshState() {
    window.buildSituationalSet();
    window.buildProblemSet();
    window.buildBehavioralSet();
    return {
      screen: "home",
      situational: {
        index: 0,
        answers: {},
        elapsedSec: 0,
        timerHandle: null,
        rewardClaimed: false,
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
      skillCheckMode: null,
      skillCheckBackup: null,
      skillCheckSjPct: null,
      bonusDrillMode: null,
      bonusDrillBackup: null,
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
    shop: document.getElementById("screen-shop"),
    goals: document.getElementById("screen-goals"),
    skillcheckResults: document.getElementById("screen-skillcheck-results"),
  };
  const timerPill = document.getElementById("global-timer");
  const walletBadge = document.getElementById("wallet-badge");
  const walletAmountEl = document.getElementById("wallet-amount");

  function updateWalletBadge() {
    walletAmountEl.textContent = "$" + window.OAWallet.getBalance();
  }

  function updateGoalsSummaryHome() {
    const el = document.getElementById("goals-summary-home");
    if (!el) return;
    const goals = window.OAGoals.getAll();
    const doneCount = goals.filter((g) => g.done).length;
    el.textContent = `${doneCount}/${goals.length} complete — each pays a one-time OA Bucks bonus.`;
  }

  function renderDateBanner() {
    const el = document.getElementById("date-banner");
    if (!el) return;
    el.classList.add("tip-box");
    const profile = window.OAProfile.get();
    const dateStr = profile.oaDate || DEADLINE_DATE;
    const now = new Date();
    const deadline = new Date(dateStr + "T23:59:59");
    const todayStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const daysLeft = Math.ceil((deadline - now) / 86400000);
    let deadlineText;
    if (daysLeft > 1) deadlineText = `⏳ ${daysLeft} days left until your OA`;
    else if (daysLeft === 1) deadlineText = `⏳ 1 day left — it's tomorrow!`;
    else if (daysLeft === 0) deadlineText = `⏳ It's today!`;
    else deadlineText = `That date has passed — update it once you have a new one.`;
    el.innerHTML = `
      <div>📅 Today is ${todayStr} · ${deadlineText}</div>
      <label class="date-edit">
        When's your OA?
        <input type="date" id="oa-date-input" value="${escapeHtml(dateStr)}">
      </label>
    `;
    el.classList.toggle("urgent", daysLeft <= 3 && daysLeft >= 0);
    el.querySelector("#oa-date-input").addEventListener("change", (e) => {
      window.OAProfile.update({ oaDate: e.target.value });
      renderDateBanner();
    });
  }

  function renderHomeIntro(editing) {
    const el = document.getElementById("onboarding-card");
    if (!el) return;
    const profile = window.OAProfile.get();

    if (profile.onboarded && !editing) {
      const focusOpt = FOCUS_OPTIONS.find((f) => f.id === profile.focus) || FOCUS_OPTIONS[3];
      el.innerHTML = `
        <div class="card greeting-row">
          <div>
            <div class="greeting-text">${greetingWord()}${profile.name ? ", " + escapeHtml(profile.name) : ""}!</div>
            <div class="greeting-sub">Focused on: <strong>${focusOpt.label}</strong>${
        profile.skillCheck && profile.skillCheck.done
          ? ` · Skill check: ${profile.skillCheck.sjPct}% SJ / ${profile.skillCheck.codingPct}% coding`
          : ""
      }</div>
          </div>
          <button class="btn secondary small" id="edit-profile-btn">Edit</button>
        </div>
      `;
      el.querySelector("#edit-profile-btn").addEventListener("click", () => renderHomeIntro(true));
      return;
    }

    el.innerHTML = `
      <div class="card onboarding-box">
        <h3 style="margin-top:0;">${profile.onboarded ? "Edit your practice settings" : "Let's set up your practice"}</h3>
        <label class="field-label" for="profile-name-input">What should we call you?</label>
        <input type="text" id="profile-name-input" class="text-input" maxlength="30" placeholder="Your name" value="${escapeHtml(profile.name)}">

        <div class="field-label" style="margin-top:14px;">What do you want to focus on? (these match the real OA's own components)</div>
        <div class="focus-options" id="focus-options">
          ${FOCUS_OPTIONS.map(
            (f) => `
            <label class="focus-option">
              <input type="radio" name="focus" value="${f.id}" ${profile.focus === f.id ? "checked" : ""}>
              <span class="focus-label">${f.label}</span>
              <span class="focus-desc">${f.desc}</span>
            </label>
          `
          ).join("")}
        </div>

        <div class="actions-row" style="margin-top:16px; flex-wrap:wrap;">
          <button class="btn" id="onboarding-save-btn">Save &amp; Continue</button>
          <button class="btn secondary" id="onboarding-skillcheck-btn">Save &amp; Take a Quick Skill Check</button>
        </div>
        <p style="color:var(--text-dim); font-size:0.85rem; margin: 10px 0 0;">
          The skill check is a short diagnostic (a few situational scenarios + one quick easy coding
          problem) that suggests a focus area based on how you do. Optional — skip it any time by
          just hitting Save &amp; Continue.
        </p>
      </div>
    `;

    function currentFocus() {
      const checked = el.querySelector('input[name="focus"]:checked');
      return checked ? checked.value : "balanced";
    }

    el.querySelector("#onboarding-save-btn").addEventListener("click", () => {
      const name = el.querySelector("#profile-name-input").value.trim().slice(0, 30);
      window.OAProfile.update({ name, focus: currentFocus(), onboarded: true });
      renderHomeIntro(false);
    });

    el.querySelector("#onboarding-skillcheck-btn").addEventListener("click", () => {
      const name = el.querySelector("#profile-name-input").value.trim().slice(0, 30);
      window.OAProfile.update({ name, focus: currentFocus() });
      startSkillCheck();
    });
  }

  // Awards any goals that just became true and returns the total OA Bucks
  // bonus paid out (0 if none). Call after any state change that could
  // complete a goal (a run, a purchase, a behavioral practice).
  function awardNewlyCompletedGoals() {
    const newly = window.OAGoals.checkNewlyCompleted();
    const bonus = newly.reduce((sum, g) => sum + g.reward, 0);
    if (bonus > 0) window.OAWallet.earn(bonus);
    updateGoalsSummaryHome();
    return { newly, bonus };
  }

  function goalUnlockedHtml(newly) {
    if (!newly.length) return "";
    const items = newly.map((g) => `${g.title} (+$${g.reward})`).join(", ");
    return `<div class="verdict strong" style="margin-top:10px;">🎉 New goal${newly.length > 1 ? "s" : ""} unlocked: ${items}</div>`;
  }

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

  function clearSituationalTimer() {
    if (state.situational.timerHandle) {
      clearInterval(state.situational.timerHandle);
      state.situational.timerHandle = null;
    }
  }

  function startSituational() {
    state.situational.index = 0;
    state.situational.answers = {};
    state.situational.elapsedSec = 0;
    showScreen("situational");

    // Untimed by design — this is a stopwatch (counts up), not a countdown,
    // just so you can see how long you spent.
    clearSituationalTimer();
    timerPill.style.display = "inline-block";
    timerPill.classList.remove("low", "critical");
    timerPill.classList.add("stopwatch");
    timerPill.textContent = fmtClock(state.situational.elapsedSec);
    state.situational.timerHandle = setInterval(() => {
      state.situational.elapsedSec += 1;
      timerPill.textContent = fmtClock(state.situational.elapsedSec);
    }, 1000);

    window.OASituational.render(state, screens.situational.querySelector(".situational-body"), finishSituational);
  }

  function finishSituational() {
    clearSituationalTimer();
    timerPill.classList.remove("stopwatch");
    timerPill.style.display = "none";
    if (state.skillCheckMode === "situational") {
      handleSkillCheckSituationalDone();
      return;
    }
    if (state.bonusDrillMode === "situational") {
      handleBonusSituationalDone();
      return;
    }
    startCoding();
  }

  function startCoding() {
    state.coding.timeLeftSec = CODING_SECONDS;
    clearCodingTimer();
    showScreen("coding");
    timerPill.style.display = "inline-block";
    timerPill.classList.remove("stopwatch", "low", "critical");
    timerPill.textContent = fmtClock(state.coding.timeLeftSec);
    window.OACoding.renderAll(state, screens.coding.querySelector(".coding-body"));

    state.coding.timerHandle = setInterval(() => {
      state.coding.timeLeftSec -= 1;
      timerPill.textContent = fmtClock(state.coding.timeLeftSec);
      timerPill.classList.toggle("low", state.coding.timeLeftSec <= 300);
      timerPill.classList.toggle("critical", state.coding.timeLeftSec <= 60);
      if (state.coding.timeLeftSec <= 0) {
        clearCodingTimer();
        finishCoding();
      }
    }, 1000);
  }

  function finishCoding() {
    clearCodingTimer();
    timerPill.style.display = "none";
    if (state.skillCheckMode === "coding") {
      handleSkillCheckCodingDone();
      return;
    }
    if (state.bonusDrillMode === "coding") {
      handleBonusCodingDone();
      return;
    }
    showResults();
  }

  // --- Optional skill check: a short diagnostic (a few situational
  // scenarios + one quick easy coding problem) offered during onboarding.
  // It temporarily swaps the shared window.SITUATIONAL / window.PROBLEMS
  // arrays (the same in-place-mutation pattern buildSituationalSet /
  // buildProblemSet already use) so it can reuse the real situational and
  // coding screens/renderers unchanged, then restores them afterward.

  function startSkillCheck() {
    state.skillCheckMode = "situational";
    state.skillCheckBackup = { situational: window.SITUATIONAL.slice(), problems: window.PROBLEMS.slice() };

    const pool = window.SITUATIONAL_POOL.slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    window.SITUATIONAL.length = 0;
    window.SITUATIONAL.push(...pool.slice(0, SKILLCHECK_SJ_COUNT));

    state.situational = { index: 0, answers: {}, elapsedSec: 0, timerHandle: null, rewardClaimed: true };
    showScreen("situational");
    clearSituationalTimer();
    timerPill.style.display = "inline-block";
    timerPill.classList.remove("low", "critical");
    timerPill.classList.add("stopwatch");
    timerPill.textContent = fmtClock(0);
    state.situational.timerHandle = setInterval(() => {
      state.situational.elapsedSec += 1;
      timerPill.textContent = fmtClock(state.situational.elapsedSec);
    }, 1000);

    window.OASituational.render(state, screens.situational.querySelector(".situational-body"), finishSituational);
  }

  function handleSkillCheckSituationalDone() {
    const sj = window.OASituational.score(state);
    state.skillCheckSjPct = Math.round((sj.points / sj.total) * 100);

    window.SITUATIONAL.length = 0;
    window.SITUATIONAL.push(...state.skillCheckBackup.situational);

    startSkillCheckCoding();
  }

  function startSkillCheckCoding() {
    state.skillCheckMode = "coding";
    const easySlot = window.PROBLEM_SLOTS[Math.floor(Math.random() * 2)]; // slots 0 and 1 are the two Easy slots
    const chosen = easySlot[Math.floor(Math.random() * easySlot.length)];
    window.PROBLEMS.length = 0;
    window.PROBLEMS.push(chosen);

    state.coding.code = {};
    state.coding.results = {};
    state.coding.scores = {};
    state.coding.currentProblemId = chosen.id;
    state.coding.timeLeftSec = SKILLCHECK_CODING_SECONDS;
    clearCodingTimer();
    showScreen("coding");
    timerPill.style.display = "inline-block";
    timerPill.classList.remove("stopwatch", "low", "critical");
    timerPill.textContent = fmtClock(state.coding.timeLeftSec);
    window.OACoding.renderAll(state, screens.coding.querySelector(".coding-body"));

    state.coding.timerHandle = setInterval(() => {
      state.coding.timeLeftSec -= 1;
      timerPill.textContent = fmtClock(state.coding.timeLeftSec);
      timerPill.classList.toggle("critical", state.coding.timeLeftSec <= 60);
      if (state.coding.timeLeftSec <= 0) {
        clearCodingTimer();
        finishCoding();
      }
    }, 1000);
  }

  function handleSkillCheckCodingDone() {
    const totalPts = window.OACoding.totalPoints();
    const earnedPts = window.OACoding.scoreEarned(state);
    const codingPct = totalPts > 0 ? Math.round((earnedPts / totalPts) * 100) : 0;
    const sjPct = state.skillCheckSjPct;

    window.PROBLEMS.length = 0;
    window.PROBLEMS.push(...state.skillCheckBackup.problems);

    let suggestedFocus = "balanced";
    if (Math.abs(sjPct - codingPct) >= 15) {
      suggestedFocus = sjPct < codingPct ? "situational" : "coding";
    }

    state.skillCheckMode = null;
    state.skillCheckSjPct = null;
    state.skillCheckBackup = null;
    // Skill check reused the real situational/coding state fields
    // temporarily — reset them to a clean slate for the actual OA run.
    state.situational = { index: 0, answers: {}, elapsedSec: 0, timerHandle: null, rewardClaimed: false };
    state.coding = {
      currentProblemId: window.PROBLEMS[0].id,
      code: {},
      results: {},
      scores: {},
      timeLeftSec: CODING_SECONDS,
      timerHandle: null,
    };

    window.OAProfile.update({ skillCheck: { done: true, sjPct, codingPct, suggestedFocus }, onboarded: true });
    showSkillCheckResults(sjPct, codingPct, suggestedFocus);
  }

  function showSkillCheckResults(sjPct, codingPct, suggestedFocus) {
    showScreen("skillcheckResults");
    const profile = window.OAProfile.get();
    const suggestedOpt = FOCUS_OPTIONS.find((f) => f.id === suggestedFocus);
    const currentOpt = FOCUS_OPTIONS.find((f) => f.id === profile.focus) || FOCUS_OPTIONS[3];
    const root = screens.skillcheckResults.querySelector(".skillcheck-results-body");
    root.innerHTML = `
      <div class="score-summary">
        <div class="score-tile"><div class="num">${sjPct}%</div><div class="label">Situational judgment</div></div>
        <div class="score-tile"><div class="num">${codingPct}%</div><div class="label">Coding (1 easy problem)</div></div>
      </div>
      <div class="card">
        <p style="margin:0;">Based on this quick check, we'd suggest focusing on <strong>${suggestedOpt.label}</strong>.</p>
        <p style="color:var(--text-dim); margin: 6px 0 0;">You currently have <strong>${currentOpt.label}</strong> selected. This is just a quick diagnostic on a handful of questions, not a full score — feel free to keep your own pick.</p>
      </div>
      <div class="center" style="margin-top:20px; display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
        ${suggestedFocus !== profile.focus ? `<button class="btn" id="use-suggested-btn">Use Suggested Focus (${suggestedOpt.label})</button>` : ""}
        <button class="btn secondary" id="keep-focus-btn">Keep My Focus (${currentOpt.label})</button>
      </div>
    `;
    const finish = (focus) => {
      window.OAProfile.update({ focus });
      showScreen("home");
      renderHomeIntro(false);
    };
    if (suggestedFocus !== profile.focus) {
      root.querySelector("#use-suggested-btn").addEventListener("click", () => finish(suggestedFocus));
    }
    root.querySelector("#keep-focus-btn").addEventListener("click", () => finish(profile.focus));
  }

  // --- Bonus Focus Drill: offered on the results screen when the user has
  // picked a Situational Judgment or Coding focus, this serves a few extra
  // not-yet-seen items from the pool as optional bonus reps, using the same
  // swap-the-shared-array-then-restore trick as the skill check above.

  function startBonusDrill(kind) {
    if (kind === "situational") {
      state.bonusDrillMode = "situational";
      state.bonusDrillBackup = window.SITUATIONAL.slice();
      const usedIds = new Set(state.bonusDrillBackup.map((s) => s.id));
      let remaining = window.SITUATIONAL_POOL.filter((s) => !usedIds.has(s.id));
      if (remaining.length === 0) remaining = window.SITUATIONAL_POOL.slice();
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      window.SITUATIONAL.length = 0;
      window.SITUATIONAL.push(...remaining.slice(0, BONUS_SJ_COUNT));

      state.situational = { index: 0, answers: {}, elapsedSec: 0, timerHandle: null, rewardClaimed: true };
      showScreen("situational");
      clearSituationalTimer();
      timerPill.style.display = "inline-block";
      timerPill.classList.remove("low", "critical");
      timerPill.classList.add("stopwatch");
      timerPill.textContent = fmtClock(0);
      state.situational.timerHandle = setInterval(() => {
        state.situational.elapsedSec += 1;
        timerPill.textContent = fmtClock(state.situational.elapsedSec);
      }, 1000);
      window.OASituational.render(state, screens.situational.querySelector(".situational-body"), finishSituational);
      return;
    }

    if (kind === "coding") {
      state.bonusDrillMode = "coding";
      state.bonusDrillBackup = window.PROBLEMS.slice();
      const slotIdxs = [0, 1, 2, 3];
      for (let i = slotIdxs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [slotIdxs[i], slotIdxs[j]] = [slotIdxs[j], slotIdxs[i]];
      }
      const bonusProblems = slotIdxs.slice(0, BONUS_CODING_COUNT).map((slotIdx) => {
        const slot = window.PROBLEM_SLOTS[slotIdx];
        const currentId = state.bonusDrillBackup[slotIdx] ? state.bonusDrillBackup[slotIdx].id : null;
        const alternatives = slot.filter((p) => p.id !== currentId);
        const pool = alternatives.length ? alternatives : slot;
        return pool[Math.floor(Math.random() * pool.length)];
      });
      window.PROBLEMS.length = 0;
      window.PROBLEMS.push(...bonusProblems);

      state.coding.currentProblemId = bonusProblems[0].id;
      state.coding.timeLeftSec = BONUS_CODING_SECONDS;
      clearCodingTimer();
      showScreen("coding");
      timerPill.style.display = "inline-block";
      timerPill.classList.remove("stopwatch");
      timerPill.textContent = fmtClock(state.coding.timeLeftSec);
      window.OACoding.renderAll(state, screens.coding.querySelector(".coding-body"));

      state.coding.timerHandle = setInterval(() => {
        state.coding.timeLeftSec -= 1;
        timerPill.textContent = fmtClock(state.coding.timeLeftSec);
        timerPill.classList.toggle("low", state.coding.timeLeftSec <= 300);
        timerPill.classList.toggle("critical", state.coding.timeLeftSec <= 60);
        if (state.coding.timeLeftSec <= 0) {
          clearCodingTimer();
          finishCoding();
        }
      }, 1000);
    }
  }

  function handleBonusSituationalDone() {
    clearSituationalTimer();
    timerPill.style.display = "none";
    const sj = window.OASituational.score(state);
    const sjSolvedCount = sj.detail.filter((d) => d.mostCorrect && d.leastCorrect).length;
    const earned = sjSolvedCount * SJ_DOLLARS_PER_SCENARIO;
    window.OAWallet.earn(earned);

    window.SITUATIONAL.length = 0;
    window.SITUATIONAL.push(...state.bonusDrillBackup);
    state.bonusDrillMode = null;
    state.bonusDrillBackup = null;
    state.situational = { index: 0, answers: {}, elapsedSec: 0, timerHandle: null, rewardClaimed: true };

    updateWalletBadge();
    showScreen("results");
    renderBonusDrillDone(earned, sjSolvedCount, BONUS_SJ_COUNT, "scenario(s) nailed");
  }

  function handleBonusCodingDone() {
    clearCodingTimer();
    timerPill.style.display = "none";
    const solved = window.PROBLEMS.filter((p) => (state.coding.scores[p.id] || 0) === p.points);
    const earned = solved.reduce((sum, p) => sum + (p.reward || 0), 0);
    window.OAWallet.earn(earned);

    window.PROBLEMS.length = 0;
    window.PROBLEMS.push(...state.bonusDrillBackup);
    state.bonusDrillMode = null;
    state.bonusDrillBackup = null;
    state.coding.currentProblemId = window.PROBLEMS[0].id;

    updateWalletBadge();
    showScreen("results");
    renderBonusDrillDone(earned, solved.length, BONUS_CODING_COUNT, "problem(s) solved");
  }

  function renderBonusDrillDone(earned, solvedCount, outOf, label) {
    const area = screens.results.querySelector("#bonus-drill-area");
    if (!area) return;
    area.innerHTML = `
      <div class="card" id="bonus-drill-card">
        <h3 style="margin-top:0;">Bonus Drill Complete</h3>
        <p style="color:var(--text-dim); margin:0;">${solvedCount}/${outOf} ${label} → +$${earned}. New balance: $${window.OAWallet.getBalance()}</p>
      </div>
    `;
    const { newly } = awardNewlyCompletedGoals();
    if (newly.length) area.innerHTML += goalUnlockedHtml(newly);
  }

  function renderBonusDrillPrompt() {
    const profile = window.OAProfile.get();
    if (profile.focus === "situational") {
      return `
        <div class="card" id="bonus-drill-card">
          <h3 style="margin-top:0;">Focused Practice: Situational Judgment</h3>
          <p style="color:var(--text-dim);">Your focus is Situational Judgment — want ${BONUS_SJ_COUNT} more scenarios before you stop?</p>
          <button class="btn secondary" id="bonus-drill-btn" data-kind="situational">Start Bonus Drill (+${BONUS_SJ_COUNT} scenarios)</button>
        </div>
      `;
    }
    if (profile.focus === "coding") {
      return `
        <div class="card" id="bonus-drill-card">
          <h3 style="margin-top:0;">Focused Practice: Coding</h3>
          <p style="color:var(--text-dim);">Your focus is Coding — want ${BONUS_CODING_COUNT} more problems before you stop?</p>
          <button class="btn secondary" id="bonus-drill-btn" data-kind="coding">Start Bonus Drill (+${BONUS_CODING_COUNT} problems)</button>
        </div>
      `;
    }
    if (profile.focus === "behavioral") {
      return `
        <div class="card" id="bonus-drill-card">
          <h3 style="margin-top:0;">Focused Practice: Behavioral / Power Day</h3>
          <p style="color:var(--text-dim); margin:0;">Your focus is Behavioral — Power Day behavioral practice now serves a fresh set of questions every time you visit it, so drop in as often as you'd like.</p>
        </div>
      `;
    }
    return "";
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

    // --- OA Bucks: a full session (situational + coding + speed bonus) tops
    // out at $56, and a Power Day behavioral practice adds up to $4 more —
    // $60 total for the whole pipeline. Situational dollars are only ever
    // paid out once per OA session (the round isn't timed/re-run the way
    // coding is), so revisiting results via a Power Day "redo coding" pass
    // doesn't double-pay them.
    const isFirstCompletionThisSession = !state.situational.rewardClaimed;
    const sjSolvedCount = sj.detail.filter((d) => d.mostCorrect && d.leastCorrect).length;
    const sjDollarsThisTime = state.situational.rewardClaimed ? 0 : sjSolvedCount * SJ_DOLLARS_PER_SCENARIO;
    state.situational.rewardClaimed = true;

    const solvedProblems = window.PROBLEMS.filter((p) => (state.coding.scores[p.id] || 0) === p.points);
    const codingSolvedCount = solvedProblems.length;
    const codingDollars = solvedProblems.reduce((sum, p) => sum + (p.reward || 0), 0);

    let timeBonus = 0;
    let timeBonusLabel = "";
    if (state.coding.timeLeftSec >= 1800) {
      timeBonus = 8;
      timeBonusLabel = "⚡ Lightning Bonus — finished with 30+ minutes to spare";
    } else if (state.coding.timeLeftSec >= 600) {
      timeBonus = 4;
      timeBonusLabel = "⏱️ On-Time Bonus — finished with time to spare";
    }

    const totalEarned = sjDollarsThisTime + codingDollars + timeBonus;
    window.OAWallet.earn(totalEarned);

    window.OAGoals.recordRun(sjPct, codingPct, isFirstCompletionThisSession);
    const { newly: newlyGoals } = awardNewlyCompletedGoals();

    updateWalletBadge();
    const newBalance = window.OAWallet.getBalance();

    const root = screens.results.querySelector(".results-body");
    root.innerHTML = `
      <h3>Situational Judgment</h3>
      <div class="score-summary">
        <div class="score-tile"><div class="num">${sj.points}/${sj.total}</div><div class="label">SJ points</div></div>
        <div class="score-tile"><div class="num">${sjPct}%</div><div class="label">SJ percentage</div></div>
        <div class="score-tile"><div class="num">${fmtClock(state.situational.elapsedSec)}</div><div class="label">Time spent (untimed round)</div></div>
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

      <h3 style="margin-top:28px;">💰 OA Bucks Earned</h3>
      <div class="card">
        <ul class="tight">
          <li>Situational scenarios nailed (Most <em>and</em> Least correct): ${sjSolvedCount}/8 → ${sjDollarsThisTime > 0 ? `+$${sjDollarsThisTime}` : "$0 (already counted on an earlier run)"}</li>
          <li>Coding problems fully solved: ${codingSolvedCount}/4 → +$${codingDollars}</li>
          ${timeBonus > 0 ? `<li>${timeBonusLabel} → +$${timeBonus}</li>` : `<li>No speed bonus this run — finish with 10+ minutes left for one next time.</li>`}
        </ul>
        <div class="verdict strong" style="margin-bottom:0;">
          +$${totalEarned} earned this run · new balance: $${newBalance}
        </div>
        <p style="color:var(--text-dim); margin: 8px 0 0;">A perfect situational round + a perfect coding round + the speed bonus caps at $56 per OA run — finish a Power Day behavioral practice too and you can earn up to $60 total.</p>
        ${goalUnlockedHtml(newlyGoals)}
      </div>

      <div id="bonus-drill-area">${renderBonusDrillPrompt()}</div>

      <div class="center" style="margin-top:28px; display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
        <button class="btn" id="powerday-btn">What's Next: Power Day Prep →</button>
        <button class="btn secondary" id="shop-btn-results">Visit Reward Shop</button>
        <button class="btn secondary" id="goals-btn-results">View Goals</button>
        <button class="btn secondary" id="restart-btn">Restart Practice OA</button>
      </div>
    `;

    const bonusDrillBtn = root.querySelector("#bonus-drill-btn");
    if (bonusDrillBtn) {
      bonusDrillBtn.addEventListener("click", () => startBonusDrill(bonusDrillBtn.getAttribute("data-kind")));
    }

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
    root.querySelector("#shop-btn-results").addEventListener("click", showShop);
    root.querySelector("#goals-btn-results").addEventListener("click", showGoals);
    root.querySelector("#restart-btn").addEventListener("click", () => {
      state = freshState();
      showScreen("home");
    });
  }

  function renderOwnedShelf() {
    const shelf = screens.shop.querySelector("#owned-shelf");
    if (!shelf) return;
    const owned = window.OAWallet.getOwned();
    if (owned.length === 0) {
      shelf.innerHTML = `<span class="empty">Nothing yet — earn some OA Bucks and come back!</span>`;
      return;
    }
    shelf.innerHTML = owned
      .map((id) => {
        const item = window.SHOP_ITEMS.find((i) => i.id === id);
        return item ? `<span class="arcade-chip" title="${item.name}">${arcadeInitials(item.name)}</span>` : "";
      })
      .join("");
  }

  function arcadeInitials(name) {
    return name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function renderShopGrid() {
    const grid = screens.shop.querySelector("#shop-grid");
    const balance = window.OAWallet.getBalance();
    grid.innerHTML = window.SHOP_ITEMS.map((item) => {
      const owned = window.OAWallet.isOwned(item.id);
      const canAfford = balance >= item.cost;
      return `
        <div class="shop-item ${owned ? "owned" : ""}">
          <div class="arcade-badge">${arcadeInitials(item.name)}</div>
          <div class="name">${item.name}</div>
          <div class="flavor">${item.flavor}</div>
          ${
            owned
              ? `<div class="owned-tag">OWNED</div>`
              : `<div class="cost">$${item.cost}</div><button class="btn small arcade-btn" data-buy="${item.id}" ${canAfford ? "" : "disabled"}>${canAfford ? "BUY" : "NEED $"}</button>`
          }
        </div>
      `;
    }).join("");

    grid.querySelectorAll("[data-buy]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = window.SHOP_ITEMS.find((i) => i.id === btn.getAttribute("data-buy"));
        if (item && window.OAWallet.buy(item.id, item.cost)) {
          awardNewlyCompletedGoals();
          updateWalletBadge();
          renderShopGrid();
          renderOwnedShelf();
        }
      });
    });
  }

  function showShop() {
    showScreen("shop");
    const root = screens.shop.querySelector(".shop-body");
    root.innerHTML = `
      <div class="card">
        <p style="color:var(--text-dim); margin:0;">
          Purely cosmetic — nothing here affects your score. Your balance and collection are saved
          in this browser only (they won't follow you to a different device or browser).
        </p>
      </div>
      <div class="score-tile" style="max-width:220px; margin:0 auto 20px;">
        <div class="num">$${window.OAWallet.getBalance()}</div>
        <div class="label">Your balance</div>
      </div>
      <div class="shop-grid" id="shop-grid"></div>
      <div class="card" style="margin-top:24px;">
        <h3 style="margin-top:0;">Your collection</h3>
        <div class="owned-shelf" id="owned-shelf"></div>
      </div>
      <div class="center" style="margin-top:20px;">
        <button class="btn secondary" id="shop-home-btn">Back to Home</button>
      </div>
    `;
    renderShopGrid();
    renderOwnedShelf();
    root.querySelector("#shop-home-btn").addEventListener("click", () => showScreen("home"));
  }

  function showGoals() {
    showScreen("goals");
    const root = screens.goals.querySelector(".goals-body");
    const goals = window.OAGoals.getAll();
    const doneCount = goals.filter((g) => g.done).length;
    const pct = Math.round((doneCount / goals.length) * 100);
    root.innerHTML = `
      <div class="card">
        <p style="color:var(--text-dim); margin:0 0 4px;">
          ${doneCount}/${goals.length} goals complete — each pays a one-time OA Bucks bonus the
          moment you hit it. Progress is saved in this browser and carries across practice runs.
        </p>
        <div class="goals-progress"><div class="goals-progress-fill" style="width:${pct}%;"></div></div>
      </div>
      <div class="goals-grid">
        ${goals
          .map(
            (g) => `
          <div class="goal-card ${g.done ? "done" : ""}">
            <div class="goal-top">
              <span class="goal-title">${g.title}</span>
              <span class="goal-reward">$${g.reward}</span>
            </div>
            <div class="goal-desc">${g.desc}</div>
            <div class="goal-check">${g.done ? "✓ Complete" : ""}</div>
          </div>
        `
          )
          .join("")}
      </div>
      <div class="center" style="margin-top:20px;">
        <button class="btn secondary" id="goals-home-btn">Back to Home</button>
      </div>
    `;
    root.querySelector("#goals-home-btn").addEventListener("click", () => showScreen("home"));
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
    // Reroll a fresh 10-question draw from the 20-question pool every visit,
    // so Power Day behavioral practice (the natural "extra reps" venue for a
    // Behavioral-focused profile) doesn't just repeat the same set each time.
    window.buildBehavioralSet();
    state.behavioral.index = 0;
    state.behavioral.phase = "think";
    state.behavioral.timeLeftSec = window.OABehavioral.THINK_SECONDS;
    state.behavioral.responses = [];
    showScreen("behavioral");
    window.OABehavioral.render(state, screens.behavioral.querySelector(".behavioral-body"), showBehavioralReview);
  }

  const BEHAVIORAL_COMPLETION_REWARD = 4;

  function showBehavioralReview() {
    window.OABehavioral.clearTimer(state);
    showScreen("behavioralReview");

    window.OAWallet.earn(BEHAVIORAL_COMPLETION_REWARD);
    window.OAGoals.markBehavioralTried();
    const { newly: newlyGoals } = awardNewlyCompletedGoals();
    updateWalletBadge();

    const root = screens.behavioralReview.querySelector(".behavioral-review-body");
    root.innerHTML = `
      <p style="color: var(--text-dim);">Self-grade each answer against the STAR framework — this is not auto-scored.</p>
      <div class="verdict strong">+$${BEHAVIORAL_COMPLETION_REWARD} earned for completing this Power Day behavioral practice · new balance: $${window.OAWallet.getBalance()}</div>
      ${goalUnlockedHtml(newlyGoals)}
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
  document.getElementById("view-shop-btn").addEventListener("click", showShop);
  document.getElementById("view-goals-btn").addEventListener("click", showGoals);
  walletBadge.addEventListener("click", showShop);

  updateWalletBadge();
  updateGoalsSummaryHome();
  renderDateBanner();
  renderHomeIntro(false);
  showScreen("home");
})();
