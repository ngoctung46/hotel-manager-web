import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Observable } from 'rxjs';
import { Room } from 'src/app/models/room';
import { tap } from 'rxjs/operators';
import { Note } from 'src/app/models/note';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  rooms$: Observable<Room[]>;
  note$: Observable<Note>;
  constructor(private fs: FirebaseService) {}

  ngOnInit() {
    this.rooms$ = this.fs.getRooms().pipe(tap(rooms => rooms.sort((x, y) => x.number - y.number)));
    this.note$ = this.fs.getNote();
  }
}
