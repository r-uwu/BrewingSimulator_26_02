package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import com.example.demo.domain.Recipe;
import com.example.demo.simulation.TemperatureSchedule;
import com.example.demo.simulation.DryHopAddition;

@Data
@NoArgsConstructor
public class SimulationRequestDto {
    private double batchSizeLiters;
    private double efficiency;
    private int durationDays;
    
    private List<GrainRequest> grains;
    private List<HopRequest> hops;
    private YeastRequest yeast;
    private List<DryHopRequest> dryHops;
    private TemperatureSchedule tempSchedule;

    // 내부 DTO 클래스들
    // 프론트엔드에서 이름과 양만 받음
    @Data public static class GrainRequest {
        private String name;
        private double weightKg;
    }
    @Data public static class HopRequest {
        private String name;
        private double amountGrams;
        private int boilTimeMinutes;
    }
    @Data public static class YeastRequest {
        private String name;
        private double amount;
    }
    @Data public static class DryHopRequest {
        private int hour;
        private String name;
        private double amountGrams;
    }
}