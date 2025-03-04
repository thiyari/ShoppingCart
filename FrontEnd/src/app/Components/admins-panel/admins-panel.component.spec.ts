import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsPanelComponent } from './admins-panel.component';

describe('AdminsPanelComponent', () => {
  let component: AdminsPanelComponent;
  let fixture: ComponentFixture<AdminsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
