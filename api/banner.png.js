module.exports = async (req, res) => {
  const DAYS = ['\uc77c','\uc6d4','\ud654','\uc218','\ubaa9','\uae08','\ud1a0'];
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
  function getKST(){const now=new Date();const kst=new Date(now.getTime()+9*60*60*1000);return{year:kst.getUTCFullYear(),month:kst.getUTCMonth(),date:kst.getUTCDate(),dow:kst.getUTCDay(),hour:kst.getUTCHours()};}
  function addDays(ms,n){return ms+n*86400000;}
  function toKey(ms){const d=new Date(ms);return `${d.getUTCMonth()+1}/${d.getUTCDate()}`;}
  function getSch(ms){const key=toKey(ms);if(SPECIAL[key])return SPECIAL[key];const dow=new Date(ms).getUTCDay();return{cutoff:(dow===0||dow===6)?15:17,ship:true,note:dow===6};}
  function nextShip(ms){for(let i=0;i<14;i++){if(getSch(ms).ship)return ms;ms=addDays(ms,1);}return ms;}

  const k=getKST();
  const todayMs=Date.UTC(k.year,k.month,k.date);
  const tomMs=addDays(todayMs,1);
  const todaySch=getSch(todayMs);
  const before=todaySch.ship&&k.hour<todaySch.cutoff;
  let shipMs,arrMs;
  if(before){shipMs=todayMs;arrMs=tomMs;}
  else{shipMs=nextShip(tomMs);arrMs=addDays(shipMs,1);}
  const arr=new Date(arrMs);
  const arrDay=DAYS[arr.getUTCDay()];
  const arrMM=arr.getUTCMonth()+1;
  const arrDD=arr.getUTCDate();
  const arrLabel=arrMs===tomMs?'\ub0b4\uc77c':'\ubaa8\ub808';
  const shipDay=DAYS[new Date(shipMs).getUTCDay()];
  const nextSch=getSch(shipMs);
  const cutH=todaySch.cutoff-12;
  const nextCutH=nextSch.cutoff-12;
  const showNote=before?todaySch.note:nextSch.note;
  const BLUE='#1e1bba',RED='#d63030';
  const accent=before?BLUE:RED;

  const titleText=`${arrLabel}(${arrDay}) ${arrMM}/${arrDD} \ub3c4\ucc29\ubcf4\uc7a5`;
  const midMain=before?`\uc624\ud6c4 ${cutH}\uc2dc \uc804 \uc8fc\ubb38 \uc2dc`:'\uc9c0\uae08 \uc8fc\ubb38\ud558\uba74 ';
  const midAccent=before?'':`${shipDay}\uc694\uc77c \ucd9c\uace0!`;
  const noteHtml=showNote?`<tspan fill="#b84040" font-size="20"> (\uc74d,\uba74,\ub9ac \uc81c\uc678)</tspan>`:'';

  /* 하단 2줄:
     1줄: 감탄홍게 뱃지 + 메시지
     2줄: 출고 레이블
  */
  const footerLeft=before
    ?`\uc624\ud6c4 ${cutH}\uc2dc \ub9c8\uac10 \u00B7 \ub2f9\uc77c \ucd9c\uace0`
    :`\ucd9c\uace0 \uc885\ub8cc \u00B7 \ub0b4\uc77c \uc624\ud6c4 ${nextCutH}\uc2dc \uc8fc\ubb38\uc2dc`;
  const footerRight=before
    ?`\uc624\ub298(${DAYS[k.dow]}) \ucd9c\uace0 \u27A1`
    :`${shipDay}\uc694\uc77c \ucd9c\uace0 \u27A1`;=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="800" height="320">
  <rect width="800" height="320" rx="20" fill="#fff" stroke="#eee" stroke-width="1.5"/>

  <!-- 감탄배송 뱃지 -->
  <rect x="24" y="28" width="136" height="44" rx="10" fill="${BLUE}"/>
  <!-- 물결 아이콘 (SVG path) -->
  <path d="M36 50 Q40 44 44 50 Q48 56 52 50" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <text x="120" y="56" fill="#fff" font-size="20" font-weight="bold" font-family="sans-serif" text-anchor="middle">\uac10\ud0c4\ubc30\uc1a1</text>

  <!-- 상단 타이틀 -->
  <text x="176" y="58" fill="#111" font-size="32" font-weight="bold" font-family="sans-serif">${titleText}</text>

  <!-- 구분선 -->
  <line x1="24" y1="92" x2="776" y2="92" stroke="#f0f0f0" stroke-width="1.5"/>

  <!-- 시계 아이콘 -->
  <circle cx="36" cy="148" r="14" stroke="#888" stroke-width="2" fill="none"/>
  <line x1="36" y1="138" x2="36" y2="148" stroke="#888" stroke-width="2" stroke-linecap="round"/>
  <line x1="36" y1="148" x2="44" y2="152" stroke="#888" stroke-width="2" stroke-linecap="round"/>

  <!-- 중단 텍스트 -->
  <text x="60" y="156" font-size="30" font-weight="bold" font-family="sans-serif">
    <tspan fill="#111">${midMain}</tspan>
    <tspan fill="${RED}">${midAccent}</tspan>${noteHtml}
  </text>

  <!-- 무료배송 -->
  <text x="24" y="215" fill="${BLUE}" font-size="32" font-weight="bold" font-family="sans-serif">\ubb34\ub8cc\ubc30\uc1a1</text>

  <!-- 하단 바 -->
  <rect x="24" y="238" width="752" height="58" rx="14" fill="#f4f4fa"/>

  <!-- 감탄홍게 뱃지 -->
  <rect x="34" y="253" width="88" height="28" rx="14" fill="#3b38d3"/>
  <text x="78" y="271" fill="#fff" font-size="16" font-weight="bold" font-family="sans-serif" text-anchor="middle">\uac10\ud0c4\ud64d\uac8c</text>

  <!-- 하단 좌측 메시지 -->
  <text x="132" y="271" fill="#444" font-size="17" font-family="sans-serif">${footerLeft}</text>

  <!-- 하단 우측: 오른쪽 끝(760) 기준 역방향 배치 -->
  <text x="756" y="271" fill="${accent}" font-size="17" font-weight="bold" font-family="sans-serif" text-anchor="end">${footerRight}</text>
  <circle cx="624" cy="267" r="6" fill="${accent}"/>
</svg>`;

  res.setHeader('Content-Type','image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.end(svg);
};
