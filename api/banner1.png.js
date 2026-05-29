module.exports = async (req, res) => {

  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );

  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  const DAYS = ['일','월','화','수','목','금','토'];

  const SPECIAL = {
    '6/1': { cutoff:17, ship:true,  note:false },
    '6/2': { cutoff:0,  ship:false, note:false },
    '6/3': { cutoff:15, ship:true,  note:false },
    '6/4': { cutoff:17, ship:true,  note:false },
    '6/5': { cutoff:17, ship:true,  note:true  },
    '6/6': { cutoff:15, ship:true,  note:true  },
    '6/7': { cutoff:15, ship:true,  note:false },
    '6/8': { cutoff:15, ship:true,  note:false },
  };

  function getKST() {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    return {
      year: kst.getUTCFullYear(),
      month: kst.getUTCMonth(),
      date: kst.getUTCDate(),
      dow: kst.getUTCDay(),
      hour: kst.getUTCHours()
    };
  }

  function addDays(ms, n) {
    return ms + n * 86400000;
  }

  function toKey(ms) {
    const d = new Date(ms);
    return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
  }

  function getSch(ms) {
    const key = toKey(ms);

    if (SPECIAL[key]) return SPECIAL[key];

    const dow = new Date(ms).getUTCDay();

    return {
      cutoff: (dow === 0 || dow === 6) ? 15 : 17,
      ship: true,
      note: dow === 6
    };
  }

  function nextShip(ms) {
    for (let i = 0; i < 14; i++) {
      if (getSch(ms).ship) return ms;
      ms = addDays(ms, 1);
    }

    return ms;
  }

  const k = getKST();

  const todayMs = Date.UTC(k.year, k.month, k.date);
  const tomMs = addDays(todayMs, 1);

  const todaySch = getSch(todayMs);

  const before = todaySch.ship && k.hour < todaySch.cutoff;

  let shipMs, arrMs;

  if (before) {
    shipMs = todayMs;
    arrMs = tomMs;
  } else {
    shipMs = nextShip(tomMs);
    arrMs = addDays(shipMs, 1);
  }

  const arr = new Date(arrMs);

  const arrDay = DAYS[arr.getUTCDay()];
  const arrMM = arr.getUTCMonth() + 1;
  const arrDD = arr.getUTCDate();

  const arrLabel = arrMs === tomMs ? '내일' : '모레';

  const shipDay = DAYS[new Date(shipMs).getUTCDay()];

  const nextSch = getSch(shipMs);

  const cutH = todaySch.cutoff - 12;
  const nextCutH = nextSch.cutoff - 12;

  const showNote = before ? todaySch.note : nextSch.note;

  const BLUE = '#1e1bba';
  const RED  = '#d63030';

  const accent = before ? BLUE : RED;

  const titleText =
    `${arrLabel}(${arrDay}) ${arrMM}/${arrDD} 도착보장`;

  const midMain = before
    ? `오후 ${cutH}시 전 주문 시`
    : `지금 주문하면 `;

  const midAccent = before
    ? ''
    : `${shipDay}요일 출고!`;

  const noteHtml = showNote
    ? `<tspan fill="#b84040" font-size="18" font-weight="700">(읍,면,리 제외)</tspan>`
    : '';

  const footerLeft = before
    ? `오후 ${cutH}시 마감 · 당일 출고`
    : `출고 종료 · 내일 오후 ${nextCutH}시 주문시`;

  const footerRight = before
    ? `오늘(${DAYS[k.dow]}) 출고 ➔`
    : `${shipDay}요일 출고 ➔`;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 800 320"
  width="800"
  height="320"
