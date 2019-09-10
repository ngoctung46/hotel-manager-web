import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BsLocaleService, TypeaheadMatch } from 'ngx-bootstrap';
import { provinces, countries } from 'src/app/models/const';
import { Customer } from 'src/app/models/customer';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @Output() finished: EventEmitter<boolean> = new EventEmitter();
  @Input() roomId = '';
  customer: Customer = {
    firstName: '',
    lastName: '',
    idNumber: '',
    issuedDate: '',
    expiredDate: '',
    issuedPlace: '',
    birthDate: '',
    birthPlace: '',
    nationality: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    country: '',
    phone: ''
  };
  orderId = '';
  provinces = provinces;
  countries = countries;
  customers: Customer[] = [];
  customerForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private fs: FirebaseService
  ) {}

  ngOnInit() {
    this.localeService.use('vi');
    this.fs.getCustomers().subscribe(customers => (this.customers = customers));
    this.setForm();
  }

  onSubmit() {
    this.customer = this.customerForm.value as Customer;
    this.addCustomer();
    this.addOrder();
    this.updateRoom();
    this.finished.emit(true);
  }
  onSelect(event: TypeaheadMatch): void {
    this.customer = (event.item as unknown) as Customer;
    this.customer.issuedDate = this.customer.issuedDate.toDate();
    this.customer.birthDate = this.customer.birthDate.toDate();
    this.customer.expiredDate = this.customer.expiredDate.toDate();
    this.setForm();
  }
  onClear() {
    this.finished.emit(true);
  }
  setForm() {
    this.customerForm = this.fb.group({
      firstName: [this.customer.firstName, Validators.required],
      lastName: [this.customer.lastName, Validators.required],
      idNumber: [this.customer.idNumber, Validators.required],
      issuedDate: [this.customer.issuedDate, Validators.required],
      expiredDate: [this.customer.expiredDate, Validators.required],
      issuedPlace: [this.customer.issuedPlace, Validators.required],
      birthDate: [this.customer.birthDate, Validators.required],
      birthPlace: [this.customer.birthPlace, Validators.required],
      nationality: [this.customer.nationality, Validators.required],
      addressLine1: [this.customer.addressLine1],
      addressLine2: [this.customer.addressLine2],
      city: [this.customer.city],
      country: [this.customer.country],
      phone: [this.customer.phone, Validators.required]
    });
  }
  addCustomer() {
    this.fs.addCustomer(this.customer);
  }
  addOrder() {
    const checkInTime = new Date().getTime();
    this.orderId = this.fs.addOrder({
      roomId: this.roomId,
      customerId: this.customer.idNumber,
      checkInTime,
      orderLineIds: []
    });
  }
  updateRoom() {
    this.fs.updateRoom(this.roomId, {
      customerId: this.customer.idNumber,
      orderId: this.orderId,
      occupied: true
    });
  }
}
