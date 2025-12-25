import { TestBed } from '@angular/core/testing';

import { DeptStockLocationMappingService } from './dept-stock-location-mapping.service';

describe('DeptStockLocationMappingService', () => {
  let service: DeptStockLocationMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeptStockLocationMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
