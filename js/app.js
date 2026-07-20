/* GospelGPS — screens and interaction.
   Plain JavaScript, no libraries, no network calls. */

/* =========================================================
   Small helpers
   ========================================================= */

const $  = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* Escape anything the user typed before putting it in HTML. */
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let toastTimer = null;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2200);
}

function openSheet(html) {
  $("#sheetInner").innerHTML = `<div class="grabber"></div>` + html;
  $("#sheet").hidden = false;
  document.body.style.overflow = "hidden";
}
function closeSheet() {
  $("#sheet").hidden = true;
  $("#sheetInner").innerHTML = "";
  document.body.style.overflow = "";
}
$("#sheet").addEventListener("click", e => { if (e.target.id === "sheet") closeSheet(); });

function celebrate(html) {
  const c = $("#celebrate");
  c.innerHTML = html;
  c.hidden = false;
}
function closeCelebrate() { $("#celebrate").hidden = true; $("#celebrate").innerHTML = ""; }

/* =========================================================
   Verse rendering
   ========================================================= */

function verseCard(ref, note, open) {
  const vs = versesFor(ref);
  const multi = vs.length > 1;
  const body = vs.map(v =>
    `<p class="verse-text">${multi ? `<span class="vn">${v.ref.split(":").pop()}</span>` : ""}${v.text}</p>`
  ).join("");

  return `
    <div class="verse-card${open ? " open" : ""}">
      <button class="verse-head" data-verse-toggle>
        <span>${esc(ref)}</span><span class="chev">▾</span>
      </button>
      <div class="verse-body"><div>
        ${body}
        ${note ? `<p class="verse-note">${note}</p>` : ""}
      </div></div>
    </div>`;
}

/* One tap anywhere in the app opens/closes a verse card. */
document.addEventListener("click", e => {
  const btn = e.target.closest("[data-verse-toggle]");
  if (btn) btn.closest(".verse-card").classList.toggle("open");
});

/* =========================================================
   Router
   ========================================================= */

const TITLES = {
  home: "GospelGPS", present: "Present", practice: "Practice",
  journal: "Journal", map: "Verse Map", about: "About this method"
};

let current = "home";

function go(screen, opts = {}) {
  current = screen;
  $$(".screen").forEach(s => { s.hidden = s.dataset.screen !== screen; });
  $$("#tabbar .tab").forEach(t => t.classList.toggle("is-active", t.dataset.goto === screen));
  $("#topTitle").textContent = TITLES[screen] || "GospelGPS";
  $("#backBtn").hidden = !(screen === "about");
  window.scrollTo({ top: 0, behavior: opts.keepScroll ? "auto" : "instant" });
  RENDER[screen](opts);
}

$$("#tabbar .tab").forEach(t => t.addEventListener("click", () => {
  const dest = t.dataset.goto;
  if (dest === "present" && presentActive()) { renderPresent(); return; }
  go(dest);
}));

$("#backBtn").addEventListener("click", () => go("home"));

/* =========================================================
   HOME
   ========================================================= */

function verseOfDay() {
  const start = new Date(2025, 0, 1);
  const days = Math.floor((Date.now() - start) / 86400000);
  return VERSE_OF_DAY[((days % VERSE_OF_DAY.length) + VERSE_OF_DAY.length) % VERSE_OF_DAY.length];
}

function nextMilestoneText() {
  const s = Store.stats();
  const rungs = [1, 10, 50, 100, 250, 500];
  const next = rungs.find(r => s.total < r);
  if (!next) return "You’re past every milestone. Keep going.";
  return `${next - s.total} more to reach ${next} presentation${next === 1 ? "" : "s"}`;
}

function renderHome() {
  const s = Store.stats();
  const streak = Store.currentStreak();
  const vref = verseOfDay();

  $("#screen-home").innerHTML = `
    <div class="hero">
      <img class="hero-logo" src="icons/icon.svg" alt="" aria-hidden="true">
      <h1>GospelGPS</h1>
      <p class="tagline">A step-by-step companion for sharing the gospel</p>
    </div>

    <button class="btn btn-primary start-btn" id="homeStart">
      ${presentActive() ? "Resume presentation" : "Start a Presentation"}
    </button>

    <div class="stat-grid">
      <div class="stat"><div class="n">${s.total}</div><div class="l">Presentations</div></div>
      <div class="stat"><div class="n">${s.seeds}</div><div class="l">Seeds planted</div></div>
      <div class="stat gold"><div class="n">${s.saved}</div><div class="l">People saved</div></div>
    </div>

    <div class="card" style="margin-top:14px">
      <div class="card-title">Practice</div>
      <div style="display:flex;align-items:center;gap:14px">
        <div style="font-size:1.9em">${streak > 0 ? "🔥" : "✨"}</div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:1.05em">
            ${streak > 0 ? `${streak}-day practice streak` : "No streak yet"}
          </div>
          <div class="small muted">${esc(nextMilestoneText())}</div>
        </div>
        <button class="btn btn-sm" data-goto-inline="practice">Practice</button>
      </div>
    </div>

    <div class="card votd">
      <div class="card-title">Verse of the day</div>
      <blockquote>${KJV[vref] || ""}</blockquote>
      <cite>${esc(vref)} &nbsp;·&nbsp; KJV</cite>
    </div>

    <div class="btn-row" style="margin-bottom:14px">
      <button class="btn btn-sm" data-goto-inline="map">Verse Map</button>
      <button class="btn btn-sm" data-goto-inline="about">About this method</button>
    </div>

    <p class="center tiny muted" style="margin-top:20px">
      <a href="${SUPPORT_URL}" target="_blank" rel="noopener">Support this ministry ☕</a>
      <br><br>
      Your journal is stored on this device only.
      <br>Back it up from the Journal tab.
    </p>
  `;

  $("#homeStart").addEventListener("click", () => go("present"));
  $$("[data-goto-inline]").forEach(b => b.addEventListener("click", () => go(b.dataset.gotoInline)));
}

