package com.example.demo.dto;

import com.example.demo.domain.Recipe;
import lombok.Getter;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class RecipeDto {
    private Long id;
    private String name;
    private double batchSizeLiters;
    private int durationDays;
    
    // 🌟 List<String> 대신 내부 DTO(Record) 리스트로 변경!
    private List<GrainDto> grains;
    private List<HopDto> hops;
    private List<DryHopDto> dryHops;
    private YeastDto yeast;

    public RecipeDto(Recipe recipe) {
        this.id = recipe.getId();
        this.name = recipe.getName();
        this.batchSizeLiters = recipe.getBatchSizeLiters();
        this.durationDays = recipe.getDurationDays();
        
        this.grains = recipe.getGrainItems().stream()
                .map(g -> new GrainDto(g.getGrain().getName(), g.getWeightKg()))
                .collect(Collectors.toList());
                
        this.hops = recipe.getHopItems().stream()
                .map(h -> new HopDto(h.getHop().getName(), h.getAmountGrams(), h.getBoilTimeMinutes()))
                .collect(Collectors.toList());
                
        if (recipe.getYeastItem() != null && recipe.getYeastItem().getYeast() != null) {
            this.yeast = new YeastDto(recipe.getYeastItem().getYeast().getName(), recipe.getYeastItem().getAmount());
        }
        
        this.dryHops = recipe.getDryHopItems().stream()
                .map(dh -> new DryHopDto(dh.getHop().getName(), dh.getAmountGrams(), dh.getInsertHour()))
                .collect(Collectors.toList());
    }

    public record GrainDto(String name, double weightKg) {}
    public record HopDto(String name, double amountGrams, int boilTimeMinutes) {}
    public record DryHopDto(String name, double amountGrams, int insertDay) {} 
    public record YeastDto(String name, double amount) {}
}