import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import BeerLoading from './BeerLoading';

function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 [변수 선언을 최상단으로 이동] 
  // 리턴문보다 위에 있어야 모든 상황에서 안전하게 참조됩니다.
  const colors = {
    bgMain: '#333333',
    bgCard: '#242424',
    beerGold: '#F5A623',
    hopGreen: '#2ECC71',
    textMain: '#F0F0F0',
    textSub: '#A0A0A0'
  };

  const containerStyle = {
    width: '100%',
    backgroundColor: colors.bgMain, 
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Mulmaru", sans-serif',
    color: colors.textMain,
    animation: 'fadeIn 0.8s ease-in-out',
  };

  const cardStyle = {
    backgroundColor: '#1e1e1e',
    border: '1px solid #444', // 초기 보더 색상 명시
    borderRadius: '16px',
    padding: '30px',
    width: '280px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
    transition: 'all 0.3s ease',
    textAlign: 'center'
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // 🌟 로딩 조건부는 변수 선언들 다음에 위치시킵니다.
  if (isLoading) {
    return <BeerLoading />;
  }

  return (
    <div style={containerStyle}>
      {/* 🌟 1. 히어로 섹션 (로고와 타이틀) */}
      <div style={{ textAlign: 'center', marginBottom: '60px', padding: '0 20px' }}>
        <img 
          src="/logo.png" 
          alt="방구석 브루어리 로고"
          className="pulse-logo"
          style={{ 
            width: '200px', 
            marginBottom: '25px', 
          }} 
        />
        
        <style>{`
          .pulse-logo {
            animation: shadowPulse 3s infinite ease-in-out;
          }

          @keyframes shadowPulse {
            0% {
              filter: drop-shadow(0px 0px 12px ${colors.beerGold}40);
              transform: scale(1);
            }
            50% {
              filter: drop-shadow(0px 0px 24px ${colors.beerGold}A0);
              transform: scale(1.02);
            }
            100% {
              filter: drop-shadow(0px 0px 12px ${colors.beerGold}40);
              transform: scale(1);
            }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        
        <h1 style={{ 
          fontSize: '3.5em', 
          margin: '0 0 15px 0', 
          color: colors.beerGold,
          letterSpacing: '2px',
          fontWeight: '800'
        }}>
          방구석 브루어리
        </h1>
        <p style={{ 
          fontSize: '1.2em', 
          color: colors.textSub, 
          margin: 0,
          fontWeight: '400'
        }}>
          나만의 완벽한 맥주 레시피를 설계하고 시뮬레이션하세요.
        </p>
      </div>

      {/* 🌟 2. 메인 네비게이션 버튼 (카드 형태) */}
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        <div 
          style={cardStyle}
          onClick={() => navigate('/simulator')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.borderColor = colors.beerGold; 
            e.currentTarget.style.boxShadow = `0 12px 24px ${colors.beerGold}50`; 
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = '#444';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
          }}
        >
          <div style={{ fontSize: '4.5em', marginBottom: '15px' }}>🧪</div>
          <h2 style={{ margin: '0 0 12px 0', color: colors.beerGold, fontSize: '1.8em' }}>새 배치 시작</h2>
          <p style={{ color: colors.textSub, margin: 0, fontSize: '0.95em', lineHeight: '1.6' }}>
            재료와 온도를 설정하고<br/>발효 과정을 시뮬레이션 합니다.
          </p>
        </div>

        <div 
          style={cardStyle}
          onClick={() => navigate('/recipes')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.borderColor = colors.hopGreen; 
            e.currentTarget.style.boxShadow = `0 12px 24px ${colors.hopGreen}50`; 
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = '#444';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
          }}
        >
          <div style={{ fontSize: '4.5em', marginBottom: '15px' }}>📂</div>
          <h2 style={{ margin: '0 0 12px 0', color: colors.hopGreen, fontSize: '1.8em' }}>내 양조 일지</h2>
          <p style={{ color: colors.textSub, margin: 0, fontSize: '0.95em', lineHeight: '1.6' }}>
            저장해둔 레시피를 확인하고<br/>다시 불러와 수정합니다.
          </p>
        </div>
      </div>

      {/* 🌟 3. 하단 기능 요약 */}
      <div style={{ 
        marginTop: '80px', 
        color: '#888', 
        fontSize: '0.95em', 
        display: 'flex', 
        gap: '30px',
        borderTop: '1px solid #444',
        paddingTop: '25px',
        marginBottom: '40px'
      }}>
        <span><strong style={{color: colors.beerGold}}>✓</strong> BU/GU 비율 계산</span>
        <span><strong style={{color: colors.beerGold}}>✓</strong> 다단계 온도 스케줄링</span>
        <span><strong style={{color: colors.beerGold}}>✓</strong> 실시간 비중 예측</span>
      </div>
    </div>
  );
}

export default Home;