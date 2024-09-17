import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionnistComponent } from './nutritionnist.component';

describe('NutritionnistComponent', () => {
  let component: NutritionnistComponent;
  let fixture: ComponentFixture<NutritionnistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NutritionnistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NutritionnistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
