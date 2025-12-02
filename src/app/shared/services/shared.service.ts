import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryForDropDownReponse } from '../interfaces/category.interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SharedService {
  http: HttpClient = inject(HttpClient);
  private api = environment.apiUrl;
  getAllCategoiesForDropdown(): Observable<CategoryForDropDownReponse> {
    return this.http.get<CategoryForDropDownReponse>(
      `${this.api}/categories/dropdown`
    );
  }
}
