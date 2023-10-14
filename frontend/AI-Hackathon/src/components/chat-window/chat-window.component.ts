import { Component } from '@angular/core';
import { ApiService } from 'src/services/api/api.service';

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

  constructor(private api: ApiService)  {

    // Sample of how to use API Service
    this.api.getHelloWorld().subscribe((data) =>  {
      this.text = data;
      console.log(this.text);
    });
  }
}
