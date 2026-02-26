package com.example.demo.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class HopItem {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hop_id")
    private Hop hop;

    private double amountGrams;
    private int boilTimeMinutes;

    public HopItem(Hop hop, double amountGrams, int boilTimeMinutes) {
        this.hop = hop;
        this.amountGrams = amountGrams;
        this.boilTimeMinutes = boilTimeMinutes;
    }
}