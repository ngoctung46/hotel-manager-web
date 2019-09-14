import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/models/note';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css']
})
export class NoteFormComponent implements OnInit {
  note: Note = {};
  constructor(private fs: FirebaseService) {}

  ngOnInit() {}

  save() {
    this.fs.updateNote(this.note.content);
  }
}
