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
  const footerMsg=before?`\uc624\ub298 \uc624\ud6c4 ${cutH}\uc2dc \uc8fc\ubb38 \ub9c8\uac10 \u00B7 \ub2f9\uc77c \ucd9c\uace0`:`\uc624\ub298 \ucd9c\uace0 \uc885\ub8cc \u00B7 \ub0b4\uc77c \uc624\ud6c4 ${nextCutH}\uc2dc\uae4c\uc9c0 \uc8fc\ubb38 \uc2dc`;
  const shipLabel=before?`\uc624\ub298(${DAYS[k.dow]}) \ucd9c\uace0 \u27A1`:`${shipDay}\uc694\uc77c \ucd9c\uace0 \u27A1`;
  const noteHtml=showNote?`<tspan fill="#b84040" font-size="22"> (\uc74d,\uba74,\ub9ac \uc81c\uc678)</tspan>`:'';

  const svg=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 200" width="900" height="200">
  <rect width="900" height="200" rx="16" fill="#fff" stroke="#eee" stroke-width="1.5"/>
  <rect x="28" y="20" width="130" height="36" rx="9" fill="${BLUE}"/>
  <text x="93" y="44" fill="#fff" font-size="16" font-weight="bold" font-family="sans-serif" text-anchor="middle">\uD83C\uDF0A \uac10\ud0c4\ubc30\uc1a1</text>
  <text x="174" y="45" fill="#111" font-size="26" font-weight="bold" font-family="sans-serif">${titleText}</text>
  <line x1="28" y1="72" x2="872" y2="72" stroke="#f0f0f0" stroke-width="1.5"/>
  <text x="28" y="112" font-size="24" font-weight="bold" font-family="sans-serif">
    <tspan fill="#555">\uD83D\uDD52 </tspan>
    <tspan fill="#111">${midMain}</tspan>
    <tspan fill="${RED}">${midAccent}</tspan>${noteHtml}
  </text>
  <text x="28" y="148" fill="${BLUE}" font-size="26" font-weight="bold" font-family="sans-serif">\ubb34\ub8cc\ubc30\uc1a1</text>
  <rect x="28" y="160" width="844" height="32" rx="10" fill="#f4f4fa"/>
  <rect x="36" y="167" width="72" height="20" rx="10" fill="#3b38d3"/>
  <text x="72" y="181" fill="#fff" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">\uac10\ud0c4\ud64d\uac8c</text>
  <text x="118" y="181" fill="#444" font-size="14" font-family="sans-serif">${footerMsg}</text>
  <text x="750" y="181" fill="${accent}" font-size="16" font-family="sans-serif">&#x25CF; ${shipLabel}</text>
</svg>`;

  res.setHeader('Content-Type','image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.end(svg);
};
