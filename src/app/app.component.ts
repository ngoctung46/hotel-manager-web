import { FirebaseService } from './services/firebase.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private fs: FirebaseService) {
    // this.fs.initMenu();
    // this.fs.initRooms();
  }
}
