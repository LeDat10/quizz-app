import { Course } from '../../../Models/course.model';
import { StatusType } from '../../../shared/enums/cloudinary.enum';
import { TypeCourse } from '../enums/course-type.enum';

export interface CourseResponse {
  message: string;
  data: Course;
  meta?: any;
}

export interface AddCourseRequest {
  title: string;
  description?: string;
  thumbnail?: string;
  typeCourse?: TypeCourse;
  status?: StatusType;
  position?: number;
  categoryId?: number | string;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  thumbnail?: string;
  typeCourse?: TypeCourse;
  status?: StatusType;
  position?: number;
  categoryId?: number | string;
}

export interface MetaInfo {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface LinksInfo {
  first: string;
  last: string;
  current: string;
  next: string | null;
  previous: string | null;
}

export interface CoursesPaginationResponse {
  data: Course[];
  meta: MetaInfo;
  links: LinksInfo;
}

export interface SelectionState {
  selectedIds: Set<number>;
  hasSelection: boolean;
  selectionCount: number;
}

export interface ChangeCourseStatusMultipleRequest {
  ids: number[];
  status: StatusType;
}

export interface CourseMultipleResponse {
  message: string;
  data: Course[];
  meta?: any;
}

export interface ChangeCoursePositionMultipleRequest {
  id: string | number;
  position: number;
}
