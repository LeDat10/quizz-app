import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Category } from '../../../Models/category.model';
import { LinksInfo, MetaInfo } from '../interfaces/category.interface';

// export interface CategoryState {
//   showForm: boolean;
// }

// export const initialState: CategoryState = {
//   showForm: false,
// };

export const categoryAdapter = createEntityAdapter<Category>({
  selectId: (category: Category) => category.id,
});

export interface CategoryState extends EntityState<Category> {
  showForm: boolean;
  loaded: boolean;
  links: LinksInfo | null;
  meta: MetaInfo | null;
  listLoading: boolean;
  detailLoading: boolean;
  actionLoading: boolean;
  selectedCategory: Category | null;
  error: any;
}

export const initialState: CategoryState = categoryAdapter.getInitialState({
  showForm: false,
  loaded: false,
  links: null,
  meta: null,
  listLoading: false,
  detailLoading: false,
  actionLoading: false,
  selectedCategory: null,
  error: null,
});
