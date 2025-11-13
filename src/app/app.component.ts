import { Component } from '@angular/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

@Component({
  selector: 'app-root',
  imports: [AdminLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'quizz';
}
