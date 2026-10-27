"use strict";

/* =====================================================
   BIBLE COMPANION
   - bible-api.com for the Bible text (called from the browser)
   - Google / MyMemory (called from the browser) for Tagalog / Waray-Waray
   - accounts are stored in this browser (localStorage)
===================================================== */

/* ---------- DATA ---------- */

const BOOKS = [
  ["Genesis",50],["Exodus",40],["Leviticus",27],["Numbers",36],["Deuteronomy",34],
  ["Joshua",24],["Judges",21],["Ruth",4],["1 Samuel",31],["2 Samuel",24],
  ["1 Kings",22],["2 Kings",25],["1 Chronicles",29],["2 Chronicles",36],
  ["Ezra",10],["Nehemiah",13],["Esther",10],["Job",42],["Psalms",150],["Proverbs",31],
  ["Ecclesiastes",12],["Song of Solomon",8],["Isaiah",66],["Jeremiah",52],["Lamentations",5],
  ["Ezekiel",48],["Daniel",12],["Hosea",14],["Joel",3],["Amos",9],["Obadiah",1],["Jonah",4],
  ["Micah",7],["Nahum",3],["Habakkuk",3],["Zephaniah",3],["Haggai",2],["Zechariah",14],["Malachi",4],
  ["Matthew",28],["Mark",16],["Luke",24],["John",21],["Acts",28],["Romans",16],
  ["1 Corinthians",16],["2 Corinthians",13],["Galatians",6],["Ephesians",6],["Philippians",4],
  ["Colossians",4],["1 Thessalonians",5],["2 Thessalonians",3],["1 Timothy",6],["2 Timothy",4],
  ["Titus",3],["Philemon",1],["Hebrews",13],["James",5],["1 Peter",5],["2 Peter",3],
  ["1 John",5],["2 John",1],["3 John",1],["Jude",1],["Revelation",22]
];

const VERSIONS = [
  ["web", "World English Bible"],
  ["webbe", "World English Bible (British)"],
  ["kjv", "King James Version"],
  ["asv", "American Standard Version"],
  ["darby", "Darby Bible"],
  ["dra", "Douay-Rheims"],
  ["bbe", "Bible in Basic English"],
  ["oeb-us", "Open English Bible (US)"],
  ["oeb-cw", "Open English Bible (Commonwealth)"]
];

const LANGS = [
  ["en", "English"],
  ["tl", "Tagalog"],
  ["war", "Waray-Waray"]
];

// Hand-checked translations (best quality). Anything you add here is used
// instead of machine translation. Key = the reference shown on the page.
// Example:
//   tl:  { "John 3:16": "Sapagkat gayon na lamang ang pag-ibig ng Diyos..." },
//   war: { "John 3:16": "Kay ginhigugma gud han Dyos an kalibutan..." }
const CURATED = {
  tl: {},
  war: {}
};

