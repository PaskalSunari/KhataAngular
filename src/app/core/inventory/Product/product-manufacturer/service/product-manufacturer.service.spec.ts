import { TestBed } from '@angular/core/testing';

import { ProductManufacturerService } from './product-manufacturer.service';

describe('ProductManufacturerService', () => {
  let service: ProductManufacturerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductManufacturerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
