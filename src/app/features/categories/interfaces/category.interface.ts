import { Category } from '../../../Models/category.model';

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

export interface CategoryPaginationResponse {
  data: Category[];
  meta: MetaInfo;
  links: LinksInfo;
}

export interface CategoryResponse {
  message: string;
  data: Category;
  meta?: any;
}

export interface CategoryMultipleResponse {
  message: string;
  data: Category[];
  meta?: any;
}

export interface AddCategoryRequest {
  title: string;
  description?: string;
  thumbnail?: string;
  status?: string;
  position?: number;
}

export interface UpdateCategoryRequest {
  title?: string;
  description?: string;
  thumbnail?: string;
  status?: string;
  position?: number;
}
