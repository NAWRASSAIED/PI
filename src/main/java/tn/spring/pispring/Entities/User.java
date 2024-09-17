package tn.spring.pispring.Entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userName;
    private String password;
    private Date datenaissance;
    @JsonIgnore
    private Float weight;
    @JsonIgnore
    private Float hight;
    @Enumerated(EnumType.STRING)
    @JsonIgnore
    private Objectif objectif;
    @JsonIgnore
    private Float imc;
    private String  city;
private int rating;
    private String number;



    //enumeration private Objectif //

@JsonIgnore
    @OneToOne(mappedBy = "user")
    private Abonnement abonnement;


    @ManyToOne
    Role role;

    @OneToOne
    @JsonIgnore
    private NutritionalGoal nutritionalGoal;
    @JsonIgnore
    @OneToOne
    private Fidelity fidelity;

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "user")
    public List<Orderr> orderrs;

@JsonIgnore
    @OneToMany(mappedBy = "userworkout")
    private  List<FollowedProgram> followedProgramsuser;


//    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
  //  private List<Post> posts;
@JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Commentaire> commentaires;

}
