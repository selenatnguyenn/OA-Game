/* Renders and drives the HireVue-style behavioral round: think time, then a
   timed typed response (standing in for a recorded video answer). */

window.OABehavioral = (function () {
  const THINK_SECONDS = 30;
  const ANSWER_SECONDS = 120;
  const questions = window.BEHAVIORAL;

  function fmt(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function clearTimer(state) {
    if (state.behavioral.timerHandle) {
      clearInterval(state.behavioral.timerHandle);
      state.behavioral.timerHandle = null;
    }
  }

  function render(state, root, onFinish) {
    clearTimer(state);
    const b = state.behavioral;
    const q = questions[b.index];
    const isLast = b.index === questions.length - 1;

    root.innerHTML = `
      <div class="progress-dots" id="dots"></div>
      <div class="behavioral-question">
        <div class="section-tag">${q.section}</div>
        <div class="phase-banner ${b.phase === "answer" ? "answering" : ""}" id="phase-banner">
          <span class="dot"></span>
          <span id="phase-label"></span>
          <span id="phase-timer" style="font-variant-numeric:tabular-nums;"></span>
        </div>
        <h2>${q.q}</h2>
        <textarea class="answer-box" id="answer-box" placeholder="Your typed answer will go here once prep time ends. Speak it out loud as you type, as if this were a recorded video response."></textarea>
        <div class="meta-row">
          <span id="word-count">0 words</span>
          <span>STAR format recommended: Situation, Task, Action, Result</span>
        </div>
        <div class="tip-box">${q.tip}</div>
        <div class="actions-row" id="behavioral-actions"></div>
      </div>
    `;

    const dots = root.querySelector("#dots");
    dots.innerHTML = questions
      .map((_, i) => {
        const cls = i < b.index ? "done" : i === b.index ? "current" : "";
        return `<span class="dot ${cls}"></span>`;
      })
      .join("");

    const textarea = root.querySelector("#answer-box");
    const wordCountEl = root.querySelector("#word-count");
    const phaseLabel = root.querySelector("#phase-label");
    const phaseTimer = root.querySelector("#phase-timer");
    const actions = root.querySelector("#behavioral-actions");

    const existing = b.responses[b.index];
    textarea.value = existing ? existing.text : "";
    wordCountEl.textContent = `${countWords(textarea.value)} words`;

    textarea.addEventListener("input", () => {
      wordCountEl.textContent = `${countWords(textarea.value)} words`;
    });

    function countWords(text) {
      return text.trim() ? text.trim().split(/\s+/).length : 0;
    }

    function updatePhaseUI() {
      if (b.phase === "think") {
        phaseLabel.textContent = "Prep Time";
        textarea.disabled = true;
      } else {
        phaseLabel.textContent = "Answering";
        textarea.disabled = false;
      }
      phaseTimer.textContent = fmt(b.timeLeftSec);
    }

    function submitAnswer(auto) {
      clearTimer(state);
      const timeSpent = ANSWER_SECONDS - (b.phase === "answer" ? b.timeLeftSec : 0);
      b.responses[b.index] = {
        text: textarea.value,
        wordCount: countWords(textarea.value),
        timeSpentSec: b.phase === "answer" ? timeSpent : 0,
        autoSubmitted: !!auto,
      };
      if (isLast) {
        onFinish();
      } else {
        b.index += 1;
        b.phase = "think";
        b.timeLeftSec = THINK_SECONDS;
        render(state, root, onFinish);
      }
    }

    function renderActions() {
      actions.innerHTML = "";
      if (b.phase === "think") {
        const skipBtn = document.createElement("button");
        skipBtn.className = "btn secondary small";
        skipBtn.textContent = "Start Answering Now (practice-only skip)";
        skipBtn.addEventListener("click", () => {
          b.phase = "answer";
          b.timeLeftSec = ANSWER_SECONDS;
          clearTimer(state);
          render(state, root, onFinish);
        });
        actions.appendChild(skipBtn);
      } else {
        const submitBtn = document.createElement("button");
        submitBtn.className = "btn";
        submitBtn.textContent = isLast ? "Submit & Finish" : "Submit & Next";
        submitBtn.addEventListener("click", () => submitAnswer(false));
        actions.appendChild(submitBtn);
      }
    }

    updatePhaseUI();
    renderActions();

    state.behavioral.timerHandle = setInterval(() => {
      b.timeLeftSec -= 1;
      if (b.timeLeftSec <= 0) {
        if (b.phase === "think") {
          clearTimer(state);
          b.phase = "answer";
          b.timeLeftSec = ANSWER_SECONDS;
          render(state, root, onFinish);
        } else {
          clearTimer(state);
          submitAnswer(true);
        }
        return;
      }
      phaseTimer.textContent = fmt(b.timeLeftSec);
    }, 1000);
  }

  return { render, clearTimer, THINK_SECONDS, ANSWER_SECONDS, questions };
})();
