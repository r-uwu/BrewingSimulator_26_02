import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BeerLoading from './BeerLoading';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [loadingRecipe, setLoadingRecipe] = useState(null);

  // 🎨 배경색(#333) 기반의 심플 & 클린 테마
  const theme = {
    bg: '#333333',          
    card: '#242424',        
    border: '#444444',      
    accent: '#FFFFFF',      
    textMain: '#F0F0F0',    
    textSub: '#A0A0A0',     
    textMuted: '#666666',   
    maltTag: '#F39C12',
    hopTag: '#2ECC71',
    dryHopTag: '#9B59B6',   // 드라이호핑 포인트 컬러
    yeastTag: '#E74C3C'
  };

  const handleLoadRecipe = (recipe) => {
    setLoadingRecipe(recipe);

    setTimeout(() => {
      navigate('/simulator', { state: { recipe } });
    }, 2000); 
  };

  if (loadingRecipe) {
    return (
      <BeerLoading 
        srm={loadingRecipe.srm} 
        message={`${loadingRecipe.name} 레시피를 준비 중입니다...`} 
      />
    );
  }


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

  if (loading) return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: theme.textSub, fontFamily: 'Mulmaru, sans-serif' }}>
      <h3 style={{ fontWeight: '400' }}>레시피를 불러오는 중입니다...</h3>
    </div>
  );

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', padding: '60px 0', fontFamily: 'Mulmaru, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px', animation: 'fadeIn 0.5s' }}>
        
        {/* 헤더 섹션 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: `1px solid ${theme.border}`, paddingBottom: '20px', marginBottom: '40px' }}>
          <div>
            <h2 style={{ color: theme.textMain, margin: '0 0 5px 0', fontSize: '1.8em', fontWeight: '700', letterSpacing: '-0.5px' }}>
              레시피 저장소
            </h2>
            <p style={{ color: theme.textSub, margin: 0, fontSize: '0.95em' }}>나만의 커스텀 양조 레시피 보관함</p>
          </div>
          <div style={{ color: theme.textSub, fontSize: '0.9em', fontWeight: '500' }}>
            총 <strong style={{ color: theme.accent }}>{recipes.length}</strong>개의 레시피
          </div>
        </div>

        {recipes.length === 0 ? (
          <div style={{ color: theme.textSub, textAlign: 'center', padding: '80px', backgroundColor: theme.card, borderRadius: '12px', border: `1px dashed ${theme.border}` }}>
            저장된 레시피가 없습니다.<br/>시뮬레이터에서 나만의 레시피를 만들어 보세요! 🍻
          </div>
        ) : (
          <div className="recipe-grid">
            {recipes.map(recipe => (
              <div key={recipe.id} className="recipe-card">
                
                {/* 카드 상단: 이름 및 뱃지 */}
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: theme.accent, fontSize: '1.3em', fontWeight: '700' }}>{recipe.name}</h3>
                  <div style={{ display: 'flex', gap: '6px', whiteSpace: 'nowrap' }}>
                    <span className="badge">{recipe.batchSizeLiters}L 배치</span>
                    <span className="badge">{recipe.durationDays}일 발효</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', whiteSpace: 'nowrap', marginTop: '4px'}}>
                    <span className="badge">{recipe.srm.toFixed(1)} SRM</span>
                    <span className="badge">{recipe.abv.toFixed(1)} ABV</span>
                    <span className="badge">{recipe.ibu.toFixed(1)} IBUs</span>
                    
                  </div>
                </div>
                
                {/* 재료 리스트 상세 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                  
                  {/* 몰트 섹션 */}
                  <div>
                    <div className="label">MALT</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {recipe.grains.map((g, idx) => (
                        <span key={idx} className="tag" style={{ color: theme.maltTag }}>{g.name}</span>
                      ))}
                    </div>
                  </div>

                  {/* 끓임 홉 섹션 */}
                  <div>
                    <div className="label">BOIL HOPS </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {recipe.hops && recipe.hops.length > 0 ? recipe.hops.map((h, idx) => (
                        <span key={idx} className="tag" style={{ color: theme.hopTag }}>{h.name}</span>
                      )) : <span className="none-text">없음</span>}
                    </div>
                  </div>

                  {/* 드라이 홉 섹션 (추가됨) */}
                  <div>
                    <div className="label">DRY HOPS</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {recipe.dryHops && recipe.dryHops.length > 0 ? recipe.dryHops.map((dh, idx) => (
                        <span key={idx} className="tag" style={{ color: theme.dryHopTag }}>{dh.name}</span>
                      )) : <span className="none-text">없음</span>}
                    </div>
                  </div>

                  {/* 효모 섹션 */}
                  <div>
                    <div className="label">YEAST</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {recipe.yeast ? (
                        <span className="tag" style={{ color: theme.yeastTag }}>{recipe.yeast.name}</span>
                      ) : <span className="none-text">없음</span>}
                    </div>
                  </div>
                </div>

                {/* 하단 버튼 */}
                <button 
                  className="simple-btn"
                  onClick={() => navigate('/simulator', { state: { recipe } })} 
                >
                  시뮬레이터로 불러오기
                </button>
                
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .recipe-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px;
        }

        .recipe-card {
          background-color: ${theme.card};
          border: 1px solid ${theme.border};
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          transition: transform 0.2s, border-color 0.2s;
        }

        .recipe-card:hover {
          transform: translateY(-5px);
          border-color: #555;
        }

        .badge {
          border: 1px solid ${theme.border};
          color: ${theme.textSub};
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75em;
          font-weight: 600;
          background-color: rgba(255,255,255,0.02);
        }

        .label {
          font-size: 0.7em;
          color: ${theme.textMuted};
          font-weight: 800;
          margin-bottom: 6px;
          letter-spacing: 0.8px;
        }

        .tag {
          font-size: 0.9em;
          font-weight: 500;
        }

        .tag::after {
          content: ',';
          color: #555;
          margin-left: 2px;
        }
        .tag:last-child::after {
          content: '';
        }

        .none-text {
          color: #444;
          font-size: 0.85em;
          font-style: italic;
        }

        .simple-btn {
          margin-top: 25px;
          padding: 14px;
          background-color: ${theme.border};
          color: ${theme.textMain};
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95em;
          font-family: 'Mulmaru', sans-serif;
          transition: all 0.2s;
        }

        .simple-btn:hover {
          background-color: #555;
          transform: scale(1.02);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default RecipeList;