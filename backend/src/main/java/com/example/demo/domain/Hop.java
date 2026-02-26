package com.example.demo.domain;

import java.util.List;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Hop{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique = true)
	private String name;
	
	private double alphaAcid;
	
	
	// 리스트 형태 홉 플레이버 별개의 테이블로 관리하는법
    @ElementCollection
    @CollectionTable(name = "hop_flavor_tags", joinColumns = @JoinColumn(name = "hop_id"))
    @Column(name = "flavor_tag")
    private List<String> flavorTags;

    
    public Hop(String name, double alphaAcid, List<String> flavorTags) {
        this.name = name;
        this.alphaAcid = alphaAcid;
        this.flavorTags = flavorTags;
    }
	
}



//public record Hop(String name, double alphaAcid, List<String> flavorTags) {
//}