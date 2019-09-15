import { Component, OnInit, Input } from '@angular/core';
import { Note } from 'src/app/models/note';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css']
})
export class NoteFormComponent implements OnInit {
  @Input() note$: Observable<Note>;
  content: string;
  hide: boolean;
  constructor(private fs: FirebaseService) {}

  ngOnInit() {
    if (this.note$) {
      this.note$.subscribe(note => {
        if (note) {
          this.content = note && note.content;
          this.hide = false;
        } else {
          this.hide = true;
        }
      });
    }
  }

  save() {
    this.fs.updateNote(this.content);
  }

  delete() {
    this.fs.deleteNote();
    this.hide = true;
  }
}
