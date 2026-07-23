/* GospelGPS — all app content lives here.
   Nothing in this file talks to the internet. Every verse is embedded.
   KJV is public domain in the United States. */

/* ---------------------------------------------------------------
   1. THE VERSES (King James Version)
   --------------------------------------------------------------- */

const KJV = {
  "Romans 3:10":
    "As it is written, There is none righteous, no, not one:",

  "Romans 3:23":
    "For all have sinned, and come short of the glory of God;",

  "James 2:10":
    "For whosoever shall keep the whole law, and yet offend in one point, he is guilty of all.",

  "Romans 6:23":
    "For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.",

  "Revelation 21:8":
    "But the fearful, and unbelieving, and the abominable, and murderers, and whoremongers, and sorcerers, and idolaters, and all liars, shall have their part in the lake which burneth with fire and brimstone: which is the second death.",

  "Revelation 20:14":
    "And death and hell were cast into the lake of fire. This is the second death.",

  "Revelation 20:15":
    "And whosoever was not found written in the book of life was cast into the lake of fire.",

  "Revelation 21:27":
    "And there shall in no wise enter into it any thing that defileth, neither whatsoever worketh abomination, or maketh a lie: but they which are written in the Lamb's book of life.",

  "Mark 9:43":
    "And if thy hand offend thee, cut it off: it is better for thee to enter into life maimed, than having two hands to go into hell, into the fire that never shall be quenched:",

  "Mark 9:44":
    "Where their worm dieth not, and the fire is not quenched.",

  "Mark 9:45":
    "And if thy foot offend thee, cut it off: it is better for thee to enter halt into life, than having two feet to be cast into hell, into the fire that never shall be quenched:",

  "Mark 9:46":
    "Where their worm dieth not, and the fire is not quenched.",

  "Mark 9:47":
    "And if thine eye offend thee, pluck it out: it is better for thee to enter into the kingdom of God with one eye, than having two eyes to be cast into hell fire:",

  "Mark 9:48":
    "Where their worm dieth not, and the fire is not quenched.",

  "Romans 5:8":
    "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.",

  "1 Peter 2:24":
    "Who his own self bare our sins in his own body on the tree, that we, being dead to sins, should live unto righteousness: by whose stripes ye were healed.",

  "1 Corinthians 15:3":
    "For I delivered unto you first of all that which I also received, how that Christ died for our sins according to the scriptures;",

  "1 Corinthians 15:4":
    "And that he was buried, and that he rose again the third day according to the scriptures:",

  "John 1:14":
    "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.",

  "John 20:27":
    "Then saith he to Thomas, Reach hither thy finger, and behold my hands; and reach hither thy hand, and thrust it into my side: and be not faithless, but believing.",

  "Acts 16:30":
    "And brought them out, and said, Sirs, what must I do to be saved?",

  "Acts 16:31":
    "And they said, Believe on the Lord Jesus Christ, and thou shalt be saved, and thy house.",

  "John 3:16":
    "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",

  "Ephesians 2:8":
    "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:",

  "Ephesians 2:9":
    "Not of works, lest any man should boast.",

  "John 6:47":
    "Verily, verily, I say unto you, He that believeth on me hath everlasting life.",

  "John 5:24":
    "Verily, verily, I say unto you, He that heareth my word, and believeth on him that sent me, hath everlasting life, and shall not come into condemnation; but is passed from death unto life.",

  "John 3:18":
    "He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God.",

  "John 3:36":
    "He that believeth on the Son hath everlasting life: and he that believeth not the Son shall not see life; but the wrath of God abideth on him.",

  "John 1:12":
    "But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name:",

  "John 10:28":
    "And I give unto them eternal life; and they shall never perish, neither shall any man pluck them out of my hand.",

  "Titus 1:2":
    "In hope of eternal life, which God, that cannot lie, promised before the world began;",

  "John 11:25":
    "Jesus said unto her, I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live:",

  "John 11:26":
    "And whosoever liveth and believeth in me shall never die. Believest thou this?",

  "Romans 10:13":
    "For whosoever shall call upon the name of the Lord shall be saved.",

  "Romans 10:17":
    "So then faith cometh by hearing, and hearing by the word of God.",

  "Luke 15:10":
    "Likewise, I say unto you, there is joy in the presence of the angels of God over one sinner that repenteth."
};

