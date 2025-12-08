import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomTextareaComponent } from '../../../../shared/components/custom-textarea/custom-textarea.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import {
  getCategoryActionLoadingSelector,
  getSelectedCategorySelector,
  getValueShowFormOfCategory,
} from '../../states/categories.selector';
import { CommonModule } from '@angular/common';
import {
  addCategory,
  setSelectedCategory,
  showForm,
  updateCategory,
} from '../../states/categories.actions';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import {
  NzUploadChangeParam,
  NzUploadFile,
  NzUploadModule,
  NzUploadXHRArgs,
} from 'ng-zorro-antd/upload';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  Subject,
  Subscription,
  takeUntil,
  tap,
} from 'rxjs';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { getCloudinarySignatureSelector } from '../../../../shared/states/shared.selector';
import { Category } from '../../../../Models/category.model';
import {
  extractFileNameFromUrl,
  extractPublicId,
} from '../../../../shared/helpers/file.helper';
import {
  createCloudinaryUploader,
  getBase64,
  handleDownloadHelper,
} from '../../../../shared/helpers/image.helper';
import { CloudinaryService } from '../../../../shared/services/cloudinary.service';
import {
  AddCategoryRequest,
  ComponentState,
  UpdateCategoryRequest,
} from '../../interfaces/category.interface';
import { StatusType } from '../../../../shared/enums/status.enum';
import { HttpProgressEvent } from '@angular/common/http';
import { CategoryService } from '../../services/category.service';
import { getCloudinarySignature } from '../../../../shared/states/shared.action';
import { CloudinarySignature } from '../../../../shared/interfaces/cloudinary.interface';

@Component({
  selector: 'app-category-form',
  imports: [
    CustomTextareaComponent,
    ReactiveFormsModule,
    CommonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzInputNumberModule,
    NzIconModule,
    NzUploadModule,
    NzButtonComponent,
    NzButtonModule,
    NzGridModule,
    NzSpinComponent,
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  store: Store<AppState> = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly cloudinaryService = inject(CloudinaryService);
  private readonly categoryService = inject(CategoryService);
  private readonly destroy$ = new Subject<void>();

  readonly state$ = new BehaviorSubject<ComponentState>({
    loading: false,
    uploading: false,
    deleting: false,
    showForm: false,
  });

  categoryForm!: FormGroup<{
    title: FormControl<string | null>;
    position: FormControl<number | null>;
    status: FormControl<StatusType | null>;
    description: FormControl<string | null>;
    thumbnail: FormControl<string | null>;
  }>;

  fileList: NzUploadFile[] = [];
  selectedCategory: Category | null = null;
  previewVisible = false;
  previewImage = '';

  readonly isLoading$ = this.state$.pipe(
    map((state) => state.loading || state.uploading || state.deleting)
  );

  readonly cloudinaryConfig$ = this.store.select(
    getCloudinarySignatureSelector
  );

  ngOnInit(): void {
    this.initForm();
    this.subscribeToState();
    this.subscribeToSelectedCategory();
    this.store.dispatch(
      getCloudinarySignature({
        cloudinary: { folder: 'categories', resourceType: 'image' },
      })
    );
  }

  private initForm(): void {
    this.categoryForm = this.fb.group({
      title: [null as string | null, Validators.required],
      position: [null as number | null, Validators.min(0)],
      status: [StatusType.DRAFT, Validators.required],
      description: [null as string | null],
      thumbnail: [null as string | null],
    });
  }

  private subscribeToState(): void {
    combineLatest([
      this.store.select(getCategoryActionLoadingSelector),
      this.store.select(getValueShowFormOfCategory),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([loading, showForm]) => {
        this.state$.next({
          ...this.state$.value,
          loading,
          showForm,
        });
      });
  }

  private subscribeToSelectedCategory(): void {
    this.store
      .select(getSelectedCategorySelector)
      .pipe(takeUntil(this.destroy$))
      .subscribe((category) => {
        this.selectedCategory = category;
        if (category) {
          this.populateForm(category);
        } else {
          this.resetForm();
        }
      });
  }

  private populateForm(category: Category): void {
    this.categoryForm.patchValue(category);
    if (category.thumbnail) {
      this.fileList = [
        {
          uid: '-1',
          name: extractFileNameFromUrl(category.thumbnail),
          status: 'done',
          url: category.thumbnail,
          thumbUrl: category.thumbnail,
          response: {
            public_id: extractPublicId(category.thumbnail),
          },
        },
      ];
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
      this.categoryForm.patchValue({ thumbnail: body.secure_url });
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
    this.categoryForm.reset({ status: StatusType.DRAFT });
    this.fileList = [];
    this.selectedCategory = null;
    this.store.dispatch(setSelectedCategory({ selectedCategory: null }));
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
    this.categoryForm.patchValue({ thumbnail: null });
    this.fileList = [];

    if (this.selectedCategory) {
      this.categoryService.updateCategory(this.selectedCategory.id, {
        thumbnail: '',
      });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      Object.values(this.categoryForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    const formData = this.categoryForm.value;

    if (this.selectedCategory) {
      const cleanFormData: UpdateCategoryRequest = {
        title: formData.title ?? undefined,
        description: formData.description ?? undefined,
        thumbnail: formData.thumbnail ?? undefined,
        status: formData.status ?? undefined,
        position: formData.position ?? undefined,
      };
      this.store.dispatch(
        updateCategory({
          id: this.selectedCategory.id,
          updateCategoryRequest: cleanFormData,
        })
      );
    } else {
      const cleanFormData: AddCategoryRequest = {
        title: formData.title as string,
        description: formData.description ?? undefined,
        thumbnail: formData.thumbnail ?? undefined,
        status: formData.status ?? undefined,
        position: formData.position ?? undefined,
      };
      this.store.dispatch(addCategory({ addCategoryRequest: cleanFormData }));
    }

    this.closeForm();
  }

  closeForm(): void {
    this.store.dispatch(showForm({ value: false }));
    if (!this.state$.value.loading) {
      this.resetForm();
    }
  }

  handleChangeUpload(info: NzUploadChangeParam) {
    this.fileList = info.fileList.slice(-1);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.state$.complete();
  }
}
