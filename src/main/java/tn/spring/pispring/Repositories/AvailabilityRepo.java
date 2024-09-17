package tn.spring.pispring.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.spring.pispring.Entities.Availability;

import java.util.List;

public interface AvailabilityRepo extends JpaRepository<Availability,Long> {
    @Query("SELECT a FROM Availability a WHERE a.date_av = :date_av")
    List<Availability> findByDateAv(@Param("date_av") String date_av);

}
