import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Category } from '../../../Models/category.model';
import { CATEGORY_ENTITY } from '../../../constants/Constants';

@Injectable({ providedIn: 'root' })
export class CategoryEntityService extends EntityCollectionServiceBase<Category> {
  constructor(ecsef: EntityCollectionServiceElementsFactory) {
    super(CATEGORY_ENTITY, ecsef);
  }
}
