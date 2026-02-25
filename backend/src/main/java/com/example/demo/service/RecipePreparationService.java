package com.example.demo.service;

import com.example.demo.domain.*;
import com.example.demo.repository.GrainRepository;
import com.example.demo.repository.HopRepository;
import com.example.demo.repository.YeastRepository;
import com.example.demo.simulation.DryHopAddition;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipePreparationService {

    private final GrainRepository grainRepo;
    private final HopRepository hopRepo;
    private final YeastRepository yeastRepo;

    /**
     * 이름만 들어있는 레시피 객체를 DB(Repository)의 진짜 데이터로 교체합니다.
     */
    public void prepareRecipeData(Recipe recipe, List<DryHopAddition> dryHopAdditions) {
        
        if (recipe.getGrainItems() != null) {
            List<GrainItem> grains = recipe.getGrainItems().stream()
                .map(item -> new GrainItem(
                        grainRepo.findByName(item.grain().name()),
                        item.weightKg()
                )).collect(Collectors.toList());
            
            recipe.getGrainItems().clear();
            recipe.getGrainItems().addAll(grains);
        }

        if (recipe.getHopItems() != null) {
            List<HopItem> hops = recipe.getHopItems().stream()
                .map(item -> new HopItem(
                        hopRepo.findByName(item.hop().name()), 
                        item.amountGrams(),
                        item.boilTimeMinutes()
                )).collect(Collectors.toList());
            
            recipe.getHopItems().clear();
            recipe.getHopItems().addAll(hops);
        }

        if (recipe.getYeastItem() != null && recipe.getYeastItem().yeast() != null) {
            Yeast yeast = yeastRepo.findByName(recipe.getYeastItem().yeast().name());
            YeastItem incoming = recipe.getYeastItem();
            
            recipe.setYeastItem(new YeastItem(
                    yeast,
                    incoming.amount(),
                    incoming.amountIsWeight(),
                    incoming.timesCultured(),
                    incoming.ageInMonths(),
                    incoming.addToSecondary()
            ));
        }

        if (dryHopAdditions != null && !dryHopAdditions.isEmpty()) {
            List<DryHopAddition> dryHops = dryHopAdditions.stream()
                .map(dh -> new DryHopAddition(
                        dh.hour(),
                        hopRepo.findByName(dh.hop().name()),
                        dh.amountGrams()
                )).collect(Collectors.toList());
            
            dryHopAdditions.clear();
            dryHopAdditions.addAll(dryHops);
        }
    }
}