/* =========================================================
   PRESENT MODE
   ========================================================= */

let P = null;                                     // active presentation state

function presentActive() { return P !== null && !P.finished; }

function startPresentation() {
  P = { step: 0, started: Date.now(), pushback: {}, checked: {}, finished: false };
}

function ringSVG(stepId) {
  const pct = stepId / 8;
  const C = 2 * Math.PI * 22;
  return `
    <svg class="ring" viewBox="0 0 54 54" aria-hidden="true">
      <circle class="bg" cx="27" cy="27" r="22"></circle>
      <circle class="fg" cx="27" cy="27" r="22"
        transform="rotate(-90 27 27)"
        stroke-dasharray="${C.toFixed(1)}"
        stroke-dashoffset="${(C * (1 - pct)).toFixed(1)}"></circle>
      <text x="27" y="30">${stepId === 0 ? "•" : stepId + "/8"}</text>
    </svg>`;
}

function renderPresent() {
  if (!P) startPresentation();
  if (P.finished) { renderOutcome(); return; }

  const step = STEPS[P.step];
  const showPush = !!P.pushback[step.id];
  const box = $("#screen-present");

  /* The cues are the only thing meant to be read mid-conversation:
     a glance, not a paragraph. */
  const cuesHTML = (step.cues || []).length
    ? `<ul class="cues">${step.cues.map(c => `<li>${c}</li>`).join("")}</ul>`
    : "";

  const versesHTML = step.verses.length
    ? `<div>${step.verses.map(v => verseCard(v.ref, v.note, true)).join("")}</div>`
    : "";

  const moreHTML = step.more && step.more.length
    ? `<details class="more"><summary>More verses (${step.more.length})</summary>
         <div style="margin-top:8px">${step.more.map(v => verseCard(v.ref, v.note, false)).join("")}</div>
       </details>`
    : "";

  /* Everything wordy lives behind one tap — for learning, or when you get stuck. */
  const notesHTML = `
    <details class="more notes">
      <summary>Notes &amp; coaching</summary>
      <div class="notes-body">
        ${step.say.length
          ? `<div class="card flat"><div class="card-title">What to say</div>
               <ul class="say-list">${step.say.map(s => `<li>${s}</li>`).join("")}</ul></div>`
          : ""}
        ${step.branches
          ? `<div class="card flat"><div class="card-title">If they answer…</div>
               ${step.branches.map(b => `
                 <div style="margin-bottom:14px">
                   <div style="font-weight:700;color:var(--sky);margin-bottom:4px">${b.heard}</div>
                   <div>${b.reply}</div>
                 </div>`).join("")}
             </div>`
          : ""}
        <div class="tipbox"><b>Coaching</b><br>${step.tip}</div>
        ${step.afterPrayerTip
          ? `<div class="tipbox" style="margin-top:12px"><b>After the prayer</b><br>${step.afterPrayerTip}</div>`
          : ""}
      </div>
    </details>`;

  const objHTML = showPush ? objectionHTML(step) : "";

  const reviewHTML = step.review
    ? `<div class="card"><div class="card-title">Review questions</div>
         <ul class="checklist">
           ${step.review.map((r, i) => `
             <li class="${P.checked[i] ? "done" : ""}">
               <button data-check="${i}">
                 <span class="box">${P.checked[i] ? "✓" : ""}</span>
                 <span>${r.q}${r.a ? `<span class="ans">${r.a}</span>` : ""}</span>
               </button>
             </li>`).join("")}
         </ul>
       </div>`
    : "";

  const prayerHTML = step.prayer
    ? `<div class="card">
         <div class="card-title">Pray with them — “repeat after me”</div>
         <div class="prayer">${step.prayer}</div>
         <p class="tiny muted center" style="margin-top:10px">${step.prayerNote}</p>
       </div>`
    : "";

  /* The bridge: confirm they got it, then the words that carry you to the next step.
     The method teaches this as a short question-and-agreement exchange, not a statement. */
  const isLast = P.step === STEPS.length - 1;
  const bridgeLines = isLast
    ? [step.afterPrayer]
    : [step.check].concat(step.bridge || []);

  const bridgeHTML = `
    <div class="bridge">
      <div class="bridge-label">${isLast ? "After the prayer" : "Move on when they’ve got it"}</div>
      ${bridgeLines.filter(Boolean).map((line, i, arr) =>
        `<p class="bridge-line${i === arr.length - 1 && !isLast && arr.length > 1 ? " pivot" : ""}">${line}</p>`
      ).join("")}
    </div>`;

  box.innerHTML = `
    <div class="present-head">
      <div class="progress-row">
        ${ringSVG(step.id)}
        <div>
          <div class="step-kicker">${esc(step.label)}</div>
          <h2 class="step-title">${esc(step.title)}</h2>
        </div>
      </div>
    </div>

    ${cuesHTML}
    ${versesHTML}
    ${moreHTML}
    ${objHTML}
    ${reviewHTML}
    ${prayerHTML}

    ${notesHTML}

    ${bridgeHTML}

    <div class="respond">
      ${isLast
        ? `<button class="btn btn-primary" data-act="finish">Finish &amp; log this ✓</button>`
        : `<button class="btn btn-agree" data-act="next">They agree ✓ &nbsp;— next step</button>
           ${showPush ? "" : `<button class="btn btn-push" data-act="push">They’re pushing back</button>`}`}
      <div class="btn-row">
        <button class="btn btn-quiet btn-sm" data-act="back" ${P.step === 0 ? "disabled" : ""}>‹ Back</button>
        <button class="btn btn-quiet btn-sm" data-act="end">End &amp; log</button>
      </div>
    </div>
  `;

  box.querySelectorAll("[data-act]").forEach(b => b.addEventListener("click", () => {
    const a = b.dataset.act;
    if (a === "next") { P.step = Math.min(P.step + 1, STEPS.length - 1); renderPresent(); window.scrollTo(0, 0); }
    if (a === "back") { P.step = Math.max(P.step - 1, 0); renderPresent(); window.scrollTo(0, 0); }
    if (a === "push") { P.pushback[step.id] = true; renderPresent(); }
    if (a === "finish" || a === "end") { P.finished = true; renderOutcome(); }
  }));

  box.querySelectorAll("[data-check]").forEach(b => b.addEventListener("click", () => {
    const i = b.dataset.check;
    P.checked[i] = !P.checked[i];
    renderPresent();
  }));
}

