/* Renders and drives the Situational Judgment round: untimed, multiple choice,
   "most effective / least effective" format matching the real Virtual Job
   Tryout style assessment. */

window.OASituational = (function () {
  const scenarios = window.SITUATIONAL;

  function render(state, root, onFinish) {
    const s = state.situational;
    const scenario = scenarios[s.index];
    const isLast = s.index === scenarios.length - 1;
    const saved = s.answers[scenario.id] || { mostId: null, leastId: null };

    root.innerHTML = `
      <div class="progress-dots" id="sj-dots"></div>
      <div class="behavioral-question">
        <div class="section-tag">Situational Judgment · ${scenario.competency}</div>
        <h2 style="font-size:1.15rem;">${scenario.scenario}</h2>
        <p style="color:var(--text-dim); font-size:0.85rem; margin-top:-8px;">
          For each option, mark which response you think is <strong>Most Effective</strong> and which is <strong>Least Effective</strong>.
          This round is untimed — take your time.
        </p>
        <div id="sj-options"></div>
        <div class="actions-row" style="justify-content:space-between; margin-top:18px;">
          <button class="btn secondary" id="sj-back" ${s.index === 0 ? "disabled" : ""}>← Back</button>
          <button class="btn" id="sj-next" disabled>${isLast ? "Finish Situational Judgment" : "Next →"}</button>
        </div>
      </div>
    `;

    const dots = root.querySelector("#sj-dots");
    dots.innerHTML = scenarios
      .map((_, i) => {
        const cls = i < s.index ? "done" : i === s.index ? "current" : "";
        return `<span class="dot ${cls}"></span>`;
      })
      .join("");

    const optionsRoot = root.querySelector("#sj-options");
    optionsRoot.innerHTML = `
      <div class="sjt-table">
        <div class="sjt-header">
          <span></span><span>Most Effective</span><span>Least Effective</span>
        </div>
        ${scenario.options
          .map(
            (opt) => `
          <div class="sjt-row">
            <span class="sjt-text">${opt.text}</span>
            <span class="sjt-radio"><input type="radio" name="most" value="${opt.id}" ${saved.mostId === opt.id ? "checked" : ""}></span>
            <span class="sjt-radio"><input type="radio" name="least" value="${opt.id}" ${saved.leastId === opt.id ? "checked" : ""}></span>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    const nextBtn = root.querySelector("#sj-next");

    function currentSelection() {
      const mostEl = optionsRoot.querySelector('input[name="most"]:checked');
      const leastEl = optionsRoot.querySelector('input[name="least"]:checked');
      return { mostId: mostEl ? mostEl.value : null, leastId: leastEl ? leastEl.value : null };
    }

    function updateNextState() {
      const sel = currentSelection();
      const valid = sel.mostId && sel.leastId && sel.mostId !== sel.leastId;
      nextBtn.disabled = !valid;
      nextBtn.title = sel.mostId && sel.mostId === sel.leastId ? "Most and Least can't be the same option" : "";
    }

    optionsRoot.addEventListener("change", () => {
      const sel = currentSelection();
      s.answers[scenario.id] = sel;
      updateNextState();
    });

    updateNextState();

    root.querySelector("#sj-back").addEventListener("click", () => {
      s.index -= 1;
      render(state, root, onFinish);
    });

    nextBtn.addEventListener("click", () => {
      if (isLast) {
        onFinish();
      } else {
        s.index += 1;
        render(state, root, onFinish);
      }
    });
  }

  function score(state) {
    let points = 0;
    const total = scenarios.length * 2;
    const detail = scenarios.map((scenario) => {
      const ans = state.situational.answers[scenario.id] || {};
      const mostOpt = scenario.options.find((o) => o.id === ans.mostId);
      const leastOpt = scenario.options.find((o) => o.id === ans.leastId);
      const mostCorrect = mostOpt && mostOpt.rank === 1;
      const leastCorrect = leastOpt && leastOpt.rank === scenario.options.length;
      if (mostCorrect) points += 1;
      if (leastCorrect) points += 1;
      return { scenario, ans, mostCorrect, leastCorrect };
    });
    return { points, total, detail };
  }

  return { render, score, scenarios };
})();
