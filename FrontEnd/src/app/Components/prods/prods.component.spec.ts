import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdsComponent } from './prods.component';

describe('ProdsComponent', () => {
  let component: ProdsComponent;
  let fixture: ComponentFixture<ProdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProdsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