function objectionHTML(step) {
  if (!step.objections || !step.objections.length) {
    return `<div class="objection">
      <div class="heard">They’re pushing back</div>
      <p>Slow down and ask a question rather than pressing harder: “What part of that doesn’t sit right with you?”
         Then go back to the verse and read it together. Don’t argue — let the Bible do the work.</p>
    </div>`;
  }
  return step.objections.map(o => `
    <div class="objection">
      <div class="heard">${o.heard}</div>
      ${o.cue ? `<div class="obj-cue">${o.cue}</div>` : ""}
      ${(o.verses || []).map(r => verseCard(r, null, true)).join("")}
      <details class="more"><summary>How to answer it</summary>
        <p style="margin:8px 0 0">${o.reply}</p>
      </details>
    </div>`).join("");
}

/* ---------- outcome logging (target: under 10 seconds) ---------- */

function renderOutcome() {
  const box = $("#screen-present");
  box.innerHTML = `
    <h2>How did it go?</h2>
    <p class="muted small">One tap saves it to your Journal.</p>

    <div class="outcome-grid" style="margin-bottom:16px">
      ${OUTCOMES.map(o => `
        <button class="outcome-btn" data-o="${o.id}">
          <span class="emo">${o.emoji}</span>
          <span><span class="lbl">${o.label}</span><br><span class="sub">${o.blurb}</span></span>
        </button>`).join("")}
    </div>

    <details class="more" style="margin-bottom:14px">
      <summary>Add a name or note (optional)</summary>
      <div style="margin-top:10px">
        <label class="field"><span>First name or initials</span><input type="text" id="oName" autocomplete="off"></label>
        <label class="field"><span>Where</span><input type="text" id="oPlace" autocomplete="off" placeholder="e.g. Maple St."></label>
        <label class="field"><span>Notes</span><textarea id="oNote"></textarea></label>
      </div>
    </details>

    <button class="btn btn-primary btn-block" id="oSave" disabled>Save to Journal</button>
    <button class="btn btn-quiet btn-block btn-sm" id="oSkip" style="margin-top:10px">Don’t log this one</button>
  `;

  let chosen = null;
  box.querySelectorAll(".outcome-btn").forEach(b => b.addEventListener("click", () => {
    box.querySelectorAll(".outcome-btn").forEach(x => x.classList.remove("sel"));
    b.classList.add("sel");
    chosen = b.dataset.o;
    $("#oSave").disabled = false;
  }));

  $("#oSkip").addEventListener("click", () => { P = null; go("home"); });

  $("#oSave").addEventListener("click", () => {
    if (!chosen) return;
    Store.addEntry({
      outcome: chosen,
      name:  $("#oName")  ? $("#oName").value  : "",
      place: $("#oPlace") ? $("#oPlace").value : "",
      note:  $("#oNote")  ? $("#oNote").value  : ""
    });
    P = null;
    const m = Store.checkMilestone();
    if (m) showMilestone(m, () => go("journal"));
    else { toast("Saved to your Journal"); go("journal"); }
  });
}

