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
  transcript = "";
  promptText = "";
  viseme: any;
  waiting = false;

  hasInitialized = false;

  private wasPlaying = false;

  constructor(private api: ApiService, private audioPlayer: AudioPlayerService, private speechRecognizer: SpeechToTextService) {
    // Sample of how to use API Service
    this.api.getHelloWorld().subscribe((data) => {
      this.promptText = data;
      console.log(this.promptText);
    });

    this.speechRecognizer.observeRecognizedText().subscribe((data) => {
      this.promptText = data;
      if (!this.promptText) {
        this.promptText = '';
      }
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
        this.transcript += "You: " + this.promptText + '\n';
        this.scrollTranscript();
        this.api.postQuery(this.promptText).subscribe((data: any) => {
          this.promptText = '';
          const stringifiedData = JSON.stringify(data);
          // Parse from JSON
          const parsedJson = JSON.parse(stringifiedData);
          this.transcript += "Viva: " + parsedJson.text + '\n';
          this.viseme = parsedJson.viseme;
          // Play Audio
          const url = "data:audio/wav;base64," + parsedJson.audio;
          this.audioPlayer.setAudioSource(url);
          this.audioPlayer.play();
          this.waiting = false;
          this.scrollTranscript();
        });
      }
    });
  }

  private scrollTranscript() {
    const transcriptBox = document.getElementById("transcript-text");
    if (transcriptBox != null) {
      transcriptBox.scrollTop = transcriptBox?.scrollHeight;
    }
  }
}
