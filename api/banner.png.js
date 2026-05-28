import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const DAYS = ['일','월','화','수','목','금','토'];

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
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return { year: kst.getUTCFullYear(), month: kst.getUTCMonth(), date: kst.getUTCDate(), dow: kst.getUTCDay(), hour: kst.getUTCHours() };
}
function addDays(ms, n) { return ms + n * 86400000; }
function toKey(ms) { const d = new Date(ms); return `${d.getUTCMonth()+1}/${d.getUTCDate()}`; }
function getSch(ms) {
  const key = toKey(ms);
  if (SPECIAL[key]) return SPECIAL[key];
  const dow = new Date(ms).getUTCDay();
  return { cutoff: (dow === 0 || dow === 6) ? 15 : 17, ship: true, note: dow === 6 };
}
function nextShip(ms) {
  for (let i = 0; i < 14; i++) { if (getSch(ms).ship) return ms; ms = addDays(ms, 1); }
  return ms;
}

export default function handler() {
  const k = getKST();
  const todayMs = Date.UTC(k.year, k.month, k.date);
  const tomMs   = addDays(todayMs, 1);
  const todaySch = getSch(todayMs);
  const before   = todaySch.ship && k.hour < todaySch.cutoff;

  let shipMs, arrMs;
  if (before) { shipMs = todayMs; arrMs = tomMs; }
  else { shipMs = nextShip(tomMs); arrMs = addDays(shipMs, 1); }

  const arr      = new Date(arrMs);
  const arrDay   = DAYS[arr.getUTCDay()];
  const arrMM    = arr.getUTCMonth() + 1;
  const arrDD    = arr.getUTCDate();
  const arrLabel = arrMs === tomMs ? '내일' : '모레';
  const shipDay  = DAYS[new Date(shipMs).getUTCDay()];
  const nextSch  = getSch(shipMs);
  const cutH     = todaySch.cutoff - 12;
  const nextCutH = nextSch.cutoff - 12;
  const showNote = before ? todaySch.note : nextSch.note;

  const BLUE = '#1e1bba';
  const RED  = '#d63030';
  const accent = before ? BLUE : RED;

  const titleText  = `${arrLabel}(${arrDay}) ${arrMM}/${arrDD} 도착보장`;
  const midText    = before ? `오후 ${cutH}시 전 주문 시` : `지금 주문하면 `;
  const midAccent  = before ? '' : `${shipDay}요일 출고!`;
  const footerMsg  = before
    ? `오늘 오후 ${cutH}시 주문 마감 · 당일 출고`
    : `오늘 출고 종료 · 내일 오후 ${nextCutH}시까지 주문 시`;
  const shipLabel  = before ? `오늘(${DAYS[k.dow]}) 출고 ➔` : `${shipDay}요일 출고 ➔`;

  return new ImageResponse(
    <div style={{ width:'900px', height:'200px', background:'#fff', border:'1px solid #eee', borderRadius:'16px', padding:'20px 28px', fontFamily:'sans-serif', display:'flex', flexDirection:'column', justifyContent:'space-between', boxSizing:'border-box' }}>

      {/* 상단 */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
        <div style={{ background:BLUE, color:'#fff', fontSize:'18px', fontWeight:900, padding:'6px 16px', borderRadius:'8px', whiteSpace:'nowrap' }}>
          🌊 감탄배송
        </div>
        <div style={{ fontSize:'28px', fontWeight:800, color:'#111', letterSpacing:'-1px' }}>
          {titleText}
        </div>
      </div>

      {/* 중단 */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'22px', fontWeight:800 }}>
        <span>🕒</span>
        <span style={{ color:'#111' }}>{midText}</span>
        {midAccent && <span style={{ color:RED }}>{midAccent}</span>}
        {showNote && (
          <span style={{ fontSize:'14px', fontWeight:700, color:'#b84040', background:'rgba(255,220,100,0.5)', textDecoration:'underline', textDecorationColor:'rgba(210,70,70,0.5)', padding:'0 3px' }}>
            (읍,면,리 제외)
          </span>
        )}
        <span style={{ marginLeft:'auto', fontSize:'24px', fontWeight:900, color:BLUE }}>무료배송</span>
      </div>

      {/* 하단 바 */}
      <div style={{ background:'#f4f4fa', borderRadius:'12px', padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ background:'#3b38d3', color:'#fff', fontSize:'14px', fontWeight:800, padding:'4px 12px', borderRadius:'20px', whiteSpace:'nowrap' }}>
            감탄홍게
          </div>
          <span style={{ color:'#444', fontWeight:600, fontSize:'16px' }}>{footerMsg}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'6px', fontWeight:800, fontSize:'16px' }}>
          <span style={{ color:accent, fontSize:'18px' }}>●</span>
          <span style={{ color:'#111' }}>{shipLabel}</span>
        </div>
      </div>

    </div>,
    {
      width: 900,
      height: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    }
  );
}
