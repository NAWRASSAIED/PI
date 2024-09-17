package tn.spring.pispring.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Availability implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long availabilityId;
    private String date_av;
    private String startTime;
    private String endTime;
  @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "nutritionist_id")
    private User nutritionist;
@JsonIgnore
    @OneToMany(mappedBy = "availability")
    private List<AppointmentNut> appointments;

}
