# Handoff: Korean Top Towers List (KTTL)

## Overview
A ranking website for the hardest towers (maps) from Roblox **Eternal Towers of Hell (JToH/EToH)** and its fan/derivative games, modeled on the format of Pointercrate. The site has 5 separate ranking lists, a detail sub-page per tower, a player ranking (Stats Viewer), record/tower submission, a rules page, global search, KO/EN language toggle, and **Google Sheets as the CMS**: editing the sheet updates the site automatically.

## About the Design Files
The files in this bundle are **design references created in HTML** — working prototypes showing intended look and behavior, not production code to ship as-is. The task is to **recreate these designs in the target codebase's environment** (e.g. Next.js/React, SvelteKit, Astro) using its established patterns. If no environment exists, a static-site or SSR framework (Next.js / Astro) with ISR or client-side fetch of the Google Sheet is recommended. That said, the prototype is fully functional vanilla JS and can serve as a precise behavioral spec (`js/data.js`, `js/app.js`).

## Fidelity
**High-fidelity.** Final colors, typography, spacing, and interactions. Recreate pixel-accurately.

---

## Screens / Views

All pages share one shell: sticky header (brand, search, language toggle, nav tabs) → content → footer. Content uses `.wrap`: max-width 1240px, padding 28px 24px 64px, CSS grid `minmax(0,1fr) 320px`, gap 28px. Below 960px it collapses to one column and the sidebar becomes non-sticky.

