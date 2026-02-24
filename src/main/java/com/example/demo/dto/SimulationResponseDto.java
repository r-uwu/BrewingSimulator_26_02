package com.example.demo.dto;

import lombok.Data;
import java.util.List;
import com.example.demo.simulation.SimulationLog;

@Data
public class SimulationResponseDto {
    // 프론트엔드 대시보드에 띄워줄 전체 요약 스탯
    private double originalGravity; // 초기 비중 (OG)
    private double finalGravity;    // 예상 종료 비중 (FG)
    private double estimatedAbv;    // 예상 알코올 도수 (ABV %)
    private double ibu;             // 쓴맛 정도 (IBU)
    private double srm;             // 맥주 색상 (SRM)
    
    // 시간별 상세 시뮬레이션 타임라인
    private List<SimulationLog> logs;
}