/* Multi-verse passages, so a card like "Acts 16:30-31" shows both verses. */
const PASSAGES = {
  "Revelation 20:14-15": ["Revelation 20:14", "Revelation 20:15"],
  "Mark 9:43-48": ["Mark 9:43", "Mark 9:44", "Mark 9:45", "Mark 9:46", "Mark 9:47", "Mark 9:48"],
  "1 Corinthians 15:3-4": ["1 Corinthians 15:3", "1 Corinthians 15:4"],
  "Acts 16:30-31": ["Acts 16:30", "Acts 16:31"],
  "Ephesians 2:8-9": ["Ephesians 2:8", "Ephesians 2:9"],
  "John 11:25-26": ["John 11:25", "John 11:26"]
};

/* Returns [{ref, text}] for any reference, single verse or passage. */
function versesFor(ref) {
  const refs = PASSAGES[ref] || [ref];
  return refs.map(r => ({ ref: r, text: KJV[r] || "" }));
}

/* ---------------------------------------------------------------
   2. THE PRESENTATION — 8 steps, plus the opener
   --------------------------------------------------------------- */

const STEPS = [
  {
    id: 0,
    label: "Opening",
    title: "Starting the conversation",
    goal: "Get permission to show them the Bible — and find out whether they know for sure.",
    beats: [
      { say: "“Do you go to church anywhere?”" },
      { say: "“More important than church — if you died today, do you know for sure you’d go to heaven?”" }
    ],
    bridge: [
      "“Perfect — let me show you.”",
      "“The first thing the Bible says is that we’ve all sinned.”"
    ],
    say: [
      "“Do you go to church anywhere?”",
      "“Do you know for sure, if you died today, would you go to heaven?”"
    ],
    verses: [],
    more: [],
    branches: [
      {
        heard: "“No” or “I hope so / pretty sure”",
        reply: "“There’s a difference between pretty sure and 100% sure. Can I take 5–10 minutes and show you from the Bible how you can know 100% for sure?”"
      },
      {
        heard: "“Yes, 100% sure”",
        reply: "“What do you believe it takes for a person to get to heaven?” If the answer is works-based — live a good life, go to church, keep the commandments — kindly say: “The Bible actually says something different — can I just show you a few verses?”"
      }
    ],
    tip: "Be kind, never smug. The goal of the whole presentation is to use the Bible and make it easy to understand — a logical path from A to B to C, never jumping around.",
    check: "Have they given you permission to show them the Bible?"
  },

  {
    id: 1,
    label: "Step 1",
    title: "Everyone is a sinner",
    goal: "The listener admits: “I have sinned.”",
    beats: [
      { say: "The Bible teaches that everyone’s a sinner — nobody is righteous on their own. It says in Romans 3:23:", verse: "Romans 3:23" }
    ],
    bridge: [
      "“So what’s the payment for sin?”"
    ],
    say: [
      "The Bible says every single one of us has sinned — me included.",
      "This isn’t me pointing a finger at you. It’s what God says about all of us."
    ],
    verses: [
      { ref: "Romans 3:10" },
      { ref: "Romans 3:23" }
    ],
    more: [
      { ref: "James 2:10", note: "You don’t have to prove they broke every commandment — breaking one is enough." }
    ],
    objections: [
      {
        heard: "“I’m a pretty good person”",
        cue: "Good by man’s standard — not God’s",
        reply: "Agree that they may be a good person by human standards — the standard here is God’s glory, and none of us reach it. Read Romans 3:23 again slowly: “all have sinned.” That includes me.",
        verses: ["James 2:10"]
      }
    ],
    tip: "99% of people agree immediately. Don’t camp here — keep moving.",
    check: "“So would you agree that you’ve sinned before?”"
  },

  {
    id: 2,
    label: "Step 2",
    title: "The penalty for sin is death and hell",
    goal: "The listener understands sin has a punishment — physical death, and after that hell, the second death — and that the list includes ordinary sins like lying.",
    beats: [
      { say: "Sin has a penalty. The first half of this verse says the wages of sin is death — we die physically.", verse: "Romans 6:23", note: "Read the first half only." },
      { say: "But that’s not the end. The Bible says there’s a second death — and that second death is hell." },
      { say: "Here’s who ends up there — and it isn’t just murderers. It says “all liars,” and everyone has told a lie.", verse: "Revelation 21:8" }
    ],
    bridge: [
      "“God wasn’t just kidding when He said that.”",
      "“But God loves you — does He want you to go there?”",
      "“So here’s what He did to save you.”"
    ],
    say: [
      "There’s a payment due for sin. The first half of this verse tells you what it is.",
      "Then look at who ends up in the lake of fire — it isn’t just murderers. It says “all liars.”"
    ],
    verses: [
      { ref: "Romans 6:23", note: "Read the FIRST half only." },
      { ref: "Revelation 21:8" }
    ],
    more: [
      { ref: "Revelation 20:14-15", note: "Death and hell cast into the lake of fire — the second death. Use it if the concept needs driving in; skip it if they’re tracking." }
    ],
    objections: [
      {
        heard: "“I’ve lied, but I’m not really a liar”",
        cue: "“How many lies makes a liar? One.”",
        reply: "Last verse of the same chapter — easy to remember. Nothing that “maketh a lie” enters heaven; only those written in the Lamb’s book of life. Then ask: “How many people do you have to kill to be a murderer? One. How many lies to be a liar?”",
        verses: ["Revelation 21:27"]
      },
      {
        heard: "“I don’t believe in a literal hell”",
        cue: "Mark 9 — Jesus’ own words",
        reply: "Turn to the end of Mark 9. This isn’t a preacher’s opinion — Jesus himself repeatedly describes hell fire and everlasting fire.",
        verses: ["Mark 9:43-48"]
      }
    ],
    tip: "Don’t be harsh here. You’re showing them the diagnosis so the cure makes sense.",
    check: "“So where does that verse say we deserve to go?”"
  },

  {
    id: 3,
    label: "Step 3",
    title: "Jesus loves you and died for you",
    goal: "The listener sees that God is proving His love here: we are all sinners, and Christ died for us anyway — taking the punishment we deserve.",
    beats: [
      { say: "Here God proves how much He loves you: while we were still sinners, Christ died for us — taking the punishment we deserved.", verse: "Romans 5:8" }
    ],
    bridge: [
      "“Now let me tell you who Jesus is.”"
    ],
    say: [
      "This verse is God showing you how much He loves you.",
      "We are all sinners — and knowing that, Christ died for us anyway.",
      "He didn’t wait for us to be worth it. He took what we had coming."
    ],
    verses: [
      { ref: "Romans 5:8" }
    ],
    more: [
      { ref: "1 Peter 2:24", note: "Every sin I’ve ever done, every sin you’ve ever done — on the cross it was as if Jesus had done it." },
      { ref: "1 Corinthians 15:3-4" }
    ],
    objections: [
      {
        heard: "“Why would God do that for me?”",
        cue: "Sinners is exactly who He died for",
        reply: "That’s the whole point of the verse. “Commendeth” means He proves, or puts on display, His love — and the proof is that He died for us being fully aware of what we are. Nobody has to become worth it first.",
        verses: ["1 Peter 2:24"]
      }
    ],
    tip: "This is the good news. Let your tone change here — you’ve just talked about hell; now talk about love.",
    check: "“Who did Jesus die for, according to that verse?”"
  },

  {
    id: 4,
    label: "Step 4",
    title: "Who is Jesus?",
    goal: "Don’t assume they know. Make sure they understand who died for them.",
    beats: [
      { say: "Jesus is the Son of God — God in the flesh. He lived a perfect life none of us could, and He preached the word of God." },
      { say: "Many hated His preaching, so He was arrested, beaten, and nailed to the cross." }
    ],
    bridge: [
      "“But it didn’t end at the cross.”"
    ],
    say: [
      "Jesus is the Son of God — God in the flesh.",
      "He lived a perfect life none of us could live, performed miracles, and preached the word of God.",
      "Many hated His preaching. He was arrested, beaten, spat upon, and nailed to the cross."
    ],
    verses: [],
    more: [
      { ref: "John 1:14", note: "Optional — if it helps show that Jesus is God in the flesh." }
    ],
    objections: [
      {
        heard: "“Jesus was just a good man”",
        cue: "The Word was made flesh",
        reply: "Gently show that the Bible claims more than that — the Word was made flesh. A merely good man’s death couldn’t pay for anyone else’s sin.",
        verses: ["John 1:14"]
      }
    ],
    tip: "Gauge the person. If they clearly know who Jesus is, keep this brief. If they’re unchurched, take the time — many people today have never even heard that Jesus rose from the dead.",
    check: "“Does that make sense — who Jesus is?”"
  },

  {
    id: 5,
    label: "Step 5",
    title: "The death, burial, and resurrection",
    goal: "The listener understands Christ died, was buried, and rose again bodily three days later.",
    beats: [
      { say: "He died, was buried, and three days later rose again bodily — He walked out of the grave and showed them the holes in His hands.", verse: "1 Corinthians 15:3-4" }
    ],
    bridge: [
      "“Jesus died for everybody — so does everyone automatically go to heaven?”",
      "“So what do we have to do to be saved?”"
    ],
    say: [
      "He died, He was buried, and three days later He rose again.",
      "He walked out of that grave and showed them the holes in His hands — a real, bodily resurrection, not just a spiritual one."
    ],
    verses: [
      { ref: "1 Corinthians 15:3-4" }
    ],
    more: [
      { ref: "John 20:27", note: "Thomas is invited to touch the holes — helpful for making the bodily resurrection concrete." }
    ],
    objections: [
      {
        heard: "“How do you know He really rose?”",
        cue: "Thomas touched the nail holes",
        reply: "Stay in the Bible rather than arguing history. He appeared to His disciples and invited Thomas to put his finger in the nail holes.",
        verses: ["John 20:27"]
      }
    ],
    tip: "Mention the holes in His hands — it makes the resurrection concrete instead of abstract.",
    check: "“So what happened three days after Jesus died?”"
  },

  {
    id: 6,
    label: "Step 6",
    title: "What must we do to be saved? BELIEVE.",
    goal: "The listener understands salvation is by faith alone in Christ — not church, not living a good life, not turning from sins, not works.",
    beats: [
      { say: "Someone in the Bible asked this very question. The answer is simply “believe” — not join a church, not live a good life.", verse: "Acts 16:30-31", note: "Point out what it does NOT say." },
      { say: "Most people know this verse. Let them say it — then ask what it says we must do.", verse: "John 3:16", note: "Let them finish it, then ask." }
    ],
    bridge: [
      "“Now — once you’re saved, how long does it last?”"
    ],
    say: [
      "Somebody in the Bible asked this exact question. Look at the answer they got.",
      "Notice it does NOT say “join a church and be saved” or “live a good life and be saved.” Those are good things — but salvation is by believing."
    ],
    verses: [
      { ref: "Acts 16:30-31", note: "Point out what it does NOT say." },
      { ref: "John 3:16", note: "Let them quote it — then ask what it says to do." }
    ],
    more: [
      { ref: "Ephesians 2:8-9", note: "Pick one more “believe” verse of your choice." },
      { ref: "John 6:47" },
      { ref: "John 5:24" },
      { ref: "John 3:18" },
      { ref: "John 3:36" }
    ],
    objections: [
      {
        heard: "“Don’t I have to be good / get baptized?”",
        cue: "Grace through faith — not of works",
        reply: "Not for salvation. Grace through faith, not of works, lest any man should boast. Good works are a fine thing — they just aren’t what saves.",
        verses: ["Ephesians 2:8-9"]
      },
      {
        heard: "“I already believe in God”",
        cue: "Believe ON Christ — not just that He is",
        reply: "Draw the distinction between believing God exists and believing ON the Lord Jesus Christ — trusting Him alone to save you.",
        verses: ["John 6:47", "John 3:18"]
      }
    ],
    tip: "Spend real time here. This is where the whole plan turns.",
    check: "“So according to that verse, what do we have to do to have everlasting life?”"
  },

  {
    id: 7,
    label: "Step 7",
    title: "Eternal security: once saved, always saved",
    goal: "The listener understands salvation is a free gift of eternal life. If it could be lost, it wouldn’t be eternal — and it wouldn’t be by faith.",
    beats: [
      { say: "Now the second half of that earlier verse: eternal life is a free gift — you don’t earn it, and you can’t un-earn it.", verse: "Romans 6:23", note: "Now the second half." },
      { say: "When you believe, you become a child of God — a child He corrects, but never throws out of the family.", verse: "John 1:12" }
    ],
    bridge: [
      "“Let me go back over it with you.”"
    ],
    say: [
      "Now the second half of that verse from earlier: the gift of God is eternal life.",
      "It’s a gift, not wages. It’s eternal, not temporary. And it’s by faith, not by works.",
      "When you believe, you become a child of God. A child who sins is a child God will chasten — not disown."
    ],
    verses: [
      { ref: "Romans 6:23", note: "Now the SECOND half." },
      { ref: "John 1:12" }
    ],
    more: [
      { ref: "John 10:28" },
      { ref: "Titus 1:2" },
      { ref: "John 6:47" },
      { ref: "John 11:25-26" }
    ],
    objections: [
      {
        heard: "“What if I sin after I’m saved?”",
        cue: "A father chastens — he doesn’t disown",
        reply: "You became His child. An earthly father chastens his child — he doesn’t stop him being his child. Neither will God.",
        verses: ["John 10:28"]
      },
      {
        heard: "“You can lose your salvation”",
        cue: "If it can be lost, it isn’t eternal",
        reply: "Walk it back through the words themselves rather than arguing. If it can be lost it isn’t eternal, and if you can keep it by behaving then it was never a gift. God cannot lie, and He promised eternal life.",
        verses: ["Titus 1:2", "John 10:28", "John 6:47"]
      }
    ],
    tip: "Spend the MOST time here — this is what people struggle with most, and “losing your salvation” is always a back door to works salvation. Don’t make eternal security sound ludicrous or lead with extreme examples. Present it as the natural conclusion: it’s a gift, it’s eternal, it’s by faith.",
    check: "“So according to the Bible, who goes to hell?”"
  },

  {
    id: 8,
    label: "Step 8",
    title: "The wrap-up: review questions and prayer",
    goal: "Confirm they truly understand, then lead them to call on the Lord.",
    beats: [
      { review: true, say: "Work down these review questions before you pray." },
      { say: "Don’t ask “Do you want to pray?” — lead them: “I want to pray with you right now and help you tell God that’s what you believe. You can just repeat after me. Let’s pray.”", verse: "Romans 10:13", note: "Call upon the name of the Lord." },
      { prayer: true, say: "Pray with them — have them repeat after you." },
      { say: "“You meant that, didn’t you? So where does the Bible say you’re going? And why?” — heaven, because I believed on Christ." }
    ],
    say: [
      "Work down the review questions below before you pray.",
      "Don’t ask “Do you want to pray?” — say: “Here’s what I want to do: I want to pray with you right now and help you tell God that’s what you believe. You can just repeat after me. Let’s pray.”"
    ],
    verses: [
      { ref: "Romans 10:13", note: "Call upon the name of the Lord." }
    ],
    more: [],
    review: [
      { q: "“Do you believe you’ve sinned?”" },
      { q: "“Do you believe Jesus died on the cross for all your sins and rose again bodily from the dead?”" },
      { q: "“According to the Bible, what do we have to do to be saved?”", a: "Believe on Him." },
      { q: "“If you believe that and receive Christ as Savior, is there anything you could ever do to lose it?”", a: "No." },
      { q: "“What do YOU personally think a person has to do to get to heaven?”", a: "Only if you sense they’re not getting it." }
    ],
    prayer: "Dear Jesus, I know I’m a sinner. I know I deserve to go to hell. But I believe that you died on the cross for all my sins and rose again. Please save me right now and give me eternal life. I’m only trusting you, Jesus. Amen.",
    prayerNote: "The exact words aren’t magic — the faith is what matters.",
    afterPrayer: "“You meant that, didn’t you? So where does the Bible say you’re going? And why?”  — answer: heaven, because I believed on Christ.",
    afterPrayerTip: "Confirm positively. Don’t plant doubt with “Did you really mean that?” in a skeptical tone.",
    tip: "On the last review question: if their answer is works-based, they didn’t get it — kindly show one more “believe” verse and graciously end. If they didn’t get it, ending graciously is a win too. A seed is planted.",
    check: "Did they pray and call on the Lord?"
  }
];

