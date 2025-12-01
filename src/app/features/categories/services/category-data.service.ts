import { DefaultDataService, HttpOptions, HttpUrlGenerator } from '@ngrx/data';
import { Category } from '../../../Models/category.model';
import { HttpClient } from '@angular/common/http';
import { CATEGORY_ENTITY } from '../../../constants/Constants';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryDataService extends DefaultDataService<Category> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super(CATEGORY_ENTITY, http, httpUrlGenerator);
  }

  override getAll(): Observable<Category[]> {
    console.log('getAll running');
    return this.http.get('http://localhost:3000/categories').pipe(
      map((data: any) => {
        return data.data;
      }),
      catchError((error) => {
        console.error('Error fetching categories:', error);
        // Return empty array or handle error appropriately
        return [];
      })
    );
  }
}
