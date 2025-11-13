import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { CustomTextareaComponent } from '../../../../shared/components/custom-textarea/custom-textarea.component';
import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select.component';
import { CustomUploadImageComponent } from '../../../../shared/components/custom-upload-image/custom-upload-image.component';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { OptionType } from '../../../../core/interfaces/custom-select.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import { getValueShowFormOfCategory } from '../../states/category.selector';
import { CommonModule } from '@angular/common';
import { showForm } from '../../states/category.actions';

@Component({
  selector: 'app-category-form',
  imports: [
    CustomInputComponent,
    CustomTextareaComponent,
    CustomSelectComponent,
    CustomUploadImageComponent,
    CustomButtonComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent implements OnInit, AfterViewInit, OnDestroy {
  store: Store<AppState> = inject(Store);
  options: OptionType[] = [
    {
      content: 'Active',
      value: 'active',
    },
    {
      content: 'Inactive',
      value: 'inactive',
    },
  ];

  categoryForm!: FormGroup;
  isMounted: boolean = false;
  isAnimating: boolean = false;
  editorKey = 0;
  timer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.store.select(getValueShowFormOfCategory).subscribe({
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

    this.categoryForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      position: new FormControl(null, [Validators.minLength(0)]),
      status: new FormControl('active', [Validators.required]),
      description: new FormControl(null),
      thumbnail: new FormControl(null),
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  OnSubmitted() {
    console.log(this.categoryForm.value);
  }

  OnCloseForm() {
    this.store.dispatch(showForm({ value: false }));
  }
}