/* ---------------------------------------------------------------
   3. GENERAL COACHING PRINCIPLES  (About this method page)
   --------------------------------------------------------------- */

const PRINCIPLES = [
  "Use the Bible — the word of God is what has power. “Faith cometh by hearing, and hearing by the word of God.” (Romans 10:17)",
  "Make it simple and logical — one point leads to the next. Never jump around.",
  "Take as much time as necessary, but don’t beat a dead horse. If they get a point, move on.",
  "A typical presentation is about 10–15 minutes. Spend the most time on faith alone and eternal security.",
  "This is a dialogue, not a speech — gauge the person, ask questions, adjust.",
  "The best way to learn is to go out with an experienced soul winner and practice."
];

/* ---------------------------------------------------------------
   4. OUTCOMES for the journal
   --------------------------------------------------------------- */

const OUTCOMES = [
  { id: "saved",     label: "Saved",             emoji: "🙌", blurb: "They prayed and called on the Lord." },
  { id: "presented", label: "Gospel presented",  emoji: "📖", blurb: "Went all the way through, no decision." },
  { id: "seed",      label: "Seed planted",      emoji: "🌱", blurb: "Partial conversation — something was sown." },
  { id: "not",       label: "Not interested",    emoji: "🚪", blurb: "They declined. That’s okay." }
];

