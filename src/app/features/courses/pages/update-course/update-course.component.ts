import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AppState } from '../../../../store/app.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectedCourseSelector } from '../../states/course.selector';
import { Course } from '../../../../Models/course.model';
import { CourseFormComponent } from '../../components/course-form/course-form.component';

@Component({
  selector: 'app-update-course',
  imports: [CommonModule, CourseFormComponent],
  templateUrl: './update-course.component.html',
  styleUrl: './update-course.component.scss',
})
export class UpdateCourseComponent implements OnInit {
  store: Store<AppState> = inject(Store<AppState>);
  selectedCourse$: Observable<Course | null> | null = null;

  ngOnInit(): void {
    this.selectedCourse$ = this.store.select(selectedCourseSelector);
  }
}
