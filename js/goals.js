/* Modernized "goals" / achievements layer on top of the OA Bucks economy.
   Progress is tracked in localStorage and persists across practice runs;
   completing a goal pays a one-time OA Bucks bonus (paid by the caller via
   window.OAWallet.earn, using the reward returned here). */

window.OAGoals = (function () {
  const KEY = "tdpPracticeGoals";

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      const d = raw ? JSON.parse(raw) : {};
      return {
        totalRuns: Number(d.totalRuns) || 0,
        bestSjPct: Number(d.bestSjPct) || 0,
        bestCodingPct: Number(d.bestCodingPct) || 0,
        behavioralTried: !!d.behavioralTried,
        completed: Array.isArray(d.completed) ? d.completed : [],
      };
    } catch (e) {
      return { totalRuns: 0, bestSjPct: 0, bestCodingPct: 0, behavioralTried: false, completed: [] };
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      /* ignore — storage may be unavailable */
    }
  }

  let data = load();

  const GOALS = [
    { id: "first-run", title: "First Steps", desc: "Complete one full OA practice run (situational + coding).", reward: 2, check: (d) => d.totalRuns >= 1 },
    { id: "people-person", title: "People Person", desc: "Score 6/8+ on situational judgment in a single run.", reward: 3, check: (d) => d.bestSjPct >= 75 },
    { id: "code-ready", title: "Code Ready", desc: "Score 70%+ on the coding round in a single run.", reward: 3, check: (d) => d.bestCodingPct >= 70 },
    { id: "power-day-prepped", title: "Power Day Prepped", desc: "Complete a full Power Day behavioral practice run.", reward: 3, check: (d) => d.behavioralTried },
    { id: "collector", title: "Collector", desc: "Own 3 items from the Reward Shop.", reward: 3, check: () => window.OAWallet.getOwned().length >= 3 },
    { id: "dedicated", title: "Dedicated", desc: "Complete 3 full OA practice runs.", reward: 5, check: (d) => d.totalRuns >= 3 },
  ];

  // countAsRun should be false for a Power Day "redo coding" pass — those are
  // real coding attempts (so best-score tracking still updates), but they
  // aren't a fresh full OA session, so they shouldn't count toward
  // "Dedicated"/"First Steps".
  function recordRun(sjPct, codingPct, countAsRun) {
    if (countAsRun) data.totalRuns += 1;
    data.bestSjPct = Math.max(data.bestSjPct, sjPct);
    data.bestCodingPct = Math.max(data.bestCodingPct, codingPct);
    save();
  }

  function markBehavioralTried() {
    data.behavioralTried = true;
    save();
  }

  // Call after any state-changing action (a run, a purchase, a behavioral
  // practice) to find goals that just became true. Returns the list of
  // newly-completed goal objects (each with its .reward) so the caller can
  // pay out and show a "goal unlocked" note.
  function checkNewlyCompleted() {
    const newly = [];
    GOALS.forEach((g) => {
      if (!data.completed.includes(g.id) && g.check(data)) {
        data.completed.push(g.id);
        newly.push(g);
      }
    });
    if (newly.length) save();
    return newly;
  }

  function getAll() {
    return GOALS.map((g) => ({ ...g, done: data.completed.includes(g.id) }));
  }

  function getStats() {
    return { ...data };
  }

  return { recordRun, markBehavioralTried, checkNewlyCompleted, getAll, getStats };
})();