/* ---------------------------------------------------------------
   5. MILESTONES
   --------------------------------------------------------------- */

const MILESTONES = [
  { id: "first-salvation", test: s => s.saved === 1,
    title: "Your first salvation", verse: "Luke 15:10" },
  { id: "salvations-10",   test: s => s.saved === 10,
    title: "10 souls saved", verse: "Luke 15:10" },
  { id: "salvations-25",   test: s => s.saved === 25,
    title: "25 souls saved", verse: "Luke 15:10" },
  { id: "first-presentation", test: s => s.total === 1,
    title: "Your first presentation", verse: "Romans 10:17" },
  { id: "presentations-10",  test: s => s.total === 10,
    title: "10 presentations", verse: "Romans 10:13" },
  { id: "presentations-50",  test: s => s.total === 50,
    title: "50 presentations", verse: "Romans 10:13" },
  { id: "presentations-100", test: s => s.total === 100,
    title: "100 presentations", verse: "Romans 10:13" }
];

/* ---------------------------------------------------------------
   6. PRACTICE CONTENT
   --------------------------------------------------------------- */

/* The correct order of the core verses, for the Verse Map drill. */
const VERSE_ORDER = [
  "Romans 3:23",
  "Romans 6:23",
  "Revelation 21:8",
  "Romans 5:8",
  "1 Corinthians 15:3-4",
  "Acts 16:30-31",
  "John 3:16",
  "Romans 6:23 (2nd half)",
  "John 1:12",
  "Romans 10:13"
];