function showMilestone(m, then) {
  celebrate(`
    <div class="glow">
      <div class="mi">${m.id.includes("salvation") ? "🙌" : "📖"}</div>
      <h2>${esc(m.title)}</h2>
      <blockquote>${KJV[m.verse] || ""}</blockquote>
      <cite>${esc(m.verse)}</cite>
      <button class="btn btn-primary btn-block" style="margin-top:20px" id="celebOk">Amen</button>
    </div>`);
  $("#celebOk").addEventListener("click", () => { closeCelebrate(); if (then) then(); });
}

/* =========================================================
   JOURNAL
   ========================================================= */

let journalFilter = "all";

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function renderJournal() {
  const s = Store.stats();
  const all = Store.entries();
  const list = journalFilter === "all" ? all : all.filter(e => e.outcome === journalFilter);
  const months = Store.monthlyCounts(6);
  const max = Math.max(1, ...months.map(m => m.count));

  const filters = [{ id: "all", label: "All" }].concat(
    OUTCOMES.map(o => ({ id: o.id, label: o.id === "saved" ? "Salvations" : o.label }))
  );

  $("#screen-journal").innerHTML = `
    <div class="stat-grid" style="margin-bottom:14px">
      <div class="stat"><div class="n">${s.total}</div><div class="l">Total</div></div>
      <div class="stat"><div class="n">${s.thisMonth}</div><div class="l">This month</div></div>
      <div class="stat gold"><div class="n">${s.saved}</div><div class="l">Saved</div></div>
    </div>

    <div class="card">
      <div class="card-title">Presentations per month</div>
      <div class="chart">
        ${months.map(m => `
          <div class="bar">
            <div class="bv">${m.count || ""}</div>
            <div class="fill" style="height:${Math.round((m.count / max) * 100)}%"></div>
            <div class="bl">${m.label}</div>
          </div>`).join("")}
      </div>
      <p class="tiny muted center" style="margin:6px 0 0">
        Last month: ${s.lastMonth} &nbsp;·&nbsp; this month: ${s.thisMonth}
      </p>
    </div>

    <div class="seg">
      ${filters.map(f => `<button data-f="${f.id}" class="${journalFilter === f.id ? "on" : ""}">${f.label}</button>`).join("")}
    </div>

    ${journalFilter === "saved" && list.length
      ? `<p class="center small" style="color:var(--gold-300)">“There is joy in the presence of the angels of God over one sinner that repenteth.”</p>`
      : ""}

    <div id="entryList">
      ${list.length ? list.map(entryHTML).join("") : emptyHTML()}
    </div>

    <div class="card flat" style="margin-top:18px">
      <div class="card-title">Backup</div>
      <p class="small muted">
        Your journal lives on this device only — no account, no server.
        If you clear your browser data or lose the phone, it’s gone unless you export it.
        Do this every so often.
      </p>
      <div class="btn-row">
        <button class="btn btn-sm" id="jExport">Export backup</button>
        <button class="btn btn-sm" id="jImport">Import backup</button>
      </div>
      <input type="file" id="jFile" accept="application/json,.json" hidden>
      <button class="btn btn-quiet btn-sm btn-danger btn-block" id="jErase" style="margin-top:10px">Erase everything</button>
    </div>
  `;

  $$("#screen-journal .seg button").forEach(b => b.addEventListener("click", () => {
    journalFilter = b.dataset.f;
    renderJournal();
  }));

  $$("#screen-journal .del").forEach(b => b.addEventListener("click", () => {
    if (confirm("Delete this entry? This cannot be undone.")) {
      Store.deleteEntry(b.dataset.id);
      renderJournal();
    }
  }));

  $("#jExport").addEventListener("click", doExport);
  $("#jImport").addEventListener("click", () => $("#jFile").click());
  $("#jFile").addEventListener("change", doImport);
  $("#jErase").addEventListener("click", () => {
    if (confirm("This erases your whole journal, streaks and badges on this device. Are you sure?") &&
        confirm("Really erase everything? Export a backup first if you might want it back.")) {
      Store.eraseAll();
      renderJournal();
      toast("Everything erased");
    }
  });
}