const I18N = {
  en: {
    tagline: "Read, search and explore the Bible.",
    login: "Log in", signup: "Sign up",
    username: "Username", password: "Password", confirm: "Confirm password",
    loginBtn: "Log in", signupBtn: "Create account",
    note: "Accounts are saved only in this browser.",
    errFill: "Please fill in every field.",
    errUser: "Username must be 3-24 letters, numbers or _.",
    errPass: "Password must be at least 6 characters.",
    errMatch: "Passwords do not match.",
    errTaken: "That username is already taken.",
    errBad: "Wrong username or password.",
    errCrypto: "This page must be opened over https (or localhost).",
    hello: "Welcome", logout: "Log out",
    search: "Search the Bible", placeholder: "Example: John 3:16", searchBtn: "Search",
    ot: "Old Testament", nt: "New Testament", prev: "Previous", next: "Next",
    loading: "Loading...", notFound: "No passage found.",
    rate: "Too many requests. Please wait a few seconds and try again.",
    netErr: "Could not reach the Bible service.",
    translating: "Translating...",
    partial: "Some verses could not be translated, so the English text is shown.",
    version: "Bible version", language: "Language"
  },
  tl: {
    tagline: "Magbasa, maghanap, at tumuklas ng Bibliya.",
    login: "Mag-log in", signup: "Mag-sign up",
    username: "Username", password: "Password", confirm: "Kumpirmahin ang password",
    loginBtn: "Mag-log in", signupBtn: "Gumawa ng account",
    note: "Ang mga account ay nakaimbak lamang sa browser na ito.",
    errFill: "Punan ang lahat ng patlang.",
    errUser: "Ang username ay 3-24 titik, numero o _.",
    errPass: "Ang password ay hindi bababa sa 6 na character.",
    errMatch: "Hindi magkatugma ang mga password.",
    errTaken: "Kinuha na ang username na iyon.",
    errBad: "Maling username o password.",
    errCrypto: "Dapat buksan ang pahinang ito sa https (o localhost).",
    hello: "Maligayang pagdating", logout: "Mag-logout",
    search: "Maghanap sa Bibliya", placeholder: "Halimbawa: John 3:16", searchBtn: "Maghanap",
    ot: "Lumang Tipan", nt: "Bagong Tipan", prev: "Nakaraan", next: "Susunod",
    loading: "Naglo-load...", notFound: "Walang nahanap na talata.",
    rate: "Masyadong maraming kahilingan. Maghintay ng ilang segundo at subukan muli.",
    netErr: "Hindi maabot ang serbisyo ng Bibliya.",
    translating: "Isinasalin...",
    partial: "Hindi naisalin ang ilang talata, kaya ipinapakita ang Ingles.",
    version: "Bersyon ng Bibliya", language: "Wika"
  },
  war: {
    tagline: "Basaha, pamilnga, ngan usisaha an Biblia.",
    login: "Pag-log in", signup: "Pag-sign up",
    username: "Username", password: "Password", confirm: "Kumpirmaha an password",
    loginBtn: "Pag-log in", signupBtn: "Himo hin account",
    note: "An mga account natatago la ha ini nga browser.",
    errFill: "Pun-a an ngatanan nga uma.",
    errUser: "An username kinahanglan 3-24 nga letra, numero o _.",
    errPass: "An password kinahanglan labing diri maubos 6 nga character.",
    errMatch: "Diri pareho an mga password.",
    errTaken: "Gamit na ini nga username.",
    errBad: "Sayop an username o password.",
    errCrypto: "Kinahanglan buksan ini nga pahina ha https (o localhost).",
    hello: "Maupay nga pag-abot", logout: "Pag-logout",
    search: "Pamiling ha Biblia", placeholder: "Pananglitan: John 3:16", searchBtn: "Pamiling",
    ot: "Daan nga Katugonan", nt: "Bag-o nga Katugonan", prev: "Naglabay", next: "Sunod",
    loading: "Naglo-load...", notFound: "Waray nakit-an nga bersikulo.",
    rate: "Damo kaayo an hangyo. Maghulat anay hin pipira nga segundo ngan sulayi utro.",
    netErr: "Diri maabot an serbisyo han Biblia.",
    translating: "Ginhuhubad...",
    partial: "Waray mahubad an iba nga bersikulo, salit ginpapakita an Ingles.",
    version: "Bersyon han Biblia", language: "Pinulongan"
  }
};

/* ---------- SMALL HELPERS ---------- */

const $ = (id) => document.getElementById(id);

const state = {
  user: null,
  lang: "en",
  version: "web",
  book: "John",
  chapter: 3,
  reference: "",
  token: 0,
  verseEls: []
};

function t(key) {
  return (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) { /* storage full or blocked: ignore */ }
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function fillSelect(select, pairs) {
  select.textContent = "";
  for (const [value, label] of pairs) {
    const option = el("option", "", label);
    option.value = value;
    select.appendChild(option);
  }
}

/* ---------- ACCOUNTS (stored in this browser) ---------- */

const encoder = new TextEncoder();

function toB64(buffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
}

function fromB64(text) {
  return Uint8Array.from(atob(text), (c) => c.charCodeAt(0));
}

async function hashPassword(password, saltB64) {
  if (!window.crypto || !crypto.subtle) throw new Error("crypto");
  const salt = saltB64 ? fromB64(saltB64) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" }, key, 256
  );
  return { salt: toB64(salt), hash: toB64(bits) };
}

async function register(username, password) {
  const users = load("bc_users", {});
  const id = username.toLowerCase();
  if (users[id]) return "errTaken";
  const result = await hashPassword(password);
  users[id] = { name: username, salt: result.salt, hash: result.hash };
  save("bc_users", users);
  state.user = id;
  save("bc_session", id);
  return null;
}

async function login(username, password) {
  const users = load("bc_users", {});
  const id = username.toLowerCase();
  const account = users[id];
  if (!account) return "errBad";
  const result = await hashPassword(password, account.salt);
  if (result.hash !== account.hash) return "errBad";
  state.user = id;
  save("bc_session", id);
  return null;
}

