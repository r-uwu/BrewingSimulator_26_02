package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import com.example.demo.domain.Recipe;
import com.example.demo.simulation.TemperatureSchedule;
import com.example.demo.simulation.DryHopAddition;

@Data
@NoArgsConstructor // Spring(Jackson)이 JSON을 자바 객체로 변환할 때 필수입니다.
public class SimulationRequestDto {

    // 1. 시뮬레이션 기간 (일)
    private int durationDays;

    // 2. 맥주 레시피 정보 (몰트, 끓임용 홉, 효모 등)
    private Recipe recipe;

    // 3. 발효 온도 변화 스케줄
    private TemperatureSchedule tempSchedule;

    // 4. 드라이호핑 (발효 중 홉 투입) 일정
    // 🌟 프론트엔드에서 드라이호핑 데이터를 안 보냈을 때(null) 발생하는 에러를 막기 위해
    // 기본값으로 텅 빈 리스트(new ArrayList<>())를 쥐여줍니다.
    private List<DryHopAddition> dryHopAdditions = new ArrayList<>();

}