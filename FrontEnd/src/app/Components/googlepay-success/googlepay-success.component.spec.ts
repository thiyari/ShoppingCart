import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GooglepaySuccessComponent } from './googlepay-success.component';

describe('GooglepaySuccessComponent', () => {
  let component: GooglepaySuccessComponent;
  let fixture: ComponentFixture<GooglepaySuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GooglepaySuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GooglepaySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
