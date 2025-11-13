import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { RawEditorOptions } from 'tinymce';

@Component({
  selector: 'app-custom-textarea',
  imports: [CommonModule, EditorComponent],
  templateUrl: './custom-textarea.component.html',
  styleUrl: './custom-textarea.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomTextareaComponent),
      multi: true,
    },
  ],
})
export class CustomTextareaComponent implements ControlValueAccessor {
  // Component TypeScript
  editorConfig: RawEditorOptions = {
    plugins:
      'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
    toolbar:
      'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
    toolbar_mode: 'sliding',
    toolbar_sticky: true,
    menubar: true,
    height: 400,
    min_height: 400,
    resize: true,
    statusbar: true,
    promotion: false,
    branding: false,
  };

  value: string = '';
  private onChange = (value: string) => {};
  private onTouched = () => {};

  @Input() label: string = '';
  @Input() id: string = '';

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange(event: any) {
    const content = event.editor.getContent();
    this.onChange(content);
    this.onTouched();
  }
}
