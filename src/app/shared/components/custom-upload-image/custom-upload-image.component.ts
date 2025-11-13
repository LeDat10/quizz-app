import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { Preview } from '../../../core/interfaces/custom-upload-image.interface';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-custom-upload-image',
  imports: [NgIcon, NgClass],
  templateUrl: './custom-upload-image.component.html',
  styleUrl: './custom-upload-image.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomUploadImageComponent),
      multi: true,
    },
  ],
})
export class CustomUploadImageComponent
  implements ControlValueAccessor, OnDestroy
{
  ngOnDestroy(): void {
    if (this.previews.length > 0) {
      this.previews.forEach((p) => URL.revokeObjectURL(p.url));
    }
  }

  dragCounter = 0;
  isDragging = false;
  isDisabled = false;

  @Input() previewMode: 'mutiple' | 'single' = 'single';
  previews: Preview[] = [];

  @Input() label: string = '';

  private onChange = (value: File | null) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.proccessFile(value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  proccessFile(incomingFile: File | null) {
    const file = incomingFile;
    if (!file) {
      return;
    }
    const currentFileId = `${file.name}-${file.lastModified}-${file.size}`;
    const checkId = this.previews.find((pre) => pre.id === currentFileId);
    if (checkId) {
      return;
    }
    const newPreview: Preview = {
      id: currentFileId,
      url: URL.createObjectURL(file),
      file: file,
    };
    if (this.previewMode === 'mutiple') {
      this.previews.push(newPreview);
    }
    if (this.previewMode === 'single') {
      this.previews.forEach((p) => URL.revokeObjectURL(p.url));
      this.previews = [];
      this.previews.push(newPreview);
    }
  }

  OnSelectImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.proccessFile(file);
      this.onChange(file);
    }
    event.target.value = '';
  }

  HandleRemove(imageId: string) {
    const previewToRemove = this.previews.find((p) => p.id === imageId);
    const indexPreviewToRemove = this.previews.findIndex(
      (p) => p.id === imageId
    );

    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove.url);
      this.previews.splice(indexPreviewToRemove, 1);
    }
  }

  HandleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    this.dragCounter = 0;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.proccessFile(event.dataTransfer.files[0]);
    }
  }

  HandleDragEvents(event: any, isEntering: boolean) {
    event.preventDefault();
    event.stopPropagation();
    if (isEntering) {
      this.dragCounter++;
      this.isDragging = true;
    } else {
      this.dragCounter--;
      if (this.dragCounter === 0) {
        this.isDragging = false;
      }
    }

    console.log(this.dragCounter);
  }
}
