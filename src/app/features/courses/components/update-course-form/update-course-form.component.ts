import { Component } from '@angular/core';
import { OptionType } from '../../../../core/interfaces/custom-select.interface';
import { CourseFormComponent } from '../course-form/course-form.component';

@Component({
  selector: 'app-update-course-form',
  imports: [CourseFormComponent],
  templateUrl: './update-course-form.component.html',
  styleUrl: './update-course-form.component.scss',
})
export class UpdateCourseFormComponent {
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

  OnSubmitted() {}

  OnCloseForm() {}
}
