/* 샘플 데이터 — 스프레드시트가 연결되지 않았을 때만 사용됩니다.
   모든 이름은 가상의 예시입니다. 실제 데이터는 Google 스프레드시트에 입력하세요.
   각 블록은 시트 탭 하나와 똑같은 CSV 형식입니다. (행 순서 = 순위) */
window.KTTL_SAMPLE = {
main: `id,name,game,difficulty,creators,verifier,video,place_id,note
tower-of-frozen-abyss,Tower of Frozen Abyss,JToH,Terrifying,"Haneul, Rimefox",Seojun,,,
citadel-of-endless-dread,Citadel of Endless Dread,JToH,Terrifying,Kestrel,Minho_99,,,
tower-of-crimson-spire,Tower of Crimson Spire,Ascent,Catastrophic,"Dalbit, Ono",Seojun,,,
steeple-of-hollow-skies,Steeple of Hollow Skies,JToH,Catastrophic,Yeonwoo,Rimefox,,,
tower-of-shattered-glass,Tower of Shattered Glass,Mystic Towers,Catastrophic,Glacien,Jiho.k,,,
tower-of-violent-currents,Tower of Violent Currents,JToH,Catastrophic,"Bora, Kestrel",Minho_99,,,
citadel-of-the-last-light,Citadel of the Last Light,EToH Archive,Catastrophic,Haneul,Haneul,,,
tower-of-restless-echoes,Tower of Restless Echoes,JToH,Catastrophic,Ono,Seojun,,,
tower-of-iron-will,Tower of Iron Will,Ascent,Terrifying,Dalbit,Jiho.k,,,
steeple-of-falling-stars,Steeple of Falling Stars,JToH,Terrifying,Yeonwoo,Daeun,,,
tower-of-midnight-static,Tower of Midnight Static,Mystic Towers,Terrifying,"Glacien, Bora",Rimefox,,,
tower-of-sunken-ruins,Tower of Sunken Ruins,JToH,Terrifying,Kestrel,Minho_99,,,
tower-of-pale-thunder,Tower of Pale Thunder,JToH,Terrifying,Haneul,Daeun,,,
citadel-of-broken-clocks,Citadel of Broken Clocks,EToH Archive,Terrifying,Ono,Jiho.k,,,
tower-of-quiet-ruin,Tower of Quiet Ruin,Ascent,Extreme,Dalbit,Sora_x,,,
tower-of-glass-labyrinth,Tower of Glass Labyrinth,JToH,Extreme,Yeonwoo,Seojun,,,
steeple-of-hidden-lanterns,Steeple of Hidden Lanterns,JToH,Extreme,Bora,Daeun,,,
tower-of-winding-thorns,Tower of Winding Thorns,Mystic Towers,Extreme,Glacien,Sora_x,,,
tower-of-scarlet-rain,Tower of Scarlet Rain,JToH,Extreme,Kestrel,Jiho.k,,,
tower-of-hollow-bells,Tower of Hollow Bells,JToH,Extreme,Rimefox,Minho_99,,`,

misc: `id,name,game,difficulty,creators,verifier,video,place_id,note
tower-of-one-jump,Tower of One Jump,Misc Obby,Catastrophic,Haneul,Seojun,,,단일 점프 기믹
endless-staircase,Endless Staircase,JToH,Terrifying,Bora,Minho_99,,,초장거리 타워
tower-of-reversed-gravity,Tower of Reversed Gravity,Mystic Towers,Terrifying,Glacien,Rimefox,,,중력 반전 기믹
tower-of-blind-faith,Tower of Blind Faith,JToH,Extreme,Ono,Daeun,,,화면 암전 구간
the-wobbly-pillar,The Wobbly Pillar,Misc Obby,Extreme,Kestrel,Jiho.k,,,물리 기반
tower-of-tiny-ledges,Tower of Tiny Ledges,Ascent,Remorseless,Dalbit,Sora_x,,,`,

packs: `id,name,game,difficulty,towers,creators,verifier,video,place_id,note
frozen-abyss-pack,Frozen Abyss Pack,JToH,Catastrophic,"tower-of-frozen-abyss;tower-of-pale-thunder;tower-of-hollow-bells","Haneul, Rimefox",Seojun,,,
ascent-trilogy,Ascent Trilogy,Ascent,Catastrophic,"tower-of-crimson-spire;tower-of-iron-will;tower-of-quiet-ruin",Dalbit,Jiho.k,,,
mystic-gauntlet,Mystic Gauntlet,Mystic Towers,Terrifying,"tower-of-shattered-glass;tower-of-midnight-static;tower-of-winding-thorns",Glacien,Rimefox,,,
archive-collection,Archive Collection,EToH Archive,Terrifying,"citadel-of-the-last-light;citadel-of-broken-clocks",Ono,Haneul,,,`,

unverified: `id,name,game,difficulty,creators,verifier,video,place_id,note
tower-of-absolute-zero,Tower of Absolute Zero,JToH,Horrific,Rimefox,,,,최고 기록 87%
citadel-of-the-void,Citadel of the Void,Mystic Towers,Horrific,"Glacien, Haneul",,,,최고 기록 61%
tower-of-unending-night,Tower of Unending Night,JToH,Catastrophic,Kestrel,,,,
steeple-of-ashen-crowns,Steeple of Ashen Crowns,Ascent,Catastrophic,Dalbit,,,,
tower-of-silent-storms,Tower of Silent Storms,JToH,Terrifying,Bora,,,,`,

pending: `id,name,game,difficulty,creators,verifier,video,place_id,note
tower-of-lost-signals,Tower of Lost Signals,JToH,Terrifying,Yeonwoo,Daeun,,,2026-10-01 제출
tower-of-coral-depths,Tower of Coral Depths,Mystic Towers,Extreme,Glacien,Sora_x,,,2026-10-03 제출
citadel-of-amber-gates,Citadel of Amber Gates,EToH Archive,Terrifying,Ono,Jiho.k,,,2026-10-05 제출`,

records: `list,tower_id,player,video,date,note
main,tower-of-frozen-abyss,Minho_99,,2026-09-02,
main,tower-of-frozen-abyss,Rimefox,,2026-09-20,
main,citadel-of-endless-dread,Seojun,,2026-07-11,
main,tower-of-crimson-spire,Minho_99,,2026-06-30,
main,tower-of-crimson-spire,Jiho.k,,2026-08-14,
main,steeple-of-hollow-skies,Seojun,,2026-05-22,
main,steeple-of-hollow-skies,Daeun,,2026-09-01,
main,tower-of-shattered-glass,Rimefox,,2026-04-18,
main,tower-of-violent-currents,Seojun,,2026-04-02,
main,tower-of-violent-currents,Sora_x,,2026-08-27,
main,citadel-of-the-last-light,Minho_99,,2026-03-15,
main,tower-of-restless-echoes,Daeun,,2026-03-01,
main,tower-of-restless-echoes,Jiho.k,,2026-06-09,
main,tower-of-iron-will,Seojun,,2026-02-12,
main,tower-of-iron-will,Rimefox,,2026-05-05,
main,steeple-of-falling-stars,Minho_99,,2026-02-02,
main,tower-of-midnight-static,Sora_x,,2026-07-21,
main,tower-of-sunken-ruins,Daeun,,2026-01-19,
main,tower-of-sunken-ruins,Haneul,,2026-04-25,
main,tower-of-pale-thunder,Jiho.k,,2026-01-08,
main,tower-of-pale-thunder,Bora,,2026-06-17,
main,citadel-of-broken-clocks,Seojun,,2025-12-24,
main,tower-of-quiet-ruin,Haneul,,2025-12-10,
main,tower-of-quiet-ruin,Kestrel,,2026-03-03,
main,tower-of-glass-labyrinth,Bora,,2025-11-30,
main,steeple-of-hidden-lanterns,Sora_x,,2025-11-12,
main,tower-of-winding-thorns,Kestrel,,2025-10-28,
main,tower-of-scarlet-rain,Haneul,,2025-10-15,
main,tower-of-hollow-bells,Bora,,2025-10-02,
main,tower-of-hollow-bells,Ono,,2026-02-20,
misc,tower-of-one-jump,Minho_99,,2026-08-01,
misc,endless-staircase,Daeun,,2026-05-11,
packs,frozen-abyss-pack,Minho_99,,2026-09-25,`,

changelog: `date,list,tower_id,change,from,to,note
2026-09-28,main,tower-of-frozen-abyss,placed,,1,신규 배치 — 기존 1위 이하 한 칸씩 밀려남
2026-09-28,main,citadel-of-endless-dread,pushed,1,2,
2026-08-10,main,citadel-of-endless-dread,raised,3,1,재평가
2026-07-15,main,citadel-of-endless-dread,placed,,3,
2026-08-10,main,tower-of-crimson-spire,lowered,1,2,재평가
2026-09-28,main,tower-of-crimson-spire,pushed,2,3,
2026-06-01,main,tower-of-shattered-glass,placed,,4,
2026-09-28,main,tower-of-shattered-glass,pushed,4,5,
2026-05-02,main,tower-of-iron-will,lowered,6,9,
2026-04-20,unverified,tower-of-absolute-zero,placed,,1,`
};
