```javascript
module.exports = async (req, res) => {

  res.setHeader('Content-Type', 'image/png');

  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );

  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  const DAYS = ['일','월','화','수','목','금','토'];

  const SPECIAL = {
    '6/1':{ cutoff:17, ship:true,  note:false },
    '6/2':{ cutoff:0,  ship:false, note:false },
    '6/3':{ cutoff:15, ship:true,  note:false },
    '6/4':{ cutoff:17, ship:true,  note:false },
    '6/5':{ cutoff:17, ship:true,  note:true  },
    '6/6':{ cutoff:15, ship:true,  note:true  },
    '6/7':{ cutoff:15, ship:true,  note:false },
    '6/8':{ cutoff:15, ship:true,  note:false },
  };

  function getKST(){
    const now = new Date();
    const kst = new Date(now.getTime()+9*60*60*1000);

    return {
      year:kst.getUTCFullYear(),
      month:kst.getUTCMonth(),
      date:kst.getUTCDate(),
      dow:kst.getUTCDay(),
      hour:kst.getUTCHours()
    };
  }

  function addDays(ms,n){
    return ms+n*86400000;
  }

  function toKey(ms){
    const d=new Date(ms);
    return `${d.getUTCMonth()+1}/${d.getUTCDate()}`;
  }

  function getSch(ms){
    const key=toKey(ms);

    if(SPECIAL[key]) return SPECIAL[key];

    const dow=new Date(ms).getUTCDay();

    return {
      cutoff:(dow===0||dow===6)?15:17,
      ship:true,
      note:dow===6
    };
  }

  function nextShip(ms){
    for(let i=0;i<14;i++){
      if(getSch(ms).ship) return ms;
      ms=addDays(ms,1);
    }
    return ms;
  }

  const k=getKST();

  const todayMs=Date.UTC(k.year,k.month,k.date);
  const tomMs=addDays(todayMs,1);

  const todaySch=getSch(todayMs);

  const before=todaySch.ship&&k.hour<todaySch.cutoff;

  let shipMs,arrMs;

  if(before){
    shipMs=todayMs;
    arrMs=tomMs;
  }else{
    shipMs=nextShip(tomMs);
    arrMs=addDays(shipMs,1);
  }

  const arr=new Date(arrMs);

  const arrDay=DAYS[arr.getUTCDay()];
  const arrMM=arr.getUTCMonth()+1;
  const arrDD=arr.getUTCDate();

  const arrLabel=arrMs===tomMs?'내일':'모레';

  const shipDay=DAYS[new Date(shipMs).getUTCDay()];

  const nextSch=getSch(shipMs);

  const cutH=todaySch.cutoff-12;
  const nextCutH=nextSch.cutoff-12;

  const showNote=before?todaySch.note:nextSch.note;

  const BLUE='#1e1bba';
  const RED='#d63030';

  const accent=before?BLUE:RED;

  const titleText=`${arrLabel}(${arrDay}) ${arrMM}/${arrDD} 도착보장`;

  const midMain=before
    ?`오후 ${cutH}시 전 주문 시`
    :'지금 주문하면 ';

  const midAccent=before
    ?''
    :`${shipDay}요일 출고!`;

  const noteHtml=showNote
    ?`<tspan fill="#b84040" font-size="20"> (읍,면,리 제외)</tspan>`
    :'';

  const footerLeft=before
    ?`오후 ${cutH}시 마감 · 당일 출고`
    :`출고 종료 · 내일 오후 ${nextCutH}시 주문시`;

  const footerRight=before
    ?`오늘(${DAYS[k.dow]}) 출고 ➜`
    :`${shipDay}요일 출고 ➜`;

  const svg=`<?xml version="1.0" encoding="UTF-8"?>

