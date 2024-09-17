import { Component, ViewChild } from '@angular/core';
import { AvailibilityService } from '../services/availibility.service';
import { Availability } from '../models/Availability';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';




@Component({
  selector: 'app-list-availability',
  templateUrl: './list-availability.component.html',
  styleUrls: ['./list-availability.component.css']
})
export class ListAvailabilityComponent {
  availabilities: Availability[] = [];
  dataSource: MatTableDataSource<Availability> = new MatTableDataSource<Availability>();
  dateFilter: string = '';

  displayedColumns: string[] = [ 'date_av', 'startTime', 'endTime', 'nutritionist', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private availabilityService: AvailibilityService) { }

  ngOnInit(): void {
    this.getAvailabilities();
  }

  getAvailabilities(): void {
    this.availabilityService.getAllAvailabilities().subscribe(
      availabilities => {
        this.availabilities = availabilities;
        this.dataSource.data = availabilities;
        this.dataSource.paginator = this.paginator;
      },
      error => {
        console.error('Error fetching availabilities:', error);
      }
    );
  }

  deleteAvailability(availabilityId: number): void {
    this.availabilityService.deleteAvailability(availabilityId).subscribe(
      () => {
        console.log('Availability deleted successfully');
        this.getAvailabilities(); // Rafraîchir la liste après la suppression
      },
      error => {
        console.error('Error deleting availability:', error);
      }
    );
  }

  applyDateFilter(): void {
    this.dataSource.filter = this.dateFilter.trim().toLowerCase();
  }

}