function logout() {
  state.token++;
  state.user = null;
  try { localStorage.removeItem("bc_session"); } catch (e) { /* ignore */ }
  showAuth();
}

function displayName() {
  const users = load("bc_users", {});
  return (users[state.user] && users[state.user].name) || state.user || "";
}

function savePrefs() {
  if (!state.user) return;
  save("bc_prefs_" + state.user, {
    lang: state.lang, version: state.version, book: state.book, chapter: state.chapter
  });
  save("bc_lang", state.lang);
}

/* ---------- SCREENS ---------- */

let authMode = "login";

function setAuthMode(mode) {
  authMode = mode;
  $("tabLogin").classList.toggle("active", mode === "login");
  $("tabSignup").classList.toggle("active", mode === "signup");
  $("confirmWrap").hidden = mode === "login";
  $("authPass").autocomplete = mode === "login" ? "current-password" : "new-password";
  $("authSubmit").textContent = t(mode === "login" ? "loginBtn" : "signupBtn");
  $("authMsg").textContent = "";
  $("authMsg").dataset.key = "";
}

function showAuthError(key) {
  $("authMsg").textContent = t(key);
  $("authMsg").dataset.key = key;
}

function applyTexts() {
  document.documentElement.lang = state.lang;

  // login screen
  $("authSubtitle").textContent = t("tagline");
  $("tabLogin").textContent = t("login");
  $("tabSignup").textContent = t("signup");
  $("lblUser").textContent = t("username");
  $("lblPass").textContent = t("password");
  $("lblPass2").textContent = t("confirm");
  $("authNote").textContent = t("note");
  $("authSubmit").textContent = t(authMode === "login" ? "loginBtn" : "signupBtn");
  const msgKey = $("authMsg").dataset.key;
  if (msgKey) $("authMsg").textContent = t(msgKey);

  // app
  $("userName").textContent = "\uD83D\uDC4B " + t("hello") + ", " + displayName();
  $("logoutBtn").textContent = t("logout");
  $("searchTitle").textContent = "\uD83D\uDD0E " + t("search");
  $("searchInput").placeholder = t("placeholder");
  $("searchBtn").textContent = t("searchBtn");
  $("langSelect").title = t("language");
  $("versionSelect").title = t("version");

  $("authLang").value = state.lang;
  $("langSelect").value = state.lang;
}

function showAuth() {
  $("appView").hidden = true;
  $("authView").hidden = false;
  applyTexts();
}

function showApp() {
  const prefs = load("bc_prefs_" + state.user, {});
  if (prefs.lang && I18N[prefs.lang]) state.lang = prefs.lang;
  if (prefs.version && VERSIONS.some((v) => v[0] === prefs.version)) state.version = prefs.version;
  if (prefs.book && BOOKS.some((b) => b[0] === prefs.book)) {
    state.book = prefs.book;
    state.chapter = prefs.chapter || 1;
  }
  state.reference = "";

  $("versionSelect").value = state.version;
  $("authView").hidden = true;
  $("appView").hidden = false;
  applyTexts();
  renderToc();
  reload();
}

/* ---------- RIGHT PAGE: BOOKS AND CHAPTERS ---------- */

function renderToc() {
  const box = $("tocPage");
  box.textContent = "";

  BOOKS.forEach((entry, i) => {
    const name = entry[0];
    const count = entry[1];

    if (i === 0 || i === 39) {
      box.appendChild(el("h3", "toc-heading", t(i === 0 ? "ot" : "nt")));
    }

    const details = el("details", "toc-book");
    details.appendChild(el("summary", "", name));

    const grid = el("div", "chapter-grid");
    for (let c = 1; c <= count; c++) {
      const button = el("button", "chapter-num", String(c));
      button.type = "button";
      button.dataset.book = name;
      button.dataset.chapter = String(c);
      grid.appendChild(button);
    }
    details.appendChild(grid);
    box.appendChild(details);
  });

  markActive(true);
}

function markActive(scroll) {
  document.querySelectorAll(".chapter-num.active").forEach((n) => n.classList.remove("active"));
  if (state.reference) return;

  const buttons = document.querySelectorAll(".chapter-num");
  let found = null;
  buttons.forEach((b) => {
    if (b.dataset.book === state.book && b.dataset.chapter === String(state.chapter)) found = b;
  });
  if (!found) return;

  found.classList.add("active");
  const details = found.closest("details");
  if (details) details.open = true;

  if (scroll) {
    const box = $("tocPage");
    const r = found.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    box.scrollTop += r.top - b.top - box.clientHeight / 2;
  }
}

