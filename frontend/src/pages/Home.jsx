import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  // 🌟 [새로운 컬러 팔레트] 🌟
  const colors = {
    bgMain: '#333333',       // 기본 배경 (요청하신 #333)
    bgCard: '#242424',       // 카드 배경 (배경보다 살짝 어둡게 눌러줌)
    beerGold: '#F5A623',     // 메인 포인트 (진한 맥주색/황금주황)
    hopGreen: '#2ECC71',     // 서브 포인트 (상큼한 홉 초록색)
    textMain: '#F0F0F0',     // 메인 텍스트 (완전 흰색보다 눈이 편한 오프화이트)
    textSub: '#A0A0A0'       // 서브 텍스트 (회색)
  };

  // --- UI 스타일 ---
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
    margin: '-80px 0px'
  };

const cardStyle = {
    backgroundColor: '#1e1e1e',
    border: '1px solid #333',
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

  return (
    <div style={containerStyle}>
      
      {/* 🌟 1. 히어로 섹션 (로고와 타이틀) */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <img 
          src="/logo.png" 
          alt="방구석 브루어리 로고" 
          style={{ 
            width: '200px', 
            marginBottom: '25px', 
            // 로고 뒤에 은은한 맥주빛 섀도우
            filter: `drop-shadow(0px 0px 16px ${colors.beerGold}80)` 
          }} 
        />
        <h1 style={{ 
          fontSize: '3.5em', 
          margin: '0 0 15px 0', 
          color: colors.beerGold, // 타이틀에 맥주 색상 적용!
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
        
        {/* 새 배치 시작 카드 (맥주색 테마) */}
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
          <h2 style={{ 
            margin: '0 0 12px 0', 
            color: colors.beerGold, 
            fontSize: '1.8em'
          }}>
            새 배치 시작
          </h2>
          <p style={{ 
            color: colors.textSub, 
            margin: 0, 
            fontSize: '0.95em',
            lineHeight: '1.6'
          }}>
            재료와 온도를 설정하고<br/>발효 과정을 시뮬레이션 합니다.
          </p>
        </div>

        {/* 내 양조 일지 카드 (홉 초록색 테마) */}
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
          <h2 style={{ 
            margin: '0 0 12px 0', 
            color: colors.hopGreen, 
            fontSize: '1.8em'
          }}>
            내 양조 일지
          </h2>
          <p style={{ 
            color: colors.textSub, 
            margin: 0, 
            fontSize: '0.95em',
            lineHeight: '1.6'
          }}>
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
        paddingTop: '25px'
      }}>
        <span><strong style={{color: colors.beerGold}}>✓</strong> BU/GU 비율 계산</span>
        <span><strong style={{color: colors.beerGold}}>✓</strong> 다단계 온도 스케줄링</span>
        <span><strong style={{color: colors.beerGold}}>✓</strong> 실시간 비중 예측</span>
      </div>

    </div>
  );
}

export default Home;