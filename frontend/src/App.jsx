import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Simulator from './pages/Simulator';
import RecipeList from './pages/RecipeList';

// 🌟 마우스를 올리면 맥주색으로 변하는 커스텀 링크 컴포넌트
function HoverLink({ to, children }) {
  const [isHover, setIsHover] = useState(false);
  return (
    <Link 
      to={to} 
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{ 
        color: isHover ? '#F5A623' : '#F0F0F0', // Hover 시 맥주 골드 색상
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'all 0.2s ease',
        padding: '8px 16px',
        borderRadius: '8px',
        backgroundColor: isHover ? '#333333' : 'transparent' // Hover 시 배경도 살짝 눌러줌
      }}
    >
      {children}
    </Link>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* 🌟 상단 네비 바 */}
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '70px', // 높이 고정
        backgroundColor: '#242424', // 본문(#333333)보다 살짝 어두운 패널 색상
        fontFamily: '"Mulmaru", sans-serif',
        padding: '0 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxSizing: 'border-box',
        borderBottom: '1px solid #444444', // 은은한 경계선
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)', // 약간의 그림자로 입체감 부여
        zIndex: 1000
      }}>

        {/* 좌측: 로고 및 타이틀 (클릭 시 홈으로) */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="logo" style={{ height: '40px' }} /> {/* 네비바용 미니 로고 */}
          <div style={{ color: '#F5A623', fontWeight: '900', fontSize: '22px', letterSpacing: '1px' }}>
            방구석 브루어리
          </div>
        </Link>

        {/* 우측: 메뉴 링크들 */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <HoverLink to="/">홈으로</HoverLink>
          <HoverLink to="/simulator">시뮬레이터</HoverLink>
          <HoverLink to="/recipes">레시피 리스트</HoverLink>
        </div>
      </nav>
      
      {/* 메인 라우터 화면 */}
      <div style={{ paddingTop: '70px', minHeight: '100vh', backgroundColor: '#333333' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/recipes" element={<RecipeList />} /> {/* 🌟 경로를 /recipes 로 통일! */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;