/* ---------- BIBLE TEXT ---------- */

const passageCache = new Map();

async function fetchPassage(reference, version) {
  const key = version + "|" + reference.toLowerCase();
  if (passageCache.has(key)) return passageCache.get(key);

  const url =
    "https://bible-api.com/" + encodeURIComponent(reference) +
    "?translation=" + encodeURIComponent(version) +
    "&single_chapter_book_matching=indifferent";

  let res;
  try {
    res = await fetch(url);
  } catch (e) {
    throw new Error("net");
  }
  if (res.status === 429) throw new Error("rate");

  let data = null;
  try { data = await res.json(); } catch (e) { /* not JSON */ }
  if (!res.ok || !data || data.error || !Array.isArray(data.verses)) throw new Error("notfound");

  passageCache.set(key, data);
  if (passageCache.size > 40) passageCache.delete(passageCache.keys().next().value);
  return data;
}

function currentReference() {
  return state.reference || (state.book + " " + state.chapter);
}

function reload() {
  markActive(true);
  showPassage(currentReference());
}

function setStatus(message) {
  $("passageHead").textContent = "";
  $("verses").textContent = "";
  $("pager").textContent = "";
  $("notice").textContent = "";
  $("verses").appendChild(el("p", "status", message));
}

async function showPassage(reference) {
  const token = ++state.token;
  setStatus(t("loading"));

  let data;
  try {
    data = await fetchPassage(reference, state.version);
  } catch (e) {
    if (token !== state.token) return;
    setStatus(e.message === "rate" ? t("rate") : e.message === "net" ? t("netErr") : t("notFound"));
    return;
  }
  if (token !== state.token) return;

  renderHead(data);
  renderVerses(data);
  renderPager();

  if (state.lang !== "en") await translateAll(token);
}

function versionLabel() {
  const found = VERSIONS.find((v) => v[0] === state.version);
  return found ? found[1] : state.version;
}

function renderHead(data) {
  const head = $("passageHead");
  head.textContent = "";
  head.appendChild(el("div", "cross", "\u271D"));
  head.appendChild(el("h2", "", data.reference));
  head.appendChild(el("p", "version-name", data.translation_name || versionLabel()));
  const langName = LANGS.find((l) => l[0] === state.lang)[1];
  head.appendChild(el("span", "lang-badge", langName));
}

function renderVerses(data) {
  const box = $("verses");
  box.textContent = "";
  $("notice").textContent = "";
  state.verseEls = [];

  data.verses.forEach((v) => {
    const wrap = el("span", "verse");
    wrap.appendChild(el("sup", "vnum", String(v.verse)));
    const text = (v.text || "").trim();
    const body = el("span", "vtext", text);
    wrap.appendChild(body);
    wrap.appendChild(document.createTextNode(" "));
    box.appendChild(wrap);
    state.verseEls.push({
      el: body,
      text: text,
      ref: v.book_name + " " + v.chapter + ":" + v.verse
    });
  });
}

function neighbor(direction) {
  let i = BOOKS.findIndex((b) => b[0] === state.book);
  let c = state.chapter + direction;
  if (c < 1) {
    if (i === 0) return null;
    i--;
    c = BOOKS[i][1];
  } else if (c > BOOKS[i][1]) {
    if (i === BOOKS.length - 1) return null;
    i++;
    c = 1;
  }
  return { book: BOOKS[i][0], chapter: c };
}

function renderPager() {
  const pager = $("pager");
  pager.textContent = "";
  if (state.reference) return;

  const prev = neighbor(-1);
  const next = neighbor(1);

  if (prev) {
    const b = el("button", "pager-btn", "\u2190 " + t("prev"));
    b.type = "button";
    b.addEventListener("click", () => goTo(prev.book, prev.chapter));
    pager.appendChild(b);
  } else {
    pager.appendChild(el("span"));
  }

  if (next) {
    const b = el("button", "pager-btn", t("next") + " \u2192");
    b.type = "button";
    b.addEventListener("click", () => goTo(next.book, next.chapter));
    pager.appendChild(b);
  }
}

function goTo(book, chapter) {
  state.reference = "";
  state.book = book;
  state.chapter = chapter;
  $("searchInput").value = "";
  savePrefs();
  reload();
  $("versesPage").scrollTop = 0;
}

/* ---------- TRANSLATION (runs in the browser) ---------- */

