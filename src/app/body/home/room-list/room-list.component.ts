import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from 'src/app/models/room';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
  @Input() rooms$ = new Observable<Room[]>();
  constructor() {
  }

  ngOnInit() {}
}
