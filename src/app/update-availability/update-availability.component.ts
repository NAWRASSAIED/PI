import { Component } from '@angular/core';
import { AvailibilityService } from '../services/availibility.service';
import { Availability } from '../models/Availability';

@Component({
  selector: 'app-update-availability',
  templateUrl: './update-availability.component.html',
  styleUrls: ['./update-availability.component.css']
})
export class UpdateAvailabilityComponent {
  availability: Availability = {
    availabilityId: 0,
    date_av: '',
    startTime: '',
    endTime: '',
   
  };

  constructor(private availabilityService: AvailibilityService) { }

  updateAvailability(): void {
    const { availabilityId, ...updatedAvailability } = this.availability; // Exclude availabilityId from the update object
    this.availabilityService.updateAvailability(availabilityId, updatedAvailability as Availability) // Cast updatedAvailability as Availability
      .subscribe(
        updatedAvailability => {
          console.log('Availability updated successfully:', updatedAvailability);
          // Handle success response
        },
        error => {
          console.error('Error updating availability:', error);
          // Handle error response
        }
      );
  }
}
