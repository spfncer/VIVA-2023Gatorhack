import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { AudioStreamState } from '../../interfaces/audio-stream-state.interface';

// TODO: Modify this to play many sources at once
@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private audioObj = new Audio();

  private audioStreamState: AudioStreamState = {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: null,
    currentTime: null,
    canplay: false,
    error: false
  };

  private audioEvents = [
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadedmetadata",
    "loadstart"
  ];

  private stop$ = new Subject();
  private state$ = new BehaviorSubject<AudioStreamState>(this.audioStreamState);

  constructor() { }

  private audioStreamObservable()  {
    return new Observable(observer =>  {
        //this.audioObj.muted = true;
        //this.audioObj.autoplay = true;
        this.audioObj.play();

        const handler = (event: Event) => {
            this.updateStateWithEvent(event);
            observer.next(event); 
        };

        this.addEvents(this.audioObj, this.audioEvents, handler);

        return () =>  {
            this.audioObj.pause();
            this.audioObj.currentTime = 0;
            this.removeEvents(this.audioObj, this.audioEvents, handler);
            this.resetState();
        }
    });
  }

  private addEvents(obj: HTMLAudioElement, events: string[], handler: (event: Event)=>void): void  {
    events.forEach((event: string) =>  {
        obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj: HTMLAudioElement, events: string[], handler: (event: Event)=>void): void  {
    events.forEach((event: string) =>  {
        obj.addEventListener(event, handler);
    });
  }

  /**
   * Updates the state of the audio player with each occuring audio event
   * @param {Event} event the event that occurred
   */
  private updateStateWithEvent(event: Event)  {
    switch (event.type)  {
      case 'canplay':
        this.audioStreamState.canplay = true;
        this.audioStreamState.duration = this.audioObj.duration;
        this.audioStreamState.readableDuration = '' + this.audioObj.duration; // Add some method for changing
        break;
      case 'playing':
        this.audioStreamState.playing = true;
        break;
      case 'pause':
        this.audioStreamState.playing = false;
        break;
      case 'timeupdate':
        this.audioStreamState.currentTime = this.audioObj.currentTime;
        this.audioStreamState.readableCurrentTime = '' + this.audioObj.currentTime; //this.formatTime(this.state.currentTime);
        break;
      case 'error':
        this.resetState();
        this.audioStreamState.error = true;
        break;
    }
    this.state$.next(this.audioStreamState);
  }

  /**
   * Helper function that resets the state of the audio player.
   */
  private resetState()  {
    this.audioStreamState = {
      playing: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: null,
      currentTime: null,
      canplay: false,
      error: false
    };
  }

  /**
   * Sets the source for the audio
   * @param {string} file_url the audio file location
   * @returns 
   */
  public setAudioSource(file_url: string)  {
    this.audioObj.src = file_url;
    this.audioObj.load();
  }

  /**
   * Play the audio file which is loaded
   */
  public play()  {
    this.audioStreamObservable().pipe(takeUntil(this.stop$)).subscribe(() => {});
  }

  /**
   * Pause the audio that is playing
   */
  public pause()  {
    this.audioObj.pause();
  }

  /**
   * Stop the audio completely
   */
  public stop() {
    this.stop$.next('');
  }

  /**
   * Go to a certain second of the audio recording
   * @param {number} seconds 
   */
  public seekTo(seconds: number) {
    this.audioObj.currentTime = seconds;
  }

  /**
   * Observe the status of the audio stream
   * @returns {Observable<AudioStreamState>} an Observable of the audio stream status
   */
  public observeAudioState(): Observable<AudioStreamState>  {
    return this.state$.asObservable();
  }
}