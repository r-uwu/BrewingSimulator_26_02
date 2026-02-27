package com.example.demo.domain;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Recipe {
	
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    
	private Long id;
    private String name;

    //CascadeType.ALL: 레시피 저장/삭제 시 아이템들도 함께 저장/삭제됨
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GrainItem> grainItems = new ArrayList<>();
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HopItem> hopItems = new ArrayList<>();

    private double batchSizeLiters;
    private double efficiency;

    @OneToOne(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private YeastItem yeastItem;

    public Recipe(double batchSizeLiters, double efficiency) {
        this.batchSizeLiters = batchSizeLiters;
        this.efficiency = efficiency;
    }

    public void addMalt(Grain grain, double weightKg) {
        GrainItem item = new GrainItem(grain, weightKg);
        item.setRecipe(this);
        this.grainItems.add(item);
    }

    public void addHop(Hop hop, double amountGrams, int boilTimeMinutes) {
    	HopItem item = new HopItem(hop, amountGrams, boilTimeMinutes);
        item.setRecipe(this);
        this.hopItems.add(item);
    }


//    public List<GrainItem> getGrainItems() { return grainItems; }
//    public List<HopItem> getHopItems() { return hopItems; }
//    public YeastItem getYeastItem() { return yeastItem; }
//    public double getBatchSizeLiters() { return batchSizeLiters; }
//    public double getEfficiency() { return efficiency; }

//    public void addYeast(Yeast yeast, double amount){
//        this.yeastItem = new YeastItem(yeast, amount, true, 3, 3,false);
//    }

    public void setYeastItem(YeastItem yeastItem) {
        this.yeastItem = yeastItem;
        if (yeastItem != null) { yeastItem.setRecipe(this);}
    }
    
    private int durationDays;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DryHopItem> dryHopItems = new ArrayList<>();

    public void addDryHop(Hop hop, double amountGrams, int insertHour) {
        DryHopItem item = new DryHopItem(hop, amountGrams, insertHour);
        item.setRecipe(this);
        this.dryHopItems.add(item);
    }
}