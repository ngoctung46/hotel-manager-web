import { FirebaseService } from './../services/firebase.service';
import { MenuItem } from './../models/menu-item';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuItems$: Observable<MenuItem[]>;
  constructor(private fs: FirebaseService) {}

  ngOnInit() {
    this.getMenuItems();
  }

  getMenuItems() {
    this.menuItems$ = this.fs.getMenuItems();
  }

}
