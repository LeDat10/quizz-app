import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  http: HttpClient = inject(HttpClient);

  public async getAllCategory() {
    
  }
}
