/* GospelGPS — local storage.
   Everything the user creates lives on THIS DEVICE only, in localStorage.
   No server, no account, no syncing. Clearing browser data erases it,
   which is why there is an Export button. */

const Store = (() => {
  const KEY = "gospelgps.v1";

  const blank = () => ({
    version: 1,
    journal: [],                                   // {id, ts, outcome, name, place, note}
    practice: {
      streak: 0,
      bestStreak: 0,
      lastDay: null,                               // "YYYY-MM-DD"
      badges: [],
      cardsSeen: 0,
      bestMapTime: null,                           // seconds
      blankStreak: 0
    },
    prefs: { size: "s", installDismissed: false },
    seenMilestones: []
  });

  let data = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      const parsed = JSON.parse(raw);
      const b = blank();
      return {
        ...b, ...parsed,
        practice: { ...b.practice, ...(parsed.practice || {}) },
        prefs:    { ...b.prefs,    ...(parsed.prefs    || {}) },
        journal:  Array.isArray(parsed.journal) ? parsed.journal : [],
        seenMilestones: Array.isArray(parsed.seenMilestones) ? parsed.seenMilestones : []
      };
    } catch (e) {
      console.warn("Could not read saved data; starting fresh.", e);
      return blank();
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Could not save.", e);
      return false;
    }
  }

  /* ---------- date helpers (local time, not UTC) ---------- */
  const dayKey = d => {
    const x = d ? new Date(d) : new Date();
    return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
  };
  const monthKey = d => dayKey(d).slice(0, 7);

  function daysBetween(aKey, bKey) {
    const a = new Date(aKey + "T00:00:00");
    const b = new Date(bKey + "T00:00:00");
    return Math.round((b - a) / 86400000);
  }

  /* ---------- journal ---------- */
  function addEntry({ outcome, name, place, note }) {
    const entry = {
      id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()),
      ts: Date.now(),
      outcome,
      name: (name || "").trim(),
      place: (place || "").trim(),
      note: (note || "").trim()
    };
    data.journal.unshift(entry);
    save();
    return entry;
  }

  function deleteEntry(id) {
    data.journal = data.journal.filter(e => e.id !== id);
    save();
  }

  const entries = () => data.journal.slice().sort((a, b) => b.ts - a.ts);

  function stats() {
    const j = data.journal;
    const thisM = monthKey();
    const lastMDate = new Date();
    lastMDate.setDate(1);
    lastMDate.setMonth(lastMDate.getMonth() - 1);
    const lastM = monthKey(lastMDate);

    return {
      total:     j.length,
      saved:     j.filter(e => e.outcome === "saved").length,
      presented: j.filter(e => e.outcome === "presented").length,
      seeds:     j.filter(e => e.outcome === "seed").length,
      notInt:    j.filter(e => e.outcome === "not").length,
      thisMonth: j.filter(e => monthKey(e.ts) === thisM).length,
      lastMonth: j.filter(e => monthKey(e.ts) === lastM).length
    };
  }

  /* Presentations per month for the last `n` months, oldest first. */
  function monthlyCounts(n = 6) {
    const out = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const k = monthKey(d);
      out.push({
        key: k,
        label: d.toLocaleString(undefined, { month: "short" }),
        count: data.journal.filter(e => monthKey(e.ts) === k).length
      });
    }
    return out;
  }

  /* ---------- milestones ---------- */
  /* Returns the milestone to celebrate right now, or null. */
  function checkMilestone() {
    const s = stats();
    for (const m of MILESTONES) {
      if (data.seenMilestones.includes(m.id)) continue;
      let hit = false;
      try { hit = m.test(s); } catch (e) { hit = false; }
      if (hit) {
        data.seenMilestones.push(m.id);
        save();
        return m;
      }
    }
    return null;
  }

  /* ---------- practice ---------- */
  function touchPracticeDay() {
    const today = dayKey();
    const p = data.practice;
    if (p.lastDay === today) return p.streak;

    if (p.lastDay && daysBetween(p.lastDay, today) === 1) p.streak += 1;
    else p.streak = 1;

    p.lastDay = today;
    p.bestStreak = Math.max(p.bestStreak || 0, p.streak);
    save();
    return p.streak;
  }

  /* Streak shown on screen — decays to 0 if they missed a day. */
  function currentStreak() {
    const p = data.practice;
    if (!p.lastDay) return 0;
    const gap = daysBetween(p.lastDay, dayKey());
    return gap <= 1 ? p.streak : 0;
  }

  function awardBadge(id) {
    if (!BADGES.some(b => b.id === id)) return false;
    if (data.practice.badges.includes(id)) return false;
    data.practice.badges.push(id);
    save();
    return true;                                   // true = newly earned
  }

  const hasBadge = id => data.practice.badges.includes(id);
  const practice = () => data.practice;

  function setBestMapTime(sec) {
    const p = data.practice;
    if (p.bestMapTime === null || sec < p.bestMapTime) { p.bestMapTime = sec; save(); return true; }
    return false;
  }

  function bumpCardsSeen() { data.practice.cardsSeen = (data.practice.cardsSeen || 0) + 1; save(); }

  /* ---------- prefs ---------- */
  const prefs = () => data.prefs;
  function setPref(k, v) { data.prefs[k] = v; save(); }

  /* ---------- backup ---------- */
  function exportBlob() {
    const payload = { ...data, exportedAt: new Date().toISOString(), app: "GospelGPS" };
    return new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  }

  function importJSON(text, mode = "merge") {
    const incoming = JSON.parse(text);
    if (!incoming || !Array.isArray(incoming.journal)) throw new Error("That file doesn’t look like a GospelGPS backup.");

    if (mode === "replace") {
      data = { ...blank(), ...incoming, journal: incoming.journal };
    } else {
      const seen = new Set(data.journal.map(e => e.id));
      const added = incoming.journal.filter(e => e && !seen.has(e.id));
      data.journal = data.journal.concat(added);
      if (incoming.practice) {
        const p = data.practice, q = incoming.practice;
        p.bestStreak = Math.max(p.bestStreak || 0, q.bestStreak || 0);
        p.cardsSeen  = Math.max(p.cardsSeen  || 0, q.cardsSeen  || 0);
        if (q.bestMapTime != null) p.bestMapTime = p.bestMapTime == null ? q.bestMapTime : Math.min(p.bestMapTime, q.bestMapTime);
        (q.badges || []).forEach(b => { if (!p.badges.includes(b)) p.badges.push(b); });
      }
      (incoming.seenMilestones || []).forEach(m => { if (!data.seenMilestones.includes(m)) data.seenMilestones.push(m); });
    }
    save();
    return data.journal.length;
  }

  function eraseAll() { data = blank(); save(); }

  return {
    addEntry, deleteEntry, entries, stats, monthlyCounts,
    checkMilestone,
    touchPracticeDay, currentStreak, awardBadge, hasBadge, practice,
    setBestMapTime, bumpCardsSeen,
    prefs, setPref,
    exportBlob, importJSON, eraseAll,
    dayKey, monthKey
  };
})();
