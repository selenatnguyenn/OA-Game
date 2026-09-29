/* Persists the practice profile — name, chosen focus area, target OA date,
   and skill-check results. Kept separate from wallet/goals (and outside the
   resettable app `state`) so "Restart Practice OA" doesn't wipe who you are
   or what you're focusing on. */

window.OAProfile = (function () {
  const KEY = "tdpPracticeProfile";
  const VALID_FOCUS = ["situational", "coding", "behavioral", "balanced"];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      const d = raw ? JSON.parse(raw) : {};
      return {
        name: typeof d.name === "string" ? d.name.slice(0, 30) : "",
        focus: VALID_FOCUS.includes(d.focus) ? d.focus : "balanced",
        oaDate: typeof d.oaDate === "string" ? d.oaDate : "",
        onboarded: !!d.onboarded,
        skillCheck: d.skillCheck && typeof d.skillCheck === "object" ? d.skillCheck : null,
      };
    } catch (e) {
      return { name: "", focus: "balanced", oaDate: "", onboarded: false, skillCheck: null };
    }
  }

  let profile = load();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(profile));
    } catch (e) {
      /* ignore — storage may be unavailable */
    }
  }

  function get() {
    return { ...profile };
  }

  function update(patch) {
    profile = { ...profile, ...patch };
    save();
    return get();
  }

  return { get, update };
})();
