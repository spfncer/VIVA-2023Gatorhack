import { Component } from '@angular/core';
import { ApiService } from 'src/services/api/api.service';
import { AudioPlayerService } from 'src/services/audio-player/audio-player.service';
import { AudioFetcherService } from 'src/services/audio-fetcher/audio-fetcher.service'

/**
 * Displays a chat window
 */
@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.less']
})
export class ChatWindowComponent {
  text = "";

  constructor(private api: ApiService, private audioPlayer: AudioPlayerService, private audioFetcher : AudioFetcherService) {

    // Sample of how to use API Service
    this.api.getHelloWorld().subscribe((data) => {
      this.text = data;
      console.log(this.text);
    });
  }

  ngOnInit() {
    this.audioFetcher.getAudio("hello world").subscribe(data => {
      // do something with audio data
      console.log("Audio data");
      console.log(data);
    });
  }

  private playSound() {
    // Sample of how to use audio player service
    this.audioPlayer.setAudioSource("assets/mixkit-arcade-retro-game-over-213.wav");
    this.audioPlayer.observeAudioState().subscribe((data) => {
      console.log(data);
    });
    this.audioPlayer.play();
  }
}
