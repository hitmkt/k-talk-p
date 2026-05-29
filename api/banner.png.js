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
  const noteHtml=showNote?`<tspan fill="#b84040" font-size="24"> (\uc74d,\uba74,\ub9ac \uc81c\uc678)</tspan>`:'';
  const footerLeft=before
    ?`\uc624\ud6c4 ${cutH}\uc2dc \ub9c8\uac10 \u00B7 \ub2f9\uc77c \ucd9c\uace0`
    :`\ucd9c\uace0 \uc885\ub8cc \u00B7 \ub0b4\uc77c \uc624\ud6c4 ${nextCutH}\uc2dc \uc8fc\ubb38\uc2dc`;
  const footerRight=before
    ?`\uc624\ub298(${DAYS[k.dow]}) \ucd9c\uace0 &#x27A1;`
    :`${shipDay}\uc694\uc77c \ucd9c\uace0 &#x27A1;`;

  const svg=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="800" height="320">
  <rect width="800" height="320" rx="20" fill="#fff" stroke="#cccccc" stroke-width="2.5"/>

  <!-- 감탄배송 뱃지 -->
  <rect x="24" y="26" width="172" height="48" rx="10" fill="${BLUE}"/>
  <!-- 배 아이콘: 원형 배경 -->
  <circle cx="48" cy="50" r="16" fill="rgba(255,255,255,0.2)"/>
  <!-- 배 선체 -->
  <path d="M39 54 L41 47 L55 47 L57 54 Z" fill="#7dd3fc" stroke="#fff" stroke-width="0.8"/>
  <!-- 배 밑 물결 -->
  <path d="M37 54 Q48 60 59 54 Z" fill="#38bdf8"/>
  <!-- 돛대 -->
  <line x1="48" y1="47" x2="48" y2="41" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
  <!-- 돛 -->
  <path d="M48 41 L54 47" stroke="#fff" stroke-width="1.2" stroke-linecap="round" fill="none"/>
  <!-- 물결 -->
  <path d="M36 57 Q42 61 48 57 Q54 53 60 57" stroke="#93c5fd" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <!-- 감탄배송 텍스트: 크기 키우고 기울기, 세로 중앙 정렬 -->
  <text x="122" y="53" fill="#fff" font-size="23" font-weight="bold" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle">\uac10\ud0c4\ubc30\uc1a1</text>

  <!-- 상단 타이틀: 뱃지와 같은 세로 중앙 -->
  <text x="210" y="53" fill="#111" font-size="32" font-weight="bold" font-family="sans-serif" dominant-baseline="middle">${titleText}</text>

  <!-- 구분선 -->
  <line x1="24" y1="92" x2="776" y2="92" stroke="#e0e0e0" stroke-width="1.5"/>

  <!-- 시계 아이콘 -->
  <circle cx="36" cy="148" r="15" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
  <circle cx="36" cy="148" r="12" fill="#eff6ff"/>
  <circle cx="36" cy="148" r="2" fill="#1d4ed8"/>
  <line x1="36" y1="148" x2="36" y2="138" stroke="#1d4ed8" stroke-width="2" stroke-linecap="round"/>
  <line x1="36" y1="148" x2="43" y2="151" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="36" y1="134" x2="36" y2="136" stroke="#93c5fd" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="50" y1="148" x2="48" y2="148" stroke="#93c5fd" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="36" y1="162" x2="36" y2="160" stroke="#93c5fd" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="22" y1="148" x2="24" y2="148" stroke="#93c5fd" stroke-width="1.5" stroke-linecap="round"/>

  <!-- 중단 텍스트 -->
  <text x="60" y="148" font-size="30" font-weight="bold" font-family="sans-serif" dominant-baseline="middle">
    <tspan fill="#111">${midMain}</tspan>
    <tspan fill="${RED}">${midAccent}</tspan>${noteHtml}
  </text>

  <!-- 무료배송 -->
  <text x="24" y="215" fill="${BLUE}" font-size="32" font-weight="bold" font-family="sans-serif">\ubb34\ub8cc\ubc30\uc1a1</text>

  <!-- 하단 바: y=238, height=58 → 중앙 y=267 -->
  <rect x="24" y="238" width="752" height="58" rx="14" fill="#f4f4fa"/>
  <rect x="34" y="252" width="88" height="30" rx="15" fill="#3b38d3"/>
  <!-- 감탄홍게, 좌측텍스트, 우측 모두 y=267 dominant-baseline="middle" 로 통일 -->
  <text x="78" y="267" fill="#fff" font-size="16" font-weight="bold" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle">\uac10\ud0c4\ud64d\uac8c</text>
  <text x="132" y="267" fill="#444" font-size="17" font-family="sans-serif" dominant-baseline="middle">${footerLeft}</text>
  <circle cx="614" cy="267" r="8" fill="${accent}"/>
  <text x="628" y="267" fill="${accent}" font-size="20" font-weight="bold" font-family="sans-serif" dominant-baseline="middle">${footerRight}</text>
</svg>`;

  res.setHeader('Content-Type','image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.end(svg);
};
