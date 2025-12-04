import { Component, inject, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AppState } from '../../../../store/app.state';
import { Store } from '@ngrx/store';
import { Category } from '../../../../Models/category.model';
import {
  getCategoriesSelector,
  getCategoryListLoadingSelector,
  getMetaSelector,
} from '../../states/categories.selector';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { statusTypeMapFull } from '../../../../constants/status';
import {
  changeCategoryPage,
  changeCategoryStatus,
  getCategoryDetail,
  loadCategoryForEdit,
  showForm,
  updateCategoryPositionMultiple,
  updateCategoryStatusnMultiple,
} from '../../states/categories.actions';
import { StatusType } from '../../../../shared/enums/cloudinary.enum';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MetaInfo } from '../../interfaces/category.interface';
import { CommonModule } from '@angular/common';
import { DEFAULT_LIMIT } from '../../../../constants/Constants';
import { ActionBarComponent } from '../../../../shared/components/action-bar/action-bar.component';
@Component({
  selector: 'app-category-table',
  imports: [
    NzTableModule,
    NzImageModule,
    NzInputNumberModule,
    FormsModule,
    NzTagModule,
    NzButtonModule,
    NzGridModule,
    NzIconModule,
    NzToolTipModule,
    CommonModule,
    ActionBarComponent,
    NzSpinModule,
  ],
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.scss',
})
export class CategoryTableComponent implements OnInit {
  store: Store<AppState> = inject(Store);
  router: Router = inject(Router);
  categories: Category[] = [];
  statusTypeMap = statusTypeMapFull;
  pageSize: number = DEFAULT_LIMIT;
  meta$: Observable<MetaInfo | null> | null = null;
  setOfCheckedId = new Set<number>();
  pageIndex: number = 1;
  pageLimit: number = DEFAULT_LIMIT;
  scrollY: string = '500px';
  checked: boolean = false;
  indeterminate: boolean = false;
  listLoading$: Observable<boolean> | null = null;
  ngOnInit(): void {
    this.listLoading$ = this.store.select(getCategoryListLoadingSelector);
    this.store.select(getCategoriesSelector).subscribe({
      next: (data) => {
        this.categories = data.map((item) => ({ ...item }));
      },
    });

    this.meta$ = this.store.select(getMetaSelector);
  }

  calculateScrollHeight(): void {
    const breadcrumb = 22;
    const headerHeight = 64;
    const paginationHeight = 32;
    const padding = 24 * 2;
    const headerPage = 51;
    const tableHeight =
      headerHeight + paginationHeight + padding + headerPage + breadcrumb;
    this.scrollY = `calc(100vh - ${tableHeight}px)`;
  }

  OnChangeStatus(params: { id: string | number; status: string }) {
    let statusRequest: string = '';
    switch (params.status) {
      case StatusType.DRAFT:
        statusRequest = StatusType.PUBLISHED;
        break;
      case StatusType.PUBLISHED:
        statusRequest = StatusType.INACTIVE;
        break;
      case StatusType.INACTIVE:
        statusRequest = StatusType.ARCHIVED;
        break;
      case StatusType.ARCHIVED:
        statusRequest = StatusType.DRAFT;
        break;
      default:
        statusRequest = StatusType.DRAFT;
        break;
    }

    params.status = statusRequest;
    this.store.dispatch(changeCategoryStatus(params));
  }

  OnCategoryEdit(id: string | number) {
    this.store.dispatch(showForm({ value: true }));
    this.store.dispatch(loadCategoryForEdit({ categoryId: id }));
  }

  onPageIndexChange(newIndex: number) {
    this.pageIndex = newIndex;
    this.store.dispatch(
      changeCategoryPage({
        queryParams: { page: newIndex, limit: this.pageLimit },
      })
    );
  }

  onPageSizeChange(newPageSize: number) {
    this.pageLimit = newPageSize;
    this.store.dispatch(
      changeCategoryPage({
        queryParams: { page: 1, limit: newPageSize },
      })
    );
  }

  onAllChecked(checked: boolean) {
    this.categories.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.categories.every((item) =>
      this.setOfCheckedId.has(item.id)
    );

    this.indeterminate =
      this.categories.some((item) => this.setOfCheckedId.has(item.id)) &&
      !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  getSelectedPositions() {
    return this.categories
      .filter((item) => this.setOfCheckedId.has(item.id))
      .map((item) => ({ id: item.id, position: item.position }));
  }

  OnUpdatePositionMultiple() {
    const selectedPositions = this.getSelectedPositions();
    this.store.dispatch(
      updateCategoryPositionMultiple({ dataRequests: selectedPositions })
    );
  }

  OnUpdateStatusMultiple(status: string) {
    const ids = [...this.setOfCheckedId];
    this.store.dispatch(
      updateCategoryStatusnMultiple({ request: { ids, status } })
    );
  }

  OnCloseActionBar() {
    this.setOfCheckedId.clear();
    this.checked = false;
    this.indeterminate = false;
  }
}
