import { TestBed } from '@angular/core/testing';

import { AppointmentNutService } from './appointment-nut.service';

describe('AppointmentNutService', () => {
  let service: AppointmentNutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentNutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
