import { useState } from 'react'

function Simulator() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

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
      yeast: { name: "US-05", amount: 11.5 },
      dryHops: [
        { hour: 48, name: "Citra", amountGrams: 50.0 }
      ],
      tempSchedule: {
        initialTemp: 20.0,
        steps: [ { hour: 240, targetTemp: 15.0 } ]
      }
    };

    


    try {
      const response = await fetch('http://localhost:8080/api/brewing/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("서버 통신 에러!");
      
      const data = await response.json();
      console.log("백엔드 데이터 성공적으로 도착!", data);
      
      // 🌟 2. 새로 만든 ResponseDto 객체를 그대로 저장
      setResult(data);
      
    } catch (error) {
      console.error(error);
      alert("시뮬레이션 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }




  

  return (

    


    












    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>🍺 스마트 브루잉 시뮬레이터</h1>
      <p>버튼을 눌러 14일간의 발효 과정을 시뮬레이션 하세요.</p>
      
      <button 
        onClick={runSimulation}
        disabled={loading}
        style={{ padding: '12px 24px', fontSize: '16px', cursor: loading ? 'wait' : 'pointer', backgroundColor: loading ? '#f39c12' : '#eebd6d', border: 'none', borderRadius: '5px', color: 'white', fontWeight: 'bold' }}
      >
        {loading ? '계산 중...' : '🚀 DDH NEIPA 시뮬레이션 돌리기'}
      </button>

      <hr style={{ margin: '30px 0', border: '1px solid #eee' }}/>

      {/* 백엔드에서 준 요약 스탯(result)과 타임라인(result.logs)이 모두 있을 때만 화면에 그립니다 */}
      {result && result.logs && (
        <>
          {/* 상단: Advanced Brew Stats 요약 대시보드 */}
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
            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #fff', display: 'flex', gap: '30px' }}>
              <p style={{ margin: 0, color: '#bdc3c7' }}>🌱 드라이 홉 비율: {result.dryHopRate.toFixed(1)} g/L</p>
              <p style={{ margin: 0, color: '#bdc3c7' }}>🦠 효모 투입 비율: {result.pitchRate.toFixed(2)} g/L</p>
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

                
                {/* <div style={{ color: '#fff' }}>
                  {log.phase} 
                  {log.flavorTags && log.flavorTags.length > 0 && ` | 🌿 ${log.flavorTags.join(', ')}`}
                </div> */}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Simulator