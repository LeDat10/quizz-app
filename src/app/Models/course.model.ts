import { TypeCourse } from '../features/courses/enums/course-type.enum';
import { StatusType } from '../shared/enums/status.enum';
import { Category } from './category.model';

export interface Course {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  typeCourse: TypeCourse;
  status: StatusType;
  position: number;
  slug: string;
  courseCode: string;
  category?: Category;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}
