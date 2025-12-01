import { Component, inject, OnInit } from '@angular/core';
import { OptionType } from '../../../../core/interfaces/custom-select.interface';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppState } from '../../../../store/app.state';
import { Store } from '@ngrx/store';
import { getValueShowFormOfCourse } from '../../states/course.selector';
import { showForm } from '../../states/course.actions';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CourseFormComponent } from '../course-form/course-form.component';

@Component({
  selector: 'app-add-course-form',
  imports: [
    // CustomInputComponent,
    // CustomSelectComponent,
    // CustomTextareaComponent,
    // CustomUploadImageComponent,
    // CustomButtonComponent,
    CommonModule,
    NzModalModule,
    CourseFormComponent,
  ],
  templateUrl: './add-course-form.component.html',
  styleUrl: './add-course-form.component.scss',
})
export class AddCourseFormComponent implements OnInit {
  router: Router = inject(Router);
  store: Store<AppState> = inject(Store);
  showForm: boolean = false;
  timer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.store.select(getValueShowFormOfCourse).subscribe({
      next: (showForm) => {
        console.log(showForm);
        this.showForm = showForm;
      },
    });
  }

  OnSubmitted() {}

  OnCloseForm() {
    this.store.dispatch(showForm({ value: false }));
  }
}
