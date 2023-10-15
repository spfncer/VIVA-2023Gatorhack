import { Component } from '@angular/core';
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

  constructor(private api: ApiService, private audioPlayer: AudioPlayerService, private speechRecognizer: SpeechToTextService) {

    // Sample of how to use API Service
    this.api.getHelloWorld().subscribe((data) => {
      this.text = data;
      console.log(this.text);
    });

    this.speechRecognizer.observeRecognizedText().subscribe((data) => {
      console.log(data);
    });

    this.speechRecognizer.start();

  }


  private playSound() {
    // Sample of how to use audio player service
    this.audioPlayer.setAudioSource("assets/mixkit-arcade-retro-game-over-213.wav");
    this.audioPlayer.observeAudioState().subscribe((data) => {
      console.log(data);

    // Sample of how to use audio player service
    this.api.postQuery("The Neural Net Workers Have Almost Finished their project.").subscribe((data: any) => {
      //console.log(data);
      const stringifiedData = JSON.stringify(data);
      //console.log("With Stringify :", stringifiedData);

      // Parse from JSON
      const parsedJson = JSON.parse(stringifiedData);
      this.viseme = parsedJson.viseme;

      const url = "data:audio/wav;base64," + parsedJson.audio;
      this.audioPlayer.setAudioSource(url);
      this.audioPlayer.observeAudioState().subscribe((data) => {
        console.log(data);
      });
      this.audioPlayer.play();
    });
  }
}
