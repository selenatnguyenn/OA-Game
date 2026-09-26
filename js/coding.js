/* Renders and drives the coding round (problem tabs, editor, run tests). */

window.OACoding = (function () {
  const problems = window.PROBLEMS;

  function totalPoints() {
    return problems.reduce((s, p) => s + p.points, 0);
  }

  function currentProblem(state) {
    return problems.find((p) => p.id === state.coding.currentProblemId);
  }

  function scoreEarned(state) {
    return problems.reduce((s, p) => s + (state.coding.scores[p.id] || 0), 0);
  }

  function renderTabs(state, container, root) {
    container.innerHTML = "";
    problems.forEach((p) => {
      const tab = document.createElement("div");
      tab.className = "problem-tab" + (p.id === state.coding.currentProblemId ? " active" : "");
      const score = state.coding.scores[p.id];
      tab.innerHTML = `
        <div class="diff ${p.difficulty}">${p.difficulty} · ${p.points} pts</div>
        <div>${p.title}</div>
        ${score !== undefined ? `<div class="score-badge">${score}/${p.points} earned</div>` : ""}
      `;
      tab.addEventListener("click", () => {
        state.coding.currentProblemId = p.id;
        renderAll(state, root);
      });
      container.appendChild(tab);
    });
  }

  function renderTestResults(problem, results) {
    if (!results) return "";
    return results
      .map((r, i) => {
        const label = r.hidden ? `Hidden Test ${i + 1}` : `Test ${i + 1}`;
        let body = "";
        if (!r.hidden) {
          body = `<pre>Input: ${JSON.stringify(r.input)}
Expected: ${JSON.stringify(r.expected)}
Actual:   ${r.error ? "ERROR: " + r.error : JSON.stringify(r.actual)}</pre>`;
        } else if (!r.pass) {
          body = `<pre>${r.error ? "ERROR: " + r.error : "Output did not match expected result."}</pre>`;
        }
        return `<div class="test-result ${r.pass ? "pass" : "fail"}">
          <span class="label ${r.pass ? "pass" : "fail"}">${r.pass ? "PASS" : "FAIL"}</span> — ${label}
          ${body}
        </div>`;
      })
      .join("");
  }

  function renderAll(state, root) {
    const problem = currentProblem(state);
    root.innerHTML = `
      <div class="coding-layout">
        <div>
          <div class="problem-list" id="problem-tabs"></div>
          <div class="card" style="margin-top:14px;">
            <div style="display:flex; justify-content:space-between;">
              <strong>Total score</strong>
              <span>${scoreEarned(state)} / ${totalPoints()}</span>
            </div>
          </div>
        </div>
        <div>
          <div class="prompt-box">
            <h3 style="margin-top:0;">${problem.title} <span class="diff ${problem.difficulty}" style="font-size:0.7rem;">${problem.difficulty}</span></h3>
            ${problem.prompt}
          </div>
          <textarea class="code-editor" id="code-editor" spellcheck="false"></textarea>
          <div class="actions-row">
            <button class="btn" id="run-tests-btn">Run Tests</button>
            <button class="btn secondary small" id="reset-code-btn">Reset to Starter Code</button>
          </div>
          <div id="test-output"></div>
        </div>
      </div>
    `;

    renderTabs(state, root.querySelector("#problem-tabs"), root);

    const editor = root.querySelector("#code-editor");
    editor.value = state.coding.code[problem.id] ?? problem.starterCode;
    editor.addEventListener("input", () => {
      state.coding.code[problem.id] = editor.value;
    });
    editor.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.slice(0, start) + "  " + editor.value.slice(end);
        editor.selectionStart = editor.selectionEnd = start + 2;
        state.coding.code[problem.id] = editor.value;
      }
    });

    const output = root.querySelector("#test-output");
    const lastResults = state.coding.results[problem.id];
    if (lastResults) {
      output.innerHTML = renderTestResults(problem, lastResults);
    }

    root.querySelector("#reset-code-btn").addEventListener("click", () => {
      editor.value = problem.starterCode;
      state.coding.code[problem.id] = problem.starterCode;
    });

    root.querySelector("#run-tests-btn").addEventListener("click", async (e) => {
      const btn = e.target;
      btn.disabled = true;
      btn.textContent = "Running…";
      output.innerHTML = `<p style="color: var(--text-dim);">Running tests in sandbox…</p>`;
      try {
        const results = await window.OARunner.runProblem(editor.value, problem);
        state.coding.results[problem.id] = results;
        const passed = results.filter((r) => r.pass).length;
        const earned = Math.round((passed / results.length) * problem.points);
        state.coding.scores[problem.id] = Math.max(state.coding.scores[problem.id] || 0, earned);
        output.innerHTML = renderTestResults(problem, results);
        renderTabs(state, root.querySelector("#problem-tabs"), root);
        root.querySelector(".card span").textContent = `${scoreEarned(state)} / ${totalPoints()}`;
      } finally {
        btn.disabled = false;
        btn.textContent = "Run Tests";
      }
    });
  }

  return { renderAll, totalPoints, scoreEarned, currentProblem };
})();
