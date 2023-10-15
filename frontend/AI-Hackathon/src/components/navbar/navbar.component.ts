import { Component } from '@angular/core';
import { InternetConnectionService } from 'src/services/internet-connection/internet-connection.service';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.less']
})
export class NavbarComponent {
    title = 'AI-Hackathon';

    imagepath = 'assets/img/wi-fi.png';
    alt = 'Internet Connected';

    constructor(private internetConnection: InternetConnectionService) {
        internetConnection.observeConnectionStatus().subscribe((status) => {
            if (status) {
                this.imagepath = 'assets/img/wi-fi.png';
                this.alt = 'Internet Connected';
            } else {
                this.imagepath = 'assets/img/wifi-off.png';
                this.alt = 'Internet Disconnected';
            }
        });
    }
}
