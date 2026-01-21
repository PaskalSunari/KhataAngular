import { TestBed } from '@angular/core/testing';

import { DemandReportService } from './demand-report.service';

describe('DemandReportService', () => {
  let service: DemandReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
