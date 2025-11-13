import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SizeType, VariantType } from '../../../core/types/custom-button.type';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-custom-button',
  imports: [NgClass, NgIcon],
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.scss',
})
export class CustomButtonComponent {
  @Input() variant: VariantType = 'primary';
  @Input() size: SizeType = 'md';
  @Input() icon: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() customClass: string = '';
  @Output() clicked = new EventEmitter<MouseEvent>();

  baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  variantClasses = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary:
      'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost:
      'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-primary-500',
  };

  sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
}