>

  <!-- 배경 -->
  <rect
    width="800"
    height="320"
    rx="20"
    fill="#ffffff"
    stroke="#eeeeee"
    stroke-width="1.5"
  />

  <!-- 감탄배송 뱃지 -->
  <rect
    x="24"
    y="28"
    width="150"
    height="44"
    rx="10"
    fill="${BLUE}"
  />

  <!-- 아이콘 -->
  <path
    d="M36 54 L38 46 L44 46 L46 54 Z"
    fill="#7dd3fc"
    stroke="#fff"
    stroke-width="0.8"
  />

  <path
    d="M33 54 Q40 60 47 54 Z"
    fill="#38bdf8"
  />

  <line
    x1="40"
    y1="46"
    x2="40"
    y2="42"
    stroke="#fff"
    stroke-width="1.5"
    stroke-linecap="round"
  />

  <path
    d="M40 42 L45 46"
    stroke="#fff"
    stroke-width="1"
    fill="none"
  />

  <path
    d="M31 56 Q40 62 49 56"
    stroke="#93c5fd"
    stroke-width="1.5"
    fill="none"
  />

  <text
    x="130"
    y="56"
    fill="#ffffff"
    font-size="20"
    font-weight="bold"
    font-family="Pretendard,sans-serif"
    text-anchor="middle"
  >
    감탄배송
  </text>

  <!-- 상단 타이틀 -->
  <text
    x="190"
    y="58"
    fill="#111111"
    font-size="32"
    font-weight="800"
    font-family="Pretendard,sans-serif"
  >
    ${titleText}
  </text>

  <!-- 구분선 -->
  <line
    x1="24"
    y1="92"
    x2="776"
    y2="92"
    stroke="#f0f0f0"
    stroke-width="1.5"
  />

  <!-- 시계 -->
  <circle
    cx="36"
    cy="148"
    r="15"
    fill="#dbeafe"
    stroke="#3b82f6"
    stroke-width="2"
  />

  <circle
    cx="36"
    cy="148"
    r="12"
    fill="#eff6ff"
  />

  <circle
    cx="36"
    cy="148"
    r="2"
    fill="#1d4ed8"
  />

  <line
    x1="36"
    y1="148"
    x2="36"
    y2="138"
    stroke="#1d4ed8"
    stroke-width="2"
    stroke-linecap="round"
  />

  <line
    x1="36"
    y1="148"
    x2="43"
    y2="151"
    stroke="#3b82f6"
    stroke-width="1.5"
    stroke-linecap="round"
  />

  <!-- 중간 텍스트 -->
  <text
    x="60"
    y="156"
    font-size="24"
    font-weight="700"
    font-family="Pretendard,sans-serif"
  >
    <tspan fill="#111111">${midMain}</tspan>
    <tspan fill="${RED}" font-weight="900">${midAccent}</tspan>
    ${noteHtml}
  </text>

  <!-- 무료배송 -->
  <text
    x="24"
    y="215"
    fill="${BLUE}"
    font-size="32"
    font-weight="900"
    font-family="Pretendard,sans-serif"
  >
    무료배송
  </text>

  <!-- 하단 바 -->
  <rect
    x="24"
    y="238"
    width="752"
    height="58"
    rx="18"
    fill="#f5f5fb"
  />

  <!-- 감탄홍게 뱃지 -->
  <rect
    x="36"
    y="251"
    width="92"
    height="32"
    rx="16"
    fill="#3b38d3"
  />

  <text
    x="82"
    y="272"
    fill="#ffffff"
    font-size="16"
    font-weight="bold"
    font-family="Pretendard,sans-serif"
    text-anchor="middle"
  >
    감탄홍게
  </text>

  <!-- 하단 좌측 문구 -->
  <text
    x="145"
    y="271"
    fill="#555555"
    font-size="16"
    font-family="Pretendard,sans-serif"
  >
    ${footerLeft}
  </text>

  <!-- 우측 점 -->
  <circle
    cx="650"
    cy="267"
    r="8"
    fill="${accent}"
  />

  <!-- 우측 출고 문구 -->
  <text
    x="668"
    y="272"
    fill="${accent}"
    font-size="17"
    font-weight="bold"
    font-family="Pretendard,sans-serif"
  >
    ${footerRight}
  </text>

</svg>
`;

  res.setHeader(
    'Content-Type',
    'image/svg+xml; charset=utf-8'
  );

  res.end(svg);

};
