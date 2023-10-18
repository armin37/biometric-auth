import { TestBed } from '@angular/core/testing';

import { ServerMockService } from './server-mock.service';

describe('ServerMockService', () => {
  let service: ServerMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
