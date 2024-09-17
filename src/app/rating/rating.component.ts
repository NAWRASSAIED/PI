import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {
  rated: number = 0;
  @Output() ratingChange = new EventEmitter<number>(); // Changement ici

  rateNutritionist(rating: number): void {
    this.rated = rating;
    this.ratingChange.emit(rating); // Changement ici
  }
}


