import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense } from 'src/app/models/expense';
import { FirebaseService } from 'src/app/services/firebase.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit {
  bsRangeValue = [];
  expenses$ = new Observable<Expense[]>();
  total = 0;
  expenses = [];
  constructor(private fs: FirebaseService) {}

  ngOnInit() {
    this.bsRangeValue = [new Date(), new Date()];
    this.expenses$ = this.fs.getExpensesByDateRange(new Date(), new Date());
    this.expenses$
      .pipe(map(ols => ols.reduce((sum, current) => sum + current.amount, 0)))
      .subscribe(total => {
        this.total = total;
      });
  }

  onValueChange(range) {
    if (!range) {
      return;
    }
    const start = range[0];
    const end = range[1];
    this.expenses$ = this.fs.getExpensesByDateRange(start, end);
  }
}
