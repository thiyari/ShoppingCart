import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdregComponent } from './prodreg.component';

describe('ProdregComponent', () => {
  let component: ProdregComponent;
  let fixture: ComponentFixture<ProdregComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProdregComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
