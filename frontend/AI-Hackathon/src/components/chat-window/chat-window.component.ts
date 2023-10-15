import { Component } from '@angular/core';
import { AudioStreamState } from 'src/interfaces/audio-stream-state.interface';
import { ApiService } from 'src/services/api/api.service';
import { AudioPlayerService } from 'src/services/audio-player/audio-player.service';
import { SpeechToTextService } from 'src/services/speech-to-text/speech-to-text.service';

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
  viseme: any;
  waiting = false;

  private wasPlaying = false;
  constructor(private api: ApiService, private audioPlayer: AudioPlayerService, private speechRecognizer: SpeechToTextService) {

    // Sample of how to use API Service
    this.api.getHelloWorld().subscribe((data) => {
      this.text = data;
      console.log(this.text);
    });

    this.speechRecognizer.observeRecognizedText().subscribe((data) => {
      this.text = data;
    });

    this.audioPlayer.observeAudioState().subscribe((state: AudioStreamState) => {
      if (state.currentTime == state.duration && state.playing == false && state.playing != this.wasPlaying) {
        this.makeQuery();
      }
      this.wasPlaying = state.playing;
    });
  }

  public makeQuery() {
    this.speechRecognizer.start();
    this.speechRecognizer.observeSpeechToTextOn().subscribe((value) => {
      if (this.waiting) { return; }

      if (value == false) {
        this.waiting = true;
        this.api.postQuery(this.text).subscribe((data: any) => {
          const stringifiedData = JSON.stringify(data);
          // Parse from JSON
          const parsedJson = JSON.parse(stringifiedData);
          this.viseme = parsedJson.viseme;
          // Play Audio
          const url = "data:audio/wav;base64," + parsedJson.audio;
          this.audioPlayer.setAudioSource(url);
          this.audioPlayer.play();
          this.waiting = false;
        });
      }
    });
  }
}
