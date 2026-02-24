package com.example.demo.dto;

import lombok.Data;
import java.util.List;

import com.example.demo.domain.Recipe;
import com.example.demo.simulation.DryHopAddition;
import com.example.demo.simulation.TemperatureSchedule;

@Data
public class SimulationRequestDto {
    private Recipe recipe;
    private TemperatureSchedule tempSchedule;
    private List<DryHopAddition> dryHopAdditions;
    private int durationDays;
}