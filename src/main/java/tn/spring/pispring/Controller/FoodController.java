package tn.spring.pispring.Controller;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.spring.pispring.Entities.Food;
import tn.spring.pispring.Interfaces.FoodInterface;
import tn.spring.pispring.Repositories.FoodRepo;
import tn.spring.pispring.Services.FoodService;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@AllArgsConstructor


@CrossOrigin("http://localhost:4200")

@RestController
public class FoodController {
  @Autowired
          FoodRepo foodRepo;
   FoodInterface foodInterface;
   @GetMapping("/retrieveFood")
    public List<Food> retrieveFood() {
        return foodInterface.retrieveFood();
    }
    @PostMapping("/createfood")
    public Food addFood(@RequestBody Food food) {
        return foodInterface.addFood(food);
    }

    @DeleteMapping("/deleteFood/{idFood}")
    public void removeFood(@PathVariable("idFood") long idFood) {
        foodInterface.removeFood(idFood);
    }


    @PutMapping("/updateFood/{id}")
    public ResponseEntity<Food> updateFood(@PathVariable Long id, @RequestBody Food updatedFood) {
        // Recherchez l'aliment existant à l'aide de son ID
        Optional<Food> optionalFood = foodRepo.findById(id);

        if (optionalFood.isPresent()) {
            // Si l'aliment existe, mettez à jour ses données
            Food existingFood = optionalFood.get();
            existingFood.setNamefood(updatedFood.getNamefood());
            existingFood.setCalories_per_serving(updatedFood.getCalories_per_serving());
            existingFood.setProtein_per_serving(updatedFood.getProtein_per_serving());
            existingFood.setCarbohydrates_per_Serving(updatedFood.getCarbohydrates_per_Serving());
            existingFood.setFat_per_Serving(updatedFood.getFat_per_Serving());
            existingFood.setFiber_per_Serving(updatedFood.getFiber_per_Serving());
            existingFood.setVitamins_per_Serving(updatedFood.getVitamins_per_Serving());
            existingFood.setMinerals_per_Serving(updatedFood.getMinerals_per_Serving());

            // Si votre relation est unidirectionnelle, définissez la propriété de l'entité liée ici
            if (updatedFood.getNuttrack() != null) {
                existingFood.setNuttrack(updatedFood.getNuttrack());
            }

            // Enregistrez l'aliment mis à jour dans la base de données
            return ResponseEntity.ok(foodRepo.save(existingFood));
        } else {
            // Si aucun aliment n'est trouvé avec l'ID donné, retournez un statut 404
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/import/excel")
    public ResponseEntity<Map<String, String>> importExcel(@RequestParam("file") MultipartFile file) {
        try {
            foodInterface.importFromExcel(file);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Excel file uploaded successfully!");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to upload Excel file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @GetMapping("/retrieveFood/{id}")
    public Food findFoodById(@PathVariable Long id) {
        return foodInterface.findFoodById(id);
    }
    @GetMapping("/food-details/{foodName}")
    public Food getFoodDetails(@PathVariable String foodName) {
        // Utilisez le service FoodService pour récupérer les détails de l'aliment en fonction de son nom
        return foodInterface.getFoodDetailsByName(foodName);
    }
    @GetMapping("/calories/{name}")
    public long getCaloriesForFood(@PathVariable String name) {
        return foodInterface.getCaloriesForFood(name);
    }
    @GetMapping("/")
    public List<Food> getNutritionAdvice(@RequestParam String goal) {
        return foodInterface.getNutritionAdvice(goal);
    }
}
