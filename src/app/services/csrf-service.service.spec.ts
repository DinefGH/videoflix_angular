import { TestBed } from '@angular/core/testing';

import { CsrfServiceService } from './csrf-service.service';

describe('CsrfServiceService', () => {
  let service: CsrfServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsrfServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
