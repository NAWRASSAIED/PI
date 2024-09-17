package tn.spring.pispring.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.spring.pispring.Entities.AppointmentNut;

import java.util.List;

public interface AppointmentNutRepo extends JpaRepository<AppointmentNut,Long> {

    @Query("SELECT a FROM AppointmentNut a WHERE a.date_app = :date_app")
    List<AppointmentNut> findByDate(@Param("date_app") String date_app);
}
