module.exports = async (req, res) => {
  const DAYS = ['\uc77c','\uc6d4','\ud654','\uc218','\ubaa9','\uae08','\ud1a0'];

  function getKST(){const now=new Date();const kst=new Date(now.getTime()+9*60*60*1000);return{year:kst.getUTCFullYear(),month:kst.getUTCMonth(),date:kst.getUTCDate(),dow:kst.getUTCDay(),hour:kst.getUTCHours()};}
  function addDays(ms,n){return ms+n*86400000;}

  const k=getKST();
  const todayMs=Date.UTC(k.year,k.month,k.date);
  const tomMs=addDays(todayMs,1);

  // 평시 규칙: 평일=17시, 토요일=15시(읍면리제외), 일요일=15시
  const isSat=k.dow===6;
  const isWeekend=(k.dow===0||k.dow===6);
  const cutoff=isWeekend?15:17;
  const before=k.hour<cutoff;
  const showNote=isSat&&before;

  const arrMs=before?tomMs:addDays(todayMs,2);
  const arr=new Date(arrMs);
  const arrDay=DAYS[arr.getUTCDay()];
  const arrMM=arr.getUTCMonth()+1;
  const arrDD=arr.getUTCDate();
  const arrLabel=arrMs===tomMs?'\ub0b4\uc77c':'\ubaa8\ub808';

  const tom=new Date(tomMs);
  const shipDay=DAYS[tom.getUTCDay()];
  const cutH=cutoff-12;
  const nextCutoff=isWeekend?15:17;
  const nextCutH=nextCutoff-12;

  const BLUE='#1e1bba',RED='#d63030';
  const accent=before?BLUE:RED;

  const titleText=`${arrMM}\uc6d4 ${arrDD}\uc77c(${arrDay}) \ub3c4\ucc29\ubcf4\uc7a5`;
  const midMain=before?`\uc624\ud6c4 ${cutH}\uc2dc \uc804 \uc8fc\ubb38 \uc2dc`:'\uc9c0\uae08 \uc8fc\ubb38\ud558\uba74 ';
  const midAccent=before?'':`${shipDay}\uc694\uc77c \ucd9c\uace0!`;
  const noteHtml=showNote?`<tspan fill="#b84040" font-size="24"> (\uc74d,\uba74,\ub9ac \uc81c\uc678)</tspan>`:'';
  const footerLeft1=before
    ?`\ub2f9\uc77c \ucd9c\uace0! \u00B7 `
    :`\uc624\ub298 \ucd9c\uace0 \uc885\ub8cc \u00B7 `;
  const footerLeft2=before
    ?`\uc624\ub298 \uc624\ud6c4 ${cutH}\uc2dc\uae4c\uc9c0 \uc8fc\ubb38 \uc2dc`
    :`\ub0b4\uc77c \uc624\ud6c4 ${nextCutH}\uc2dc\uae4c\uc9c0`;
  const footerLeft3=before
    ?''
    :` \uc8fc\ubb38 \uc2dc`;
  const footerRight=before
    ?`\uc624\ub298(${DAYS[k.dow]}) \ucd9c\uace0 &#x27A1;`
    :`${shipDay}\uc694\uc77c \ucd9c\uace0 &#x27A1;`;

  const svg=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="800" height="320">
  <rect width="800" height="320" rx="20" fill="#fff" stroke="#cccccc" stroke-width="2.5"/>

  <!-- 감탄배송 뱃지 -->
  <rect x="24" y="26" width="172" height="48" rx="10" fill="${BLUE}"/>
  <circle cx="48" cy="50" r="16" fill="rgba(255,255,255,0.2)"/>
  <path d="M39 54 L41 47 L55 47 L57 54 Z" fill="#7dd3fc" stroke="#fff" stroke-width="0.8"/>
  <path d="M37 54 Q48 60 59 54 Z" fill="#38bdf8"/>
  <line x1="48" y1="47" x2="48" y2="41" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M48 41 L54 47" stroke="#fff" stroke-width="1.2" stroke-linecap="round" fill="none"/>
  <path d="M36 57 Q42 61 48 57 Q54 53 60 57" stroke="#93c5fd" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <text x="122" y="53" fill="#fff" font-size="23" font-weight="bold" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle">\uac10 \ud0c4 \ubc30 \uc1a1</text>

  <!-- 상단 타이틀 -->
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

  <!-- 하단 바 -->
  <rect x="24" y="232" width="752" height="72" rx="14" fill="#f4f4fa"/>
  <rect x="34" y="251" width="96" height="34" rx="17" fill="#3b38d3"/>
  <text x="82" y="268" fill="#fff" font-size="18" font-weight="bold" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle">\uac10\ud0c4\ud64d\uac8c</text>
  <text x="140" y="268" fill="#444" font-size="19" font-family="sans-serif" dominant-baseline="middle">
    <tspan fill="${before ? RED : '#444'}" font-weight="${before ? 'bold' : 'normal'}">${footerLeft1}</tspan><tspan fill="${before ? '#444' : BLUE}" font-weight="${before ? 'normal' : 'bold'}">${footerLeft2}</tspan><tspan fill="#444">${footerLeft3}</tspan>
  </text>
  <circle cx="614" cy="268" r="9" fill="${accent}"/>
  <text x="629" y="268" fill="${accent}" font-size="22" font-weight="bold" font-family="sans-serif" dominant-baseline="middle">${footerRight}</text>
</svg>`;

  res.setHeader('Content-Type','image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.end(svg);
};
