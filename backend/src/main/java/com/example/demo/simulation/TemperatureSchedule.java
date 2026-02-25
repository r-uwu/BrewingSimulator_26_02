package com.example.demo.simulation;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TemperatureSchedule {
	
	private double initialTemp;
    private List<TempStep> steps;

    private final TreeMap<Integer, Double> schedule = new TreeMap<>();

    public TemperatureSchedule(double initialTemp) {
    	this.initialTemp = initialTemp;
        this.schedule.put(0, initialTemp);
    }

    public void addStep(int hour, double temp) {
        this.schedule.put(hour, temp);
    }

    public double getTempAt(int hour) {
    	if (schedule.isEmpty()) {
            schedule.put(0, initialTemp); // 초기 온도 세팅
            if (steps != null) {
                for (TempStep step : steps) {
                    schedule.put(step.getHour(), step.getTargetTemp());
                }
            }
        }
    	
    	Map.Entry<Integer, Double> entry = schedule.floorEntry(hour);
        
        if (entry == null) {
            return initialTemp; 
        }
        
        return entry.getValue();   	
    }
    
    @Data
    public static class TempStep {
        private int hour;
        private double targetTemp;
    }
}
