/* Executes untrusted candidate code inside a sandboxed Web Worker (via a
   Blob URL, so it also works when index.html is opened directly with
   file://) and enforces a per-test timeout so an infinite loop can't hang
   the page. */

window.OARunner = (function () {
  const WORKER_SRC = `
    self.onmessage = function (e) {
      const { code, callCode } = e.data;
      try {
        const fullScript = code + "\\n;\\nself.__RESULT__ = (function () {\\n" + callCode + "\\n})();";
        (0, eval)(fullScript);
        self.postMessage({ ok: true, result: self.__RESULT__ });
      } catch (err) {
        self.postMessage({ ok: false, error: (err && err.message) ? err.message : String(err) });
      }
    };
  `;

  function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a === null || b === null) return a === b;
    if (typeof a !== "object") return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const k of aKeys) {
      if (!deepEqual(a[k], b[k])) return false;
    }
    return true;
  }

  function runOne(code, callCode, timeoutMs) {
    return new Promise((resolve) => {
      let blobUrl;
      let worker;
      try {
        const blob = new Blob([WORKER_SRC], { type: "application/javascript" });
        blobUrl = URL.createObjectURL(blob);
        worker = new Worker(blobUrl);
      } catch (err) {
        resolve({ ok: false, error: "Could not start sandbox: " + err.message });
        return;
      }

      let done = false;
      const cleanup = () => {
        if (worker) worker.terminate();
        if (blobUrl) URL.revokeObjectURL(blobUrl);
      };

      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        cleanup();
        resolve({ ok: false, error: "Time limit exceeded (possible infinite loop)" });
      }, timeoutMs);

      worker.onmessage = (e) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        cleanup();
        resolve(e.data);
      };
      worker.onerror = (e) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        cleanup();
        resolve({ ok: false, error: e.message || "Worker error" });
      };
      worker.postMessage({ code, callCode });
    });
  }

  async function runProblem(code, problem, timeoutMs) {
    timeoutMs = timeoutMs || 3000;
    const results = [];
    for (const test of problem.tests) {
      const callCode = problem.callTemplate.split("__INPUT__").join(JSON.stringify(test.input));
      const out = await runOne(code, callCode, timeoutMs);
      const pass = out.ok && deepEqual(out.result, test.expected);
      results.push({
        pass,
        hidden: !!test.hidden,
        input: test.input,
        expected: test.expected,
        actual: out.ok ? out.result : undefined,
        error: out.ok ? null : out.error,
      });
    }
    return results;
  }

  return { runProblem };
})();
