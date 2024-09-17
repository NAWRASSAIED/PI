package tn.spring.pispring.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentNut implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long appointmentId;
    private String date_app;
    private String time;

   @JsonIgnore
    @ManyToOne

    private User client;
@JsonIgnore
    @ManyToOne
    @JoinColumn(name = "nutritionist_id")
    private User nutritionist;
@JsonIgnore
    @ManyToOne
    @JoinColumn(name = "availability_id")
    private Availability availability;
}