/* Flashcards: question on the front, answer on the back. */
const FLASHCARDS = [
  { q: "What’s the verse for Step 1 — everyone is a sinner?", a: "Romans 3:23 (and Romans 3:10)" },
  { q: "What’s the verse for the penalty of sin?", a: "Romans 6:23, first half — “For the wages of sin is death…”" },
  { q: "Which verse lists “all liars” in the lake of fire?", a: "Revelation 21:8" },
  { q: "They say “I’ve lied, but I’m not a liar.” Which verse?", a: "Revelation 21:27 — last verse of the chapter" },
  { q: "They don’t believe in a literal hell. Where do you go?", a: "Mark 9, end of the chapter — Jesus’ own words on hell fire" },
  { q: "What comes after Revelation 21:8?", a: "Romans 5:8 — Jesus loves you and died for you" },
  { q: "Which verse shows God proving His love for sinners?", a: "Romans 5:8" },
  { q: "Which verse covers the death, burial and resurrection?", a: "1 Corinthians 15:3–4" },
  { q: "Where does someone ask “What must I do to be saved?”", a: "Acts 16:30–31" },
  { q: "What comes after Acts 16:30–31?", a: "John 3:16" },
  { q: "Which verse says salvation is not of works?", a: "Ephesians 2:8–9" },
  { q: "What’s the verse for eternal security — the gift?", a: "Romans 6:23, second half — “the gift of God is eternal life”" },
  { q: "Which verse says believers become children of God?", a: "John 1:12" },
  { q: "Which verse says “they shall never perish”?", a: "John 10:28" },
  { q: "Which verse says God cannot lie?", a: "Titus 1:2" },
  { q: "What’s the verse for calling on the Lord in prayer?", a: "Romans 10:13" },
  { q: "How many steps are in the presentation?", a: "8 — plus the opening questions" },
  { q: "Which step should get the MOST time?", a: "Step 7 — eternal security" }
];

