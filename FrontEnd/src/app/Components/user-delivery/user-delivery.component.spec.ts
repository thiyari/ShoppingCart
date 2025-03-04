import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeliveryComponent } from './user-delivery.component';

describe('UserDeliveryComponent', () => {
  let component: UserDeliveryComponent;
  let fixture: ComponentFixture<UserDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDeliveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
