import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from 'src/app/models/booking';
import { FirebaseService } from 'src/app/services/firebase.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  bookings$: Observable<Booking[]>;
  constructor(private fs: FirebaseService) {}

  ngOnInit() {
    this.bookings$ = this.fs
      .getBookings()
      .pipe(map(bookings => bookings.sort((x, y) => x.date - y.date)));
  }
}
