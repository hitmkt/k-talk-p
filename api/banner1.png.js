// banner.png.js
// 톡스토어 최적화 스타일 버전

module.exports = async (req, res) => {

  res.setHeader('Content-Type', 'image/png');

  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );

  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  const { ImageResponse } = require('@vercel/og');

  /* =========================
     KST 시간
  ========================= */

  const now = new Date();

  const kst = new Date(
    now.toLocaleString('en-US', {
      timeZone: 'Asia/Seoul'
    })
  );

  const DAYS = ['일','월','화','수','목','금','토'];

  const dow = kst.getDay();
  const hour = kst.getHours();

  const isSat = dow === 6;
  const isSun = dow === 0;
  const isWeekend = isSat || isSun;

  const cutoff = isWeekend ? 15 : 17;
  const beforeCutoff = hour < cutoff;

  /* =========================
     도착일 계산
  ========================= */

  const arriveDate = new Date(kst);

  if (beforeCutoff) {
    arriveDate.setDate(arriveDate.getDate() + 1);
  } else {
    arriveDate.setDate(arriveDate.getDate() + 2);
  }

  const arriveMonth = arriveDate.getMonth() + 1;
  const arriveDay = arriveDate.getDate();
  const arriveWeek = DAYS[arriveDate.getDay()];

  const tomorrow = new Date(kst);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowWeek = DAYS[tomorrow.getDay()];
  const todayWeek = DAYS[dow];

  const isTomorrow =
    beforeCutoff;

  const titleText = isTomorrow
    ? `🚀 내일(${arriveWeek}) 도착보장`
    : `📦 ${arriveMonth}/${arriveDay}(${arriveWeek}) 도착보장`;

  /* =========================
     중단 문구
  ========================= */

  let middleText = '';
  let noteText = '';

  if (beforeCutoff) {

    middleText =
      `오후 ${cutoff - 12}시 전 주문 시`;

    if (isSat) {
      noteText = '(읍,면,리 제외)';
    }

  } else {

    middleText =
      `지금 주문하면 내일(${tomorrowWeek}) 출고!`;
  }

  /* =========================
     하단 문구
  ========================= */

  let footerLeft = '';
  let footerRight = '';
  let dotColor = '#1e1bba';

  if (beforeCutoff) {

    footerLeft =
      `오늘 오후 ${cutoff - 12}시 주문 마감 · 당일 출고`;

    footerRight =
      `오늘(${todayWeek}) 출고 ➜`;

    dotColor = '#1e1bba';

  } else {

    footerLeft =
      `오늘 출고 종료 · 내일 오후 ${cutoff - 12}시까지 주문 시`;

    footerRight =
      `내일(${tomorrowWeek}) 출고 ➜`;

    dotColor = '#d63030';
  }

  /* =========================
     이미지 생성
  ========================= */

  const image = new ImageResponse(

    (
      <div
        style={{
          width: '900px',
          height: '320px',
          background: '#ffffff',
          border: '1px solid #eaeaea',
          borderRadius: '18px',
          padding: '28px 34px',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'sans-serif',
          boxSizing: 'border-box'
        }}
      >

        {/* 상단 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >

            <div
              style={{
                background: '#1e1bba',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '900',
                padding: '6px 14px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                letterSpacing: '-0.5px'
              }}
            >
              🌊 감탄배송
            </div>

            <div
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#111111',
                letterSpacing: '-1px'
              }}
            >
              {titleText}
            </div>

          </div>

          <div
            style={{
              fontSize: '28px',
              color: '#999999'
            }}
          >
            ➜
          </div>

        </div>

        {/* 구분선 */}
        <div
          style={{
            width: '100%',
            height: '1px',
            background: '#efefef',
            marginBottom: '24px'
          }}
        />

        {/* 중단 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '28px'
          }}
        >

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px',
              flexWrap: 'wrap'
            }}
          >

            <div
              style={{
                fontSize: '20px'
              }}
            >
              🕒
            </div>

            <div
              style={{
                fontSize: '19px',
                fontWeight: '800',
                color: '#111111',
                letterSpacing: '-0.5px'
              }}
            >
              {middleText}
            </div>

            {
              noteText && (
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: '800',
                    color: '#b84040',
                    background:
                      'linear-gradient(to bottom, transparent 50%, rgba(255,220,100,0.65) 50%)',
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(210,70,70,0.45)',
                    textDecorationThickness: '2px',
                    textUnderlineOffset: '2px',
                    padding: '0 2px',
                    borderRadius: '4px'
                  }}
                >
                  {noteText}
                </div>
              )
            }

          </div>

          <div
            style={{
              fontSize: '24px',
              fontWeight: '900',
              color: '#1e1bba',
              letterSpacing: '-0.5px'
            }}
          >
            무료배송
          </div>

        </div>

        {/* 하단바 */}
        <div
          style={{
            background: '#f4f4fa',
            borderRadius: '14px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >

            <div
              style={{
                background: '#3b38d3',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '800',
                padding: '4px 10px',
                borderRadius: '20px',
                letterSpacing: '-0.5px'
              }}
            >
              감탄홍게
            </div>

            <div
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#444444',
                letterSpacing: '-0.3px'
              }}
            >
              {footerLeft}
            </div>

          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '15px',
              fontWeight: '800',
              color: '#111111'
            }}
          >

            <div
              style={{
                color: dotColor,
                fontSize: '18px'
              }}
            >
              ●
            </div>

            <div>
              {footerRight}
            </div>

          </div>

        </div>

      </div>
    ),

    {
      width: 900,
      height: 320
    }
  );

  return res.end(await image.arrayBuffer());
};
