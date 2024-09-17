package tn.spring.pispring.Interfaces;

import org.springframework.web.bind.annotation.PathVariable;
import tn.spring.pispring.Entities.User;

import java.util.List;
import java.util.Optional;

public interface UserInterface {

    public User CreateUser(User user);

    List<User> retrieveAllUsers();

    User updateUser (User user);

    User retrieveUser (long idUser);
    public List<User> getAllNutritionists();
    public Optional<User> getNutritionistById(Long userId);
    public void rateNutritionist(Long userId, int rating) ;
    public User getUserById(@PathVariable Long id);
    public List<User> getNutritionistsByRating(int minRating);


}
