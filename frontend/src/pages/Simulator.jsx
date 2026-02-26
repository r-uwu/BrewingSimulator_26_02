import { useState } from 'react'

function Simulator() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)


  const [recipeData, setRecipeData] = useState({
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
    dryHops: [],
    tempSchedule: { initialTemp: 20.0, steps: [] }
  });


      const GRAIN_OPTIONS = ["Pilsner", "Pale Ale", "Wheat", "Munich", "Vienna", "Crystal 40L", "Roasted Barley"];
    const HOP_OPTIONS = ["Magnum", "Citra", "Mosaic", "Cascade", "Centennial", "Simcoe", "Galaxy", "Saaz"];
    const YEAST_OPTIONS = ["SafAle US-05", "SafAle S-04", "SafLager W-34/70", "SafBrew WB-06", "Lallemand Voss Kveik"];

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
      // 🌟 State에 있는 recipeData를 그대로 백엔드로 쏩니다!
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
      // 🌟 시뮬레이션과 완벽하게 똑같은 recipeData를 이번엔 /save로 쏩니다!
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


//   return (

//     <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
//       <h1>🍺 스마트 브루잉 시뮬레이터</h1>
//       <p>버튼을 눌러 14일간의 발효 과정을 시뮬레이션 하세요.</p>


//       <div style={{ display: 'flex', gap: '10px' }}>
//       <button 
//         onClick={runSimulation}
//         disabled={loading}
//         style={{ padding: '12px 24px', fontSize: '16px', cursor: loading ? 'wait' : 'pointer', backgroundColor: loading ? '#f39c12' : '#eebd6d', border: 'none', borderRadius: '5px', color: 'white', fontWeight: 'bold' }}
//       >
//         {loading ? '계산 중...' : '🚀 DDH NEIPA 시뮬레이션 돌리기'}
//       </button>

      
//         <button 
//           onClick={saveRecipe}
//           disabled={loading || isSaving}
//           style={{ padding: '12px 24px', fontSize: '16px', cursor: (loading || isSaving) ? 'wait' : 'pointer', backgroundColor: isSaving ? '#7f8c8d' : '#2ecc71', border: 'none', borderRadius: '5px', color: 'white', fontWeight: 'bold' }}
//         >
//           {isSaving ? '저장 중...' : '💾 DB에 레시피 저장하기'}
//         </button>

//         </div>



//       <hr style={{ margin: '30px 0', border: '1px solid #eee' }}/>

//       {/* 백엔드에서 준 요약 스탯(result)과 타임라인(result.logs)이 모두 있을 때만 화면에 그립니다 */}
//       {result && result.logs && (
//         <>
//           {/* 상단: Advanced Brew Stats 요약 대시보드 */}
//           <div style={{ backgroundColor: '#333', color: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
//             <h2 style={{ marginTop: 0, color: '#fff' }}>📊 레시피 분석 스탯</h2>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', fontSize: '18px' }}>
//               <p><strong>초기 비중 (OG):</strong> {result.originalGravity.toFixed(4)}</p>
//               <p><strong>목표 비중 (FG):</strong> {result.finalGravity.toFixed(4)}</p>
//               <p><strong>예상 알코올 (ABV):</strong> {result.estimatedAbv.toFixed(1)} %</p>
//               <p><strong>쓴맛 (IBU):</strong> {result.ibu.toFixed(1)}</p>
//               <p><strong>색상 (SRM):</strong> {result.srm.toFixed(1)}</p>
//               <p><strong>BU:GU 비율:</strong> {result.buGuRatio.toFixed(2)} ({result.balanceProfile})</p>
//             </div>
//             <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #fff', display: 'flex', gap: '30px' }}>
//               <p style={{ margin: 0, color: '#bdc3c7' }}>🌱 드라이 홉 비율: {result.dryHopRate.toFixed(1)} g/L</p>
//               <p style={{ margin: 0, color: '#bdc3c7' }}>🦠 효모 투입 비율: {result.pitchRate.toFixed(2)} g/L</p>
//             </div>
//           </div>

