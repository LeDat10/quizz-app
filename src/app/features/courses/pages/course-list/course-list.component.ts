import { Component, inject, OnInit } from '@angular/core';
import { AppState } from '../../../../store/app.state';
import { Store } from '@ngrx/store';
import { getCourses, showForm } from '../../states/course.actions';
import { AddCourseFormComponent } from '../../components/add-course-form/add-course-form.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  getAllCategoriesForDropDown,
  getCloudinarySignature,
} from '../../../../shared/states/shared.action';
import { CourseTableComponent } from '../../components/course-table/course-table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-list',
  imports: [
    AddCourseFormComponent,
    NzButtonModule,
    NzIconModule,
    CourseTableComponent,
  ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent implements OnInit {
  store: Store<AppState> = inject(Store);
  router: Router = inject(Router);
  ngOnInit(): void {
    this.store.dispatch(getCourses());
  }

  OnAddCourse() {
    this.store.dispatch(showForm({ value: true }));
    this.store.dispatch(getAllCategoriesForDropDown());
    this.store.dispatch(
      getCloudinarySignature({
        cloudinary: {
          folder: 'courses',
          resourceType: 'image',
        },
      })
    );
    this.router.navigateByUrl(`admin/courses?id=${null}&editMode=${false}`);
  }
}
