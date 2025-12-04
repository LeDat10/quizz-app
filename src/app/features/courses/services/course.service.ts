import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AddCourseRequest,
  CourseResponse,
  CoursesPaginationResponse,
} from '../interfaces/course.interface';
import { DEFAULT_LIMIT } from '../../../constants/Constants';
import { StatusType } from '../../../shared/enums/status.enum';
import { UpdateCategoryRequest } from '../../categories/interfaces/category.interface';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private api = environment.apiUrl;
  private courseApi = this.api + '/courses';
  constructor(private readonly http: HttpClient) {}

  addCourse(addCourseRequest: AddCourseRequest): Observable<CourseResponse> {
    return this.http.post<CourseResponse>(this.courseApi, addCourseRequest);
  }

  getCourses(
    queryParams: { page?: number; limit?: number } = {}
  ): Observable<CoursesPaginationResponse> {
    const { page = 1, limit = DEFAULT_LIMIT } = queryParams;
    return this.http.get<CoursesPaginationResponse>(
      `${this.courseApi}?page=${page}&limit=${limit}`
    );
  }

  changeCourseStatus(params: {
    id: number | string;
    status: StatusType;
  }): Observable<CourseResponse> {
    return this.http.patch<CourseResponse>(
      `${this.courseApi}/${params.id}/status`,
      {
        status: params.status,
      }
    );
  }

  updateCourse(params: {
    id: string | number;
    updateCourseRequest: UpdateCategoryRequest;
  }): Observable<CourseResponse> {
    return this.http.patch<CourseResponse>(
      `${this.courseApi}/${params.id}`,
      params.updateCourseRequest
    );
  }

  getCourseDetail(id: string | number): Observable<CourseResponse> {
    return this.http.get<CourseResponse>(`${this.courseApi}/${id}`);
  }
}
