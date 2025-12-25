import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptStockLocationMappingComponent } from './dept-stock-location-mapping.component';

describe('DeptStockLocationMappingComponent', () => {
  let component: DeptStockLocationMappingComponent;
  let fixture: ComponentFixture<DeptStockLocationMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeptStockLocationMappingComponent]
    });
    fixture = TestBed.createComponent(DeptStockLocationMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