//           {/* 하단: 344시간 타임라인 로그 리스트 */}
//           <h3>⏱️ 시간별 발효 타임라인 (총 {result.logs.length}건)</h3>
//           <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #333', borderRadius: '8px', padding: '10px', backgroundColor: '#333' }}>
//             {result.logs.map((log, index) => (
//               <div key={index} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', gap: '15px' }}>
//                 <div style={{ fontWeight: 'bold', color: '#e67e22', minWidth: '60px' }}>{log.hour <= 0 ? `${log.hour}h` : `${log.hour} Day`}</div>
//                 <div style={{ minWidth: '80px' }}>{log.temperature}°C</div>
//                 <div style={{ minWidth: '100px' }}>Gravity: {log.gravity.toFixed(4)}</div>
//                 <div style={{ minWidth: '80px' }}>ABV: {log.abv.toFixed(1)}%</div>

                
//                 {/* <div style={{ color: '#fff' }}>
//                   {log.phase} 
//                   {log.flavorTags && log.flavorTags.length > 0 && ` | 🌿 ${log.flavorTags.join(', ')}`}
//                 </div> */}
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>🍺 스마트 브루잉 시뮬레이터</h1>
      
      {/* 🌟 사용자 입력 폼 영역 */}
      <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
        <h3>📝 레시피 설계</h3>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
          <label>배치 용량(L): <input type="number" value={recipeData.batchSizeLiters} onChange={e => setRecipeData({...recipeData, batchSizeLiters: parseFloat(e.target.value) || 0})} style={{width:'60px'}} /></label>
          <label>효율(%): <input type="number" step="0.01" value={recipeData.efficiency} onChange={e => setRecipeData({...recipeData, efficiency: parseFloat(e.target.value) || 0})} style={{width:'60px'}} /></label>
        </div>

        {/* 몰트 설정 */}
        <h4>🌾 몰트 (Grains)</h4>
        {recipeData.grains.map((grain, index) => (
          <div key={`grain-${index}`} style={{ marginBottom: '10px' }}>
            <select value={grain.name} onChange={(e) => handleGrainChange(index, 'name', e.target.value)} style={{ padding: '5px', marginRight: '10px' }}>
              {GRAIN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <input type="number" step="0.1" value={grain.weightKg} onChange={(e) => handleGrainChange(index, 'weightKg', e.target.value)} style={{ width: '60px', padding: '5px' }} /> kg
          </div>
        ))}

        {/* 홉 설정 */}
        <h4>🌿 홉 (Hops)</h4>
        {recipeData.hops.map((hop, index) => (
          <div key={`hop-${index}`} style={{ marginBottom: '10px' }}>
            <select value={hop.name} onChange={(e) => handleHopChange(index, 'name', e.target.value)} style={{ padding: '5px', marginRight: '10px' }}>
              {HOP_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <input type="number" step="1" value={hop.amountGrams} onChange={(e) => handleHopChange(index, 'amountGrams', e.target.value)} style={{ width: '60px', padding: '5px' }} /> g
            <span style={{ margin: '0 10px' }}>@</span>
            <input type="number" step="1" value={hop.boilTimeMinutes} onChange={(e) => handleHopChange(index, 'boilTimeMinutes', e.target.value)} style={{ width: '60px', padding: '5px' }} /> 분 끓임
          </div>
        ))}

        {/* 효모 설정 */}
        <h4>🦠 효모 (Yeast)</h4>
        <div>
          <select value={recipeData.yeast.name} onChange={(e) => setRecipeData({...recipeData, yeast: {...recipeData.yeast, name: e.target.value}})} style={{ padding: '5px', marginRight: '10px' }}>
            {YEAST_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <input type="number" step="0.1" value={recipeData.yeast.amount} onChange={(e) => setRecipeData({...recipeData, yeast: {...recipeData.yeast, amount: parseFloat(e.target.value) || 0}})} style={{ width: '60px', padding: '5px' }} /> g
        </div>
      </div>

      {/* 버튼 영역 */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={runSimulation} disabled={loading || isSaving} style={{ padding: '12px 24px', fontSize: '16px', cursor: (loading || isSaving) ? 'wait' : 'pointer', backgroundColor: loading ? '#f39c12' : '#eebd6d', border: 'none', borderRadius: '5px', color: 'white', fontWeight: 'bold' }}>
          {loading ? '계산 중...' : '🚀 시뮬레이션 돌리기'}
        </button>

        <button onClick={saveRecipe} disabled={loading || isSaving} style={{ padding: '12px 24px', fontSize: '16px', cursor: (loading || isSaving) ? 'wait' : 'pointer', backgroundColor: isSaving ? '#7f8c8d' : '#2ecc71', border: 'none', borderRadius: '5px', color: 'white', fontWeight: 'bold' }}>
          {isSaving ? '저장 중...' : '💾 DB에 레시피 저장하기'}
        </button>
      </div>

      <hr style={{ margin: '30px 0', border: '1px solid #eee' }}/>

      {/* 결과 화면 (기존 코드와 동일) */}
      {result && result.logs && (
        <>
          {/* 상단: Advanced Brew Stats */}
          <div style={{ backgroundColor: '#333', color: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2 style={{ marginTop: 0, color: '#fff' }}>📊 레시피 분석 스탯</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', fontSize: '18px' }}>
              <p><strong>초기 비중 (OG):</strong> {result.originalGravity.toFixed(4)}</p>
              <p><strong>목표 비중 (FG):</strong> {result.finalGravity.toFixed(4)}</p>
              <p><strong>예상 알코올 (ABV):</strong> {result.estimatedAbv.toFixed(1)} %</p>
              <p><strong>쓴맛 (IBU):</strong> {result.ibu.toFixed(1)}</p>
              <p><strong>색상 (SRM):</strong> {result.srm.toFixed(1)}</p>
              <p><strong>BU:GU 비율:</strong> {result.buGuRatio.toFixed(2)} ({result.balanceProfile})</p>
            </div>
          </div>

          {/* 하단: 344시간 타임라인 로그 리스트 */}
          <h3>⏱️ 시간별 발효 타임라인 (총 {result.logs.length}건)</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #333', borderRadius: '8px', padding: '10px', backgroundColor: '#333' }}>
            {result.logs.map((log, index) => (
              <div key={index} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', gap: '15px' }}>
                <div style={{ fontWeight: 'bold', color: '#e67e22', minWidth: '60px' }}>{log.hour <= 0 ? `${log.hour}h` : `${log.hour} Day`}</div>
                <div style={{ minWidth: '80px' }}>{log.temperature}°C</div>
                <div style={{ minWidth: '100px' }}>Gravity: {log.gravity.toFixed(4)}</div>
                <div style={{ minWidth: '80px' }}>ABV: {log.abv.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Simulator