### Header (all pages)
- White bg, 1px bottom border `--line`, `position: sticky; top:0; z-index:50`.
- Top row: height 64px, inner max-width 1240px, padding 0 24px, flex gap 20px.
  - Brand: 32×32 blue square (radius 8px) holding "KT" (JetBrains Mono 700 13px, white). Then "**Korean** Top Towers List", 16px/700, with "Korean" in `--blue`.
  - Search: flex 1, max-width 420px, pushed right with `margin-left:auto`. Input is 38px tall, radius 8px, bg `--bg`, border `--line`. On focus: border `--blue`, bg white. Magnifier glyph built from CSS pseudo-elements.
  - Search dropdown: absolute, top 44px, white, radius 10px, shadow `0 12px 32px -8px oklch(0.3 0.05 258/.18)`, max-height 420px. Results come in groups "Towers" (max 8, matched on name or creator, across all lists) and "Players" (max 5). Each row shows a position (#N, or `P{rank}` for players) in mono blue, the name, and right-aligned meta (list name or points). ↑/↓ moves the selection, Enter opens it, Esc closes, clicking outside closes.
  - Language toggle: segmented KO | EN, 34px tall. The active side gets bg `--blue` and white text. Saved in `localStorage["kttl-lang"]`.
- Nav row: horizontal scroll with no scrollbar. Links are 14px/500 `--ink-2`, padding 10px 10px 12px. Active link: `--blue`, 600, 2px blue bottom border. Order: Main List · Misc List · Tower Packs · Unverified · Pending | (1px separator) | Stats Viewer · Submit · Guidelines · Discord ↗ (external).

### 1–5. List pages (`index.html` = Main, `misc.html`, `packs.html`, `unverified.html`, `pending.html`)
- **Page head:** eyebrow "N개 타워" (mono 12px, blue, uppercase), H1 30px/700 with letter-spacing −0.02em, and a description paragraph (`--ink-2`, max 64ch).
- **Toolbar:** filter input (38px) plus a mono count ("12 / 20" while filtering). The filter text is kept in sessionStorage per list.
- **Entry card** (an `<a>` to the detail page): white, 1px border, radius 10px. Grid `196px | 1fr | auto`, gap 18px, padding 10px 20px 10px 10px.
  - Thumbnail: 16:9, radius 6px, the YouTube `mqdefault.jpg`. With no video, a striped placeholder (`repeating-linear-gradient(135deg, --blue-ll 0 8px, --blue-l 8px 16px)`) with "영상 없음" in mono.
  - Title line: position `#N` (mono 700 20px blue; 22px for the top 3) followed by the name (18px/700, ellipsis).
  - Credit line: "제작 **creators** · 검증 **verifier**", 13.5px `--ink-2`.
  - Tags: difficulty chip (24px tall, radius 6px, colored 8px dot), game chip, and a "미검증" warn chip on the Unverified list.
  - Right column: **Main** shows points (mono 700 15px), the label "POINTS", and "기록 N개". **Packs** shows the tower count. **Pending** shows "배치 대기". The other lists show the record count.
  - Hover: border `oklch(0.8 0.06 258)` plus shadow `0 6px 20px -10px oklch(0.4 0.1 258/.35)`.
  - Pending items have no rank number (shown as "—").
  - Below 640px the grid becomes `112px | 1fr`, the right column is hidden, and the name drops to 15px.
- **Sidebar** (sticky, top 132px, gap 16px):
  - "순위 변동 이력" card with the last 5 changelog entries for this list.
  - Submit CTA card.
  - Discord card.
  - Sync status card: LED is green for synced from sheet, red for error, grey for sample data. Shows "마지막 동기화 HH:MM:SS · auto 120s", plus a "새로고침" button and an "관리자 가이드" link (both `flex:1`, nowrap).

### 6. Tower detail (`tower.html?list=<key>&id=<id>`)
- Breadcrumb: list name / tower name.
- Head: large position number (mono 700 56px blue) followed by H1 32px and the credit line.
- Video: 16:9 YouTube embed, radius 10px. Placeholder when there is no video.
- Facts card: 3-column grid (2 columns under 640px) with inner 1px dividers. Each cell has a label (11.5px uppercase `--ink-3`) and a value (600).
  - Main: Position, Difficulty, Game, Creators, Verifier, Points, Place ID (linked to `roblox.com/games/{id}`), Records, Video.
  - Other lists swap Points for Place ID / Tower count.
- Note box: bg `--blue-ll`, radius 8px.
- Packs only: "포함된 타워" list linking to each contained tower.
- Records table: #, Player (links to stats), Date, Video. Sorted by date ascending. Hidden on the Pending list.
- Position history table: date, change badge (placed = blue; raised/verified = green; lowered/pushed/removed = red), note.
- Pager: previous and next positions as two cards.

### 7. Stats Viewer (`stats.html?player=<name>`)
- Two-column grid (1fr | 1.1fr). Left: filter input plus a table (Rank, Player, Points); clicking a row selects it (bg `--blue-l`) and updates `?player=`. Right (sticky): player panel.
  - Player panel: name, a 3-up number row (Points / Clears / Verifs), hardest tower, "Verified" tag cloud, "Completed" tag cloud.
  - Tags: inline-block, nowrap, ellipsis. The hardest tower's tag is highlighted.

### 8. Submit (`submit.html?type=record|map`)
- Segmented tabs: 기록 제출 / 타워 제출.
- **Record form:** Player*, List* (select; changing it repopulates the Tower* select), Video URL*, Raw URL, Note.
- **Tower form:** Name*, Game* (datalist), Creators*, Verifier, Difficulty* (select), Place*, Video, Note.
- Validation: empty required fields get a red border plus a message. If a Google Form `action` is set in config, the form POSTs `URLSearchParams` to `formResponse` with `mode:no-cors` and shows a success message. Otherwise it shows the yellow "demo mode" message.

### 9. Guidelines (`guidelines.html`)
- One card containing numbered sections (01, 02, …), each with a bullet list. All copy lives in `js/i18n.js`.

### 10. Admin guide (`관리자 가이드.html`)
- Documentation for staff: sheet setup, a row-insertion diagram, column reference, Google Form wiring, troubleshooting. Download buttons generate CSV templates from the sample data.

---

## Data Model — Google Sheets (CMS)

One spreadsheet with 7 tabs (names configurable in `config.TABS`). It is shared as "anyone with link: viewer" and fetched as CSV:
`https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={TAB}`

**The order of rows is the ranking.** The first data row is #1. Inserting a row pushes every tower below it down one spot, and points are recomputed.

| Tab | Columns |
|---|---|
| Main / Misc / Unverified / Pending | `id, name, game, difficulty, creators, verifier, video, place_id, note` |
| Packs | the same columns plus `towers` (tower ids separated by `;`) |
| Records | `list, tower_id, player, video, date, note` |
| Changelog | `date, list, tower_id, change(placed/raised/lowered/pushed/moved/removed/verified), from, to, note` |

Column notes:
- `id` is a stable slug, auto-generated from `name` if empty. It keeps detail URLs valid when positions change.
- `creators` is comma separated.

**Points (Main only):** `MAX × DECAY^(pos−1)` with MAX=250 and DECAY=0.965, rounded to 2 decimals.

**Player score:** sum of the points of each Main tower the player verified or completed. A player is counted at most once per tower, and a verifier's own record isn't double-counted.

**Refresh:** fetch on load and every `REFRESH_SECONDS` (120). The last successful raw CSV is cached in localStorage (`kttl-cache`) as a fallback. If no sheet is configured, `data/sample.js` is used (fictional data).

For production, consider server-side fetching with ISR or revalidation of about 60s for SEO, and per-tower static paths.

## State
- `lang` (ko/en, localStorage)
- `DB` (parsed lists, records, changelog, players, `source`, `syncedAt`)
- per-list filter string (sessionStorage)
- selected player (URL param)
- submit tab (URL param)
- form status

## Design Tokens
Colors (oklch; approximate hex in parentheses):
- `--blue` oklch(0.55 0.19 258) (≈ #2F63E0) · `--blue-d` oklch(0.45 0.18 258) (≈ #1F4CB8)
- `--blue-l` oklch(0.95 0.03 258) (≈ #E8EEFC) · `--blue-ll` oklch(0.975 0.015 258) (≈ #F3F6FD)
- `--bg` oklch(0.975 0.004 258) (≈ #F6F7F9) · `--card` #FFFFFF
- `--ink` oklch(0.22 0.02 258) (≈ #1B2130) · `--ink-2` oklch(0.45 0.02 258) (≈ #5A6170) · `--ink-3` oklch(0.62 0.015 258) (≈ #8A909B)
- `--line` oklch(0.91 0.008 258) (≈ #E1E4E9) · `--line-2` oklch(0.95 0.006 258) (≈ #EEF0F3)
- ok oklch(0.6 0.14 150) · bad oklch(0.58 0.18 25)

Difficulty dot colors (JToH convention):
- Insane oklch(0.5 0.24 265)
- Extreme oklch(0.75 0.15 215)
- Terrifying oklch(0.85 0.12 200)
- Catastrophic white
- Horrific oklch(0.6 0.2 300)
- Remorseless oklch(0.65 0.25 330)
- See `DIFF` in `app.js` for the full map.

Typography:
- **IBM Plex Sans KR** (400/500/600/700) for UI.
- **JetBrains Mono** (500/700) for positions, numbers, and eyebrows.
- Base size 15px, line-height 1.55.
- Scale: 11.5 / 12 / 13 / 13.5 / 14 / 15 / 18 / 20 / 22 / 30 / 32 / 56 px.

Radius: card 10px · button/input 8px · chip/thumbnail 6px · badge 5px.

Shadows:
- Entry hover: `0 6px 20px -10px oklch(0.4 0.1 258/.35)`
- Popover: `0 12px 32px -8px oklch(0.3 0.05 258/.18)`
- Input focus ring: `0 0 0 3px --blue-l`

Spacing:
- Page padding 24px; card padding 18–24px.
- Gaps: list 10px, sidebar 16px, layout 28px.

Transitions: 0.15s on color, border-color, box-shadow, background.

## Assets
- No bundled images.
- Thumbnails come from YouTube (`i.ytimg.com/vi/{id}/mqdefault.jpg`) and embeds from `youtube.com/embed/{id}`.
- Fonts come from Google Fonts.
- The brand mark is a CSS placeholder ("KT"); replace it with the real logo when available.

## Files
- `index.html`, `misc.html`, `packs.html`, `unverified.html`, `pending.html`, `tower.html`, `stats.html`, `submit.html`, `guidelines.html`: page shells (`data-page` attribute selects the renderer)
- `관리자 가이드.html`: admin / sheet setup guide
- `css/style.css`: all styles and tokens
- `js/config.js`: sheet ID, tab names, refresh interval, points formula, Discord URL, Google Form endpoints
- `js/i18n.js`: all KO/EN copy
- `js/data.js`: CSV parser, sheet fetch, data model, points, player aggregation
- `js/app.js`: shell, search, and all page renderers
- `data/sample.js`: sample CSV per tab (fictional)
