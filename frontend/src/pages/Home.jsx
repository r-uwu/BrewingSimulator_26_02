import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>메인 페이지</h1>
      <p>시뮬레이터 바로가기</p>
      
      {/* a 태그 대신 Link 태그를 사용하여 페이지를 깜빡임 없이 이동합니다 */}
      <Link to="/simulator">
        <button style={{ padding: '15px 30px', fontSize: '18px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '20px' }}>
          시뮬레이터 시작 (임의의 파라미터 사용)
        </button>
      </Link>
    </div>
  );
}

export default Home;