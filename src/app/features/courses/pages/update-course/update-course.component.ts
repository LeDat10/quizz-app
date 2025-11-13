import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AppState } from '../../../../store/app.state';
import { Store } from '@ngrx/store';
import { getRouterUrl } from '../../../../store/router/router.selector';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-update-course',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './update-course.component.html',
  styleUrl: './update-course.component.scss',
})
export class UpdateCourseComponent implements OnInit {
  navItems = [
    { content: 'Info', link: '/admin/courses/update/1' },
    { content: 'Content', link: '/admin/courses/update/1/content' },
  ];
  store: Store<AppState> = inject(Store);

  url$: Observable<string> | null = null;

  ngOnInit(): void {
    this.url$ = this.store.select(getRouterUrl);
  }
}