function entryHTML(e) {
  const o = OUTCOMES.find(x => x.id === e.outcome) || { emoji: "•", label: e.outcome };
  const who = e.name || "(no name)";
  const where = e.place ? ` · ${esc(e.place)}` : "";
  return `
    <div class="entry ${e.outcome === "saved" ? "saved" : ""}">
      <div class="emo">${o.emoji}</div>
      <div style="flex:1">
        <div class="who">${esc(who)}</div>
        <div class="meta">${o.label} · ${fmtDate(e.ts)}${where}</div>
        ${e.note ? `<div class="note">${esc(e.note)}</div>` : ""}
      </div>
      <button class="del" data-id="${e.id}" aria-label="Delete entry">✕</button>
    </div>`;
}

function emptyHTML() {
  return `<div class="empty">
    <span class="big">📖</span>
    ${journalFilter === "saved"
      ? "No salvations recorded yet.<br>The first one goes here."
      : "Nothing logged yet.<br>Finish a presentation and it will appear here."}
  </div>`;
}

function doExport() {
  const blob = Store.exportBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gospelgps-backup-${Store.dayKey()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Backup file saved");
}

function doImport(ev) {
  const file = ev.target.files && ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const n = Store.importJSON(String(reader.result), "merge");
      toast(`Imported — ${n} entries total`);
      renderJournal();
    } catch (err) {
      alert("Sorry, that file couldn’t be read.\n\n" + err.message);
    }
  };
  reader.readAsText(file);
  ev.target.value = "";
}

/* =========================================================
   PRACTICE
   ========================================================= */

function renderPractice() {
  const streak = Store.currentStreak();
  const p = Store.practice();
  const earned = p.badges.length;

  $("#screen-practice").innerHTML = `
    <div class="streak-banner">
      <div class="flame">${streak > 0 ? "🔥" : "✨"}</div>
      <div style="flex:1">
        <div class="n">${streak}</div>
        <div class="small">day streak${p.bestStreak > streak ? ` · best ${p.bestStreak}` : ""}</div>
      </div>
      <div class="center">
        <div class="n">${earned}/${BADGES.length}</div>
        <div class="small">badges</div>
      </div>
    </div>

    <div class="drill-grid">
      <button class="drill" data-drill="cards">
        <span class="ico">🃏</span>
        <span><span class="t">Flashcards</span><br><span class="d">Which verse goes with which point?</span></span>
      </button>
      <button class="drill" data-drill="order">
        <span class="ico">🗺️</span>
        <span><span class="t">Verse Map builder</span><br>
          <span class="d">Put the verses in order${p.bestMapTime ? ` · best ${p.bestMapTime}s` : ""}</span></span>
      </button>
      <button class="drill" data-drill="steps">
        <span class="ico">🧭</span>
        <span><span class="t">Name the 8 steps</span><br><span class="d">From memory, in order</span></span>
      </button>
      <button class="drill" data-drill="blanks">
        <span class="ico">✍️</span>
        <span><span class="t">Fill in the blank</span><br><span class="d">Memorise the exact KJV wording</span></span>
      </button>
      <button class="drill" data-drill="sim">
        <span class="ico">💬</span>
        <span><span class="t">Objection simulator</span><br><span class="d">They push back — what do you turn to?</span></span>
      </button>
    </div>

    <div class="card" style="margin-top:18px">
      <div class="card-title">Badges</div>
      <div class="badge-grid">
        ${BADGES.map(b => `
          <div class="badge ${Store.hasBadge(b.id) ? "earned" : ""}" title="${esc(b.desc)}">
            <div class="bi">${Store.hasBadge(b.id) ? "🏅" : "🔒"}</div>
            <div class="bt">${esc(b.title)}</div>
          </div>`).join("")}
      </div>
    </div>
  `;

  $$("#screen-practice .drill").forEach(b => b.addEventListener("click", () => {
    Store.touchPracticeDay();
    const s = Store.currentStreak();
    if (Store.awardBadge("first-drill")) toast("Badge earned: First drill done");
    if (s >= 3  && Store.awardBadge("streak-3"))  toast("Badge earned: 3-day streak");
    if (s >= 7  && Store.awardBadge("streak-7"))  toast("Badge earned: 7-day streak");
    if (s >= 30 && Store.awardBadge("streak-30")) toast("Badge earned: 30-day streak");
    DRILLS[b.dataset.drill]();
  }));
}

const DRILLS = {
  cards: drillCards,
  order: () => drillOrder(VERSE_ORDER, "Verse Map builder", true),
  steps: () => drillOrder(STEPS.slice(1).map(s => s.title), "Name the 8 steps", false),
  blanks: drillBlanks,
  sim: drillSim
};

