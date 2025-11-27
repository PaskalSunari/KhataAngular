import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManufacturerComponent } from './product-manufacturer.component';

describe('ProductManufacturerComponent', () => {
  let component: ProductManufacturerComponent;
  let fixture: ComponentFixture<ProductManufacturerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductManufacturerComponent]
    });
    fixture = TestBed.createComponent(ProductManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
