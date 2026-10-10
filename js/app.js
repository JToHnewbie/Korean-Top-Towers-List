/* Korean Top Towers List — 공통 UI 및 페이지 렌더러 */
(function () {
  const CFG = window.KTTL_CONFIG, I18N = window.KTTL_I18N, D = window.KTTL_DATA;
  let lang = localStorage.getItem("kttl-lang") || "ko";
  let T = I18N[lang];
  let DB = null;
  const PAGE = document.body.dataset.page;
  const qs = new URLSearchParams(location.search);

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (s, el = document) => el.querySelector(s);

  const PAGES = { main: "index.html", misc: "misc.html", packs: "packs.html", unverified: "unverified.html", pending: "pending.html", stats: "stats.html", submit: "submit.html", guidelines: "guidelines.html" };
  const towerURL = t => `tower.html?list=${t.list}&id=${encodeURIComponent(t.id)}`;

  /* JToH 계열 난이도 색 */
  const DIFF = {
    insane: "oklch(0.452 0.313 264.1)", extreme: "oklch(0.6166 0.2005 253.93)", terrifying: "oklch(0.9054 0.1546 194.77)", catastrophic: "oklch(0.97 0 0)",
    horrific: "oklchoklch(0.6 0.2 300)", unreal: "oklch(0.4186 0.2323 300.29)", nil: "oklchoklch(0.15 0 0)", error: "oklch(0.3767 0.15 29.23)", toohard: "oklch(0 0 0)"
  };
  const SUBTIERS = ["Baseline","Bottom","Bottom-Low","Low","Low-Mid","Mid","Mid-High","High","High-Peak","Peak"];

function parseDiff(d) {
  const s = String(d || "").trim();
  if (!s) return null;
  const parts = s.split(",").map(x => x.trim()).filter(Boolean);
  let base = parts[parts.length - 1];          // 오른쪽 = 일반 난이도
  let sub  = parts.slice(0, -1).join(", ");    // 왼쪽 = 세부 난이도
  if (!DIFF[base.toLowerCase()]) {             // 쉼표를 빠뜨린 경우("Mid-High Unreal")도 처리
    const words = s.split(/[\s,]+/);
    const i = words.map(w => w.toLowerCase()).findLastIndex(w => DIFF[w]);
    if (i >= 0) { base = words[i]; sub = words.slice(0, i).join(" "); }
  }
  return { sub, base, color: DIFF[base.toLowerCase()] || "var(--ink-3)" };
}
const diffChip = d => {
  const p = parseDiff(d);
  if (!p) return "";
  return `<span class="chip" style="--c:${p.color}"><span class="dot"></span>${p.sub ? `<span class="sub">${esc(p.sub)},</span>` : ""}${esc(p.base)}</span>`;
};

  function ytId(u) {
    if (!u) return "";
    const m = u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : "";
  }
  const thumb = t => {
    const id = ytId(t.video);
    return `<div class="thumb">${id ? `<img loading="lazy" src="https://i.ytimg.com/vi/${id}/mqdefault.jpg" alt="">` : `<div class="ph">${esc(T.noVideo)}</div>`}</div>`;
  };
  const placeLink = p => {
    if (!p) return "—";
    if (/^\d+$/.test(p)) return `<a href="https://www.roblox.com/games/${p}" target="_blank" rel="noopener">${esc(p)} ↗</a>`;
    if (/^https?:/.test(p)) return `<a href="${esc(p)}" target="_blank" rel="noopener">${esc(T.open)} ↗</a>`;
    return esc(p);
  };
  const posLabel = t => t.list === "pending" ? "—" : "#" + t.pos;

  /* ---------------- shell ---------------- */
  function shell() {
    const navKeys = ["main", "misc", "packs", "unverified", "pending"];
    const extraKeys = ["stats", "submit", "guidelines"];
    const active = PAGE === "tower" ? qs.get("list") : PAGE;
    const link = k => `<a href="${PAGES[k]}" class="${active === k ? "on" : ""}">${esc(T.nav[k])}</a>`;
    $("#hdr").innerHTML = `
      <div class="hdr-top">
        <a class="brand" href="index.html"><span class="brand-mark">KT</span><span class="brand-name"><b>Korean</b> Top Towers List</span></a>
        <div class="hdr-search">
          <input id="gsearch" type="search" placeholder="${esc(T.search)}" autocomplete="off">
          <div class="search-pop" id="gpop"></div>
        </div>
        <div class="lang"><button data-l="ko" class="${lang === "ko" ? "on" : ""}">KO</button><button data-l="en" class="${lang === "en" ? "on" : ""}">EN</button></div>
      </div>
      <nav class="nav">${navKeys.map(link).join("")}<span class="sep"></span>${extraKeys.map(link).join("")}<a href="${esc(CFG.DISCORD_URL)}" target="_blank" rel="noopener">Discord ↗</a></nav>`;
    $("#foot").innerHTML = `<div class="foot-in"><span>© 2026 Korean Top Towers List · ${esc(T.footer)}</span><span><a href="관리자 가이드.html">${esc(T.adminGuide)}</a> · <a href="guidelines.html">${esc(T.nav.guidelines)}</a> · <a href="${esc(CFG.DISCORD_URL)}" target="_blank">Discord</a></span></div>`;
    document.documentElement.lang = lang;
    $(".lang").onclick = e => {
      const l = e.target.dataset.l; if (!l || l === lang) return;
      lang = l; T = I18N[lang]; localStorage.setItem("kttl-lang", l); shell(); render();
    };
    wireSearch();
  }

  function wireSearch() {
    const inp = $("#gsearch"), pop = $("#gpop");
    let sel = 0, items = [];
    const draw = () => {
      const q = inp.value.trim().toLowerCase();
      if (!q || !DB) { pop.classList.remove("open"); return; }
      const towers = [];
      D.LISTS.forEach(k => DB.lists[k].forEach(t => {
        if (t.name.toLowerCase().includes(q) || t.creators.some(c => c.toLowerCase().includes(q))) towers.push(t);
      }));
      const players = DB.players.filter(p => p.name.toLowerCase().includes(q)).slice(0, 5);
      items = [...towers.slice(0, 8).map(t => ({ href: towerURL(t), html: `<span class="pos">${posLabel(t)}</span><span>${esc(t.name)}</span><span class="meta">${esc(T.listName[t.list])}</span>` })),
               ...players.map(p => ({ href: `stats.html?player=${encodeURIComponent(p.name)}`, html: `<span class="pos">P${p.rank}</span><span>${esc(p.name)}</span><span class="meta">${p.score} pt</span>` }))];
      sel = Math.min(sel, Math.max(items.length - 1, 0));
      let html = "", i = 0;
      const tw = Math.min(towers.length, 8);
      if (tw) html += `<div class="sp-group">Towers</div>` + items.slice(0, tw).map(it => `<a class="sp-item ${i++ === sel ? "active" : ""}" href="${it.href}">${it.html}</a>`).join("");
      if (players.length) html += `<div class="sp-group">Players</div>` + items.slice(tw).map(it => `<a class="sp-item ${i++ === sel ? "active" : ""}" href="${it.href}">${it.html}</a>`).join("");
      pop.innerHTML = html || `<div class="sp-empty">${esc(T.noResults)}</div>`;
      pop.classList.add("open");
    };
    inp.addEventListener("input", () => { sel = 0; draw(); });
    inp.addEventListener("focus", draw);
    inp.addEventListener("keydown", e => {
      if (e.key === "ArrowDown") { sel = Math.min(sel + 1, items.length - 1); draw(); e.preventDefault(); }
      if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); draw(); e.preventDefault(); }
      if (e.key === "Enter" && items[sel]) location.href = items[sel].href;
      if (e.key === "Escape") { inp.blur(); pop.classList.remove("open"); }
    });
    document.addEventListener("click", e => { if (!e.target.closest(".hdr-search")) pop.classList.remove("open"); });
  }

  /* ---------------- sidebar ---------------- */
  function syncBox() {
    const st = DB.source === "sheet" ? ["on", T.srcSheet] : DB.error ? ["err", T.srcError] : ["", T.srcSample];
    const time = DB.syncedAt.toLocaleTimeString(lang === "ko" ? "ko-KR" : "en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    return `<div class="card box">
      <div class="sync"><span class="led ${st[0]}"></span><span>${esc(st[1])}</span></div>
      <div class="sync-meta">${esc(T.lastSync)} ${time} · auto ${CFG.REFRESH_SECONDS}s</div>
      <div class="sync-row"><button class="btn ghost" id="refreshBtn">${esc(T.refresh)}</button><a class="btn ghost" href="관리자 가이드.html">${esc(T.adminGuide)}</a></div>
    </div>`;
  }
  function sidebar(extra = "") {
    return `<aside class="side">
      ${extra}
      <div class="card box"><h3>${esc(T.submitRecord)}</h3><p>${esc(T.submitRecordDesc)}</p><a class="btn block" href="submit.html">${esc(T.nav.submit)}</a></div>
      <div class="card box"><h3>${esc(T.discord)}</h3><p>${esc(T.discordDesc)}</p><a class="btn ghost block" href="${esc(CFG.DISCORD_URL)}" target="_blank" rel="noopener">Discord ↗</a></div>
      ${syncBox()}
    </aside>`;
  }

  /* ---------------- list page ---------------- */
  function entry(t) {
    const credit = `${esc(T.by)} <b>${esc(t.creators.join(", ") || "—")}</b>` +
      (t.list === "unverified" ? "" : t.verifier ? ` · ${esc(T.verifiedBy)} <b>${esc(t.verifier)}</b>` : "");
    const right = t.list === "main"
      ? `<div class="pts">${t.points.toFixed(2)}</div><div class="pts-l">${esc(T.points)}</div><div class="rec">${esc(T.recordsN(t.records.length))}</div>`
      : t.list === "packs" ? `<div class="pts">${t.towers.length}</div><div class="pts-l">Towers</div>`
      : t.list === "pending" ? `<div class="pts-l">${esc(T.unplaced)}</div>`
      : `<div class="rec">${esc(T.recordsN(t.records.length))}</div>`;
    return `<a class="card entry ${t.pos <= 3 ? "top" : ""}" href="${towerURL(t)}" data-q="${esc((t.name + " " + t.creators.join(" ") + " " + t.verifier + " " + t.game).toLowerCase())}">
      ${thumb(t)}
      <div class="body">
        <div class="title"><span class="pos">${posLabel(t)}</span><span class="name">${esc(t.name)}</span></div>
        <div class="credit">${credit}</div>
        <div class="tags">${diffChip(t.difficulty)}${t.game ? `<span class="chip">${esc(t.game)}</span>` : ""}${t.list === "unverified" ? `<span class="chip warn">${esc(T.notVerified)}</span>` : ""}</div>
      </div>
      <div class="right">${right}</div>
    </a>`;
  }

  function renderList(key) {
    const list = DB.lists[key];
    const recent = DB.changelog.filter(c => c.list === key).slice(0, 5);
    const recentBox = recent.length ? `<div class="card"><div class="box" style="padding-bottom:6px"><h3>${esc(T.history)}</h3></div>
      <table class="t"><tbody>${recent.map(c => { const t = DB.byId[c.list + ":" + c.tower]; return `<tr class="click" onclick="location.href='${t ? towerURL(t) : "#"}'"><td style="padding-left:20px">${changeBadge(c)}</td><td style="font-size:13px">${esc(t ? t.name : c.tower)}</td></tr>`; }).join("")}</tbody></table></div>` : "";
    $("#app").className = "wrap";
    $("#app").innerHTML = `
      <main>
        <div class="phead"><div class="eyebrow">${esc(T.towersN(list.length))}</div><h1>${esc(T.listName[key])}</h1><p>${esc(T.listDesc[key])}</p></div>
        <div class="toolbar"><input id="lf" type="search" placeholder="${esc(T.filter)}"><span class="count" id="lc">${list.length}</span></div>
        <div class="list" id="ll">${list.map(entry).join("") || `<div class="card empty">${esc(T.noResults)}</div>`}</div>
      </main>
      ${sidebar(recentBox)}`;
    const inp = $("#lf"); inp.value = sessionStorage.getItem("kttl-f-" + key) || "";
    const apply = () => {
      const q = inp.value.trim().toLowerCase(); let n = 0;
      document.querySelectorAll("#ll .entry").forEach(el => { const ok = !q || el.dataset.q.includes(q); el.style.display = ok ? "" : "none"; n += ok; });
      $("#lc").textContent = q ? `${n} / ${list.length}` : list.length;
      sessionStorage.setItem("kttl-f-" + key, inp.value);
    };
    inp.oninput = apply; apply();
  }

  function changeBadge(c) {
    const cls = { placed: "new", raised: "up", lowered: "down", pushed: "down", removed: "down", verified: "up" }[c.change] || "";
    const label = T.change[c.change] || T.change.other;
    const mv = c.from || c.to ? ` ${c.from ? "#" + c.from : ""}${c.from && c.to ? " → " : ""}${c.to ? (c.from ? "" : "→ ") + "#" + c.to : ""}` : "";
    return `<span class="badge ${cls}">${esc(label)}${esc(mv)}</span>`;
  }

  /* ---------------- tower detail ---------------- */
  function renderTower() {
    const key = qs.get("list") || "main", id = qs.get("id");
    const list = DB.lists[key] || [];
    const t = list.find(x => x.id === id);
    $("#app").className = "wrap";
    if (!t) { $("#app").innerHTML = `<main><div class="card empty">${esc(T.noResults)}</div></main>${sidebar()}`; return; }
    document.title = `${t.name} — Korean Top Towers List`;
    const vid = ytId(t.video);
    const prev = list[t.pos - 2], next = list[t.pos];
    const facts = [
      [T.position, key === "pending" ? T.unplaced : "#" + t.pos, "mono"],
      [T.difficulty, diffChip(t.difficulty) || "—", "", true],
      [T.game, t.game || "—"],
      [T.creators, t.creators.join(", ") || "—"],
      [T.verifier, t.verifier || (key === "unverified" ? T.notVerified : "—")],
      key === "main" ? [T.points, t.points.toFixed(2), "mono"] : key === "packs" ? ["Towers", t.towers.length, "mono"] : [T.placeId, placeLink(t.place), "mono", true]
    ];
    if (key === "main" || key === "packs") facts.push([T.placeId, placeLink(t.place), "mono", true], [T.records, t.records.length, "mono"], [T.video, vid ? `<a href="${esc(t.video)}" target="_blank" rel="noopener">YouTube ↗</a>` : "—", "", true]);
    const packTowers = key === "packs" && t.towers.length ? `<div class="sec"><div class="sec-h"><h2>${esc(T.towersInPack)}</h2><span>${t.towers.length}</span></div><div class="card packlist">${t.towers.map(tid => {
      const m = D.LISTS.map(k => DB.byId[k + ":" + tid]).find(Boolean);
      return m ? `<a href="${towerURL(m)}"><span class="pos">${posLabel(m)}</span><span>${esc(m.name)}</span><span style="margin-left:auto">${diffChip(m.difficulty)}</span></a>` : `<a><span class="pos">—</span><span>${esc(tid)}</span></a>`;
    }).join("")}</div></div>` : "";

    const recs = t.records.slice().sort((a, b) => a.date.localeCompare(b.date));
    $("#app").innerHTML = `
      <main>
        <div class="crumbs"><a href="${PAGES[key]}">${esc(T.listName[key])}</a><span>/</span><span>${esc(t.name)}</span></div>
        <div class="dhead"><div class="dpos">${posLabel(t)}</div><div><h1>${esc(t.name)}</h1><div class="credit">${esc(T.by)} ${esc(t.creators.join(", ") || "—")}${t.verifier ? ` · ${esc(T.verifiedBy)} ${esc(t.verifier)}` : ""}</div></div></div>
        <div class="video">${vid ? `<iframe src="https://www.youtube.com/embed/${vid}" allowfullscreen loading="lazy"></iframe>` : `<div class="ph">${esc(T.noVideo)} — YouTube</div>`}</div>
        <div class="card facts">${facts.map(f => `<div><div class="k">${esc(f[0])}</div><div class="v ${f[2] || ""}">${f[3] ? f[1] : esc(f[1])}</div></div>`).join("")}</div>
        ${t.note ? `<div class="note">${esc(t.note)}</div>` : ""}
        ${packTowers}
        ${key !== "pending" ? `<div class="sec"><div class="sec-h"><h2>${esc(T.records)}</h2><span>${recs.length}</span></div>
          <div class="card">${recs.length ? `<table class="t"><thead><tr><th style="width:56px">#</th><th>${esc(T.player)}</th><th>${esc(T.date)}</th><th>${esc(T.video)}</th></tr></thead><tbody>
          ${recs.map((r, i) => `<tr><td class="mono">${i + 1}</td><td><a class="lnk" href="stats.html?player=${encodeURIComponent(r.player)}">${esc(r.player)}</a>${r.note ? ` <span style="color:var(--ink-3);font-size:12.5px">· ${esc(r.note)}</span>` : ""}</td><td class="mono">${esc(r.date || "—")}</td><td>${r.video ? `<a class="lnk" href="${esc(r.video)}" target="_blank" rel="noopener">${esc(T.open)} ↗</a>` : "—"}</td></tr>`).join("")}
          </tbody></table>` : `<div class="empty">${esc(T.noRecords)}</div>`}</div></div>` : ""}
        <div class="sec"><div class="sec-h"><h2>${esc(T.history)}</h2><span>${t.history.length}</span></div>
          <div class="card">${t.history.length ? `<table class="t"><thead><tr><th style="width:130px">${esc(T.date)}</th><th>${esc(T.position)}</th><th>${esc(T.note)}</th></tr></thead><tbody>
          ${t.history.map(c => `<tr><td class="mono">${esc(c.date)}</td><td>${changeBadge(c)}</td><td style="color:var(--ink-2)">${esc(c.note || "")}</td></tr>`).join("")}
          </tbody></table>` : `<div class="empty">${esc(T.noHistory)}</div>`}</div></div>
        <div class="pager">
          ${prev ? `<a class="card" href="${towerURL(prev)}"><div class="k">← ${esc(T.prev)}</div><div class="v">${posLabel(prev)} ${esc(prev.name)}</div></a>` : "<span></span>"}
          ${next ? `<a class="card nx" href="${towerURL(next)}"><div class="k">${esc(T.next)} →</div><div class="v">${posLabel(next)} ${esc(next.name)}</div></a>` : "<span></span>"}
        </div>
      </main>
      ${sidebar()}`;
  }

  /* ---------------- stats ---------------- */
  function renderStats() {
    const S = T.stats;
    const want = (qs.get("player") || "").toLowerCase();
    let cur = DB.players.find(p => p.name.toLowerCase() === want) || DB.players[0];
    $("#app").className = "wrap single"; $("#app").style.maxWidth = "1240px";
    const panel = p => {
      if (!p) return `<div class="card empty">${esc(S.select)}</div>`;
      const all = [...p.verifs, ...p.clears].sort((a, b) => a.pos - b.pos);
      const hardest = all[0];
      const cloud = (arr, hard) => arr.length ? `<div class="tagcloud">${arr.slice().sort((a, b) => a.pos - b.pos).map(t => `<a href="${towerURL(t)}" class="${hard && t === hardest ? "hard" : ""}">#${t.pos} ${esc(t.name)}</a>`).join("")}</div>` : `<span style="color:var(--ink-3);font-size:14px">${esc(S.none)}</span>`;
      return `<div class="card">
        <div class="pl-head"><div class="eyebrow" style="font-family:var(--mono);font-size:12px;color:var(--blue)">#${p.rank}</div><h2>${esc(p.name)}</h2></div>
        <div class="pl-nums"><div><div class="k">${esc(S.score)}</div><div class="v">${p.score.toFixed(2)}</div></div><div><div class="k">${esc(S.clears)}</div><div class="v">${p.clears.length}</div></div><div><div class="k">${esc(S.verifs)}</div><div class="v">${p.verifs.length}</div></div></div>
        <div class="pl-sec"><h4>${esc(S.hardest)}</h4>${hardest ? `<a href="${towerURL(hardest)}" style="font-weight:700;color:var(--blue)">#${hardest.pos} ${esc(hardest.name)}</a>` : esc(S.none)}</div>
        <div class="pl-sec"><h4>${esc(S.verified)}</h4>${cloud(p.verifs, true)}</div>
        <div class="pl-sec"><h4>${esc(S.completed)}</h4>${cloud(p.clears, true)}</div>
      </div>`;
    };
    $("#app").innerHTML = `
      <div class="phead"><div class="eyebrow">${DB.players.length} players</div><h1>${esc(S.title)}</h1><p>${esc(S.desc)}</p></div>
      <div class="stats-grid">
        <div>
          <div class="toolbar"><input id="pf" type="search" placeholder="${esc(S.player)}"></div>
          <div class="card"><table class="t"><thead><tr><th style="width:64px">${esc(S.rank)}</th><th>${esc(S.player)}</th><th style="text-align:right">${esc(S.score)}</th></tr></thead><tbody id="pt">
          ${DB.players.map(p => `<tr class="click ${p === cur ? "sel" : ""}" data-n="${esc(p.name)}"><td class="mono">${p.rank}</td><td style="font-weight:600">${esc(p.name)}</td><td class="mono" style="text-align:right">${p.score.toFixed(2)}</td></tr>`).join("")}
          </tbody></table></div>
        </div>
        <div id="pp" style="position:sticky;top:132px">${panel(cur)}</div>
      </div>`;
    $("#pt").onclick = e => {
      const tr = e.target.closest("tr"); if (!tr) return;
      cur = DB.players.find(p => p.name === tr.dataset.n);
      document.querySelectorAll("#pt tr").forEach(r => r.classList.toggle("sel", r === tr));
      $("#pp").innerHTML = panel(cur);
      history.replaceState(null, "", "?player=" + encodeURIComponent(cur.name));
    };
    $("#pf").oninput = e => { const q = e.target.value.toLowerCase(); document.querySelectorAll("#pt tr").forEach(r => r.style.display = r.dataset.n.toLowerCase().includes(q) ? "" : "none"); };
  }

  /* ---------------- submit ---------------- */
  let submitTab = qs.get("type") === "map" ? "map" : "record";
  function renderSubmit() {
    const S = T.submit;
    $("#app").className = "wrap";
    const fld = (n, label, req, inner) => `<div class="fld" data-f="${n}"><label>${esc(label)}${req ? ' <span class="req">*</span>' : ""}</label>${inner || `<input name="${n}" ${req ? "required" : ""}>`}</div>`;
    const lists = ["main", "misc", "packs", "unverified"];
    const towerOpts = l => DB.lists[l].map(t => `<option value="${esc(t.name)}">#${t.pos} ${esc(t.name)}</option>`).join("");
    const diffs = ["Insane", "Extreme", "Terrifying", "Catastrophic", "Horrific", "Unreal"];
    const form = submitTab === "record" ? `
      <p style="color:var(--ink-2)">${esc(S.recordDesc)}</p>
      ${fld("player", S.player, true)}
      <div class="row2">${fld("list", S.list, true, `<select name="list">${lists.map(l => `<option value="${l}">${esc(T.listName[l])}</option>`).join("")}</select>`)}
      ${fld("tower", S.tower, true, `<select name="tower" required>${towerOpts("main")}</select>`)}</div>
      ${fld("video", S.video, true, `<input name="video" type="url" placeholder="https://youtu.be/…" required>`)}
      ${fld("raw", S.raw, false, `<input name="raw" type="url" placeholder="https://…">`)}
      ${fld("note", S.note, false, `<textarea name="note"></textarea>`)}` : `
      <p style="color:var(--ink-2)">${esc(S.mapDesc)}</p>
      <div class="row2">${fld("name", S.name, true)}${fld("game", S.game, true, `<input name="game" list="games" required><datalist id="games"><option>JToH</option><option>Mystic Towers</option><option>Ascent</option><option>EToH Archive</option></datalist>`)}</div>
      <div class="row2">${fld("creators", S.creators, true)}${fld("verifier", S.verifier, false)}</div>
      <div class="row2">${fld("difficulty", S.difficulty, true, `<select name="difficulty">${diffs.map(d => `<option>${d}</option>`).join("")}</select>`)}${fld("place", S.place, true)}</div>
      ${fld("video", S.video, false, `<input name="video" type="url" placeholder="https://youtu.be/…">`)}
      ${fld("note", S.note, false, `<textarea name="note"></textarea>`)}`;
    $("#app").innerHTML = `
      <main>
        <div class="phead"><h1>${esc(S.title)}</h1><p>${esc(S.rulesHint)} <a href="guidelines.html" style="color:var(--blue);font-weight:600">${esc(T.nav.guidelines)} →</a></p></div>
        <div class="tabs"><button data-t="record" class="${submitTab === "record" ? "on" : ""}">${esc(S.record)}</button><button data-t="map" class="${submitTab === "map" ? "on" : ""}">${esc(S.map)}</button></div>
        <form class="card form" id="sf" novalidate>${form}<div id="smsg"></div><div><button class="btn" type="submit">${esc(S.send)}</button></div></form>
      </main>
      ${sidebar()}`;
    $(".tabs").onclick = e => { const t = e.target.dataset.t; if (t && t !== submitTab) { submitTab = t; history.replaceState(null, "", "?type=" + t); renderSubmit(); } };
    const ls = $('select[name="list"]');
    if (ls) ls.onchange = () => { $('select[name="tower"]').innerHTML = towerOpts(ls.value); };
    $("#sf").onsubmit = async e => {
      e.preventDefault();
      const f = e.target, fd = new FormData(f), msg = $("#smsg");
      let bad = false;
      f.querySelectorAll("[required]").forEach(i => { const w = i.closest(".fld"); const ok = i.value.trim() !== ""; w.classList.toggle("err", !ok); bad ||= !ok; });
      if (bad) { msg.innerHTML = `<div class="msg bad">${esc(S.required)}</div>`; return; }
      const conf = CFG.FORMS[submitTab];
      const btn = f.querySelector("button[type=submit]"); btn.disabled = true; btn.textContent = S.sending;
      if (conf.action) {
        const body = new URLSearchParams();
        for (const [k, v] of fd.entries()) if (conf.fields[k]) body.append(conf.fields[k], k === "list" ? T.listName[v] : v);
        try { await fetch(conf.action, { method: "POST", mode: "no-cors", body }); msg.innerHTML = `<div class="msg ok">${esc(S.ok)}</div>`; f.reset(); }
        catch (err) { msg.innerHTML = `<div class="msg bad">${esc(String(err))}</div>`; }
      } else {
        await new Promise(r => setTimeout(r, 500));
        msg.innerHTML = `<div class="msg warn">${esc(S.demo)}</div>`;
      }
      btn.disabled = false; btn.textContent = S.send;
    };
  }

  /* ---------------- guidelines ---------------- */
  function renderGuidelines() {
    const G = T.guidelines;
    $("#app").className = "wrap";
    $("#app").innerHTML = `<main><div class="phead"><h1>${esc(G.title)}</h1></div>
      <div class="card">${G.sections.map((s, i) => `<section class="gl"><h2><span>0${i + 1}</span>${esc(s[0])}</h2><ul>${s[1].map(x => `<li>${esc(x)}</li>`).join("")}</ul></section>`).join("")}</div></main>${sidebar()}`;
  }

  /* ---------------- boot ---------------- */
  function render() {
    if (!DB) { $("#app").innerHTML = `<div class="loading">${esc(T.loading)}</div>`; return; }
    if (D.LISTS.includes(PAGE)) renderList(PAGE);
    else if (PAGE === "tower") renderTower();
    else if (PAGE === "stats") renderStats();
    else if (PAGE === "submit") renderSubmit();
    else if (PAGE === "guidelines") renderGuidelines();
    const rb = $("#refreshBtn"); if (rb) rb.onclick = refresh;
  }
  async function refresh() {
    const y = scrollY;
    DB = await D.load();
    if (PAGE !== "submit" || !document.getElementById("sf")) render();
    else { const s = document.querySelector(".side"); if (s) { s.outerHTML = sidebar(); const rb = $("#refreshBtn"); if (rb) rb.onclick = refresh; } }
    scrollTo(0, y);
  }
  shell(); render();
  refresh().then(() => { if (CFG.SHEET_ID) setInterval(refresh, CFG.REFRESH_SECONDS * 1000); });
})();
