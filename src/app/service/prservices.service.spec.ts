import { TestBed } from '@angular/core/testing';

import { PRServicesService } from './prservices.service';

describe('PRServicesService', () => {
  let service: PRServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PRServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
