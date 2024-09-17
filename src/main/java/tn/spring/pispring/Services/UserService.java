package tn.spring.pispring.Services;


import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.spring.pispring.Entities.Role;
import tn.spring.pispring.Entities.User;
import tn.spring.pispring.Interfaces.UserInterface;
import tn.spring.pispring.Repositories.RoleRepo;
import tn.spring.pispring.Repositories.UserRepo;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService implements UserInterface {

    UserRepo userRepo;
   RoleRepo roleRepo;
@Override

    public User CreateUser(User user) {
        // Vérifier si le rôle associé à l'utilisateur existe déjà dans la base de données
        Role role = user.getRole();
        if (role != null && role.getId() == null) {
            // Si le rôle n'a pas d'ID, cela signifie qu'il n'est pas encore sauvegardé
            // Sauvegarder le rôle en premier
            role = roleRepo.save(role);
            // Mettre à jour l'utilisateur avec le rôle sauvegardé
            user.setRole(role);
        }
        // Sauvegarder l'utilisateur
        return userRepo.save(user);
    }


    @Override
    public List<User> retrieveAllUsers() {
        return userRepo.findAll();
    }


    @Override
    public User updateUser(User user) {
        return userRepo.save(user);
    }

    @Override
    public User retrieveUser(long idUser) {
        return userRepo.findById(idUser).orElse(null);
    }
    @Override
    public List<User> getAllNutritionists() {
        return userRepo.findByRoleName("Nutritionnist");
    }
    @Override
    public Optional<User> getNutritionistById(Long userId) {
        return userRepo.findById(userId);
    }
   @Override
   public void rateNutritionist(Long userId, int rating) {
       // Récupérer l'utilisateur (nutritionniste) à partir de la base de données
       User user = userRepo.findById(userId).orElse(null);

       if (user != null) {
           // Mettre à jour la note du nutritionniste
           Role role = user.getRole();
           int currentRating = user.getRating();
           int newRating = (currentRating + rating) / 2; // Par exemple, calculer la moyenne des notes
           user.setRating(newRating);
           // Enregistrer les modifications dans la base de données
           userRepo.save(user);
       } else {
           // Gérer le cas où l'utilisateur (nutritionniste) n'est pas trouvé
           throw new RuntimeException("Nutritionist not found with ID: " + userId);
       }
   }
   @Override
    public List<User> getNutritionistsByRating(int minRating) {
        // Fetch all nutritionists
        List<User> nutritionists = userRepo.findAll();

        // Filter nutritionists by rating
        return nutritionists.stream()
                .filter(nutritionist -> nutritionist.getRating() >= minRating)
                .collect(Collectors.toList());
    }

    @Override
    public User getUserById(Long id) {
        return userRepo.findById(id).get();
    }

}
