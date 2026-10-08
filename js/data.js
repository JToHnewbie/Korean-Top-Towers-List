/* 데이터 로더: Google 스프레드시트(CSV) → 리스트 객체
   - 시트의 "행 순서 = 순위" (헤더 다음 첫 행이 1위)
   - 행을 중간에 삽입하면 그 아래 타워들은 자동으로 한 칸씩 밀려납니다. */
(function () {
  const CFG = window.KTTL_CONFIG;

  function parseCSV(text) {
    const rows = []; let row = []; let f = ""; let q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
        else f += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(f); rows.push(row); row = []; f = "";
      } else f += c;
    }
    if (f !== "" || row.length) { row.push(f); rows.push(row); }
    if (!rows.length) return [];
    const head = rows[0].map(h => h.trim().toLowerCase());
    return rows.slice(1)
      .filter(r => r.some(v => v.trim() !== ""))
      .map(r => Object.fromEntries(head.map((h, i) => [h, (r[i] || "").trim()])));
  }

  const slug = s => s.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
  const splitNames = s => (s || "").split(/[,;\/]/).map(x => x.trim()).filter(Boolean);

  function sheetURL(tab) {
    return `https://docs.google.com/spreadsheets/d/${CFG.SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}&_=${Date.now()}`;
  }

  async function fetchTab(key) {
    const res = await fetch(sheetURL(CFG.TABS[key]), { cache: "no-store" });
    if (!res.ok) throw new Error(key + " " + res.status);
    const txt = await res.text();
    if (/^\s*</.test(txt)) throw new Error(key + ": not CSV (시트 공유 설정 확인)");
    return txt;
  }

  const LISTS = ["main", "misc", "packs", "unverified", "pending"];
  const EXTRA = ["records", "changelog"];

  function points(pos) {
    const { MAX, DECAY } = CFG.POINTS;
    return Math.round(MAX * Math.pow(DECAY, pos - 1) * 100) / 100;
  }

  function build(raw) {
    const db = { lists: {}, records: [], changelog: [], byId: {} };
    LISTS.forEach(key => {
      const rows = parseCSV(raw[key] || "");
      db.lists[key] = rows.filter(r => r.name).map((r, i) => {
        const t = {
          list: key,
          pos: i + 1,
          id: r.id ? slug(r.id) : slug(r.name),
          name: r.name,
          game: r.game || "",
          difficulty: r.difficulty || "",
          creators: splitNames(r.creators),
          verifier: r.verifier || "",
          video: r.video || "",
          place: r.place_id || r.place || "",
          note: r.note || "",
          towers: (r.towers || "").split(/[;\n]/).map(x => slug(x.trim())).filter(Boolean),
          records: [],
          history: []
        };
        t.points = key === "main" ? points(t.pos) : 0;
        return t;
      });
      db.lists[key].forEach(t => { db.byId[key + ":" + t.id] = t; });
    });

    db.records = parseCSV(raw.records || "").filter(r => r.player && r.tower_id).map(r => ({
      list: (r.list || "main").toLowerCase(), tower: slug(r.tower_id), player: r.player, video: r.video || "", date: r.date || "", note: r.note || ""
    }));
    db.records.forEach(r => { const t = db.byId[r.list + ":" + r.tower]; if (t) t.records.push(r); });

    db.changelog = parseCSV(raw.changelog || "").filter(r => r.tower_id).map(r => ({
      date: r.date || "", list: (r.list || "main").toLowerCase(), tower: slug(r.tower_id), change: (r.change || "other").toLowerCase(), from: r.from || "", to: r.to || "", note: r.note || ""
    })).sort((a, b) => b.date.localeCompare(a.date));
    db.changelog.forEach(c => { const t = db.byId[c.list + ":" + c.tower]; if (t) t.history.push(c); });

    // players (Main list only for points)
    const P = {};
    const get = n => (P[n.toLowerCase()] ||= { name: n, score: 0, clears: [], verifs: [] });
    db.lists.main.forEach(t => {
      if (t.verifier) { const p = get(t.verifier); p.verifs.push(t); p.score += t.points; }
      const seen = new Set();
      t.records.forEach(r => {
        const k = r.player.toLowerCase();
        if (seen.has(k) || (t.verifier && k === t.verifier.toLowerCase())) return;
        seen.add(k); const p = get(r.player); p.clears.push(t); p.score += t.points;
      });
    });
    db.players = Object.values(P).map(p => ({ ...p, score: Math.round(p.score * 100) / 100 }))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    db.players.forEach((p, i) => p.rank = i + 1);
    return db;
  }

  async function load() {
    let raw, source = "sample", error = null;
    if (CFG.SHEET_ID) {
      try {
        const keys = [...LISTS, ...EXTRA];
        const texts = await Promise.all(keys.map(k => fetchTab(k).catch(e => { if (LISTS.includes(k) && k === "main") throw e; return ""; })));
        raw = Object.fromEntries(keys.map((k, i) => [k, texts[i]]));
        source = "sheet";
        try { localStorage.setItem("kttl-cache", JSON.stringify({ t: Date.now(), raw })); } catch (e) {}
      } catch (e) {
        error = String(e.message || e);
        const c = JSON.parse(localStorage.getItem("kttl-cache") || "null");
        if (c) { raw = c.raw; source = "cache"; } else { raw = window.KTTL_SAMPLE; source = "sample"; }
      }
    } else raw = window.KTTL_SAMPLE;
    const db = build(raw);
    db.source = source; db.error = error; db.syncedAt = new Date();
    return db;
  }

  window.KTTL_DATA = { load, parseCSV, slug, points, LISTS };
})();
