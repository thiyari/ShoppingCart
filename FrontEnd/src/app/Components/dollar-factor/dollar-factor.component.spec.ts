import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DollarFactorComponent } from './dollar-factor.component';

describe('DollarFactorComponent', () => {
  let component: DollarFactorComponent;
  let fixture: ComponentFixture<DollarFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DollarFactorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DollarFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
