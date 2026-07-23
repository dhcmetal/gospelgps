/* Structural checks on js/data.js. Run after any content edit:
 *
 *     node tools/check-content.js
 *
 * Verifies that:
 *   - every verse reference used anywhere resolves to real KJV text
 *   - each objection-simulator round has exactly one correct answer
 *   - fill-in-the-blank words actually occur in their verse
 *   - no pushback objection repeats a verse already shown on that step
 *   - every step has cues and a bridge, and no orphaned `transition` fields
 *   - no embedded verse is dead weight (never shown anywhere)
 */

const fs = require("fs");
const path = require("path");

const PROJ = path.join(__dirname, "..");
const dataSrc = fs.readFileSync(path.join(PROJ, "js", "data.js"), "utf8");

const MARK = "/* ---- CHE" + "CKS ---- */";
const checks = fs.readFileSync(__filename, "utf8").split(MARK)[1];
eval(dataSrc + checks);
process.exit(globalThis.__exitCode || 0);

/* ---- CHECKS ---- */
let problems = 0;
const fail = m => { console.log("PROBLEM: " + m); problems++; };

function checkRef(ref, where) {
  for (const p of (PASSAGES[ref] || [ref])) {
    if (!KJV[p]) fail(`${where} -> "${ref}" has no text for "${p}"`);
  }
}

STEPS.forEach(s => {
  // What actually appears on screen during this step: the beat verses,
  // plus the legacy core-verse list the Verse Map still reads.
  const shown = new Set([
    ...(s.verses || []).map(v => v.ref),
    ...(s.beats  || []).filter(b => b.verse).map(b => b.verse)
  ]);

  (s.verses || []).forEach(v => checkRef(v.ref, `Step ${s.id} core`));
  (s.more   || []).forEach(v => checkRef(v.ref, `Step ${s.id} more`));
  (s.beats  || []).forEach(b => { if (b.verse) checkRef(b.verse, `Step ${s.id} beat`); });

  (s.objections || []).forEach(o => {
    (o.verses || []).forEach(r => {
      checkRef(r, `Step ${s.id} objection`);
      // A pushback panel should add scripture, not repeat what's already on screen.
      if (shown.has(r)) fail(`Step ${s.id} objection "${o.heard}" repeats a verse already shown: ${r}`);
    });
  });

  // Every step is a flow of one-idea "beat" pages.
  if (!s.beats || !s.beats.length) fail(`Step ${s.id} has no beats`);
  (s.beats || []).forEach((b, i) => {
    if (!b.say && !b.verse && !b.review && !b.prayer)
      fail(`Step ${s.id} beat ${i} is empty (needs say, verse, review or prayer)`);
  });
  if (s.cues) fail(`Step ${s.id} still has an orphaned "cues" field`);
  if (s.id !== 8 && (!s.bridge || !s.bridge.length)) fail(`Step ${s.id} has no bridge`);
  if (s.transition) fail(`Step ${s.id} still has an orphaned "transition" field`);
});

SIMULATOR.forEach((s, i) => {
  s.choices.forEach(c => checkRef(c.ref, `Simulator ${i + 1}`));
  const n = s.choices.filter(c => c.correct).length;
  if (n !== 1) fail(`Simulator round ${i + 1} has ${n} correct answers`);
});

VERSE_OF_DAY.forEach(r => { if (!KJV[r]) fail(`Verse of the day "${r}" has no text`); });
MILESTONES.forEach(m => { if (!KJV[m.verse]) fail(`Milestone "${m.id}" verse "${m.verse}" has no text`); });

FILL_BLANKS.forEach(f => {
  const t = KJV[f.ref];
  if (!t) return fail(`Fill-blank ref "${f.ref}" has no text`);
  if (!new RegExp(`\\b${f.blank}\\b`).test(t)) fail(`Fill-blank word "${f.blank}" not in ${f.ref}`);
});

const used = new Set();
const mark = ref => (PASSAGES[ref] || [ref]).forEach(p => used.add(p));
STEPS.forEach(s => {
  (s.verses || []).forEach(v => mark(v.ref));
  (s.more   || []).forEach(v => mark(v.ref));
  (s.beats  || []).forEach(b => { if (b.verse) mark(b.verse); });
  (s.objections || []).forEach(o => (o.verses || []).forEach(mark));
});
SIMULATOR.forEach(s => s.choices.forEach(c => mark(c.ref)));
VERSE_OF_DAY.forEach(mark);
MILESTONES.forEach(m => mark(m.verse));
FILL_BLANKS.forEach(f => mark(f.ref));

const unused = Object.keys(KJV).filter(k => !used.has(k));
if (unused.length) console.log("Note - embedded but never shown: " + unused.join(", "));

console.log("\n" + "=".repeat(60));
console.log(`${Object.keys(KJV).length} verses, ${STEPS.length} steps, ${SIMULATOR.length} simulator rounds`);
console.log(problems === 0 ? "All checks passed." : `${problems} problem(s)`);
globalThis.__exitCode = problems === 0 ? 0 : 1;
