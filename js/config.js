/* =========================================================
   Korean Top Towers List — 사이트 설정
   관리자는 이 파일만 수정하면 됩니다. (자세한 내용: 관리자 가이드.html)
   ========================================================= */
window.KTTL_CONFIG = {
  /* Google 스프레드시트 ID
     https://docs.google.com/spreadsheets/d/1t1Sx5QbIsyfQcx8cEsQjxIzBnyJn9QoYlo8w9nylSo4/edit
     비워두면 data/ 폴더의 샘플 CSV를 사용합니다. */
  SHEET_ID: "",

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
      action: "", // 예: https://docs.google.com/forms/d/e/1t1Sx5QbIsyfQcx8cEsQjxIzBnyJn9QoYlo8w9nylSo4/formResponse
      fields: {
        player: "entry.1000001",
        list: "entry.1000002",
        tower: "entry.1000003",
        video: "entry.1000004",
        raw: "entry.1000005",
        note: "entry.1000006"
      }
    },
    map: {
      action: "",
      fields: {
        name: "entry.2000001",
        game: "entry.2000002",
        creators: "entry.2000003",
        verifier: "entry.2000004",
        difficulty: "entry.2000005",
        video: "entry.2000006",
        place: "entry.2000007",
        note: "entry.2000008"
      }
    }
  }
};
