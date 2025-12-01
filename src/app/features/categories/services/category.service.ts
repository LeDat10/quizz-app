import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {
  AddCategoryRequest,
  CategoryMultipleResponse,
  CategoryPaginationResponse,
  CategoryResponse,
  UpdateCategoryRequest,
} from '../interfaces/category.interface';
import { Category } from '../../../Models/category.model';
import { DEFAULT_LIMIT } from '../../../constants/Constants';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private api = environment.apiUrl;
  http: HttpClient = inject(HttpClient);

  getCategories(
    params: { page?: number; limit?: number } = {}
  ): Observable<CategoryPaginationResponse> {
    const { page = 1, limit = DEFAULT_LIMIT } = params;

    return this.http.get<CategoryPaginationResponse>(
      `${this.api}/categories?page=${page}&limit=${limit}`
    );
  }

  addCategory(
    addCategoryRequest: AddCategoryRequest
  ): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(
      `${this.api}/categories`,
      addCategoryRequest
    );
  }

  changeCategoryStatus(params: { id: number | string; status: string }) {
    return this.http.patch<CategoryResponse>(
      `${this.api}/categories/${params.id}/status`,
      {
        status: params.status,
      }
    );
  }

  getCategoryDetail(id: number | string): Observable<Category> {
    return this.http.get<Category>(`${this.api}/categories/${id}`);
  }

  updateCategory(
    id: string | number,
    updateCategoryRequest: UpdateCategoryRequest
  ): Observable<CategoryResponse> {
    return this.http.patch<CategoryResponse>(
      `${this.api}/categories/${id}`,
      updateCategoryRequest
    );
  }

  updateCategoryPositionMultiple(
    dataRequest: { id: number | string; position: number }[]
  ): Observable<CategoryMultipleResponse> {
    return this.http.patch<CategoryMultipleResponse>(
      `${this.api}/categories/position-multiple`,
      dataRequest
    );
  }

  updateCategoryStatusMultiple(dataRequest: {
    ids: string[] | number[];
    status: string;
  }): Observable<CategoryMultipleResponse> {
    return this.http.patch<CategoryMultipleResponse>(
      `${this.api}/categories/status-multiple`,
      dataRequest
    );
  }
}
