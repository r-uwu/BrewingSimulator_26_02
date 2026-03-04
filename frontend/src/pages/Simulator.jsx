import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // 🌟 useNavigate 추가
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'; 
import BeerLoading from './BeerLoading';

function Simulator() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [dbIngredients, setDbIngredients] = useState({ grains: [], hops: [], yeasts: [] });

  const location = useLocation();
  const navigate = useNavigate(); // 🌟 네비게이션 함수 선언

  const [recipeData, setRecipeData] = useState({
    batchSizeLiters: 20.0,
    efficiency: 0.73,
    durationDays: 14,
    grains: [{ name: "", weightKg: 0.0 }],
    hops: [{ name: "", amountGrams: 0.0, boilTimeMinutes: 60 }],
    yeast: { name: "", amount: 0.0 },
    dryHops: [],
    tempSchedule: { initialTemp: 20.0, steps: [] }
  });

  const colors = {
    bgMain: '#333333',       
    bgCard: '#242424',       
    bgInput: '#1A1A1A',      
    cardBorder: '#444444',   
    beerGold: '#F5A623',     
    hopGreen: '#2ECC71',     
    textMain: '#F0F0F0',     
    textSub: '#A0A0A0',      
    danger: '#E74C3C',       
    info: '#3498DB'          
  };

  const [initialLoading, setInitialLoading] = useState(!!location.state?.recipe);

  useEffect(() => {
  if (location.state && location.state.recipe) {

    const loadedRecipe = location.state.recipe;
    setRecipeData({
      ...recipeData,
      batchSizeLiters: loadedRecipe.batchSizeLiters || 20.0,
      grains: loadedRecipe.grains || [],
      hops: loadedRecipe.hops || [],
      yeast: loadedRecipe.yeast || { name: "", amount: 0.0 },
      durationDays: loadedRecipe.durationDays || 14
    });


    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }
}, [location.state]);

  useEffect(() => {
    if (location.state && location.state.recipe) {
      const loadedRecipe = location.state.recipe;
      setRecipeData({
        batchSizeLiters: loadedRecipe.batchSizeLiters || 20.0,
        efficiency: 0.73,
        durationDays: loadedRecipe.durationDays || 14,
        grains: loadedRecipe.grains && loadedRecipe.grains.length > 0 ? loadedRecipe.grains : [{ name: "", weightKg: 0.0 }],
        hops: loadedRecipe.hops && loadedRecipe.hops.length > 0 ? loadedRecipe.hops : [{ name: "", amountGrams: 0.0, boilTimeMinutes: 60 }],
        yeast: loadedRecipe.yeast || { name: "", amount: 0.0 },
        dryHops: loadedRecipe.dryHops ? loadedRecipe.dryHops.map(dh => ({ name: dh.name, amountGrams: dh.amountGrams, hour: dh.insertDay })) : [],
        tempSchedule: loadedRecipe.tempSchedule || { initialTemp: 20.0, steps: [] }
      });
    }
  }, [location.state]);

  useEffect(() => {
    fetch('http://localhost:8080/api/brewing/ingredients')
      .then(res => res.json())
      .then(data => {
        setDbIngredients(data);
        if (!location.state?.recipe) {
          if (data.grains.length > 0 && data.hops.length > 0 && data.yeasts.length > 0) {
            setRecipeData(prev => ({
              ...prev,
              grains: [{ name: data.grains[0].name, weightKg: 0.0 }],
              hops: [{ name: data.hops[0].name, amountGrams: 0.0, boilTimeMinutes: 60 }],
              yeast: { name: data.yeasts[0].name, amount: 0.0 }
            }));
          }
        }
      })
      .catch(err => console.error("재료 목록 로딩 실패:", err));
  }, [location.state?.recipe]);

  const addItem = (listName, defaultItem) => {
    setRecipeData({ ...recipeData, [listName]: [...recipeData[listName], defaultItem] });
  };

  const removeItem = (listName, index) => {
    const newList = [...recipeData[listName]];
    newList.splice(index, 1);
    setRecipeData({ ...recipeData, [listName]: newList });
  };

  const handleArrayChange = (listName, index, field, value) => {
    const newList = [...recipeData[listName]];
    newList[index][field] = (field === 'name') ? value : (parseFloat(value) || 0);
    setRecipeData({ ...recipeData, [listName]: newList });
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/brewing/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData) 
      });
      if (!response.ok) throw new Error(`서버 에러`);
      const data = await response.json();
      setResult(data);
    } catch (error) { alert(error.message); } finally { setLoading(false); }
  };

  const saveRecipe = async () => {
    const recipeName = prompt("저장할 레시피 이름을 입력하세요:", "나의 커스텀 레시피");
    if (!recipeName) return; 
    setIsSaving(true);
    try {
      const simResponse = await fetch('http://localhost:8080/api/brewing/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData)
      });

      if (!simResponse.ok) throw new Error("분석 중 오류가 발생했습니다.");
      const simResult = await simResponse.json();

      const saveData = {
        ...recipeData,
        srm: simResult.srm,
        ibu: simResult.ibu,
        abv: simResult.estimatedAbv

      };

      const response = await fetch(`http://localhost:8080/api/brewing/save?recipeName=${encodeURIComponent(recipeName)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      });
      const msg = await response.text();
      alert(msg); 
    } catch (error) { alert(error.message); } finally { setIsSaving(false); }
  };

  const srmToColor = (srm) => {
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
      if (diff < minDiff) { minDiff = diff; closestSrm = definedSrms[i]; }
    }
    return srmColors[closestSrm];
  };

  const darkCardStyle = {
    backgroundColor: colors.bgCard, 
    color: colors.textMain, 
    padding: '30px', 
    borderRadius: '16px', 
    marginBottom: '20px', 
    border: `1px solid ${colors.cardBorder}`,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    fontFamily: '"Mulmaru", sans-serif'
  };

  const darkInputStyle = {
    backgroundColor: colors.bgInput, 
    color: colors.textMain, 
    border: `1px solid ${colors.cardBorder}`, 
    padding: '10px 12px', 
    borderRadius: '8px',
    outline: 'none',
    width: '100%',
    fontFamily: '"Mulmaru", sans-serif'
  };

  const btnStyle = { 
    padding: '8px 16px', 
    marginLeft: '10px', 
    cursor: 'pointer', 
    borderRadius: '8px', 
    border: 'none', 
    fontWeight: 'bold',
    fontFamily: '"Mulmaru", sans-serif'
  };
  
  const deleteBtnStyle = { ...btnStyle, backgroundColor: colors.bgMain, color: colors.textSub, padding: '8px 12px' };

  if (initialLoading) {
  return (
    <BeerLoading 
      srm={location.state.recipe.srm} 
      message={`${location.state.recipe?.name} 레시피를 분석 중...`} 
    />
  );
}

  return (
    <div style={{ 
      width: '100%', 
      backgroundColor: colors.bgMain, 
      minHeight: '100vh', 
      padding: '60px 0', 
      fontFamily: '"Mulmaru", sans-serif', // 🌟 전체 폰트 적용
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-start'  
    }}>
      <div style={{ width: '90%', maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* 🌟 [NEW] RecipeList와 통일된 헤더 섹션 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          borderBottom: `1px solid ${colors.cardBorder}`, 
          paddingBottom: '20px', 
          marginBottom: '20px' 
        }}>
          <div>
            <h2 style={{ color: colors.textMain, margin: '0 0 5px 0', fontSize: '1.8em', fontWeight: '700', letterSpacing: '-0.5px' }}>
              브루잉 시뮬레이터
            </h2>
            <p style={{ color: colors.textSub, margin: 0, fontSize: '0.95em' }}>나만의 레시피를 설계하고 발효 과정을 예측해보세요.</p>
          </div>
          <button 
            onClick={() => navigate('/recipes')} // 🌟 저장소 이동
            style={{ 
              padding: '16px 20px', 
              backgroundColor: colors.cardBorder, 
              color: colors.textMain, 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: '700',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#555'}
            onMouseOut={(e) => e.target.style.backgroundColor = colors.cardBorder}
          >
            📂 레시피 불러오기
          </button>
        </div>

        {/* 📝 레시피 설계 카드 */}
        <div style={darkCardStyle}>
          <h3 style={{ color: colors.textMain, borderBottom: `2px solid ${colors.cardBorder}`, paddingBottom: '15px', marginTop: 0, fontWeight: '700' }}>
            📝 레시피 설계
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '40px', marginBottom: '30px', marginTop: '25px'}}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: colors.textSub, fontSize: '0.9em', fontWeight: '600' }}>
              배치 용량(L)
              <input type="number" value={recipeData.batchSizeLiters} onChange={e => setRecipeData({...recipeData, batchSizeLiters: parseFloat(e.target.value) || 0})} style={darkInputStyle} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: colors.textSub, fontSize: '0.9em', fontWeight: '600' }}>
              매쉬 효율(%)
              <input type="number" step="0.01" value={recipeData.efficiency} onChange={e => setRecipeData({...recipeData, efficiency: parseFloat(e.target.value) || 0})} style={darkInputStyle} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: colors.textSub, fontSize: '0.9em', fontWeight: '600', marginRight : '25px' }}>
              총 발효 기간(일)
              <input type="number" step="1" value={recipeData.durationDays} onChange={e => setRecipeData({...recipeData, durationDays: parseInt(e.target.value) || 0})} style={darkInputStyle} />
            </label>
          </div>

          <hr style={{ borderColor: colors.cardBorder, margin: '25px 0' }}/>

          {/* 🌾 몰트 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h4 style={{ margin: 0, color: colors.beerGold, fontSize: '1.2em' }}>🌾 베이스 & 특수 몰트</h4>
            <button style={{...btnStyle, backgroundColor: '#E8860B', color: '#fff'}} onClick={() => addItem('grains', { name: dbIngredients.grains[0]?.name || "", weightKg: 1.0 })}>+ 몰트 추가</button>
          </div>
          {recipeData.grains.map((grain, index) => (
            <div key={`grain-${index}`} style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
              <select value={grain.name} onChange={(e) => handleArrayChange('grains', index, 'name', e.target.value)} style={{ ...darkInputStyle, marginRight: '15px', flex: 2 }}>
                {dbIngredients.grains.map(g => <option key={`g-${g.id}`} value={g.name}>{g.name}</option>)}
              </select>
              <input type="number" step="0.1" value={grain.weightKg} onChange={(e) => handleArrayChange('grains', index, 'weightKg', e.target.value)} style={{ ...darkInputStyle, width: '90px', marginRight: '5px', textAlign: 'right' }} /> 
              <span style={{ color: colors.textSub, width: '30px' }}>kg</span>
              {index > 0 ? <button style={deleteBtnStyle} onClick={() => removeItem('grains', index)}>✕</button> : <div style={{ width: '42px', marginLeft: '10px' }}></div>}
            </div>
          ))}

          <hr style={{ borderColor: colors.cardBorder, margin: '25px 0' }}/>

          {/* 🌿 보일링 홉 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h4 style={{ margin: 0, color: colors.hopGreen, fontSize: '1.2em' }}>🌿 끓임 홉 (Boil Hops)</h4>
            <button style={{...btnStyle, backgroundColor: '#27AE60', color: '#fff'}} onClick={() => addItem('hops', { name: dbIngredients.hops[0]?.name || "", amountGrams: 10, boilTimeMinutes: 60 })}>+ 홉 추가</button>
          </div>
          {recipeData.hops.map((hop, index) => (
            <div key={`hop-${index}`} style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
              <select value={hop.name} onChange={(e) => handleArrayChange('hops', index, 'name', e.target.value)} style={{ ...darkInputStyle, marginRight: '15px', flex: 2 }}>
                {dbIngredients.hops.map(h => <option key={`h-${h.id}`} value={h.name}>{h.name}</option>)}
              </select>
              <input type="number" step="1" value={hop.amountGrams} onChange={(e) => handleArrayChange('hops', index, 'amountGrams', e.target.value)} style={{ ...darkInputStyle, width: '80px', marginRight: '5px', textAlign: 'right' }} /> 
              <span style={{ color: colors.textSub, width: '20px' }}>g</span>
              <span style={{ margin: '0 10px', color: colors.textSub }}>@</span>
              <input type="number" step="1" value={hop.boilTimeMinutes} onChange={(e) => handleArrayChange('hops', index, 'boilTimeMinutes', e.target.value)} style={{ ...darkInputStyle, width: '80px', marginLeft: '5px', marginRight: '5px', textAlign: 'right' }} /> 
              <span style={{ color: colors.textSub, width: '25px' }}>분</span>
              {index > 0 ? <button style={deleteBtnStyle} onClick={() => removeItem('hops', index)}>✕</button> : <div style={{ width: '42px', marginLeft: '10px' }}></div>}
            </div>
          ))}

          <hr style={{ borderColor: colors.cardBorder, margin: '25px 0' }}/>

          {/* 🌱 드라이홉 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h4 style={{ margin: 0, color: '#9B59B6', fontSize: '1.2em' }}>🌱 드라이 호핑 (Dry Hops)</h4>
            <button style={{...btnStyle, backgroundColor: '#8E44AD', color: '#fff'}} onClick={() => addItem('dryHops', { name: dbIngredients.hops[0]?.name || "", amountGrams: 30, hour: 0 })}>+ 드라이홉 추가</button>
          </div>
          {recipeData.dryHops.length === 0 && <div style={{fontSize: '0.9em', color: colors.textSub, fontStyle: 'italic', paddingLeft: '10px'}}>적용된 드라이홉이 없습니다.</div>}
          {recipeData.dryHops.map((dh, index) => (
            <div key={`dh-${index}`} style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
              <select value={dh.name} onChange={(e) => handleArrayChange('dryHops', index, 'name', e.target.value)} style={{ ...darkInputStyle, marginRight: '15px', flex: 2 }}>
                {dbIngredients.hops.map(h => <option key={`dhop-${h.id}`} value={h.name}>{h.name}</option>)}
              </select>
              <input type="number" step="1" value={dh.amountGrams} onChange={(e) => handleArrayChange('dryHops', index, 'amountGrams', e.target.value)} style={{ ...darkInputStyle, width: '80px', marginRight: '5px', textAlign: 'right' }} /> 
              <span style={{ color: colors.textSub, width: '20px' }}>g</span>
              <span style={{ margin: '0 15px 0 10px', color: colors.textSub }}>(투입:</span>
              <input type="number" step="1" value={dh.hour} onChange={(e) => handleArrayChange('dryHops', index, 'hour', e.target.value)} style={{ ...darkInputStyle, width: '80px', marginRight: '5px', textAlign: 'right' }} /> 
              <span style={{ color: colors.textSub }}>일차)</span>
              <button style={deleteBtnStyle} onClick={() => removeItem('dryHops', index)}>✕</button>
            </div>
          ))}

          <hr style={{ borderColor: colors.cardBorder, margin: '25px 0' }}/>

          {/* 🦠 효모 */}
          <h4 style={{ margin: '0 0 15px 0', color: colors.danger, fontSize: '1.2em' }}>🦠 효모 (Yeast)</h4>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <select value={recipeData.yeast.name} onChange={(e) => setRecipeData({...recipeData, yeast: {...recipeData.yeast, name: e.target.value}})} style={{ ...darkInputStyle, marginRight: '15px', flex: 1 }}>
              {dbIngredients.yeasts.map(y => <option key={`y-${y.id}`} value={y.name}>{y.name}</option>)}
            </select>
            <input type="number" step="0.1" value={recipeData.yeast.amount} onChange={(e) => setRecipeData({...recipeData, yeast: {...recipeData.yeast, amount: parseFloat(e.target.value) || 0}})} style={{ ...darkInputStyle, width: '90px', marginRight: '5px', textAlign: 'right' }} /> 
            <span style={{ color: colors.textSub }}>g</span>
          </div>

          <hr style={{ borderColor: colors.cardBorder, margin: '25px 0' }}/>

          {/* 🌡️ 온도 스케줄 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h4 style={{ margin: 0, color: colors.info, fontSize: '1.2em' }}>🌡️ 발효 온도 스케줄</h4>
            <button style={{...btnStyle, backgroundColor: '#2980B9', color: '#fff'}} onClick={() => {
              const defaultDay = recipeData.durationDays > 3 ? recipeData.durationDays - 3 : Math.floor(recipeData.durationDays / 2);
              const newSteps = [...recipeData.tempSchedule.steps, { hour: defaultDay, targetTemp: 15.0 }];
              setRecipeData({...recipeData, tempSchedule: {...recipeData.tempSchedule, steps: newSteps}});
            }}>+ 온도 변경 추가</button>
          </div>

          <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', backgroundColor: colors.bgInput, padding: '15px', borderRadius: '12px', borderLeft: `4px solid ${colors.info}` }}>
            <span style={{ color: '#fff', fontWeight: 'bold', marginRight: '15px', minWidth: '80px' }}>▶ 기본 발효</span>
            <input type="number" step="0.1" value={recipeData.tempSchedule.initialTemp} onChange={(e) => setRecipeData({...recipeData, tempSchedule: {...recipeData.tempSchedule, initialTemp: parseFloat(e.target.value) || 0}})} style={{ ...darkInputStyle, width: '90px', marginRight: '5px', textAlign: 'right', backgroundColor: colors.bgCard }} /> 
            <span style={{color: colors.textSub, fontWeight: 'bold'}}>°C</span>
            <span style={{ margin: '0 15px', color: colors.textSub, fontSize: '0.9em' }}>(0일차부터 시작)</span>
          </div>

          {recipeData.tempSchedule.steps.map((step, index) => (
            <div key={`temp-${index}`} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
              <span style={{ color: colors.textSub, marginRight: '15px', fontSize: '1.2em' }}>↳</span>
              <input type="number" step="1" value={step.hour} onChange={(e) => {
                const newSteps = [...recipeData.tempSchedule.steps];
                newSteps[index].hour = parseInt(e.target.value) || 0;
                setRecipeData({...recipeData, tempSchedule: {...recipeData.tempSchedule, steps: newSteps}});
              }} style={{ ...darkInputStyle, width: '80px', marginRight: '8px', textAlign: 'right', color: colors.beerGold, fontWeight: 'bold' }} /> 
              <span style={{ color: colors.textSub, marginRight: '20px' }}>일차부터</span>
              <input type="number" step="0.1" value={step.targetTemp} onChange={(e) => {
                const newSteps = [...recipeData.tempSchedule.steps];
                newSteps[index].targetTemp = parseFloat(e.target.value) || 0;
                setRecipeData({...recipeData, tempSchedule: {...recipeData.tempSchedule, steps: newSteps}});
              }} style={{ ...darkInputStyle, width: '90px', marginRight: '8px', textAlign: 'right', color: colors.danger, fontWeight: 'bold' }} /> 
              <span style={{color: colors.textSub}}>°C 로 변경</span>
              <button style={{...deleteBtnStyle, marginLeft: '15px'}} onClick={() => {
                const newSteps = [...recipeData.tempSchedule.steps];
                newSteps.splice(index, 1);
                setRecipeData({...recipeData, tempSchedule: {...recipeData.tempSchedule, steps: newSteps}});
              }}>✕</button>
            </div>
          ))}

        </div>

        {/* 🔘 액션 버튼 영역 */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', margin: '20px 0 40px 0' }}>
          <button onClick={runSimulation} disabled={loading || isSaving} style={{ 
            padding: '16px 32px', fontSize: '1.1em', backgroundColor: colors.beerGold, border: 'none', borderRadius: '12px', 
            color: '#111', fontWeight: '800', fontFamily: 'inherit',
            boxShadow: `0 4px 15px ${colors.beerGold}40`, transition: 'all 0.2s', cursor: 'pointer'
          }}>
            {loading ? '⏳ 분석 중...' : '🚀 발효 시뮬레이션 가동'}
          </button>

          <button onClick={saveRecipe} disabled={loading || isSaving} style={{ 
            padding: '16px 32px', fontSize: '1.1em', backgroundColor: colors.hopGreen, border: 'none', borderRadius: '12px', 
            color: '#111', fontWeight: '800', fontFamily: 'inherit',
            boxShadow: `0 4px 15px ${colors.hopGreen}40`, transition: 'all 0.2s', cursor: 'pointer'
          }}>
            {isSaving ? '💾 저장 중...' : '💾 내 일지에 레시피 저장'}
          </button>
        </div>

        {/* --- 📊 시뮬레이션 결과 화면 --- */}
        {result && result.logs && (
          <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
            <div style={{ ...darkCardStyle, borderColor: colors.cardBorder }}>
              <h2 style={{ marginTop: 0, color: colors.textMain, borderBottom: `2px solid ${colors.cardBorder}`, paddingBottom: '15px', fontWeight: '800' }}>
                📊 레시피 분석 리포트
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '25px', fontSize: '1.1em', color: colors.textSub, marginTop: '25px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <span style={{ fontSize: '0.85em', fontWeight: 'bold' }}>초기 비중 (OG)</span>
                  <span style={{ color: colors.beerGold, fontSize: '1.4em', fontWeight: '800' }}>{result.originalGravity.toFixed(4)}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <span style={{ fontSize: '0.85em', fontWeight: 'bold' }}>목표 비중 (FG)</span>
                  <span style={{ color: colors.beerGold, fontSize: '1.4em', fontWeight: '800' }}>{result.finalGravity.toFixed(4)}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <span style={{ fontSize: '0.85em', fontWeight: 'bold' }}>예상 알코올 (ABV)</span>
                  <span style={{ color: colors.danger, fontSize: '1.4em', fontWeight: '800' }}>{result.estimatedAbv.toFixed(1)}%</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <span style={{ fontSize: '0.85em', fontWeight: 'bold' }}>쓴맛 (IBU)</span>
                  <span style={{ color: colors.textMain, fontSize: '1.4em', fontWeight: '800' }}>{result.ibu.toFixed(1)}</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <span style={{ fontSize: '0.85em', fontWeight: 'bold' }}>색상 (SRM)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '6px', backgroundColor: srmToColor(result.srm),
                      border: `2px solid ${colors.cardBorder}`, display: 'inline-block', boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                    }}></div>
                    <span style={{ color: colors.textMain, fontSize: '1.4em', fontWeight: '800' }}>{result.srm.toFixed(1)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <span style={{ fontSize: '0.85em', fontWeight: 'bold' }}>BU:GU 비율</span>
                  <div>
                    <span style={{ color: colors.textMain, fontSize: '1.4em', fontWeight: '800' }}>{result.buGuRatio.toFixed(2)}</span>
                    <span style={{ fontSize: '0.8em', color: colors.hopGreen, marginLeft: '8px', fontWeight: 'bold' }}>{result.balanceProfile}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: `1px dashed ${colors.cardBorder}`, display: 'flex', gap: '40px', color: colors.textSub, fontSize: '0.95em' }}>
                <p style={{ margin: 0 }}>🌱 드라이 홉 투입률: <strong style={{color: colors.textMain}}>{result.dryHopRate.toFixed(1)} g/L</strong></p>
                <p style={{ margin: 0 }}>🦠 효모 피칭률: <strong style={{color: colors.textMain}}>{result.pitchRate.toFixed(2)} g/L</strong></p>
              </div>

              {/* 플레이버 태그 요약 */}
              {result.logs && result.logs.length > 0 && (
                <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: `1px solid ${colors.cardBorder}` }}>
                  <h4 style={{ margin: '0 0 10px 0', color: colors.textSub, fontSize: '0.9em', fontWeight: 'bold' }}>✨ 예상 향미 프로필 (Flavor Profile)</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {result.logs[result.logs.length - 1].flavorTags && result.logs[result.logs.length - 1].flavorTags.length > 0 ? (
                      result.logs[result.logs.length - 1].flavorTags.map((tag, idx) => (
                        <span key={idx} style={{ 
                          backgroundColor: colors.bgInput, color: colors.hopGreen, 
                          padding: '6px 12px', borderRadius: '20px', fontSize: '0.85em', fontWeight: 'bold',
                          border: `1px solid ${colors.hopGreen}40`
                        }}>
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: colors.textSub, fontSize: '0.9em' }}>특별히 감지된 향미 태그가 없습니다.</span>
                    )}
                  </div>
                </div>
              )}
            </div>
{/* 🌟 3. [NEW] 한눈에 보는 발효 타임라인 그래프 🌟 */}
            <h3 style={{ color: colors.textMain, marginTop: '40px', marginBottom: '15px', fontWeight: '700' }}>📈 발효 비중 및 온도 추이</h3>
            <div style={{ 
              backgroundColor: colors.bgCard,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '12px',
              padding: '30px 20px 10px 0',
              marginBottom: '30px',
              height: '400px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.logs.filter(log => log.hour >= 24 && log.hour <= recipeData.durationDays * 24)} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                  
                  {/* 🌟 수정: ticks 속성에 24시간 단위의 배열을 직접 계산해서 넣음으로써 정확히 일수대로 칸이 나뉘게 강제함 */}
                  <XAxis 
                    type="number"
                    dataKey="hour" 
                    domain={[24, recipeData.durationDays * 24]}
                    ticks={Array.from({ length: recipeData.durationDays }, (_, i) => (i + 1) * 24)}
                    tickFormatter={(tick) => `${tick / 24}d`} 
                    stroke={colors.textSub} 
                    tick={{ fill: colors.textSub, fontSize: 12 }}
                  />
                  
                  <YAxis 
                    yAxisId="gravity" 
                    domain={[1.01, (dataMax) => dataMax + 0.002]} 
                    stroke={colors.beerGold} 
                    tickFormatter={(val) => val.toFixed(3)}
                    tick={{ fill: colors.beerGold, fontSize: 12 }}
                  />
                  
                  <YAxis 
                    yAxisId="temp" 
                    orientation="right" 
                    domain={[(dataMin) => dataMin - 2, (dataMax) => dataMax + 2]}
                    stroke={colors.info} 
                    tick={{ fill: colors.info, fontSize: 12 }}
                  />

                  <YAxis 
                    yAxisId="abv" 
                    orientation="right" 
                    domain={[0, 'dataMax + 1']}
                    hide={true} 
                  />

                  <Tooltip 
                    contentStyle={{ backgroundColor: colors.bgInput, border: `1px solid ${colors.cardBorder}`, color: colors.textMain, borderRadius: '8px' }}
                    labelFormatter={(label) => `${label / 24}일 차`}
                  />
                  <Legend wrapperStyle={{ paddingTop: '15px' }} />

                  <ReferenceLine y={result.originalGravity} yAxisId="gravity" stroke={colors.textSub} strokeDasharray="3 3" label={{ position: 'top', value: `OG: ${result.originalGravity.toFixed(3)}`, fill: colors.textSub, fontSize: 12 }} />
                  <ReferenceLine y={result.finalGravity} yAxisId="gravity" stroke={colors.hopGreen} strokeDasharray="3 3" label={{ position: 'bottom', value: `FG: ${result.finalGravity.toFixed(3)}`, fill: colors.hopGreen, fontSize: 12 }} />

                  <Line yAxisId="gravity" type="monotone" dataKey="gravity" name="비중 (Gravity)" stroke={colors.beerGold} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  <Line yAxisId="temp" type="stepAfter" dataKey="temperature" name="온도 (°C)" stroke={colors.info} strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  <Line yAxisId="abv" type="monotone" dataKey="abv" name="알코올 (ABV %)" stroke={colors.danger} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 🌟 4-1. [NEW] 발효 이전 (양조) 타임라인 로그 */}
            <h3 style={{ color: colors.textMain, marginTop: '40px', marginBottom: '15px', fontWeight: '700' }}>🔥 발효 이전 매싱 & 보일링 타임라인</h3>
            <div style={{ 
              maxHeight: '250px', overflowY: 'auto', border: `1px solid ${colors.cardBorder}`, 
              borderRadius: '12px', padding: '15px 25px', backgroundColor: colors.bgInput, 
              boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)', marginBottom: '30px'
            }}>
              {result.logs.filter(log => log.hour < 0).map((log, index) => (
                <div key={`pre-${index}`} style={{ 
                  padding: '12px 0', 
                  borderBottom: index === result.logs.filter(l => l.hour < 0).length - 1 ? 'none' : `1px dashed ${colors.cardBorder}`, 
                  display: 'flex', gap: '25px', color: colors.textSub, alignItems: 'center' 
                }}>
                  <div style={{ fontWeight: '800', color: colors.textMain, minWidth: '70px', fontSize: '1.1em' }}>
                    {log.hour}h
                  </div>
                  <div style={{ minWidth: '70px', color: '#E67E22', fontWeight: '700' }}>{log.temperature}°C</div>
                  <div style={{ minWidth: '130px' }}>Gravity <strong style={{color: colors.beerGold}}>{log.gravity.toFixed(4)}</strong></div>
                  
                  <div style={{ color: colors.textSub, fontSize: '0.95em', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    ▶ {log.phase}
                  </div>
                </div>
              ))}
            </div>

            {/* 🌟 4-2. [NEW] 발효 타임라인 로그 */}
            <h3 style={{ color: colors.textMain, marginTop: '20px', marginBottom: '15px', fontWeight: '700' }}>⏱️ 발효 타임라인 로그</h3>
            <div style={{ 
              maxHeight: '400px', overflowY: 'auto', border: `1px solid ${colors.cardBorder}`, 
              borderRadius: '12px', padding: '15px 25px', backgroundColor: colors.bgInput, 
              boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)' 
            }}>
              {result.logs.filter(log => log.hour >= 0 && log.hour <= recipeData.durationDays * 24).map((log, index) => (
                <div key={`ferm-${index}`} style={{ 
                  padding: '16px 0', 
                  borderBottom: index === result.logs.filter(l => l.hour >= 0 && l.hour <= recipeData.durationDays * 24).length - 1 ? 'none' : `1px solid ${colors.cardBorder}`, 
                  display: 'flex', gap: '25px', color: colors.textSub, alignItems: 'center' 
                }}>
                  <div style={{ fontWeight: '800', color: colors.beerGold, minWidth: '70px', fontSize: '1.1em' }}>
                    {log.hour === 0 ? `0h` : `${log.hour / 24} Day`}
                  </div>
                  <div style={{ minWidth: '70px', color: colors.info, fontWeight: '700' }}>{log.temperature}°C</div>
                  <div style={{ minWidth: '130px' }}>Gravity <strong style={{color: colors.textMain}}>{log.gravity.toFixed(4)}</strong></div>
                  <div style={{ minWidth: '100px' }}>ABV <strong style={{color: colors.danger}}>{log.abv.toFixed(1)}%</strong></div>
                  
                  <div style={{ color: colors.textSub, fontSize: '0.95em', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    ▶ {log.phase}
                  </div>
                </div>
              ))}

              

              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Simulator;