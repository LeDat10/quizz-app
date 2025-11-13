import { Component, inject, OnInit } from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select.component';
import { OptionType } from '../../../../core/interfaces/custom-select.interface';
import { CustomTextareaComponent } from '../../../../shared/components/custom-textarea/custom-textarea.component';
import { CustomUploadImageComponent } from '../../../../shared/components/custom-upload-image/custom-upload-image.component';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppState } from '../../../../store/app.state';
import { Store } from '@ngrx/store';
import { getValueShowFormOfCourse } from '../../states/course.selector';
import { showForm } from '../../states/course.actions';

@Component({
  selector: 'app-add-course-form',
  imports: [
    CustomInputComponent,
    CustomSelectComponent,
    CustomTextareaComponent,
    CustomUploadImageComponent,
    CustomButtonComponent,
    CommonModule,
  ],
  templateUrl: './add-course-form.component.html',
  styleUrl: './add-course-form.component.scss',
})
export class AddCourseFormComponent implements OnInit {
  router: Router = inject(Router);
  store: Store<AppState> = inject(Store);
  isMounted: boolean = false;
  isAnimating: boolean = false;
  timer: ReturnType<typeof setTimeout> | null = null;
  options: OptionType[] = [
    {
      content: 'Active',
      value: 'active',
    },
    {
      content: 'InActive',
      value: 'inactive',
    },
  ];

  courseType: OptionType[] = [
    {
      content: 'Free',
      value: 'free',
    },
    {
      content: 'Premium',
      value: 'premium',
    },
  ];

  category: OptionType[] = [
    {
      content: 'Choose a category',
      value: '',
    },
    {
      content: 'Python Basic',
      value: '1',
    },
  ];

  ngOnInit(): void {
    this.store.select(getValueShowFormOfCourse).subscribe({
      next: (showForm) => {
        if (this.timer) {
          clearTimeout(this.timer);
        }

        if (showForm) {
          this.isAnimating = showForm;
          this.isMounted = showForm;
        } else {
          this.isAnimating = showForm;
          this.timer = setTimeout(() => {
            this.isMounted = showForm;
          }, 300);
        }
      },
    });
  }

  OnSubmitted() {}

  OnCloseForm() {
    this.store.dispatch(showForm({ value: false }));
  }
}
