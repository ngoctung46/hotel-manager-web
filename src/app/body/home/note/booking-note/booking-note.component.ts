import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { RoomType } from 'src/app/enums';

@Component({
  selector: 'app-booking-note',
  templateUrl: './booking-note.component.html',
  styleUrls: ['./booking-note.component.css']
})
export class BookingNoteComponent implements OnInit {
  content = '';
  show: boolean;
  constructor(private fs: FirebaseService) {}

  ngOnInit() {
    this.fs.getBookings().subscribe(bookings => {
      const single = bookings.filter(x => x.type === RoomType.Single).length;
      const double = bookings.filter(x => x.type === RoomType.Double).length;
      if (single > 0 || double > 0) {
        this.show = true;
      }
      this.content += single > 0 ? `Phòng đơn: ${single} ` : '';
      this.content += double > 0 ? `Phòng đôi: ${double} ` : '';
    });
  }
}