// Optional: put your email here to raise MyMemory's free limit
// from about 5,000 to 50,000 characters per day.
const MYMEMORY_EMAIL = "camraadriene@gmail.com";
const MYMEMORY_CODES = { tl: ["tl", "tl-PH"], war: ["war", "war-PH"] };

const TCACHE_KEY = "bc_tcache_v1";
const tcache = load(TCACHE_KEY, {});
const problems = new Set();
let googleOk = true;

function hashText(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

function cacheKey(lang, text) {
  return lang + "|" + hashText(text) + "|" + text.length;
}

function cacheGet(lang, text) {
  return tcache[cacheKey(lang, text)] || null;
}

function cacheSet(lang, text, out) {
  tcache[cacheKey(lang, text)] = out;
  const keys = Object.keys(tcache);
  if (keys.length > 2500) {
    keys.slice(0, 500).forEach((k) => { delete tcache[k]; });
  }
}

function applyTranslation(item, out) {
  item.el.textContent = out;
  item.el.classList.remove("pending", "untranslated");
}

function decodeEntities(text) {
  const box = document.createElement("textarea");
  box.innerHTML = text;
  return box.value;
}

async function getJson(url) {
  const host = new URL(url).hostname;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      problems.add(host + " answered HTTP " + res.status);
      return null;
    }
    return await res.json();
  } catch (e) {
    problems.add("cannot reach " + host + " (check your internet)");
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Google's public endpoint (Tagalog only). If the browser blocks it, we skip it.
async function viaGoogle(text, lang) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&dt=t" +
    "&tl=" + encodeURIComponent(lang) +
    "&q=" + encodeURIComponent(text);
  const data = await getJson(url);
  if (!Array.isArray(data) || !Array.isArray(data[0])) return null;
  const out = data[0].map((part) => (part && part[0]) || "").join("");
  return out.trim() ? out : null;
}

