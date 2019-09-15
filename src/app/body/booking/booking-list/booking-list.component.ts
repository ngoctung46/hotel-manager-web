import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from 'src/app/models/booking';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  @Input() bookings$: Observable<Booking[]>;
  constructor(private fs: FirebaseService) {}

  ngOnInit() {}
  done(booking: Booking) {
    booking.done = true;
    this.fs.updateBooking(booking);
  }
}
