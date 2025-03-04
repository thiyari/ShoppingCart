import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrderDeliveryComponent } from './view-order-delivery.component';

describe('ViewOrderDeliveryComponent', () => {
  let component: ViewOrderDeliveryComponent;
  let fixture: ComponentFixture<ViewOrderDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewOrderDeliveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOrderDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
