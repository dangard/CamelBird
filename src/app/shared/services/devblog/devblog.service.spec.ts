import { TestBed } from '@angular/core/testing';

import { DevblogService } from './devblog.service';

describe('DevblogService', () => {
  let service: DevblogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevblogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
