import { TestBed } from '@angular/core/testing';

import { AudioPlayerService } from './audio-player.service';
import { AudioStreamState } from '../../interfaces/audio-stream-state.interface';

describe('AudioPlayerService', () => {
  let service: AudioPlayerService;

  beforeEach(() => {
    
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioPlayerService);
    
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize audio stream state correctly', () =>  {
    const initialState: AudioStreamState = {
        playing: false,
        readableCurrentTime: '',
        readableDuration: '',
        duration: null,
        currentTime: null,
        canplay: false,
        error: false,
      };
      expect(service['audioStreamState']).toEqual(initialState);
  });

  it('should pause audio', () => {
    spyOn(service['audioObj'], 'pause');
    service.pause();
    expect(service['audioObj'].pause).toHaveBeenCalled();
  });

  it('should stop audio', () => {
    spyOn(service['stop$'], 'next');
    service.stop();
    expect(service['stop$'].next).toHaveBeenCalledWith('');
  });

  it('should seek to a specific time', () => {
    const currentTime = 30; // Sample time to seek to
    service.seekTo(currentTime);
    expect(service['audioObj'].currentTime).toEqual(currentTime);
  });

});