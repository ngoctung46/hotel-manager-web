import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customer$: Observable<Customer>;
  id: string;
  roomId: string;
  constructor(
    private location: Location,
    private fs: FirebaseService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.roomId = this.route.snapshot.paramMap.get('roomId');
  }
  ngOnInit() {
    if (this.id) {
          this.customer$ = this.fs.getCustomerById(this.id);
    }
  }

  onSubmit() {}

  onFinished(finished: boolean) {
    if (finished) {
      this.location.back();
    }
  }
}
