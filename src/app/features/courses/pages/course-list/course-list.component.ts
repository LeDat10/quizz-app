import { Component, inject } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { AppState } from '../../../../store/app.state';
import { Store } from '@ngrx/store';
import { showForm } from '../../states/course.actions';
import { AddCourseFormComponent } from '../../components/add-course-form/add-course-form.component';

@Component({
  selector: 'app-course-list',
  imports: [NgIconComponent, AddCourseFormComponent],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent {
  store: Store<AppState> = inject(Store);

  OnShowForm() {
    this.store.dispatch(showForm({ value: true }));
  }
}
