import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Booking } from 'src/app/models/booking';
import { RoomType } from 'src/app/enums';
import { BsLocaleService } from 'ngx-bootstrap';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  booking: Booking;
  bookingForm: FormGroup;
  items = [
    { name: 'Phòng đơn', value: RoomType.Single },
    { name: 'Phòng đôi', value: RoomType.Double }
  ];
  constructor(
    private fs: FirebaseService,
    private fb: FormBuilder,
    private localeService: BsLocaleService
  ) {}
  ngOnInit() {
    this.localeService.use('vi');
    this.setForm(this.booking);
  }

  setForm(booking: Booking) {
    if (!booking) {
      booking = {
        name: '',
        phone: '',
        type: RoomType.Single
      };
    }
    this.bookingForm = this.fb.group({
      name: [booking.name, Validators.required],
      phone: [booking.phone, Validators.required],
      type: [booking.type, Validators.required],
      date: [new Date(), Validators.required],
      time: [new Date(), Validators.required]
    });
  }
  onSubmit() {
    const booking = this.bookingForm.value as Booking;
    booking.date = booking.date.getTime();
    booking.time = booking.time.getTime();
    this.fs.addBooking(booking);
  }

  reset() {
    this.booking = null;
    this.setForm(this.booking);
  }
}
