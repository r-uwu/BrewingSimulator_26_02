package com.example.demo.dto;

import lombok.Data;
import java.util.List;
import com.example.demo.simulation.SimulationLog;

//@Data
//public class SimulationResponseDto {
//    // 프론트엔드 대시보드에 띄워줄 전체 요약 스탯
//    private double originalGravity; // 초기 비중 (OG)
//    private double finalGravity;    // 예상 종료 비중 (FG)
//    private double estimatedAbv;    // 예상 알코올 도수 (ABV %)
//    private double ibu;             // 쓴맛 정도 (IBU)
//    private double srm;             // 맥주 색상 (SRM)
//    
//    // 시간별 상세 시뮬레이션 타임라인
//    private List<SimulationLog> logs;
//}

@Data
public class SimulationResponseDto {
    // 1. 레시피 기본 스탯
    private double originalGravity;
    private double finalGravity;
    private double estimatedAbv;
    private double ibu;
    private double srm;
    
    // 2. 심화 양조 스탯 (Advanced Brew Stats)
    private double buGuRatio;
    private String balanceProfile; // (Malty / Balanced / Hoppy)
    private double dryHopRate;     // g/L
    private double pitchRate;      // g/L
    
    // 3. 타임라인 로그
    private List<SimulationLog> logs;
}