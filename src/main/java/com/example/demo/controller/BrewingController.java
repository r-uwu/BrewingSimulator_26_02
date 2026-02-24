package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.SimulationRequestDto;
import com.example.demo.service.BrewingSimulator;
import com.example.demo.simulation.SimulationLog;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/brewing")
@RequiredArgsConstructor
public class BrewingController {

    private final BrewingSimulator brewingSimulator;

    /**
     * 시뮬레이션 실행 API
     * HTTP POST 요청으로 들어온 JSON 데이터를 DTO로 변환하여 받습니다.
     */
    @PostMapping("/simulate")
    public List<SimulationLog> runSimulation(@RequestBody SimulationRequestDto request) {
        
        // DTO에서 데이터를 꺼내어 시뮬레이터 실행
        return brewingSimulator.simulate(
                request.getRecipe(),
                request.getTempSchedule(),
                request.getDryHopAdditions(),
                request.getDurationDays()
        );
    }
}