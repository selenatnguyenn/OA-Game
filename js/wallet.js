/* Persists "OA Bucks" balance and owned reward-shop items in localStorage,
   so they accumulate across practice runs in this browser. Wrapped in
   try/catch since storage can throw (private browsing, blocked storage). */

window.OAWallet = (function () {
  const KEY = "tdpPracticeWallet";

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { balance: 0, owned: [] };
      const parsed = JSON.parse(raw);
      return {
        balance: Number(parsed.balance) || 0,
        owned: Array.isArray(parsed.owned) ? parsed.owned : [],
      };
    } catch (e) {
      return { balance: 0, owned: [] };
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(wallet));
    } catch (e) {
      /* ignore — storage may be unavailable */
    }
  }

  let wallet = load();

  function getBalance() {
    return wallet.balance;
  }

  function isOwned(itemId) {
    return wallet.owned.includes(itemId);
  }

  function getOwned() {
    return wallet.owned.slice();
  }

  function earn(amount) {
    if (amount <= 0) return;
    wallet.balance += amount;
    save();
  }

  function buy(itemId, cost) {
    if (isOwned(itemId)) return false;
    if (wallet.balance < cost) return false;
    wallet.balance -= cost;
    wallet.owned.push(itemId);
    save();
    return true;
  }

  return { getBalance, isOwned, getOwned, earn, buy };
})();
