import { Component } from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select.component';
import { CustomTextareaComponent } from '../../../../shared/components/custom-textarea/custom-textarea.component';
import { CustomUploadImageComponent } from '../../../../shared/components/custom-upload-image/custom-upload-image.component';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { OptionType } from '../../../../core/interfaces/custom-select.interface';

@Component({
  selector: 'app-update-course-form',
  imports: [
    CustomInputComponent,
    CustomSelectComponent,
    CustomTextareaComponent,
    CustomUploadImageComponent,
    CustomButtonComponent,
  ],
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
