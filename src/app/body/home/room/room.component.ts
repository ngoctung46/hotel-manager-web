import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Room } from 'src/app/models/room';
import { RoomStatus } from 'src/app/enums';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Observable } from 'rxjs';
import { BsModalRef, BsModalService, TypeaheadMatch } from 'ngx-bootstrap';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  @Input() room: Room;
  rooms: Room[] = [];
  modalRef: BsModalRef;
  selectedRoom: Room;

  constructor(private fs: FirebaseService, private modalService: BsModalService) {
    this.fs.getRooms().subscribe(rooms => (this.rooms = rooms.sort((x, y) => x.number - y.number)));
  }

  ngOnInit() {}

  updateStatus(needCleaning = false) {
    if (this.room.status === RoomStatus.Clean) {
      this.room.status = needCleaning ? RoomStatus.NeedCleaning : RoomStatus.CustomerOut;
    } else {
      this.room.status = RoomStatus.Clean;
    }
    this.fs.updateRoomStatus(this.room.id, this.room.status);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  changeRoom(room: Room) {
    if (room) {
      room.occupied = true;
      room.customerId = this.room.customerId;
      room.orderId = this.room.orderId;
      room.status = RoomStatus.Clean;
      this.room.customerId = null;
      this.room.orderId = null;
      this.room.status = RoomStatus.NeedCleaning;
      this.room.occupied = false;
      this.fs.updateRoom(room.id, room);
      this.fs.updateRoom(this.room.id, this.room);
      this.fs.updateOrder({ roomId: room.id }, room.orderId);
      this.modalRef.hide();
    }
  }
}
