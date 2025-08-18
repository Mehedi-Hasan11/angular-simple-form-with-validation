import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBioComponent } from './employee-bio';

describe('EmployeeBioComponent', () => {
  let component: EmployeeBioComponent;
  let fixture: ComponentFixture<EmployeeBioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeBioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeBioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
