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
      const single = bookings
        .filter(x => x.type === RoomType.Single)
        .sort((x, y) => x.date - y.date);
      const double = bookings
        .filter(x => x.type === RoomType.Double)
        .sort((x, y) => x.date - y.date);
      const singleDate = single
        .map(x => `${new Date(x.date).getDate()}/${new Date(x.date).getMonth() + 1}`)
        .join(', ');
      const doubleDate = double
        .map(x => `${new Date(x.date).getDate()}/${new Date(x.date).getMonth() + 1}`)
        .join(', ');

      if (single.length > 0 || double.length > 0) {
        this.show = true;
      }
      this.content += single.length > 0 ? `Phòng đơn: ${single.length} (${singleDate}) ` : '';
      this.content += double.length > 0 ? `Phòng đôi: ${double.length} (${doubleDate}) ` : '';
    });
  }
}
