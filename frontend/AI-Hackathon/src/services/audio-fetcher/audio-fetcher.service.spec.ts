import { TestBed } from '@angular/core/testing';

import { AudioFetcherService } from './audio-fetcher.service';

describe('AudioFetcherService', () => {
  let service: AudioFetcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioFetcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
