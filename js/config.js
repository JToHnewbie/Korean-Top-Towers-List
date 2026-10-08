/* =========================================================
   Korean Top Towers List — 사이트 설정
   관리자는 이 파일만 수정하면 됩니다. (자세한 내용: 관리자 가이드.html)
   ========================================================= */
window.KTTL_CONFIG = {
  /* Google 스프레드시트 ID
     https://docs.google.com/spreadsheets/d/1t1Sx5QbIsyfQcx8cEsQjxIzBnyJn9QoYlo8w9nylSo4/edit
     비워두면 data/ 폴더의 샘플 CSV를 사용합니다. */
  SHEET_ID: "1t1Sx5QbIsyfQcx8cEsQjxIzBnyJn9QoYlo8w9nylSo4",

  /* 시트 탭 이름 (스프레드시트 하단 탭 이름과 정확히 일치해야 함) */
  TABS: {
    main: "Main",
    misc: "Misc",
    packs: "Packs",
    unverified: "Unverified",
    pending: "Pending",
    records: "Records",
    changelog: "Changelog"
  },

  /* 시트 변경 사항 자동 반영 주기(초). 페이지를 열어둔 상태에서도 갱신됩니다. */
  REFRESH_SECONDS: 120,

  /* Main List 포인트 공식: 1위 = MAX, 순위가 내려갈수록 DECAY 비율로 감소 */
  POINTS: { MAX: 250, DECAY: 0.965 },

  DISCORD_URL: "https://discord.gg/keN2bVCZCF",

  /* 제출 폼 — Google Form을 만든 뒤 action URL과 각 질문의 entry ID를 입력하세요.
     action 이 비어있으면 데모 모드(실제 전송 없음)로 동작합니다. */
  FORMS: {
    record: {
      action: "https://docs.google.com/forms/d/e/1FAIpQLSda9XPoQuRQ99bf9TfBBd02atLiXyX7I4PIWqjUY9trIjit5w/formResponse", // 예: https://docs.google.com/forms/d/e/1t1Sx5QbIsyfQcx8cEsQjxIzBnyJn9QoYlo8w9nylSo4/formResponse
      fields: {
        player: "entry.9021063",
        list: "entry.372644296",
        tower: "entry.932672589",
        video: "entry.93628443",
        raw: "entry.1003787229",
        note: "entry.448111630"
      }
    },
    map: {
      action: "https://docs.google.com/forms/d/e/1FAIpQLSccJuKbQJWWH5Sj1aA1NcDQM9LmpKIikFCARlLV0HlBx0iClA/formResponse",
      fields: {
        name: "entry.796922281",
        game: "entry.923555865",
        creators: "entry.1842655939",
        verifier: "entry.233484933",
        difficulty: "entry.1118792823",
        video: "entry.721474325",
        place: "entry.687705323",
        note: "entry.889661039"
      }
    }
  }
};
