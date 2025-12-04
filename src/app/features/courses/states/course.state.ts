// export interface CourseState {
//   showForm: boolean;
// }

import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Course } from '../../../Models/course.model';
import { LinksInfo, MetaInfo } from '../interfaces/course.interface';
import { HttpErrorResponse } from '@angular/common/http';

export const courseAdapter = createEntityAdapter<Course>({
  selectId: (course: Course) => course.id,
});

export interface CourseState extends EntityState<Course> {
  showForm: boolean;
  meta: MetaInfo | null;
  links: LinksInfo | null;
  detailLoading: boolean;
  actionLoading: boolean;
  listLoading: boolean;
  loaded: boolean;
  selectedCourse: Course | null;
  error: HttpErrorResponse | null;
}

export const initialState: CourseState = courseAdapter.getInitialState({
  showForm: false,
  meta: null,
  links: null,
  detailLoading: false,
  actionLoading: false,
  listLoading: false,
  loaded: false,
  selectedCourse: null,
  error: null,
});
