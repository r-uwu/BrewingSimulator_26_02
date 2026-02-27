import { useState, useEffect } from 'react'

function Simulator() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)


  const [dbIngredients, setDbIngredients] = useState({ grains: [], hops: [], yeasts: [] });


  useEffect(() => {
    console.log("simul mounted");
  },[]


);

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
  


  //컴포넌트 첫 렌더링 때 백엔드에서 재료 목록 싹 다 가져오기
  useEffect(() => {
    fetch('http://localhost:8080/api/brewing/ingredients')
      .then(res => res.json())
      .then(data => {
        setDbIngredients(data);
        
        if (data.grains.length > 0 && data.hops.length > 0 && data.yeasts.length > 0) {
          setRecipeData(prev => ({
            ...prev,
            grains: [{ name: data.grains[0].name, weightKg: 0.0 }],
            hops: [{ name: data.hops[0].name, amountGrams: 0.0, boilTimeMinutes: 60 }],
            yeast: { name: data.yeasts[0].name, amount: 0.0 }
          }));
        }
      })
      .catch(err => console.error("재료 목록 로딩 실패:", err));
  }, []);

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

    const handleGrainChange = (index, field, value) => {
    const newGrains = [...recipeData.grains];
    newGrains[index][field] = field === 'weightKg' ? parseFloat(value) || 0 : value;
    setRecipeData({ ...recipeData, grains: newGrains });
  };

    const handleHopChange = (index, field, value) => {
    const newHops = [...recipeData.hops];
    newHops[index][field] = field === 'name' ? value : parseFloat(value) || 0;
    setRecipeData({ ...recipeData, hops: newHops });
  };