function drillShell(title, inner) {
  $("#screen-practice").innerHTML = `
    <div class="scorebar">
      <button class="btn btn-quiet btn-sm" id="drillBack">‹ Practice</button>
      <span id="drillScore"></span>
    </div>
    <h2>${esc(title)}</h2>
    <div id="drillBody">${inner}</div>
  `;
  $("#drillBack").addEventListener("click", renderPractice);
}

/* ---------- flashcards ---------- */
function drillCards() {
  let deck = shuffle(FLASHCARDS);
  let i = 0, showing = false;

  drillShell("Flashcards", "");
  paint();

  function paint() {
    const c = deck[i];
    $("#drillScore").textContent = `${i + 1} of ${deck.length}`;
    $("#drillBody").innerHTML = `
      <div class="flashcard${showing ? " flip" : ""}" id="fc">
        <div>
          <span class="side-tag">${showing ? "Answer" : "Question — tap to flip"}</span>
          <div>${showing ? c.a : c.q}</div>
        </div>
      </div>
      <div class="btn-row" style="margin-top:14px">
        <button class="btn" id="fcPrev">‹ Prev</button>
        <button class="btn btn-primary" id="fcNext">${i === deck.length - 1 ? "Start over" : "Next ›"}</button>
      </div>`;

    $("#fc").addEventListener("click", () => {
      showing = !showing;
      if (showing) { Store.bumpCardsSeen(); if (Store.practice().cardsSeen >= 20 && Store.awardBadge("cards-20")) toast("Badge earned: Card shark"); }
      paint();
    });
    $("#fcPrev").addEventListener("click", () => { i = (i - 1 + deck.length) % deck.length; showing = false; paint(); });
    $("#fcNext").addEventListener("click", () => {
      if (i === deck.length - 1) { deck = shuffle(FLASHCARDS); i = 0; } else i++;
      showing = false; paint();
    });
  }
}

/* ---------- ordering drill (verse map + 8 steps) ---------- */
function drillOrder(correctOrder, title, timed) {
  const pool = shuffle(correctOrder);
  const picked = [];
  let mistakes = 0;
  const t0 = Date.now();

  drillShell(title, "");
  paint();

  function paint() {
    $("#drillScore").textContent = `${picked.length} / ${correctOrder.length}${mistakes ? ` · ${mistakes} wrong` : ""}`;
    $("#drillBody").innerHTML = `
      <p class="small muted">Tap them in the order you would use them.</p>
      <ol class="order-list" id="chosen">
        ${picked.map((p, n) => `<li class="order-item"><span class="num">${n + 1}</span><span>${esc(p)}</span></li>`).join("")}
      </ol>
      <div id="pool">
        ${pool.map(p => `
          <button class="order-item ${picked.includes(p) ? "picked" : ""}" data-p="${esc(p)}"
            ${picked.includes(p) ? "disabled" : ""}>
            <span>${esc(p)}</span>
          </button>`).join("")}
      </div>`;

    $$("#pool .order-item").forEach(b => b.addEventListener("click", () => {
      const val = b.dataset.p;
      if (val === correctOrder[picked.length]) {
        picked.push(val);
        if (picked.length === correctOrder.length) finish();
        else paint();
      } else {
        mistakes++;
        b.classList.add("wrong");
        setTimeout(() => b.classList.remove("wrong"), 320);
        $("#drillScore").textContent = `${picked.length} / ${correctOrder.length} · ${mistakes} wrong`;
      }
    }));
  }

  function finish() {
    const secs = Math.round((Date.now() - t0) / 1000);
    let extra = "";
    if (timed) {
      if (Store.setBestMapTime(secs)) extra += `<p class="small" style="color:var(--gold-300)">New best time!</p>`;
      if (mistakes === 0 && Store.awardBadge("map-master")) extra += `<p class="small">🏅 Badge earned: Verse Map mastered</p>`;
      if (secs < 60 && Store.awardBadge("map-fast"))       extra += `<p class="small">🏅 Badge earned: Quick draw</p>`;
    } else if (mistakes === 0 && Store.awardBadge("all-eight")) {
      extra += `<p class="small">🏅 Badge earned: All 8 steps</p>`;
    }

    $("#drillBody").innerHTML = `
      <div class="card center">
        <div style="font-size:2.4em">✅</div>
        <h3>In order, start to finish.</h3>
        <p class="muted">${secs} seconds${mistakes ? ` · ${mistakes} wrong tap${mistakes === 1 ? "" : "s"}` : " · no mistakes"}</p>
        ${extra}
      </div>
      <ol class="order-list">
        ${correctOrder.map((p, n) => `<li class="order-item"><span class="num">${n + 1}</span><span>${esc(p)}</span></li>`).join("")}
      </ol>
      <button class="btn btn-primary btn-block" id="againBtn">Go again</button>`;
    $("#againBtn").addEventListener("click", () => drillOrder(correctOrder, title, timed));
  }
}

