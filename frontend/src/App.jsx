import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Simulator from './pages/Simulator';

function App() {
  return (
    <BrowserRouter>
      {/*상단 네비 바*/}

      <nav style={{ 
        position: 'fixed', top: 0, left: 0, width: '100vw', 
        backgroundColor: '#333', padding: '10px 30px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxSizing: 'border-box' 
      }}>

        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '26px' }}>
          양조 시뮬레이터🍺🍻
        </div>


        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>홈으로</Link>
          <Link to="/simulator" style={{ color: 'white', textDecoration: 'none' }}>시뮬레이터</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulator" element={<Simulator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;