import { Link } from 'react-router-dom';
import Card from '../components/Card';

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

const Home = () => {
  const brewingSteps = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1550258213-f4a250e0c104?w=400",
      tag: "Step 1",
      title: "몰트 당화 (Mashing)",
      description: "맥아의 전분을 당으로 바꾸는 핵심 과정입니다. 온도를 조절해 보세요."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1584225065152-4a1454aa3d4e?w=400",
      tag: "Step 2",
      title: "홉 투입 (Boiling)",
      description: "맥주의 쓴맛과 향을 결정합니다. IBU 수치를 실시간으로 계산합니다."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1532635042-a6f6ad4ca33d?w=400",
      tag: "Step 3",
      title: "발효 (Fermentation)",
      description: "효모가 당을 알코올로 바꾸는 마법! 예상 ABV를 확인해보세요."
    }
  ];

  return (
    <div style={{ padding: '100px 20px 50px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#222' }}>Brewing Process</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '25px' 
        }}>
          {brewingSteps.map(step => (
            <Card key={step.id} {...step} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;