// MyMemory accepts about 500 bytes per request, so long verses are split by sentence.
function splitText(text, maxBytes) {
  const encoder = new TextEncoder();
  const sentences = text.match(/[^.!?;]+[.!?;]*["\u201D\u2019)]*\s*/g) || [text];
  const chunks = [];
  let current = "";
  for (const sentence of sentences) {
    const joined = current ? current + " " + sentence.trim() : sentence.trim();
    if (current && encoder.encode(joined).length > maxBytes) {
      chunks.push(current);
      current = sentence.trim();
    } else {
      current = joined;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

// Choose the translation we trust from a MyMemory answer.
// Waray-Waray: MyMemory's machine translator does not really know it (it can answer
// in another language, for example German), so only entries written by people are used.
function pickMyMemoryText(data, lang) {
  if (lang !== "war") {
    return (data.responseData && data.responseData.translatedText) || "";
  }
  const matches = Array.isArray(data.matches) ? data.matches : [];
  const human = matches
    .filter((m) => m && m.translation &&
      String(m["created-by"] || "").toUpperCase() !== "MT!" &&
      !/machine translation/i.test(String(m.reference || "")))
    .sort((a, b) => Number(b.match) - Number(a.match))[0];
  return human && Number(human.match) >= 0.8 ? human.translation : "";
}

async function myMemoryOnce(text, code, lang) {
  const out = [];
  for (const part of splitText(text, 450)) {
    let url =
      "https://api.mymemory.translated.net/get" +
      "?q=" + encodeURIComponent(part) +
      "&langpair=" + encodeURIComponent("en|" + code);
    if (MYMEMORY_EMAIL) url += "&de=" + encodeURIComponent(MYMEMORY_EMAIL);

    const data = await getJson(url);
    if (!data) return null;

    const first = data.responseData && data.responseData.translatedText;
    if (first && /MYMEMORY WARNING/i.test(first)) {
      problems.add("MyMemory free daily limit reached - try again tomorrow or add your email in app.js");
      return null;
    }

    const raw = pickMyMemoryText(data, lang);
    const translated = raw ? decodeEntities(raw).trim() : "";
    if (Number(data.responseStatus) !== 200 || !translated) return null;
    if (translated.toLowerCase() === part.trim().toLowerCase()) return null;   // came back untranslated

    out.push(translated);
  }
  return out.join(" ");
}

async function viaMyMemory(text, lang) {
  for (const code of MYMEMORY_CODES[lang] || [lang]) {
    const result = await myMemoryOnce(text, code, lang);
    if (result) return result;
  }
  return null;
}

async function translateOne(item, lang) {
  // 1. hand-checked verses (see CURATED near the top of this file)
  const curated = CURATED[lang] || {};
  if (item.ref && curated[item.ref]) return curated[item.ref];

  // 2. Google (Tagalog only)
  let result = null;
  if (lang === "tl" && googleOk) {
    result = await viaGoogle(item.text, "tl");
    if (!result) googleOk = false;
  }

  // 3. MyMemory
  if (!result) result = await viaMyMemory(item.text, lang);
  if (!result) {
    problems.add(lang === "war"
      ? "no Waray-Waray translation found for " + (item.ref || "a verse") + " - add it to CURATED in app.js"
      : "no translation found for " + (item.ref || "a verse"));
  }
  return result;
}

async function translateAll(token) {
  const lang = state.lang;
  const items = state.verseEls;
  const todo = [];

  items.forEach((item, index) => {
    const cached = cacheGet(lang, item.text);
    if (cached) {
      applyTranslation(item, cached);
    } else {
      item.el.classList.add("pending");
      todo.push(index);
    }
  });

  if (!todo.length) return;
  $("notice").textContent = t("translating");
  problems.clear();

  let failed = 0;
  let next = 0;

  async function worker() {
    while (next < todo.length) {
      const item = items[todo[next++]];
      let out = null;
      try { out = await translateOne(item, lang); } catch (e) { out = null; }
      if (token !== state.token) return;

      item.el.classList.remove("pending");
      if (out) {
        cacheSet(lang, item.text, out);
        applyTranslation(item, out);
      } else {
        failed++;
        item.el.classList.add("untranslated");
      }
    }
  }

  await Promise.all([worker(), worker(), worker()]);
  if (token !== state.token) return;

  save(TCACHE_KEY, tcache);
  const why = Array.from(problems).slice(0, 3).join("; ");
  $("notice").textContent = failed ? t("partial") + (why ? " [" + why + "]" : "") : "";
}

/* ---------- EVENTS ---------- */

function setLanguage(code) {
  state.lang = code;
  save("bc_lang", code);
  applyTexts();
  if (state.user) {
    savePrefs();
    renderToc();
    reload();
  }
}

function bindEvents() {
  $("authLang").addEventListener("change", (e) => setLanguage(e.target.value));
  $("langSelect").addEventListener("change", (e) => setLanguage(e.target.value));

  $("versionSelect").addEventListener("change", (e) => {
    state.version = e.target.value;
    savePrefs();
    reload();
  });

  $("tabLogin").addEventListener("click", () => setAuthMode("login"));
  $("tabSignup").addEventListener("click", () => setAuthMode("signup"));

  $("authForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = $("authUser").value.trim();
    const pass = $("authPass").value;
    const pass2 = $("authPass2").value;

    $("authMsg").textContent = "";
    $("authMsg").dataset.key = "";

    if (!username || !pass || (authMode === "signup" && !pass2)) return showAuthError("errFill");
    if (authMode === "signup") {
      if (!/^[A-Za-z0-9_]{3,24}$/.test(username)) return showAuthError("errUser");
      if (pass.length < 6) return showAuthError("errPass");
      if (pass !== pass2) return showAuthError("errMatch");
    }

    try {
      const error = authMode === "signup" ? await register(username, pass) : await login(username, pass);
      if (error) return showAuthError(error);
      $("authForm").reset();
      showApp();
    } catch (err) {
      showAuthError("errCrypto");
    }
  });

  $("logoutBtn").addEventListener("click", logout);

  $("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = $("searchInput").value.trim();
    if (!text) return;
    state.reference = text;
    markActive(false);
    showPassage(text);
    $("versesPage").scrollTop = 0;
  });

  $("tocPage").addEventListener("click", (e) => {
    const button = e.target.closest(".chapter-num");
    if (!button) return;
    goTo(button.dataset.book, parseInt(button.dataset.chapter, 10));
  });
}

/* ---------- START ---------- */

function boot() {
  fillSelect($("authLang"), LANGS);
  fillSelect($("langSelect"), LANGS.map((l) => [l[0], "\uD83C\uDF10 " + l[1]]));
  fillSelect($("versionSelect"), VERSIONS);

  const savedLang = load("bc_lang", "en");
  state.lang = I18N[savedLang] ? savedLang : "en";

  bindEvents();
  setAuthMode("login");

  const session = load("bc_session", null);
  const users = load("bc_users", {});
  if (session && users[session]) {
    state.user = session;
    showApp();
  } else {
    showAuth();
  }
}

boot();