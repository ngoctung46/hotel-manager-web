import { Component, OnInit, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Expense } from 'src/app/models/expense';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { ExpenseType, ProductType } from 'src/app/enums';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup;
  expense: Expense;
  expenses: Expense[];
  @ViewChild('name', { static: false }) nameField: ElementRef;
  constructor(private fs: FirebaseService, private fb: FormBuilder) {}

  items = [
    { name: 'Thu', value: ExpenseType.Receipt },
    { name: 'Chi', value: ExpenseType.Payment }
  ];
  ngOnInit() {
    this.resetForm();
    this.fs
      .getExpensesByDateRange(new Date(), new Date())
      .subscribe(expenses => (this.expenses = expenses));
    this.nameField.nativeElement.focus();
  }

  onSubmit() {
    this.expense = this.expenseForm.value as Expense;
    this.expense.amount =
      this.expense.type === ExpenseType.Payment ? -this.expense.amount : this.expense.amount;
    this.fs.addExpense(this.expense);
    this.resetForm();
  }

  resetForm() {
    this.expenseForm = this.fb.group({
      name: ['', Validators.required],
      amount: [0, Validators.required],
      type: [ExpenseType.Payment, Validators.required]
    });
    this.expense = null;
  }

  setForm() {
    if (this.expense) {
      this.expenseForm = this.fb.group({
        name: [this.expense.name, Validators.required],
        amount: [this.expense.amount, Validators.required],
        type: [this.expense.type, Validators.required]
      });
    }
  }

  delete() {
    if (this.expense) {
      this.fs.deleteExpense(this.expense.expenseId);
      this.resetForm();
    }
  }

  onSelect(data: TypeaheadMatch) {
    this.expense = (data.item as unknown) as Expense;
    this.setForm();
  }
}