/* Fill-in-the-blank drills. The blanked word is given explicitly
   so the drill always tests a meaningful word. */
const FILL_BLANKS = [
  { ref: "Romans 3:23", blank: "sinned" },
  { ref: "Romans 6:23", blank: "wages" },
  { ref: "Romans 6:23", blank: "gift" },
  { ref: "Romans 5:8", blank: "sinners" },
  { ref: "Acts 16:31", blank: "Believe" },
  { ref: "John 3:16", blank: "believeth" },
  { ref: "John 3:16", blank: "everlasting" },
  { ref: "Ephesians 2:9", blank: "works" },
  { ref: "John 1:12", blank: "sons" },
  { ref: "John 10:28", blank: "perish" },
  { ref: "Romans 10:13", blank: "call" },
  { ref: "Revelation 21:8", blank: "liars" },
  { ref: "John 6:47", blank: "everlasting" },
  { ref: "Titus 1:2", blank: "lie" }
];

/* Objection simulator: the app plays the listener. */
const SIMULATOR = [
  {
    says: "“I’ve lied before, sure. But I’m not really a liar.”",
    choices: [
      { ref: "Revelation 21:27", correct: true,
        why: "Right. Last verse of the same chapter — nothing that “maketh a lie” enters heaven. Then ask how many people you have to kill to be a murderer." },
      { ref: "Romans 5:8", correct: false,
        why: "Not yet — that’s the love of God in Step 3. Right now you still need them to see they’re guilty." },
      { ref: "John 10:28", correct: false,
        why: "That’s an eternal security verse for Step 7. You’d be jumping ahead." }
    ]
  },
  {
    says: "“I don’t really believe in a literal hell.”",
    choices: [
      { ref: "Mark 9:43-48", correct: true,
        why: "Right. Go to the end of Mark 9 — these are Jesus’ own words about hell fire, not a preacher’s opinion." },
      { ref: "James 2:10", correct: false,
        why: "That’s for showing that breaking one commandment makes you guilty — a Step 1 support verse." },
      { ref: "Titus 1:2", correct: false,
        why: "That’s for eternal security — God cannot lie. Not the issue on the table." }
    ]
  },
  {
    says: "“I think if I live a good life and go to church, I’ll make it.”",
    choices: [
      { ref: "Ephesians 2:8-9", correct: true,
        why: "Right — grace through faith, not of works, lest any man should boast. Acts 16:30–31 pairs well here too." },
      { ref: "Revelation 21:8", correct: false,
        why: "That’s the penalty verse from Step 2. Useful earlier, but it doesn’t answer the works question." },
      { ref: "John 20:27", correct: false,
        why: "That’s the bodily resurrection. Not what they’re struggling with." }
    ]
  },
  {
    says: "“Okay — but what if I get saved and then mess up badly?”",
    choices: [
      { ref: "John 1:12", correct: true,
        why: "Right. You became a child of God. A father chastens his child — he doesn’t disown him. John 10:28 backs it up." },
      { ref: "Romans 3:23", correct: false,
        why: "They already agreed they’ve sinned. Going back there doesn’t answer the fear." },
      { ref: "Acts 16:30-31", correct: false,
        why: "Close — it’s the right idea, but the question is about keeping salvation, so go to the gift and the child of God." }
    ]
  },
  {
    says: "“I already believe in God. Doesn’t everybody?”",
    choices: [
      { ref: "John 6:47", correct: true,
        why: "Right — draw the distinction between believing God exists and believing ON Christ, trusting Him alone to save you." },
      { ref: "Luke 15:10", correct: false,
        why: "That’s a lovely verse about rejoicing over one sinner — but it isn’t the answer here." },
      { ref: "Mark 9:43-48", correct: false,
        why: "Hell isn’t what they’re questioning. Don’t swing back to fear when the issue is understanding." }
    ]
  },
  {
    says: "“Isn’t that too easy? Just believe, and that’s it?”",
    choices: [
      { ref: "Romans 6:23", correct: true,
        why: "Right — it’s easy for us because it was not easy for Him. It’s a gift; the wages were paid by Christ." },
      { ref: "Romans 3:10", correct: false,
        why: "That’s Step 1. They’re past that — they’re wrestling with grace now." },
      { ref: "John 20:27", correct: false,
        why: "The resurrection isn’t the sticking point here." }
    ]
  }
];

