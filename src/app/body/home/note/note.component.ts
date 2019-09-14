import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Note } from 'src/app/models/note';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  note$: Observable<Note>;
  constructor(private fs: FirebaseService) {}

  ngOnInit() {
    this.note$ = this.fs.getNote();
  }
}