/*
  const runSimulation = async () => {
    setLoading(true);
    
    const payload = {
      batchSizeLiters: 20.0,
      efficiency: 0.70,
      durationDays: 14,
      grains: [
        { name: "Pilsner", weightKg: 4.0 },
        { name: "Wheat", weightKg: 1.0 }
      ],
      hops: [
        { name: "Magnum", amountGrams: 5.0, boilTimeMinutes: 60 },
        { name: "Citra", amountGrams: 20.0, boilTimeMinutes: 0 }
      ],
      yeast: { name: "SafAle US-05", amount: 11.5 },
      dryHops: [
        { hour: 48, name: "Citra", amountGrams: 50.0 }
      ],
      tempSchedule: {
        initialTemp: 20.0,
        steps: [ { hour: 240, targetTemp: 15.0 } ]
      }
    };
    */
  

  const runSimulation = async () => {
    setLoading(true);
    try {
 
      const response = await fetch('http://localhost:8080/api/brewing/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData) 
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`서버 에러 발생: ${errorText}`);
      }
      
      const data = await response.json();
      setResult(data);
      
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };







    

  /*
    try {
      const response = await fetch('http://localhost:8080/api/brewing/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("서버 통신 에러!");
      
      const data = await response.json();
      console.log("백엔드 데이터 성공적으로 도착!", data);
      
      //새로 만든 ResponseDto 객체 그대로 저장
      setResult(data);
      
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const saveRecipe = async () => {

  const recipeName = prompt("저장할 레시피 이름을 입력하세요:", "나의 첫 DDH NEIPA");
    if (!recipeName) return;

    setIsSaving(true);

    // 시뮬레이션 때 썼던 payload 재활용
    const payload = {
      batchSizeLiters: 20.0,
      efficiency: 0.70,
      durationDays: 14,
      grains: [
        { name: "Pilsner", weightKg: 4.0 },
        { name: "Wheat", weightKg: 1.0 }
      ],
      hops: [
        { name: "Magnum", amountGrams: 5.0, boilTimeMinutes: 60 },
        { name: "Citra", amountGrams: 20.0, boilTimeMinutes: 0 }
      ],
      yeast: { name: "SafAle US-05", amount: 11.5 },
      dryHops: [
        { hour: 48, name: "Citra", amountGrams: 50.0 }
      ],
      tempSchedule: {
        initialTemp: 20.0,
        steps: [ { hour: 240, targetTemp: 15.0 } ]
      }
    };

    try {
      //방금 백엔드에 만든 /save 엔드포인트로 전송
      //(?recipeName=파라미터 포함)
      const response = await fetch(`http://localhost:8080/api/brewing/save?recipeName=${encodeURIComponent(recipeName)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`저장 실패: ${errorText}`);
      }
      
      const msg = await response.text();
      alert(msg);
      
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsSaving(false);
    }

  }
    */

  const saveRecipe = async () => {
    const recipeName = prompt("저장할 레시피 이름을 입력하세요:", "나의 커스텀 레시피");
    if (!recipeName) return; 

    setIsSaving(true);
    try {

      const response = await fetch(`http://localhost:8080/api/brewing/save?recipeName=${encodeURIComponent(recipeName)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`저장 실패: ${errorText}`);
      }
      
      const msg = await response.text();
      alert(msg); 
      
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- [New] SRM 수치를 실제 HEX 색상으로 변환하는 테이블 lookup 함수 ---
  const srmToColor = (srm) => {
    // 공통 SRM 대 RGB 매핑 테이블 (근사값)
    const colors = {
      0: '#FFFFE0', // Very light, close to white
      1: '#FFFFBF', // Pale straw
      2: '#FFFF80', // Straw
      3: '#FFFF40', // Deep straw
      4: '#FFD700', // Gold
      5: '#FFC000', // Deep gold
      6: '#FFA500', // Orange-ish, pale amber
      7: '#FF8C00', // Amber
      8: '#FF4500', // Deep amber
      9: '#D2691E', // Copper
      10: '#B87333', // Deep copper
      11: '#A0522D', // Pale brown
      12: '#8B4513', // Brown
      13: '#704214', // Deep brown
      14: '#5D4037', // Pale black / very deep brown
      15: '#3E2723', // Black / coffee
      20: '#1A1A1A', // Jet black
      25: '#000000', // Pitch black
      30: '#000000',
      35: '#000000',
      40: '#000000' // Darkest
    };

    // 범위를 벗어난 값 처리
    if (srm <= 0) return colors[0];
    if (srm >= 40) return colors[40];

    // 정의된 가장 가까운 SRM 값 찾기
    const definedSrms = Object.keys(colors).map(Number).sort((a, b) => a - b);
    let closestSrm = definedSrms[0];
    let minDiff = Math.abs(srm - closestSrm);

    for (let i = 1; i < definedSrms.length; i++) {
      const diff = Math.abs(srm - definedSrms[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closestSrm = definedSrms[i];
      }
    }
    return colors[closestSrm];
  };

  // --- UI 컴포넌트 편의 스타일 (다크모드용) ---
  const darkCardStyle = {
    backgroundColor: '#1e1e1e', // 어두운 회색 배경
    color: '#e0e0e0',           // 밝은 회색 텍스트
    padding: '20px', 
    borderRadius: '12px', 
    marginBottom: '20px', 
    border: '1px solid #333',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
    transition: 'all 0.3s ease-in-out' // 🌟 부드러운 전환 효과 추가
  };

  const darkInputStyle = {
    backgroundColor: '#2d2d2d', 
    color: '#fff', 
    border: '1px solid #444', 
    padding: '8px', 
    borderRadius: '4px',
    outline: 'none',
    width: '100%' // 부모 크기에 맞추기
  };

  const btnStyle = { padding: '6px 12px', marginLeft: '10px', cursor: 'pointer', borderRadius: '4px', border: 'none', fontWeight: 'bold' };
  const deleteBtnStyle = { ...btnStyle, backgroundColor: '#1e1e1e', color: 'white' };

  return (
    // 🌟 [수정 포인트 1] 화면 전체를 Flexbox 중앙 정렬로 설정!
    <div style={{ 
      width: '100%',
      backgroundColor: '#121212', 
      minHeight: '100vh', 
      padding: '40px 0', // 좌우 패딩은 빼고 중앙 정렬에 집중
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      display: 'flex',       // Flexbox 가동
      justifyContent: 'center', // 가로 중앙 정렬!
      alignItems: 'flex-start'  // 세로 정렬은 위에서부터
    }}>
      {/* 🌟 [수정 포인트 2] 실제 콘텐츠를 감싸는 내부 div, maxWidth 지정 및 중앙 배치 */}
      <div style={{ 
        width: '90%',        // 화면이 작을 땐 90%
        maxWidth: '900px',    // 화면이 클 땐 최대 900px로 제한
        display: 'flex',      
        flexDirection: 'column', // 세로로 쌓기
        gap: '20px',         // 요소 간 간격
        paddingLeft: '20px',  // 작은 화면용 좌우 여백
        paddingRight: '20px' 
      }}>
        
        <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '30px', marginTop: '30px' }}>🍺 스마트 브루잉 시뮬레이터</h2>
        
        {/* 📝 레시피 설계 카드 */}
        <div style={darkCardStyle}>
          <h3 style={{ color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0 }}>📝 레시피 설계</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '50px', marginBottom: '25px', marginTop: '20px', paddingRight:'20px'}}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              배치 용량(L): 
              <input type="number" value={recipeData.batchSizeLiters} onChange={e => setRecipeData({...recipeData, batchSizeLiters: parseFloat(e.target.value) || 0})} style={darkInputStyle} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              효율(%): 
              <input type="number" step="0.01" value={recipeData.efficiency} onChange={e => setRecipeData({...recipeData, efficiency: parseFloat(e.target.value) || 0})} style={darkInputStyle} />
            </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              발효 기간(일): 
              <input type="number" step="1" value={recipeData.durationDays} onChange={e => setRecipeData({...recipeData, durationDays: parseInt(e.target.value) || 0})} style={darkInputStyle} />
            </label>

            
          </div>

          <hr style={{ borderColor: '#333', margin: '20px 0' }}/>

          {/* 🌾 몰트 동적 리스트 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h4 style={{ margin: 0, color: '#f39c12' }}>🌾 몰트 (Grains)</h4>
            <button style={{...btnStyle, backgroundColor: '#2980b9', color: '#fff'}} onClick={() => addItem('grains', { name: dbIngredients.grains[0]?.name || "", weightKg: 1.0 })}>+ 몰트 추가</button>
          </div>
          {recipeData.grains.map((grain, index) => (
            <div key={`grain-${index}`} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <select value={grain.name} onChange={(e) => handleArrayChange('grains', index, 'name', e.target.value)} style={{ ...darkInputStyle, marginRight: '15px', flex: 2 }}>
                {dbIngredients.grains.map(g => <option key={`g-${g.id}`} value={g.name}>{g.name}</option>)}
              </select>
              <input type="number" step="0.1" value={grain.weightKg} onChange={(e) => handleArrayChange('grains', index, 'weightKg', e.target.value)} style={{ ...darkInputStyle, width: '80px', marginRight: '5px', textAlign: 'right' }} /> kg
              
              {index > 0 ? (
                <button style={deleteBtnStyle} onClick={() => removeItem('grains', index)}>❌</button>
              ) : (
                <div style={{ width: '42px', marginLeft: '10px' }}></div> 
              )}
            </div>
          ))}

          <hr style={{ borderColor: '#333', margin: '20px 0' }}/>

          {/* 🌿 보일링 홉 동적 리스트 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h4 style={{ margin: 0, color: '#2ecc71' }}>🌿 보일링 홉 (Hops)</h4>
            <button style={{...btnStyle, backgroundColor: '#27ae60', color: '#fff'}} onClick={() => addItem('hops', { name: dbIngredients.hops[0]?.name || "", amountGrams: 10, boilTimeMinutes: 60 })}>+ 홉 추가</button>
          </div>
          {recipeData.hops.map((hop, index) => (
            <div key={`hop-${index}`} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <select value={hop.name} onChange={(e) => handleArrayChange('hops', index, 'name', e.target.value)} style={{ ...darkInputStyle, marginRight: '15px', flex: 2 }}>
                {dbIngredients.hops.map(h => <option key={`h-${h.id}`} value={h.name}>{h.name}</option>)}
              </select>
              <input type="number" step="1" value={hop.amountGrams} onChange={(e) => handleArrayChange('hops', index, 'amountGrams', e.target.value)} style={{ ...darkInputStyle, width: '70px', marginRight: '5px', textAlign: 'right' }} /> g 
              <span style={{ margin: '0 10px', color: '#888' }}>@</span>
              <input type="number" step="1" value={hop.boilTimeMinutes} onChange={(e) => handleArrayChange('hops', index, 'boilTimeMinutes', e.target.value)} style={{ ...darkInputStyle, width: '70px', marginLeft: '5px', marginRight: '5px', textAlign: 'right' }} /> 분
              
              {index > 0 ? (
                <button style={deleteBtnStyle} onClick={() => removeItem('hops', index)}>❌</button>
              ) : (
                <div style={{ width: '42px', marginLeft: '10px' }}></div>
              )}
            </div>
          ))}

          <hr style={{ borderColor: '#333', margin: '20px 0' }}/>

          {/* 🌱 드라이홉 동적 리스트 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h4 style={{ margin: 0, color: '#9b59b6' }}>🌱 드라이 호핑 (Dry Hops)</h4>
            <button style={{...btnStyle, backgroundColor: '#8e44ad', color: '#fff'}} onClick={() => addItem('dryHops', { name: dbIngredients.hops[0]?.name || "", amountGrams: 30, hour: 72 })}>+ 드라이홉 추가</button>
          </div>
          {recipeData.dryHops.length === 0 && <div style={{fontSize: '14px', color: '#777', fontStyle: 'italic', paddingLeft: '10px'}}>적용된 드라이홉이 없습니다.</div>}
          {recipeData.dryHops.map((dh, index) => (
            <div key={`dh-${index}`} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <select value={dh.name} onChange={(e) => handleArrayChange('dryHops', index, 'name', e.target.value)} style={{ ...darkInputStyle, marginRight: '15px', flex: 2 }}>
                {dbIngredients.hops.map(h => <option key={`dhop-${h.id}`} value={h.name}>{h.name}</option>)}
              </select>
              <input type="number" step="1" value={dh.amountGrams} onChange={(e) => handleArrayChange('dryHops', index, 'amountGrams', e.target.value)} style={{ ...darkInputStyle, width: '70px', marginRight: '5px', textAlign: 'right' }} /> g 
              <span style={{ margin: '0 10px', color: '#888' }}>(투입:</span>
              <input type="number" step="1" value={dh.hour} onChange={(e) => handleArrayChange('dryHops', index, 'hour', e.target.value)} style={{ ...darkInputStyle, width: '70px', marginRight: '5px', textAlign: 'right' }} /> <span style={{ color: '#888' }}>Day)</span>
              
              <button style={deleteBtnStyle} onClick={() => removeItem('dryHops', index)}>❌</button>
            </div>
          ))}

          <hr style={{ borderColor: '#333', margin: '20px 0' }}/>

          {/* 🦠 효모 설정 */}
          <h4 style={{ margin: '0 0 15px 0', color: '#e74c3c' }}>🦠 효모 (Yeast)</h4>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <select value={recipeData.yeast.name} onChange={(e) => setRecipeData({...recipeData, yeast: {...recipeData.yeast, name: e.target.value}})} style={{ ...darkInputStyle, marginRight: '15px', flex: 1 }}>
              {dbIngredients.yeasts.map(y => <option key={`y-${y.id}`} value={y.name}>{y.name}</option>)}
            </select>
            <input type="number" step="0.1" value={recipeData.yeast.amount} onChange={(e) => setRecipeData({...recipeData, yeast: {...recipeData.yeast, amount: parseFloat(e.target.value) || 0}})} style={{ ...darkInputStyle, width: '80px', marginRight: '5px', textAlign: 'right' }} /> g
          </div>
        </div>

        {/* 🔘 액션 버튼 영역 */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', margin: '30px 0' }}>
          <button onClick={runSimulation} disabled={loading || isSaving} style={{ padding: '15px 30px', fontSize: '18px', cursor: (loading || isSaving) ? 'wait' : 'pointer', backgroundColor: loading ? '#d35400' : '#e67e22', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', transition: '0.2s' }}>
            {loading ? '⏳ 시뮬레이션 중...' : '🚀 시뮬레이션 가동'}
          </button>

          <button onClick={saveRecipe} disabled={loading || isSaving} style={{ padding: '15px 30px', fontSize: '18px', cursor: (loading || isSaving) ? 'wait' : 'pointer', backgroundColor: isSaving ? '#27ae60' : '#2ecc71', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', transition: '0.2s' }}>
            {isSaving ? '💾 저장 중...' : '💾 레시피 저장'}
          </button>
        </div>

        {/* --- 📊 시뮬레이션 결과 화면 --- */}
        {result && result.logs && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            {/* 상단 스탯 대시보드 */}
            <div style={{ ...darkCardStyle, backgroundColor: '#2c3e50', borderColor: '#34495e' }}>
              <h2 style={{ marginTop: 0, color: '#ecf0f1', borderBottom: '1px solid #7f8c8d', paddingBottom: '10px' }}>📊 레시피 분석 리포트</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', fontSize: '18px', color: '#bdc3c7', marginTop: '20px' }}>
                <p><strong style={{color:'#fff'}}>초기 비중 (OG):</strong> <span style={{color:'#f1c40f'}}>{result.originalGravity.toFixed(4)}</span></p>
                <p><strong style={{color:'#fff'}}>목표 비중 (FG):</strong> <span style={{color:'#f1c40f'}}>{result.finalGravity.toFixed(4)}</span></p>
                <p><strong style={{color:'#fff'}}>예상 알코올:</strong> <span style={{color:'#e74c3c'}}>{result.estimatedAbv.toFixed(1)}% ABV</span></p>
                <p><strong style={{color:'#fff'}}>쓴맛 (IBU):</strong> {result.ibu.toFixed(1)}</p>

                {/* 🌟 [수정 포인트 3] SRM 진짜 색상 표시 박스 추가! */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <strong style={{color:'#fff'}}>색상 (SRM):</strong>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '5px',
                    backgroundColor: srmToColor(result.srm), // [ New ] srmToColor 함수 호출
                    border: '1px solid #555',
                    display: 'inline-block',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                  }}></div>
                  <span style={{color: '#fff', fontWeight: 'bold'}}>{result.srm.toFixed(1)}</span>
                </div>

                <p><strong style={{color:'#fff'}}>BU:GU 비율:</strong> {result.buGuRatio.toFixed(2)} <br/><span style={{fontSize:'14px', color:'#2ecc71'}}>({result.balanceProfile})</span></p>
              </div>
              
              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px dashed #7f8c8d', display: 'flex', gap: '30px', color: '#95a5a6' }}>
                <p style={{ margin: 0 }}>🌱 드라이 홉 투입률: <strong style={{color:'#fff'}}>{result.dryHopRate.toFixed(1)} g/L</strong></p>
                <p style={{ margin: 0 }}>🦠 효모 피칭률: <strong style={{color:'#fff'}}>{result.pitchRate.toFixed(2)} g/L</strong></p>
              </div>
            </div>
            
            {/* 하단 타임라인 로그 */}
            <h3 style={{ color: '#fff', marginTop: '30px' }}>⏱️ 시간별 발효 타임라인 (총 {result.logs.length}건)</h3>
            <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #333', borderRadius: '8px', padding: '15px', backgroundColor: '#1a1a1a', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
              {result.logs.map((log, index) => (
                <div key={index} style={{ padding: '12px 0', borderBottom: index === result.logs.length - 1 ? 'none' : '1px solid #333', display: 'flex', gap: '20px', color: '#bbb', alignItems: 'center' }}>
                  <div style={{ fontWeight: 'bold', color: '#e67e22', minWidth: '70px', fontSize: '1.1em' }}>
                    {log.hour <= 0 ? `${log.hour}h` : `${log.hour} Day`}
                  </div>
                  <div style={{ minWidth: '70px', color: '#3498db', fontWeight: 'bold' }}>{log.temperature}°C</div>
                  <div style={{ minWidth: '120px' }}>Gravity: <span style={{color:'#fff'}}>{log.gravity.toFixed(4)}</span></div>
                  <div style={{ minWidth: '90px' }}>ABV: <span style={{color:'#fff'}}>{log.abv.toFixed(1)}%</span></div>
                  
                  <div style={{ color: '#7f8c8d', fontSize: '0.9em', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    <span style={{color: '#95a5a6'}}>▶ {log.phase}</span>
                    {log.flavorTags && log.flavorTags.length > 0 && <span style={{color:'#2ecc71', marginLeft:'10px'}}>🌿 {log.flavorTags.join(', ')}</span>}
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
export default Simulator