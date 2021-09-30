import { TestBed } from '@angular/core/testing';

import { EventListenerService } from './event-listener.service';

describe('EventListenerService', () => {
  let service: EventListenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