/* ---------- fill in the blank ---------- */
function drillBlanks() {
  let queue = shuffle(FILL_BLANKS);
  let i = 0, correct = 0, run = 0;

  drillShell("Fill in the blank", "");
  paint();

  function paint() {
    const item = queue[i];
    const text = KJV[item.ref] || "";
    const re = new RegExp(`\\b${item.blank}\\b`);
    const shown = text.replace(re, `<span class="blank-slot">?</span>`);

    const others = shuffle(FILL_BLANKS.filter(f => f.blank.toLowerCase() !== item.blank.toLowerCase()))
      .slice(0, 3).map(f => f.blank);
    const choices = shuffle(others.concat([item.blank]));

    $("#drillScore").textContent = `${correct} correct · ${run} in a row`;
    $("#drillBody").innerHTML = `
      <div class="card">
        <div class="card-title">${esc(item.ref)}</div>
        <p class="blank-verse">${shown}</p>
      </div>
      <div id="choices">
        ${choices.map(c => `<button class="choice" data-c="${esc(c)}">${esc(c)}</button>`).join("")}
      </div>
      <div id="fbArea"></div>`;

    $$("#choices .choice").forEach(b => b.addEventListener("click", () => {
      const right = b.dataset.c === item.blank;
      $$("#choices .choice").forEach(x => {
        x.disabled = true;
        if (x.dataset.c === item.blank) x.classList.add("right");
      });
      if (right) { correct++; run++; }
      else { b.classList.add("wrongc"); run = 0; }

      if (run >= 10 && Store.awardBadge("blanks-perfect")) toast("Badge earned: Word for word");

      $("#fbArea").innerHTML = `
        <div class="feedback ${right ? "ok" : "no"}">
          ${right ? "Correct." : `The word is <b>${esc(item.blank)}</b>.`}
          <div class="small muted" style="margin-top:6px">${text}</div>
        </div>
        <button class="btn btn-primary btn-block" id="nextBlank">Next ›</button>`;

      $("#nextBlank").addEventListener("click", () => {
        i++;
        if (i >= queue.length) { queue = shuffle(FILL_BLANKS); i = 0; }
        paint();
        window.scrollTo(0, 0);
      });
    }));
  }
}

/* ---------- objection simulator ---------- */
function drillSim() {
  const round = shuffle(SIMULATOR);
  let i = 0, right = 0;

  drillShell("Objection simulator", "");
  paint();

  function paint() {
    if (i >= round.length) return finish();
    const s = round[i];
    const choices = shuffle(s.choices);

    $("#drillScore").textContent = `${i + 1} of ${round.length}`;
    $("#drillBody").innerHTML = `
      <p class="small muted">They say:</p>
      <div class="sim-says" style="margin-bottom:16px">${s.says}</div>
      <p class="small muted">What do you turn to?</p>
      <div id="simChoices">
        ${choices.map(c => `<button class="choice" data-r="${esc(c.ref)}">${esc(c.ref)}</button>`).join("")}
      </div>
      <div id="simFb"></div>`;

    $$("#simChoices .choice").forEach(b => b.addEventListener("click", () => {
      const picked = choices.find(c => c.ref === b.dataset.r);
      $$("#simChoices .choice").forEach(x => {
        x.disabled = true;
        const c = choices.find(y => y.ref === x.dataset.r);
        if (c.correct) x.classList.add("right");
      });
      if (picked.correct) right++;
      else b.classList.add("wrongc");

      $("#simFb").innerHTML = `
        <div class="feedback ${picked.correct ? "ok" : "no"}">${picked.why}</div>
        ${verseCard(choices.find(c => c.correct).ref, null, true)}
        <button class="btn btn-primary btn-block" id="simNext" style="margin-top:10px">
          ${i === round.length - 1 ? "See results" : "Next ›"}
        </button>`;
      $("#simNext").addEventListener("click", () => { i++; paint(); window.scrollTo(0, 0); });
    }));
  }

  function finish() {
    let extra = "";
    if (right === round.length && Store.awardBadge("sim-perfect")) extra = `<p class="small">🏅 Badge earned: Ready for pushback</p>`;
    $("#drillScore").textContent = "";
    $("#drillBody").innerHTML = `
      <div class="card center">
        <div style="font-size:2.4em">${right === round.length ? "🎯" : "👍"}</div>
        <h3>${right} of ${round.length} right</h3>
        <p class="muted">${right === round.length
          ? "Every objection answered correctly."
          : "Look back at the ones you missed — that’s where the practice pays off."}</p>
        ${extra}
      </div>
      <button class="btn btn-primary btn-block" id="simAgain">Go again</button>`;
    $("#simAgain").addEventListener("click", drillSim);
  }
}

/* =========================================================
   VERSE MAP
   ========================================================= */

