import { Component, OnInit, Input } from '@angular/core';
import { Order } from 'src/app/models/order';
import { Room } from 'src/app/models/room';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Total } from 'src/app/models/total';
import { Observable } from 'rxjs';
import { Expense } from 'src/app/models/expense';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.css']
})
export class ReportTableComponent implements OnInit {
  @Input() orders: Order[] = [];
  @Input() total: Total = {};
  @Input() totalExpense = 0;
  room: Room;
  expenses$: Observable<Expense[]>;
  constructor(private fs: FirebaseService) {}

  ngOnInit() {}
}
