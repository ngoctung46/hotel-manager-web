import { Component, OnInit, Input } from '@angular/core';
import { Room } from 'src/app/models/room';
import { RoomStatus } from 'src/app/enums';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  @Input() room: Room;
  constructor() {}

  ngOnInit() {}

  updateStatus(needCleaning = false) {
    if (this.room.status === RoomStatus.Available) {
      this.room.status = needCleaning ? RoomStatus.NeedCleaning : RoomStatus.CustomerOut;
    } else {
      this.room.status = RoomStatus.Available;
    }
  }
}