<svg xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 900 340"
width="900"
height="340">

  <!-- 배경 -->
  <rect
    width="900"
    height="340"
    rx="22"
    fill="#ffffff"
    stroke="#eeeeee"
    stroke-width="1.5"
  />

  <!-- 감탄배송 뱃지 -->
  <rect
    x="36"
    y="32"
    width="132"
    height="42"
    rx="9"
    fill="${BLUE}"
  />

  <!-- 배 아이콘 -->
  <path
    d="M48 58 L50 50 L56 50 L58 58 Z"
    fill="#7dd3fc"
    stroke="#ffffff"
    stroke-width="0.8"
  />

  <path
    d="M45 58 Q52 64 59 58 Z"
    fill="#38bdf8"
  />

  <line
    x1="52"
    y1="50"
    x2="52"
    y2="46"
    stroke="#ffffff"
    stroke-width="1.5"
    stroke-linecap="round"
  />

  <path
    d="M52 46 L57 50"
    stroke="#ffffff"
    stroke-width="1"
    stroke-linecap="round"
    fill="none"
  />

  <path
    d="M43 60 Q52 66 61 60"
    stroke="#93c5fd"
    stroke-width="1.5"
    fill="none"
    stroke-linecap="round"
  />

  <!-- 감탄배송 텍스트 -->
  <text
    x="102"
    y="58"
    fill="#ffffff"
    font-size="18"
    font-weight="800"
    font-family="sans-serif"
    text-anchor="middle"
  >
    감탄배송
  </text>

  <!-- 상단 타이틀 -->
  <text
    x="190"
    y="61"
    fill="#111111"
    font-size="27"
    font-weight="800"
    font-family="sans-serif"
  >
    ${titleText}
  </text>

  <!-- 구분선 -->
  <line
    x1="36"
    y1="100"
    x2="864"
    y2="100"
    stroke="#efefef"
    stroke-width="1.5"
  />

  <!-- 시계 아이콘 -->
  <circle
    cx="48"
    cy="158"
    r="15"
    fill="#dbeafe"
    stroke="#3b82f6"
    stroke-width="2"
  />

  <circle
    cx="48"
    cy="158"
    r="12"
    fill="#eff6ff"
  />

  <circle
    cx="48"
    cy="158"
    r="2"
    fill="#1d4ed8"
  />

  <line
    x1="48"
    y1="158"
    x2="48"
    y2="148"
    stroke="#1d4ed8"
    stroke-width="2"
    stroke-linecap="round"
  />

  <line
    x1="48"
    y1="158"
    x2="55"
    y2="161"
    stroke="#3b82f6"
    stroke-width="1.5"
    stroke-linecap="round"
  />

  <!-- 중단 텍스트 -->
  <text
    x="78"
    y="166"
    font-size="20"
    font-weight="800"
    font-family="sans-serif"
  >
    <tspan fill="#111111">${midMain}</tspan>
    <tspan fill="${RED}">${midAccent}</tspan>
    ${noteHtml}
  </text>

  <!-- 무료배송 -->
  <text
    x="36"
    y="232"
    fill="${BLUE}"
    font-size="24"
    font-weight="900"
    font-family="sans-serif"
  >
    무료배송
  </text>

  <!-- 하단 바 -->
  <rect
    x="36"
    y="258"
    width="828"
    height="54"
    rx="14"
    fill="#f4f4fa"
  />

  <!-- 감탄홍게 뱃지 -->
  <rect
    x="48"
    y="271"
    width="74"
    height="26"
    rx="13"
    fill="#3b38d3"
  />

  <!-- 감탄홍게 텍스트 -->
  <text
    x="85"
    y="288"
    fill="#ffffff"
    font-size="13"
    font-weight="800"
    font-family="sans-serif"
    text-anchor="middle"
  >
    감탄홍게
  </text>

  <!-- 하단 왼쪽 문구 -->
  <text
    x="138"
    y="288"
    fill="#444444"
    font-size="14"
    font-family="sans-serif"
  >
    ${footerLeft}
  </text>

  <!-- dot -->
  <circle
    cx="688"
    cy="285"
    r="8"
    fill="${accent}"
  />

  <!-- 하단 오른쪽 -->
  <text
    x="706"
    y="289"
    fill="${accent}"
    font-size="15"
    font-weight="800"
    font-family="sans-serif"
  >
    ${footerRight}
  </text>

</svg>`;

  res.setHeader('Content-Type','image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control','no-store, max-age=0');

  res.end(svg);

};
```
