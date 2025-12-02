import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CustomTextareaComponent } from '../../../../shared/components/custom-textarea/custom-textarea.component';
import {
  NzUploadChangeParam,
  NzUploadFile,
  NzUploadModule,
  NzUploadXHRArgs,
} from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { StatusType } from '../../../../shared/enums/status.enum';
import { CourseType } from '../../enums/course-type.enum';
import {
  getBase64,
  handleDownloadHelper,
  uploadToCloudinaryHelper,
} from '../../../../shared/helpers/image.helper';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Observable, Subscription } from 'rxjs';
import { CloudinarySignature } from '../../../../shared/interfaces/cloudinary.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import {
  getAllCategoriesForDropDownSelector,
  getCloudinarySignatureSelector,
} from '../../../../shared/states/shared.selector';
import { addCourse, showForm } from '../../states/course.actions';
import { deleteCloudinaryFile } from '../../../../shared/states/shared.action';
import { getActionLoadingSelector } from '../../states/course.selector';
import { CommonModule } from '@angular/common';
import { CategoryForDropDown } from '../../../../shared/interfaces/category.interface';
@Component({
  selector: 'app-course-form',
  imports: [
    NzSpinComponent,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzInputNumberComponent,
    NzSelectModule,
    CustomTextareaComponent,
    NzUploadModule,
    NzIconModule,
    NzGridModule,
    NzButtonComponent,
    NzModalModule,
    CommonModule,
  ],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss',
})
export class CourseFormComponent implements OnInit, OnDestroy {
  courseForm!: FormGroup;
  previewImage: string | undefined = '';
  previewVisible: boolean = false;
  cloudinaryData: CloudinarySignature | null = null;
  fileList: NzUploadFile[] = [];
  actionLoading: boolean = false;
  @Input() editMode: boolean = false;
  @Input() courseId: number | string = '';
  cloudDinarySignatureSubscription: Subscription | null = null;
  actionLoadingSubscription: Subscription | null = null;
  allCategoriesForDropDown$: Observable<CategoryForDropDown[] | null> | null =
    null;
  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.cloudDinarySignatureSubscription = this.store
      .select(getCloudinarySignatureSelector)
      .subscribe({
        next: (res: CloudinarySignature | null) => {
          this.cloudinaryData = res;
        },
      });

    this.actionLoadingSubscription = this.store
      .select(getActionLoadingSelector)
      .subscribe({
        next: (loading) => {
          this.actionLoading = loading;
        },
      });

    this.allCategoriesForDropDown$ = this.store.select(
      getAllCategoriesForDropDownSelector
    );

    this.courseForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      position: new FormControl(null),
      status: new FormControl(StatusType.DRAFT),
      typeCourse: new FormControl(CourseType.FREE),
      categoryId: new FormControl(null),
      description: new FormControl(null),
      thumbnail: new FormControl(null),
    });

    this.SubsribeToSelectedCourse();
  }

  ngOnDestroy(): void {
    this.cloudDinarySignatureSubscription?.unsubscribe();
    this.actionLoadingSubscription?.unsubscribe();
    this.ResetForm();
  }

  handlePreview = async (
    file: NzUploadFile & { preview?: string }
  ): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview!;
    this.previewVisible = true;
  };

  handleChangeUpload(info: NzUploadChangeParam) {
    this.fileList = info.fileList.slice(-1);
  }

  uploadToCloudinary = (item: NzUploadXHRArgs): Subscription => {
    return uploadToCloudinaryHelper(item, this.cloudinaryData, (url) => {
      this.courseForm.patchValue({ thumbnail: url });
    });
  };

  handleDownload = async (file: NzUploadFile) => {
    await handleDownloadHelper(file);
  };

  handleRemove = (file: NzUploadFile) => {
    // Lấy publicId từ response sau khi upload thành công
    const publicId = file.response?.public_id || file.name;

    if (!publicId) return false;

    try {
      // Gọi API DELETE của BE
      this.store.dispatch(
        deleteCloudinaryFile({
          deleteCloudinaryRequest: { publicId, resourceType: 'image' },
        })
      );

      // // Xóa khỏi form
      this.courseForm.patchValue({ thumbnail: null });
      return true;
    } catch (error) {
      return false;
    }
  };

  ResetForm() {
    this.courseForm.reset({
      status: StatusType.DRAFT,
      typeCourse: CourseType.FREE,
    });
    this.fileList = [];

    this.editMode = false;
    this.courseId = '';
  }

  SubsribeToSelectedCourse() {
    if (this.editMode) {
    } else {
      this.ResetForm();
    }
  }

  LoadCourseDataForEdit() {
    // load dữ liệu courseId vào form
    console.log('Loading...', this.courseId);
  }

  OnCloseForm() {
    this.store.dispatch(showForm({ value: false }));
    if (!this.actionLoading) {
      this.ResetForm();
    }
  }

  OnSubmitted() {
    if (this.editMode) {
    } else {
      this.store.dispatch(addCourse({ addCourse: this.courseForm.value }));
    }
  }
}
