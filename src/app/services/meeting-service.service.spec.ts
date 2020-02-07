import { TestBed } from '@angular/core/testing';

import { MeetingServiceService } from './meeting-service.service';

describe('MeetingServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MeetingServiceService = TestBed.get(MeetingServiceService);
    expect(service).toBeTruthy();
  });
});
