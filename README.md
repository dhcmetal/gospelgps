# GospelGPS

A free, offline, step-by-step companion for presenting the gospel of Jesus Christ
from the King James Bible.

**Live app: https://dhcmetal.github.io/gospelgps/**

---

## What it is

A web app built for the person *sharing* the gospel — standing at a door or sitting
across from a friend, holding their phone. It walks through the plan one step at a
time, shows the exact KJV verses to read aloud, adapts when the listener pushes back,
and afterwards logs the outcome, including when someone gets saved.

It installs to a phone's home screen and works with **no signal at all** after the
first visit.

**The five screens** (buttons along the bottom):

- **Home** — start a presentation, lifetime totals, practice streak, verse of the day
- **Present** — the opening questions plus 8 steps, with pushback helpers
- **Journal** — every outcome you record, with a Salvations list and monthly chart
- **Practice** — flashcards, verse-order drills, fill-in-the-blank, objection simulator
- **Verse Map** — the whole plan and every verse on one printable page

## Sharing it

Send people the link above, or hand out cards with the QR code. The QR code image is
**`qr-code.png`** in this folder — it points at the live app and can be printed at any size.

When someone opens the link on their phone, a banner shows them how to "Add to Home
Screen" so it behaves like a real app.

## About your journal

Your journal, streaks and badges are saved **on that one device only**. There is no
account and no server — nothing is ever sent anywhere. That also means:

- Clearing your browser data will erase it
- It does not sync between your phone and your computer
- If you lose the phone, it's gone

**So use the Export button** on the Journal tab now and then. It saves a small backup
file you can keep somewhere safe, and the Import button puts it back.

## The Bible text

Every verse is the King James Version, which is public domain in the United States, and
is built into the app itself — that's why it works offline. All 37 verses were checked
word-for-word against the Project Gutenberg King James text.

---

## Asking Claude Code to make changes

You don't need to know any of the technical detail below. To change something, open
Claude Code in this folder and just say what you want in plain English. For example:

> "On step 4, change the second bullet to say ..."

> "The verse text is too small on my phone — make it bigger."

> "Add a new objection to step 7 for when someone says ..."

> "Here's my Buy Me a Coffee link, put it in: https://..."

Then say **"publish it"** and Claude will push the change to GitHub. The live link stays
the same — you never need a new URL.

**One thing worth knowing:** phones save a copy of the app so it works offline. After
publishing a change, tell Claude to *"bump the cache version"* — that is what makes
phones pick up the new version instead of showing the old one. (Claude normally does
this automatically, but it's worth asking if a change doesn't seem to appear.)

To see a change on your own phone straight away, pull down to refresh, or close the app
fully and reopen it.

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | The page itself |
| `css/app.css` | All the styling — colours, sizes, layout |
| `js/data.js` | **All the words and verses.** Steps, cues, objections, practice content |
| `js/app.js` | The app's behaviour — screens, buttons, drills |
| `js/store.js` | Saving the journal, streaks and badges on the device |
| `sw.js` | Makes the app work offline |
| `manifest.webmanifest` | Lets the app install to a home screen |
| `icons/` | The app icons |
| `qr-code.png` | QR code for the live app, for printing on cards |

If you ever want to change wording yourself, it's nearly all in **`js/data.js`**.

## Cost

Nothing. GitHub Pages hosting is free, there is no server, no database and no paid
service anywhere in this project.

---

*Built with [Claude Code](https://claude.com/claude-code).*
