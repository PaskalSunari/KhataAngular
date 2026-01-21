import { TestBed } from '@angular/core/testing';

import { SupplyReportService } from './supply-report.service';

describe('SupplyReportService', () => {
  let service: SupplyReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplyReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
