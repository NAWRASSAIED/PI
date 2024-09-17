import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAvailabilityComponent } from './list-availability.component';

describe('ListAvailabilityComponent', () => {
  let component: ListAvailabilityComponent;
  let fixture: ComponentFixture<ListAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAvailabilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
