package tn.spring.pispring.Controller;


import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.spring.pispring.Entities.User;
import tn.spring.pispring.Interfaces.UserInterface;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor

@RestController
public class UserController {

    UserInterface userInterface;

    @PostMapping("/createuser")
    public User CreateUser(@RequestBody User user) {
        return userInterface.CreateUser(user);
    }
    @GetMapping("/users/nutritionists/{id}")
    public ResponseEntity<User> getNutritionistById(@PathVariable Long id) {
        Optional<User> nutritionist = userInterface.getNutritionistById(id);
        if (nutritionist.isPresent()) {
            return ResponseEntity.ok(nutritionist.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/nutritionists")
    public List<User> getAllNutritionists() {
        return userInterface.getAllNutritionists();
    }

    @GetMapping("/retrieveAllUsers")
    public List<User> retrieveAllUsers() {
        return userInterface.retrieveAllUsers();
    }
    @PutMapping("/updateuser")
    public User updateUser(@RequestBody User user) {
        return userInterface.updateUser(user);
    }

    @DeleteMapping("/retrieveUser/{idUser}")
    public User retrieveUser(@PathVariable("idUser")long idUser) {
        return userInterface.retrieveUser(idUser);
    }
    @PatchMapping("/{userId}/rate")
    public void rateNutritionist(@PathVariable Long userId, @RequestParam int rating) {
        userInterface.rateNutritionist(userId, rating);
    }

    @GetMapping("/rating/{minRating}")
    public List<User> getNutritionistsByRating(@PathVariable int minRating) {
        return userInterface.getNutritionistsByRating(minRating);
    }
    @GetMapping("/us/{id}")
    public User getUserById(@PathVariable Long id) {
        return userInterface.getUserById(id);

    }

}
