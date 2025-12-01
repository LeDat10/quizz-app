import { inject } from '@angular/core';
import { CategoryDataService } from '../../../features/categories/services/category-data.service';
import { EntityDataService } from '@ngrx/data';
import { CATEGORY_ENTITY } from '../../../constants/Constants';

export function EntityDataInitService() {
  const entityDataService = inject(EntityDataService);
  const categoryDataService = inject(CategoryDataService);
  entityDataService.registerService(CATEGORY_ENTITY, categoryDataService);
}
