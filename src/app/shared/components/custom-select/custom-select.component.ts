import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { NgClass } from '@angular/common';
import { OptionType } from '../../../core/interfaces/custom-select.interface';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-select',
  imports: [NgIcon, NgClass],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
})
export class CustomSelectComponent implements OnInit, ControlValueAccessor {
  value: string = '';
  isDisabled: boolean = false;
  isDropdown: boolean = false;
  optionSelected: OptionType = { content: '', value: '' };

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() id: string = '';
  @Input() options: OptionType[] = [];

  private onChange = (value: string | number) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
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

  ngOnInit() {
    if (this.options.length > 0) {
      this.optionSelected = this.options[0];
    }
  }

  OpenDorpdown() {
    this.isDropdown = !this.isDropdown;
  }

  ChooseOption(option: OptionType) {
    this.optionSelected = option;
    this.onChange(option.value);
    this.isDropdown = false;
  }
}
