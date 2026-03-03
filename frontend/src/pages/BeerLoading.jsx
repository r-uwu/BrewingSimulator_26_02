import React, { useMemo } from 'react';

// SRM 수치를 색상(HEX)으로 변환하는 함수
const getSrmColor = (srm) => {
  const srmColors = {
    0: '#FFFFE0', 1: '#FFFFBF', 2: '#FFFF80', 3: '#FFFF40', 4: '#FFD700', 
    5: '#FFC000', 6: '#FFA500', 7: '#FF8C00', 8: '#FF4500', 9: '#D2691E', 
    10: '#B87333', 11: '#A0522D', 12: '#8B4513', 13: '#704214', 14: '#5D4037', 
    15: '#3E2723', 20: '#1A1A1A', 25: '#000000', 30: '#000000', 35: '#000000', 40: '#000000'
  };

  const definedSrms = Object.keys(srmColors).map(Number).sort((a, b) => a - b);
  let closestSrm = definedSrms[0];
  let minDiff = Math.abs(srm - closestSrm);
  
  for (let i = 1; i < definedSrms.length; i++) {
    const diff = Math.abs(srm - definedSrms[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closestSrm = definedSrms[i];
    }
  }
  return srmColors[closestSrm];
};

function BeerLoading({ message = "양조장 문을 여는 중...", srm }) {
  
  const theme = {
    bgMain: '#333333',
    textMain: '#F0F0F0',
    glassBorder: '#555555',
  };

  const beerStyles = [
    { name: 'Pilsner', color: '#f7dc74' },
    { name: 'Ale', color: '#f7b347' },
    { name: 'Stout', color: '#1A1110' }
  ];

  const finalColor = useMemo(() => {
    // srm 값이 유효하게 넘어왔는지 확인
    if (srm !== undefined && srm !== null) {
      return getSrmColor(Number(srm));
    }
    // srm이 없으면 랜덤 색상 선택
    const randomBeer = beerStyles[Math.floor(Math.random() * beerStyles.length)];
    return randomBeer.color;
  }, [srm]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: theme.bgMain,
      fontFamily: '"Mulmaru", sans-serif'
    }}>
      <div className="beer-glass" style={{ borderColor: theme.glassBorder }}>

        <div className="beer-liquid" style={{ backgroundColor: finalColor }}>
          <div className="bubble bubble-1"></div>
          <div className="bubble bubble-2"></div>
          <div className="bubble bubble-3"></div>
        </div>
        <div className="beer-foam"></div>
      </div>

      <h3 style={{ 
        color: theme.textMain, 
        marginTop: '30px', 
        letterSpacing: '2px',
        animation: 'pulse 1.5s infinite',
        fontWeight: '400',
        textAlign: 'center'
      }}>
        {message}
      </h3>

      <style>{`
        .beer-glass {
          position: relative;
          width: 100px;
          height: 140px;
          background: rgba(255, 255, 255, 0.05);
          border: 4px solid;
          border-top: none;
          border-radius: 5px 5px 20px 20px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }
        .beer-liquid {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0%; 
          animation: fillUp 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .beer-foam {
          position: absolute;
          left: 0;
          width: 100%;
          background: #FFFFFF;
          height: 0%;
          bottom: 0%;
          animation: foamUp 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes fillUp { 0% { height: 0%; } 100% { height: 85%; } }
        @keyframes foamUp {
          0% { height: 0%; bottom: 0%; opacity: 0; }
          60% { opacity: 1; }
          100% { height: 15%; bottom: 85%; opacity: 1; }
        }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        .bubble {
          position: absolute;
          bottom: -10px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: rise 1.5s infinite ease-in;
        }
        .bubble-1 { width: 8px; height: 8px; left: 20%; animation-duration: 1.2s; animation-delay: 0.5s; }
        .bubble-2 { width: 12px; height: 12px; left: 50%; animation-duration: 1.5s; animation-delay: 0.2s; }
        .bubble-3 { width: 6px; height: 6px; left: 75%; animation-duration: 1s; animation-delay: 0.8s; }
        @keyframes rise {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-120px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default BeerLoading;