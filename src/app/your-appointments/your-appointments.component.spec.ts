import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourAppointmentsComponent } from './your-appointments.component';

describe('YourAppointmentsComponent', () => {
  let component: YourAppointmentsComponent;
  let fixture: ComponentFixture<YourAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourAppointmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
