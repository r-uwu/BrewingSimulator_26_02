package com.example.demo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

import com.example.demo.domain.*;
import com.example.demo.dto.SimulationRequestDto;
import com.example.demo.dto.SimulationResponseDto;
import com.example.demo.engine.BrewCalculator;
import com.example.demo.engine.FermentationEngine;
import com.example.demo.repository.GrainRepository;
import com.example.demo.repository.HopRepository;
import com.example.demo.repository.YeastRepository;
import com.example.demo.service.BrewingSimulator;
import com.example.demo.simulation.DryHopAddition;
import com.example.demo.simulation.SimulationLog;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/brewing")
@RequiredArgsConstructor // 🌟 필수: final이 붙은 부품(Bean)들을 자동으로 연결해 줍니다.
public class BrewingController {

    private final BrewingSimulator brewingSimulator;
    private final BrewCalculator calculator;
    private final GrainRepository grainRepo;
    private final HopRepository hopRepo;
    private final YeastRepository yeastRepo;
    private final FermentationEngine fermEngine;

    @PostMapping("/simulate")
    public SimulationResponseDto runSimulation(@RequestBody SimulationRequestDto request) {
        
        Recipe recipe = new Recipe(request.getBatchSizeLiters(), request.getEfficiency());

        // 레시피 조립 위치
        for (SimulationRequestDto.GrainRequest g : request.getGrains()) {
            //recipe.addMalt(grainRepo.findByName(g.getName()), g.getWeightKg());
        
        	Grain grain = grainRepo.findByName(g.getName())
                    .orElseThrow(() -> new IllegalArgumentException("DB에 없는 몰트입니다: " + g.getName()));
            
            recipe.addMalt(grain, g.getWeightKg());
        }
        
        
        for (SimulationRequestDto.HopRequest h : request.getHops()) {
            //recipe.addHop(hopRepo.findByName(h.getName()), h.getAmountGrams(), h.getBoilTimeMinutes());
        	Hop hop = hopRepo.findByname(h.getName())
        			.orElseThrow(() -> new IllegalArgumentException("DB에 없는 몰트입니다: " + h.getName()));
        	recipe.addHop(hop, h.getAmountGrams(), h.getBoilTimeMinutes());
        }
        
        Yeast yeast = yeastRepo.findByName(request.getYeast().getName())
        		.orElseThrow(() -> new IllegalArgumentException("DB에 없는 효모입니다: " + request.getYeast().getName()));
        
        recipe.setYeastItem(new YeastItem(yeast, request.getYeast().getAmount(), true, 0, 0, false));

        List<DryHopAddition> dryHopAdditions = new ArrayList<>();
        if (request.getDryHops() != null) {
            for (SimulationRequestDto.DryHopRequest dh : request.getDryHops()) {
            	Hop dhHop = hopRepo.findByName(dh.getName())
            			.orElseThrow(() -> new IllegalArgumentException("DB에 없는 드라이홉입니다: " + dh.getName()));
                dryHopAdditions.add(new DryHopAddition(dh.getHour(), dhHop, dh.getAmountGrams()));
            }
        }

        double og = calculator.calculateOG(recipe);
        double ibu = calculator.calculateIBU(recipe);
        double srm = calculator.calculateSRM(recipe);
        
        FermentationEngine tempFermEngine = new FermentationEngine();
        double targetFG = tempFermEngine.calculateFG(recipe, og, yeast.getMaxTemp(), 65.0);
        double estABV = tempFermEngine.calculateABV(og, targetFG);

        double gravityUnits = (og > 1.0) ? (og - 1.0) * 1000.0 : 0.0;
        double buGuRatio = (gravityUnits > 0) ? (ibu / gravityUnits) : 0.0;
        String balance = (buGuRatio > 0.8) ? "Very Bitter / Hoppy" : (buGuRatio > 0.5) ? "Balanced" : "Malty / Sweet";
        
        double totalDryHops = dryHopAdditions.stream().mapToDouble(DryHopAddition::amountGrams).sum();
        double dryHopRate = totalDryHops / recipe.getBatchSizeLiters();
        double pitchRate = request.getYeast().getAmount() / recipe.getBatchSizeLiters();

        List<SimulationLog> logs = brewingSimulator.simulate(recipe, request.getTempSchedule(), dryHopAdditions, request.getDurationDays());

        //ResponseDto에 반환
        SimulationResponseDto response = new SimulationResponseDto();
        response.setOriginalGravity(og);
        response.setFinalGravity(targetFG);
        response.setEstimatedAbv(estABV);
        response.setIbu(ibu);
        response.setSrm(srm);
        response.setBuGuRatio(buGuRatio);
        response.setBalanceProfile(balance);
        response.setDryHopRate(dryHopRate);
        response.setPitchRate(pitchRate);
        response.setLogs(logs);

        return response;
    }
}