/* Badges earned in Practice mode. */
const BADGES = [
  { id: "first-drill",     title: "First drill done",     desc: "Completed your first practice drill." },
  { id: "streak-3",        title: "3-day streak",         desc: "Practised three days in a row." },
  { id: "streak-7",        title: "7-day streak",         desc: "Practised a full week in a row." },
  { id: "streak-30",       title: "30-day streak",        desc: "A month of daily practice." },
  { id: "map-master",      title: "Verse Map mastered",   desc: "Put every verse in the right order with no mistakes." },
  { id: "map-fast",        title: "Quick draw",           desc: "Ordered the whole Verse Map in under 60 seconds." },
  { id: "cards-20",        title: "Card shark",           desc: "Reviewed 20 flashcards." },
  { id: "blanks-perfect",  title: "Word for word",        desc: "Ten fill-in-the-blanks correct in a row." },
  { id: "sim-perfect",     title: "Ready for pushback",   desc: "Answered every objection correctly in one round." },
  { id: "all-eight",       title: "All 8 steps",          desc: "Named all eight steps from memory." }
];

/* Verse of the day rotation, in presentation order. */
const VERSE_OF_DAY = [
  "Romans 3:23", "Romans 6:23", "Revelation 21:8", "Romans 5:8",
  "1 Corinthians 15:3", "Acts 16:31", "John 3:16", "Ephesians 2:8",
  "John 1:12", "John 10:28", "Romans 10:13", "Luke 15:10", "Romans 10:17"
];

/* Opens in a new tab. No payment processing happens inside this app. */
const SUPPORT_URL = "https://buymeacoffee.com/gospelgps";
