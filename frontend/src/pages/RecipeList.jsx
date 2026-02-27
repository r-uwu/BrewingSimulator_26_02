import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/brewing/recipes')
      .then(res => res.json())
      .then(data => {
        setRecipes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const cardStyle = {
    backgroundColor: '#1e1e1e',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '20px',
    color: '#e0e0e0',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>⏳ 레시피를 불러오는 중입니다...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', animation: 'fadeIn 0.5s', padding: '0 20px' }}>
      <h2 style={{ color: '#fff', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>📂 저장된 레시피 리스트</h2>
      
      {recipes.length === 0 ? (
        <div style={{ color: '#aaa', textAlign: 'center', padding: '50px' }}>
          저장된 레시피가 없습니다. 시뮬레이터에서 새로운 레시피를 만들어 저장해 보세요!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {recipes.map(recipe => (
            <div key={recipe.id} style={cardStyle}>
              {/* 상단: 이름 & 뱃지들 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#f1c40f', fontSize: '1.3em', flex: 1 }}>{recipe.name}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
                  <span style={{ backgroundColor: '#2c3e50', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', color: '#3498db', fontWeight: 'bold' }}>
                    {recipe.batchSizeLiters}L 배치
                  </span>
                  {/* 🌟 새로 추가된 발효 기간 뱃지 */}
                  <span style={{ backgroundColor: '#2c3e50', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', color: '#e67e22', fontWeight: 'bold' }}>
                    ⏱️ {recipe.durationDays}일 발효
                  </span>
                </div>
              </div>
              
              {/* 하단: 재료 리스트 */}
              <div style={{ marginTop: '10px', fontSize: '0.95em' }}>
                <strong style={{ color: '#f39c12' }}>🌾 몰트:</strong>
                <ul style={{ margin: '5px 0 12px 0', paddingLeft: '20px', color: '#bbb' }}>
                  {/* 🌟 프론트에서 객체의 필드를 꺼내와서 'kg' 단위를 붙여줍니다 */}
                  {recipe.grains.map((g, idx) => (
                    <li key={idx}>{g.name} <span style={{color: '#fff'}}>({g.weightKg}kg)</span></li>
                  ))}
                </ul>

                <strong style={{ color: '#2ecc71' }}>🌿 보일링 홉:</strong>
                <ul style={{ margin: '5px 0 12px 0', paddingLeft: '20px', color: '#bbb' }}>
                  {recipe.hops.length > 0 ? recipe.hops.map((h, idx) => (
                    <li key={idx}>{h.name} <span style={{color: '#fff'}}>{h.amountGrams}g</span> @{h.boilTimeMinutes}분</li>
                  )) : <li style={{color:'#777'}}>없음</li>}
                </ul>

                <strong style={{ color: '#9b59b6' }}>🌱 드라이 홉:</strong>
                <ul style={{ margin: '5px 0 12px 0', paddingLeft: '20px', color: '#bbb' }}>
                  {recipe.dryHops && recipe.dryHops.length > 0 ? (
                    recipe.dryHops.map((dh, idx) => (
                      <li key={idx}>{dh.name} <span style={{color: '#fff'}}>{dh.amountGrams}g</span> ({dh.insertDay}일차 투입)</li>
                    ))
                  ) : (
                    <li style={{color:'#777'}}>없음</li>
                  )}
                </ul>

                <strong style={{ color: '#e74c3c' }}>🦠 효모:</strong>
                <div style={{ margin: '5px 0 0 0', paddingLeft: '20px', color: '#bbb' }}>
                  {recipe.yeast ? (
                    <span>{recipe.yeast.name} <span style={{color: '#fff'}}>({recipe.yeast.amount}g)</span></span>
                  ) : (
                    <span style={{color:'#777'}}>없음</span>
                  )}
                </div>
              </div>
              {/* 🌟 3. 시뮬레이터로 불러오기 버튼 추가 */}
              <button 
                onClick={() => navigate('/simulator', { state: { recipe } })} 
                style={{ marginTop: 'auto', padding: '10px', backgroundColor: '#34495e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2c3e50'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#34495e'}
              >
                ✏️ 시뮬레이터로 불러오기
              </button>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;