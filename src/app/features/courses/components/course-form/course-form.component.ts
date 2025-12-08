import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import {
  FormBuilder,
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
import { TypeCourse } from '../../enums/course-type.enum';
import {
  createCloudinaryUploader,
  getBase64,
  handleDownloadHelper,
} from '../../../../shared/helpers/image.helper';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  Subject,
  Subscription,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { CloudinarySignature } from '../../../../shared/interfaces/cloudinary.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import {
  getAllCategoriesForDropDownSelector,
  getCloudinarySignatureSelector,
} from '../../../../shared/states/shared.selector';
import {
  addCourse,
  setSelectedCourse,
  showForm,
  updateCourse,
} from '../../states/course.actions';
import {
  getAllCategoriesForDropDown,
  getCloudinarySignature,
} from '../../../../shared/states/shared.action';
import {
  getActionLoadingSelector,
  selectedCourseSelector,
} from '../../states/course.selector';
import { CommonModule } from '@angular/common';
import { Course } from '../../../../Models/course.model';
import {
  extractFileNameFromUrl,
  extractPublicId,
} from '../../../../shared/helpers/file.helper';
import { CloudinaryService } from '../../../../shared/services/cloudinary.service';
import {
  AddCourseRequest,
  ComponentState,
  UpdateCourseRequest,
} from '../../interfaces/course.interface';
import { HttpProgressEvent } from '@angular/common/http';
import { CourseService } from '../../services/course.service';
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
  private readonly store: Store<AppState> = inject(Store<AppState>);
  private readonly fb = inject(FormBuilder);
  private readonly cloudinaryService = inject(CloudinaryService);
  private readonly courseService = inject(CourseService);
  private readonly destroy$ = new Subject<void>();

  selectedCourse: Course | null = null;

  readonly state$ = new BehaviorSubject<ComponentState>({
    loading: false,
    uploading: false,
    deleting: false,
    showForm: false,
  });

  readonly categoriesForUpdate$ = this.store.select(
    getAllCategoriesForDropDownSelector
  );

  courseForm!: FormGroup<{
    title: FormControl<string | null>;
    position: FormControl<number | null>;
    status: FormControl<StatusType | null>;
    typeCourse: FormControl<TypeCourse | null>;
    categoryId: FormControl<number | string | null>;
    description: FormControl<string | null>;
    thumbnail: FormControl<string | null>;
  }>;

  fileList: NzUploadFile[] = [];
  previewVisible = false;
  previewImage = '';

  readonly isLoading$ = this.state$.pipe(
    map((state) => state.loading || state.uploading || state.deleting)
  );

  readonly cloudinaryConfig$ = this.store.select(
    getCloudinarySignatureSelector
  );

  ngOnInit(): void {
    this.store.dispatch(getAllCategoriesForDropDown());
    this.store.dispatch(
      getCloudinarySignature({
        cloudinary: {
          folder: 'courses',
          resourceType: 'image',
        },
      })
    );
    this.initForm();
    this.subscribeToState();
    this.subscribeToSelectedCourse();
  }

  private initForm(): void {
    this.courseForm = this.fb.group({
      title: [null as string | null, Validators.required],
      position: [null as number | null, Validators.min(0)],
      status: [StatusType.DRAFT, Validators.required],
      typeCourse: [TypeCourse.FREE, Validators.required],
      categoryId: [null as string | number | null],
      description: [null as string | null],
      thumbnail: [null as string | null],
    });
  }

  private subscribeToSelectedCourse(): void {
    this.store
      .select(selectedCourseSelector)
      .pipe(takeUntil(this.destroy$))
      .subscribe((course) => {
        this.selectedCourse = course;
        if (course) {
          this.populateForm(course);
        } else {
          this.resetForm();
        }
      });
  }

  private populateForm(course: Course): void {
    if (this.selectedCourse) {
      this.courseForm.patchValue(course);

      if (course.thumbnail) {
        this.fileList = [
          {
            uid: '-1',
            name: extractFileNameFromUrl(course.thumbnail),
            status: 'done',
            url: course.thumbnail,
            thumbUrl: course.thumbnail,
            response: {
              public_id: extractPublicId(course.thumbnail),
            },
          },
        ];
      }
    }
  }

  uploadToCloudinary = (item: NzUploadXHRArgs): Subscription => {
    const file = this.extractFile(item);

    if (!file) {
      item.onError?.(new Error('Invalid file'), item.file as NzUploadFile);
      return new Subscription();
    }

    return createCloudinaryUploader(
      item,
      file,
      this.cloudinaryConfig$,
      (file: File, config: CloudinarySignature) =>
        this.cloudinaryService.upload(file, config),
      {
        onProgress: (event, item) => this.handleUploadProgress(event, item),
        onSuccess: (body, item) => this.handleUploadSuccess(body, item),
        onError: (err, item) => this.handleUploadError(err, item),
      }
    ).subscribe();
  };

  private extractFile(item: NzUploadXHRArgs): File | null {
    if (item.file instanceof File) {
      return item.file;
    }

    if ((item.file as NzUploadFile).originFileObj) {
      return (item.file as NzUploadFile).originFileObj!;
    }

    return null;
  }

  private handleUploadSuccess(body: any, item: NzUploadXHRArgs): void {
    if (body?.secure_url) {
      this.courseForm.patchValue({ thumbnail: body.secure_url });
      item.onSuccess?.(body, item.file, body);
    }
  }

  private handleUploadProgress(
    event: HttpProgressEvent,
    item: NzUploadXHRArgs
  ) {
    const progress = Math.round((100 * event.loaded) / (event.total || 1));
    item.onProgress?.({ percent: progress }, item.file as NzUploadFile);
  }

  private handleUploadError(error: any, item: NzUploadXHRArgs): void {
    item.onError?.(error, item.file as NzUploadFile);
  }

  private resetForm(): void {
    this.courseForm.reset({
      status: StatusType.DRAFT,
      typeCourse: TypeCourse.FREE,
    });
    this.fileList = [];
    this.selectedCourse = null;
    this.store.dispatch(setSelectedCourse({ selectedCourse: null }));
  }

  handleRemove = (file: NzUploadFile): Observable<boolean> => {
    const publicId =
      file.response?.public_id || extractPublicId(file.url || '');

    if (!publicId) {
      return of(false);
    }

    return this.cloudinaryService
      .deleteCloudinaryFile({ publicId, resourceType: 'image' })
      .pipe(
        tap(() => {
          this.clearThumbnail();
        }),
        map(() => true),
        catchError((error) => {
          return of(false);
        })
      );
  };

  private clearThumbnail(): void {
    this.courseForm.patchValue({ thumbnail: null });
    this.fileList = [];

    if (this.selectedCourse) {
      this.courseService.updateCourse({
        id: this.selectedCourse.id,
        updateCourseRequest: { thumbnail: '' },
      });
    }
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      Object.values(this.courseForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    const formData = this.courseForm.value;

    if (this.selectedCourse) {
      const cleanFormData: UpdateCourseRequest = {
        title: formData.title ?? undefined,
        description: formData.description ?? undefined,
        thumbnail: formData.thumbnail ?? undefined,
        status: formData.status ?? undefined,
        position: formData.position ?? undefined,
        typeCourse: formData.typeCourse ?? undefined,
        categoryId: formData.categoryId ?? undefined,
      };
      this.store.dispatch(
        updateCourse({
          params: {
            id: this.selectedCourse.id,
            updateCourseRequest: cleanFormData,
          },
        })
      );
    } else {
      const cleanFormData: AddCourseRequest = {
        title: formData.title as string,
        description: formData.description ?? undefined,
        thumbnail: formData.thumbnail ?? undefined,
        status: formData.status ?? undefined,
        position: formData.position ?? undefined,
        categoryId: formData.categoryId ?? undefined,
        typeCourse: formData.typeCourse ?? undefined,
      };
      this.store.dispatch(addCourse({ addCourse: cleanFormData }));
    }

    this.closeForm();
  }

  closeForm(): void {
    if (!this.selectedCourse) {
      this.store.dispatch(showForm({ value: false }));
      if (!this.state$.value.loading) {
        this.resetForm();
      }
    }
  }

  handleChangeUpload(info: NzUploadChangeParam) {
    const newFileList = info.fileList.slice(-1);
    const oldFile = this.fileList[0];
    const newFile = newFileList[0];

    const isDifferentFile =
      oldFile &&
      newFile &&
      (oldFile.uid !== newFile.uid || oldFile.name !== newFile.name);

    if (isDifferentFile && oldFile) {
      const publicId =
        oldFile.response?.public_id || extractPublicId(oldFile.url || '');
      this.cloudinaryService
        .deleteCloudinaryFile({ publicId, resourceType: 'image' })
        .pipe(take(1))
        .subscribe(() => {
          this.fileList = newFileList;
        });
    }
  }

  handleDownload = async (file: NzUploadFile) => {
    await handleDownloadHelper(file);
  };

  handlePreview = async (
    file: NzUploadFile & { preview?: string }
  ): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview!;
    this.previewVisible = true;
  };

  private subscribeToState(): void {
    combineLatest([this.store.select(getActionLoadingSelector)])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([loading]) => {
        this.state$.next({
          ...this.state$.value,
          loading,
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.state$.complete();
    this.destroy$.complete();
  }
}
