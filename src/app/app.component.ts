import { Component } from '@angular/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { TopProgressBarComponent } from './shared/components/top-progress-bar/top-progress-bar.component';

@Component({
  selector: 'app-root',
  imports: [AdminLayoutComponent, TopProgressBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'quizz';
}
