import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonepeSuccessComponent } from './phonepe-success.component';

describe('PhonepeSuccessComponent', () => {
  let component: PhonepeSuccessComponent;
  let fixture: ComponentFixture<PhonepeSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhonepeSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhonepeSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
