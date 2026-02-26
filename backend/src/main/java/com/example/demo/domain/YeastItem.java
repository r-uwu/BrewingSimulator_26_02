package com.example.demo.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class YeastItem {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "yeast_id")
    private Yeast yeast;

    private double amount;
    private boolean amountIsWeight;
    private int timesCultured;
    private int ageInMonths;
    private boolean addToSecondary;

    public YeastItem(Yeast yeast, double amount, boolean amountIsWeight, int timesCultured, int ageInMonths, boolean addToSecondary) {
        this.yeast = yeast;
        this.amount = amount;
        this.amountIsWeight = amountIsWeight;
        this.timesCultured = timesCultured;
        this.ageInMonths = ageInMonths;
        this.addToSecondary = addToSecondary;
    }
}