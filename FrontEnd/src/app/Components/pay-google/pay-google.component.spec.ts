import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayGoogleComponent } from './pay-google.component';

describe('PayGoogleComponent', () => {
  let component: PayGoogleComponent;
  let fixture: ComponentFixture<PayGoogleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayGoogleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
