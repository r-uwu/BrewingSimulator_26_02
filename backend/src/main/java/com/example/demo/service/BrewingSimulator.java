package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.domain.FlavorProfile;
import com.example.demo.domain.Recipe;
import com.example.demo.domain.Yeast;
import com.example.demo.engine.BrewCalculator;
import com.example.demo.engine.DensityEngine;
import com.example.demo.engine.FermentationEngine;
import com.example.demo.engine.HopChemistryEngine;
import com.example.demo.simulation.DryHopAddition;
import com.example.demo.simulation.SimulationLog;
import com.example.demo.simulation.TemperatureSchedule;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class BrewingSimulator {

    private final BrewCalculator calculator;
    private final FermentationEngine fermentationEngine;
    private final DensityEngine densityEngine;
    private final HopChemistryEngine hopChemistryEngine;

    /**
     * 시뮬레이션 메인 메서드
     */
    public List<SimulationLog> simulate(Recipe recipe, TemperatureSchedule tempSchedule,
            List<DryHopAddition> dryHopAdditions, int durationDays) {
	List<SimulationLog> logs = new ArrayList<>();
	int totalHours = durationDays * 24;
	
	simulateBrewhouse(recipe, logs);
	
	double currentGravity = densityEngine.calculateOG(recipe);
	final double startOG = currentGravity;
	
	double optimalTemp = (recipe.getYeastItem().getYeast().getMaxTemp() > 0) ? 
	 recipe.getYeastItem().getYeast().getMaxTemp() : 20.0;
	double targetFG = fermentationEngine.calculateFG(recipe, startOG, optimalTemp, 65.0);
	
	// 안전장치
	double fallbackFG = 1.0 + (startOG - 1.0) * 0.25; 
	if (targetFG > startOG - 0.015) targetFG = fallbackFG;
	
	FlavorProfile lastProfile = null;
	String phase = "Lag Phase";
	List<String> dryHopTags = new ArrayList<>();
	
	double dynamicFG = targetFG;
	double dynamicIBU = calculator.calculateIBU(recipe);
	double currentDiacetyl = 0;
	
	for (int hour = 0; hour <= totalHours; hour++) {
		// hours를 그냥 hours로 쓰고 day개념 추가
		int currentDay = hour / 24;
		
		double currentTemp = tempSchedule.getTempAt(hour); 
		
		double drop = calculateHourlyDrop(hour, currentGravity, dynamicFG, currentTemp, recipe.getYeastItem().getYeast());
		if (drop < 0) drop = 0;
		currentGravity -= drop;
		
		double currentABV = fermentationEngine.calculateABV(startOG, currentGravity);
		
		for(DryHopAddition dryHopAddition : dryHopAdditions){
		if(dryHopAddition.hour() * 24 == hour) { 
			double gramsPerLiter = dryHopAddition.amountGrams() / recipe.getBatchSizeLiters();
			double addedIbu = hopChemistryEngine.calculateHumulinoneIBU(gramsPerLiter, currentABV);
			double fgDrop = hopChemistryEngine.calculateHopCreepDrop(gramsPerLiter, currentGravity);
			
			dynamicIBU += addedIbu;
			dynamicFG -= fgDrop;
			currentDiacetyl += 25.0;
			
			logs.add(new SimulationLog(
			hour, currentTemp, currentGravity, currentABV,
			"Hop Addition: " + dryHopAddition.hop().getName(),
			List.of(String.format("+%.1fg %s (IBU +%.2f, TargetFG -%.4f)",
			        dryHopAddition.amountGrams(), dryHopAddition.hop().getName(), addedIbu, fgDrop)),
			0, 0
			));
			
			if (dryHopAddition.hop().getFlavorTags() != null) {
				dryHopTags.addAll(dryHopAddition.hop().getFlavorTags());
				}
			}
		}
		
		if (currentDiacetyl > 0) {
			double reduction = hopChemistryEngine.calculateDiacetylReduction(currentDiacetyl, currentTemp);
			currentDiacetyl -= reduction;
		}
		
		if (currentGravity > startOG) currentGravity = startOG;
		if (currentGravity < dynamicFG) currentGravity = dynamicFG; 
		
		phase = determinePhase(hour, currentGravity, startOG, dynamicFG, currentTemp);
		
		if (hour == 0 || hour % 24 == 0 || hour == totalHours) {
			lastProfile = calculator.predictFlavorProfile(recipe, currentTemp);
		}
		
			if (hour == 0 || hour % 24 == 0 || hour == totalHours) {
				if (lastProfile != null) {
				List<String> combinedTags = new ArrayList<>(lastProfile.flavorTags());
				combinedTags.addAll(dryHopTags);
				
				logs.add(new SimulationLog(
				hour, currentTemp, currentGravity, currentABV, phase,
				combinedTags.stream().distinct().toList(),
				lastProfile.esterScore(), lastProfile.diacetylRisk()
				));
				}
			}
		}
	
	return logs;
	}

    private void simulateBrewhouse(Recipe recipe, List<SimulationLog> logs) {
        double og = densityEngine.calculateOG(recipe);

        double mashGravity = 1.0 + (og - 1.0) * 0.82;
        logs.add(new SimulationLog(-120, 65.0, mashGravity, 0.0, "Mashing Start", List.of("Starch Conversion"), 0, 0));
        logs.add(new SimulationLog(-90, 75.0, mashGravity + 0.002, 0.0, "Mash Out", List.of("Enzyme Denature"), 0, 0));

        double boilStartGravity = mashGravity + 0.005;
        logs.add(new SimulationLog(-60, 100.0, boilStartGravity, 0.0, "Boil Start", List.of("Sterilization"), 0, 0));
        
        recipe.getHopItems().stream()
                .sorted((h1, h2) -> Integer.compare(h2.getBoilTimeMinutes(), h1.getBoilTimeMinutes()))
                .forEach(hop -> {
                    int logTime = -hop.getBoilTimeMinutes();
                    
                    double currentGravity = (logTime == 0) ? og : boilStartGravity;
                    
                    logs.add(new SimulationLog(logTime, 100.0, currentGravity, 0,
                            "Hop Addition: " + hop.getHop().getName(),
                            List.of(hop.getAmountGrams() + "g added"), 0, 0));
                });

        //월풀
        logs.add(new SimulationLog(0, 20.0, og, 0.0, "Fermenter In", List.of("Oxygenation"), 0, 0));
    }


    private double calculateHourlyDrop(int hour, double currentG, double targetFG, double temp, Yeast yeast) {
        double remainingSugar = currentG - targetFG;
        if (remainingSugar <= 0.0005) return 0.0;

        double baseTemp = 20.0;
        double q10 = 2.0; 
        double tempActivity = Math.pow(q10, (temp - baseTemp) / 10.0);

        double minT = (yeast.getMinTemp() > 0) ? yeast.getMinTemp() : 15.0;
        double maxT = (yeast.getMaxTemp() > 0) ? yeast.getMaxTemp() : 25.0;

        if (temp < minT) tempActivity *= 0.1;
        else if (temp > maxT + 5) tempActivity = 0.0;

        double yeastActivityFactor;
        if (hour < 24) yeastActivityFactor = 0.05;       // 1일차: 지체기
        else if (hour < 48) yeastActivityFactor = 0.8;   // 2일차: 증식기
        else if (hour < 120) yeastActivityFactor = 1.8;  // 3~5일차: 폭풍 발효기
        else if (hour < 240) yeastActivityFactor = 0.8;  // 6~10일차: 감속기
        else yeastActivityFactor = 0.2;                  // 이후: 안정기

        // 🌟 반응 상수 상향 조정 (에일 기준 확실하게 떨어지도록)
        double baseHourlyRate = 0.018; 
        double drop = remainingSugar * baseHourlyRate * tempActivity * yeastActivityFactor;

        return Math.min(drop, remainingSugar);
    }

    private String determinePhase(int hour, double currentG, double startOG, double targetFG, double temp) {
        if (hour < 0) return "Brewhouse";
        if (hour < 12) return "Lag Phase";

        // 목표 비중과 현재 비중의 차이가 0.002 미만이면 발효 종료로 간주
        // == > 목표 비중과의 차이보단 발효 온도가 5도 미만이면 발효 종료도 ㄱㅊ을ㄷ스
        if (Math.abs(currentG - targetFG) < 0.001) {
            if (temp < 5.0) return "Cold Crashing / Lagering";
            return "Finished / Conditioning";
        }
        return "Fermenting";
    }

    public List<SimulationLog> simulate(Recipe recipe, TemperatureSchedule tempSchedule, int durationDays) {
        // 드라이 호핑 리스트 자리에 빈 리스트(new ArrayList<>())를 넣어서 진짜 simulate 메서드를 호출합니다.
        return simulate(recipe, tempSchedule, new ArrayList<>(), durationDays);
    }
}