function renderMap() {
  const steps = STEPS.filter(s => s.verses.length || (s.more && s.more.length));

  $("#screen-map").innerHTML = `
    <p class="muted small">
      The whole plan in order. Each point leads to the next — this is the map you’d write in the front of your Bible.
      Tap any reference to read it.
    </p>
    <div class="btn-row no-print" style="margin-bottom:18px">
      <button class="btn btn-sm" id="mapExpand">Open all</button>
      <button class="btn btn-sm" id="mapPrint">Print</button>
    </div>

    ${steps.map((s, idx) => `
      <div class="map-step">
        <h3><span class="n">${esc(s.label)}</span> ${esc(s.title)}</h3>
        <p class="map-goal">${s.goal}</p>
        ${s.verses.map(v => verseCard(v.ref, null, false)).join("")}
        ${(s.more || []).length
          ? `<details class="more"><summary>Backup verses (${s.more.length})</summary>
               <div style="margin-top:8px">${s.more.map(v => verseCard(v.ref, null, false)).join("")}</div>
             </details>`
          : ""}
      </div>
      ${idx < steps.length - 1 ? `<div class="map-arrow">↓</div>` : ""}
    `).join("")}

    <div class="card" style="margin-top:8px">
      <div class="card-title">The prayer</div>
      <div class="prayer" style="font-size:var(--vs)">${STEPS[8].prayer}</div>
    </div>

    <button class="btn btn-block no-print" id="mapAbout" style="margin-top:6px">About this method</button>
  `;

  $("#mapExpand").addEventListener("click", e => {
    const cards = $$("#screen-map .verse-card");
    const openAll = !cards.every(c => c.classList.contains("open"));
    cards.forEach(c => c.classList.toggle("open", openAll));
    $$("#screen-map details.more").forEach(d => { d.open = openAll; });
    e.target.textContent = openAll ? "Close all" : "Open all";
  });
  $("#mapPrint").addEventListener("click", () => window.print());
  $("#mapAbout").addEventListener("click", () => go("about"));
}

/* =========================================================
   ABOUT
   ========================================================= */

function renderAbout() {
  $("#screen-about").innerHTML = `
    <h2>About this method</h2>
    <div class="card">
      <div class="card-title">General coaching principles</div>
      <ul class="say-list">${PRINCIPLES.map(p => `<li>${p}</li>`).join("")}</ul>
    </div>

    <div class="card">
      <div class="card-title">The eight steps</div>
      <ol class="say-list">${STEPS.slice(1).map(s => `<li><b>${esc(s.title)}</b><br><span class="small muted">${s.goal}</span></li>`).join("")}</ol>
    </div>

    <div class="card flat">
      <div class="card-title">About the text</div>
      <p class="small muted">
        All verses are the King James Version, which is public domain in the United States.
        Every verse is built into the app, so it works with no signal at all.
      </p>
      <p class="small muted">
        Your journal, streaks and badges are stored on this device only. Nothing is sent anywhere.
      </p>
    </div>

    <p class="center small">
      <a href="${SUPPORT_URL}" target="_blank" rel="noopener">Support this ministry ☕</a>
    </p>
  `;
}

const RENDER = {
  home: renderHome, present: renderPresent, practice: renderPractice,
  journal: renderJournal, map: renderMap, about: renderAbout
};

/* =========================================================
   Text size toggle
   ========================================================= */

const SIZES = ["s", "m", "l"];
function applySize(v) { document.documentElement.dataset.size = v; }

$("#textSizeBtn").addEventListener("click", () => {
  const cur = Store.prefs().size || "s";
  const next = SIZES[(SIZES.indexOf(cur) + 1) % SIZES.length];
  Store.setPref("size", next);
  applySize(next);
  toast(next === "s" ? "Normal text" : next === "m" ? "Larger text" : "Largest text");
});

/* =========================================================
   Add to Home Screen banner
   ========================================================= */

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
});

function maybeShowInstall() {
  if (isStandalone() || Store.prefs().installDismissed) return;

  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  $("#installHow").textContent = iOS
    ? "Tap the Share button, then “Add to Home Screen.” It will open full-screen and work offline."
    : "Tap the ⋮ menu, then “Install app” or “Add to Home screen.” It will work offline.";

  setTimeout(() => { $("#installBanner").hidden = false; }, 2500);
}

$("#installDismiss").addEventListener("click", async () => {
  if (deferredPrompt) {
    $("#installBanner").hidden = true;
    deferredPrompt.prompt();
    deferredPrompt = null;
    return;
  }
  Store.setPref("installDismissed", true);
  $("#installBanner").hidden = true;
});

/* =========================================================
   Start up
   ========================================================= */

applySize(Store.prefs().size || "s");

/* Home-screen shortcuts land on #present or #map. */
const startScreen = (location.hash || "").replace("#", "");
go(RENDER[startScreen] ? startScreen : "home");

maybeShowInstall();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(err => console.warn("Offline mode unavailable:", err));
  });
}
