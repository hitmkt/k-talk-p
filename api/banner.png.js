module.exports = async (req, res) => {
  const DAYS = ['\uc77c','\uc6d4','\ud654','\uc218','\ubaa9','\uae08','\ud1a0'];

  const SPECIAL = {
    '6/1':  { cutoff: 17, ship: true,  note: false },
    '6/2':  { cutoff: 0,  ship: false, note: false },
    '6/3':  { cutoff: 15, ship: true,  note: false },
    '6/4':  { cutoff: 17, ship: true,  note: false },
    '6/5':  { cutoff: 17, ship: true,  note: true  },
    '6/6':  { cutoff: 15, ship: true,  note: true  },
    '6/7':  { cutoff: 15, ship: true,  note: false },
    '6/8':  { cutoff: 15, ship: true,  note: false },
  };

  function getKST() {
    const now = new Date();
    const kst = new Date(now.getTime() + 9*60*60*1000);
    return { year:kst.getUTCFullYear(), month:kst.getUTCMonth(), date:kst.getUTCDate(), dow:kst.getUTCDay(), hour:kst.getUTCHours() };
  }
  function addDays(ms,n){return ms+n*86400000;}
  function toKey(ms){const d=new Date(ms);return `${d.getUTCMonth()+1}/${d.getUTCDate()}`;}
  function getSch(ms){
    const key=toKey(ms);
    if(SPECIAL[key])return SPECIAL[key];
    const dow=new Date(ms).getUTCDay();
    return{cutoff:(dow===0||dow===6)?15:17,ship:true,note:dow===6};
  }
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

  const BLUE='#1e1bba', RED='#d63030';
  const accent=before?BLUE:RED;
  const FONT="'Apple SD Gothic Neo','Malgun Gothic',sans-serif";

  const titleText=`${arrLabel}(${arrDay}) ${arrMM}/${arrDD} \ub3c4\ucc29\ubcf4\uc7a5`;
  const midMain=before?`\uc624\ud6c4 ${cutH}\uc2dc \uc804 \uc8fc\ubb38 \uc2dc`:'\uc9c0\uae08 \uc8fc\ubb38\ud558\uba74 ';
  const midAccent=before?'':`${shipDay}\uc694\uc77c \ucd9c\uace0!`;
  const footerMsg=before
    ?`\uc624\ub298 \uc624\ud6c4 ${cutH}\uc2dc \uc8fc\ubb38 \ub9c8\uac10 \u00B7 \ub2f9\uc77c \ucd9c\uace0`
    :`\uc624\ub298 \ucd9c\uace0 \uc885\ub8cc \u00B7 \ub0b4\uc77c \uc624\ud6c4 ${nextCutH}\uc2dc\uae4c\uc9c0 \uc8fc\ubb38 \uc2dc`;
  const shipLabel=before?`\uc624\ub298(${DAYS[k.dow]}) \ucd9c\uace0 \u27A1`:`${shipDay}\uc694\uc77c \ucd9c\uace0 \u27A1`;
  const noteHtml=showNote?`<tspan fill="#b84040" font-size="22"> (\uc74d,\uba74,\ub9ac \uc81c\uc678)</tspan>`:'';

  // SVG: viewBox 기준 900x300, width=100% → 모바일에서도 꽉 차고 글자 크게 보임
  const svg=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 300" width="100%" style="max-width:900px;display:block;">
  <rect width="900" height="300" rx="20" fill="#fff" stroke="#eee" stroke-width="2"/>

  <!-- 감탄배송 뱃지 -->
  <rect x="32" y="30" width="150" height="46" rx="10" fill="${BLUE}"/>
  <text x="107" y="62" fill="#fff" font-size="22" font-weight="bold" font-family=${FONT} text-anchor="middle">\uD83C\uDF0A \uac10\ud0c4\ubc30\uc1a1</text>

  <!-- 상단 타이틀 -->
  <text x="200" y="63" fill="#111" font-size="30" font-weight="bold" font-family=${FONT}>${titleText}</text>

  <!-- 구분선 -->
  <line x1="32" y1="96" x2="868" y2="96" stroke="#f0f0f0" stroke-width="1.5"/>

  <!-- 중단 -->
  <text x="32" y="148" font-size="28" font-weight="bold" font-family=${FONT}>
    <tspan fill="#555">\uD83D\uDD52 </tspan>
    <tspan fill="#111">${midMain}</tspan>
    <tspan fill="${RED}">${midAccent}</tspan>${noteHtml}
  </text>

  <!-- 무료배송 -->
  <text x="32" y="200" fill="${BLUE}" font-size="32" font-weight="bold" font-family=${FONT}>\ubb34\ub8cc\ubc30\uc1a1</text>

  <!-- 하단 바 -->
  <rect x="32" y="222" width="836" height="52" rx="14" fill="#f4f4fa"/>

  <!-- 감탄홍게 뱃지 -->
  <rect x="44" y="233" width="88" height="28" rx="14" fill="#3b38d3"/>
  <text x="88" y="252" fill="#fff" font-size="16" font-weight="bold" font-family=${FONT} text-anchor="middle">\uac10\ud0c4\ud64d\uac8c</text>

  <!-- 하단 메시지 -->
  <text x="144" y="254" fill="#444" font-size="19" font-family=${FONT}>${footerMsg}</text>

  <!-- 출고 레이블 -->
  <text x="730" y="254" fill="${accent}" font-size="20" font-family="sans-serif">&#x25CF;</text>
  <text x="752" y="254" fill="#111" font-size="19" font-weight="bold" font-family=${FONT}>${shipLabel}</text>
</svg>`;

  res.setHeader('Content-Type','image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.end(svg);
};
