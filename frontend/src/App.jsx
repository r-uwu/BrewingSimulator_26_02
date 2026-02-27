import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Simulator from './pages/Simulator';
import RecipeList from './pages/RecipeList';

function App() {


  return (
    <BrowserRouter>
      {/*상단 네비 바*/}

      <nav style={{ 
        position: 'fixed', top: 0, left: 0, width: '100%', 
        backgroundColor: '#333', padding: '10px 30px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxSizing: 'border-box',
        borderBottom: '1px solid #333',
        zIndex: 1000
      }}>

        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '26px' }}>
          양조 시뮬레이터🍺🍻
        </div>


        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>홈으로</Link>
          <Link to="/simulator" style={{ color: 'white', textDecoration: 'none' }}>시뮬레이터</Link>
          <Link to="/recipeList" style={{ color: 'white', textDecoration: 'none' }}>레시피 목록</Link>
          
        </div>
      </nav>
      

<div style={{ paddingTop: '70px', minHeight: '100vh', backgroundColor: '#121212' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/recipeList" element={<RecipeList />} /> {/* 🌟 누락되었던 라우트 추가! */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;