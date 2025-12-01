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
// import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { CustomTextareaComponent } from '../../../../shared/components/custom-textarea/custom-textarea.component';
// import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select.component';
// import { CustomUploadImageComponent } from '../../../../shared/components/custom-upload-image/custom-upload-image.component';
// import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { OptionType } from '../../../../core/interfaces/custom-select.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import {
  getCategoryActionLoadingSelector,
  getCategoryDetailLoadingSelector,
  getSelectedCategorySelector,
  getValueShowFormOfCategory,
} from '../../states/categories.selector';
import { CommonModule } from '@angular/common';
import {
  addCategory,
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
import { Observable, Subscription } from 'rxjs';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { CloudinarySignature } from '../../../../shared/interfaces/cloudinary.interface';
import { getCloudinarySignatureSelector } from '../../../../shared/states/shared.selector';
import { deleteCloudinaryFile } from '../../../../shared/states/shared.action';
import { getQueryParams } from '../../../../store/router/router.selector';
import { Category } from '../../../../Models/category.model';
import {
  extractFileNameFromUrl,
  extractPublicId,
} from '../../../../shared/helpers/file.helper';
import {
  getBase64,
  handleDownloadHelper,
} from '../../../../shared/helpers/image.helper';

@Component({
  selector: 'app-category-form',
  imports: [
    // CustomInputComponent,
    CustomTextareaComponent,
    // CustomSelectComponent,
    // CustomUploadImageComponent,
    // CustomButtonComponent,
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
  showFormSubscription!: Subscription;
  loading: boolean = false;
  actionLoadingSubscription: Subscription | null = null;
  detailLoadingSubscription: Subscription | null = null;
  previewVisible: boolean = false;
  previewImage: string | undefined = '';
  categoryForm!: FormGroup;
  showForm: boolean = false;
  fileList: NzUploadFile[] = [];
  cloudinaryData: CloudinarySignature | null = null;
  isEditMode: boolean = false;
  categoryId: string | number = '';
  selectedCategory: Category | null = null;
  selectedCategorySubscription: Subscription | null = null;
  ExtractFileNameFromUrl = extractFileNameFromUrl;
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

  ngOnInit(): void {
    this.actionLoadingSubscription = this.store
      .select(getCategoryActionLoadingSelector)
      .subscribe({
        next: (loading) => {
          this.loading = loading;
        },
      });

    this.detailLoadingSubscription = this.store
      .select(getCategoryDetailLoadingSelector)
      .subscribe({
        next: (loading) => {
          this.loading = loading;
        },
      });

    this.showFormSubscription = this.store
      .select(getValueShowFormOfCategory)
      .subscribe({
        next: (showForm) => {
          this.showForm = showForm;
        },
      });

    this.store.select(getCloudinarySignatureSelector).subscribe({
      next: (res: CloudinarySignature | null) => {
        this.cloudinaryData = res;
      },
    });

    this.categoryForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      position: new FormControl(null, [Validators.minLength(0)]),
      status: new FormControl('draft', [Validators.required]),
      description: new FormControl(null),
      thumbnail: new FormControl(null),
    });

    this.store.select(getQueryParams).subscribe({
      next: (queryParams) => {
        if (queryParams['edit']) {
          this.isEditMode = JSON.parse(queryParams['edit']);
        }
        if (queryParams['id']) {
          this.categoryId = JSON.parse(queryParams['id']);
        }
        this.SubsribeToSelectedCategory();
      },
    });
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

  OnCloseForm() {
    this.store.dispatch(showForm({ value: false }));
    if (!this.loading) {
      this.ResetForm();
    }
  }

  uploadToCloudinary = (item: NzUploadXHRArgs): Subscription => {
    // Extract the actual File object correctly from nz-upload
    let file: File | undefined;

    // Try multiple ways to get the file
    if (item.file instanceof File) {
      file = item.file;
    } else if ((item.file as NzUploadFile).originFileObj) {
      file = (item.file as NzUploadFile).originFileObj;
    } else if ((item.file as any) instanceof File) {
      file = item.file as any;
    }

    // Debug log
    console.log('File extraction:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      itemFile: item.file,
    });

    if (!file || !(file instanceof File)) {
      console.error('Invalid file object:', item.file);
      item.onError!(new Error('Invalid file'), item.file as NzUploadFile);
      return new Subscription();
    }

    if (!this.cloudinaryData) {
      console.error('No cloudinaryData available!');
      item.onError!(
        new Error('Cloudinary configuration missing'),
        item.file as NzUploadFile
      );
      return new Subscription();
    }

    console.log('Cloudinary Data:', this.cloudinaryData);

    const formData = new FormData();

    // IMPORTANT: Append in this exact order
    formData.append('file', file, file.name);
    formData.append('api_key', this.cloudinaryData.apiKey);
    formData.append('timestamp', this.cloudinaryData.timestamp.toString());
    formData.append('signature', this.cloudinaryData.signature);
    formData.append('folder', this.cloudinaryData.folder);

    // Debug: Log FormData contents
    console.log('FormData contents:');
    formData.forEach((value, key) => {
      if (key === 'file') {
        console.log(
          `  ${key}: File(${(value as File).name}, ${
            (value as File).size
          } bytes)`
        );
      } else {
        console.log(`  ${key}: ${value}`);
      }
    });

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        console.log(`Progress: ${percent.toFixed(0)}%`);
        item.onProgress!({ percent }, item.file as NzUploadFile);
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        console.log('Response received:', {
          status: xhr.status,
          statusText: xhr.statusText,
          response: xhr.responseText,
        });

        if (xhr.status === 200) {
          console.log('Upload successful!');
          const response = JSON.parse(xhr.responseText);
          item.onSuccess!(response, item.file as NzUploadFile, xhr);
          this.categoryForm.patchValue({
            thumbnail: response.secure_url,
          });
        } else {
          console.error('Upload failed:', {
            status: xhr.status,
            statusText: xhr.statusText,
            response: xhr.responseText,
          });

          let errorMsg = 'Upload failed';
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            errorMsg = errorResponse.error?.message || xhr.responseText;
            console.error('Error details:', errorResponse);
          } catch (e) {
            errorMsg = `HTTP ${xhr.status}: ${xhr.statusText}`;
          }

          item.onError!(new Error(errorMsg), item.file as NzUploadFile);
        }
      }
    };

    // Use /auto/upload endpoint
    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudinaryData.cloudName}/${this.cloudinaryData.resourceType}/upload`;

    console.log('Upload URL:', uploadUrl);

    xhr.open('POST', uploadUrl, true);
    xhr.send(formData);

    return new Subscription();
  };

  handleChangeUpload(info: NzUploadChangeParam) {
    this.fileList = info.fileList.slice(-1);
  }

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

      if (this.isEditMode && this.categoryId) {
        this.store.dispatch(
          updateCategory({
            id: this.categoryId,
            updateCategoryRequest: { thumbnail: '' },
          })
        );
      }

      // // Xóa khỏi form
      this.categoryForm.patchValue({ thumbnail: null });

      // Xóa thành công
      console.log('✅ File deleted successfully from Cloudinary');
      return true; // cho phép nz-upload xóa khỏi fileList
    } catch (error) {
      console.error('❌ Failed to delete file:', error);
      return false; // không xóa khỏi fileList
    }
  };

  SubsribeToSelectedCategory() {
    if (this.isEditMode) {
      this.selectedCategorySubscription = this.store
        .select(getSelectedCategorySelector)
        .subscribe({
          next: (category) => {
            this.selectedCategory = category;
            if (category) {
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
            } else {
              this.ResetForm();
            }
          },
        });
    } else {
      this.ResetForm();
    }
  }

  OnSubmitted() {
    if (this.isEditMode) {
      this.store.dispatch(
        updateCategory({
          id: this.categoryId,
          updateCategoryRequest: this.categoryForm.value,
        })
      );
    } else {
      this.store.dispatch(
        addCategory({ addCategoryRequest: this.categoryForm.value })
      );
    }
  }

  ResetForm() {
    this.categoryForm.reset({ status: 'draft' });
    this.fileList = [];

    this.isEditMode = false;
    this.categoryId = '';
    this.selectedCategory = null;
  }

  ngOnDestroy(): void {
    this.showFormSubscription.unsubscribe();
    this.actionLoadingSubscription?.unsubscribe();
    this.detailLoadingSubscription?.unsubscribe();
  }
}
