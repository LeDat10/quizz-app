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
  loadCategoryForEdit,
  showForm,
  updateCategoryPositionMultiple,
  updateCategoryStatusnMultiple,
} from '../../states/categories.actions';
import { StatusType } from '../../../../shared/enums/cloudinary.enum';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
import { SelectionState } from '../../interfaces/category.interface';
import { CommonModule } from '@angular/common';
import { DEFAULT_LIMIT } from '../../../../constants/Constants';
import { ActionBarComponent } from '../../../../shared/components/action-bar/action-bar.component';

const STATUS_TRANSITIONS: Record<StatusType, StatusType> = {
  [StatusType.DRAFT]: StatusType.PUBLISHED,
  [StatusType.PUBLISHED]: StatusType.INACTIVE,
  [StatusType.INACTIVE]: StatusType.ARCHIVED,
  [StatusType.ARCHIVED]: StatusType.DRAFT,
};

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
  private readonly store = inject(Store<AppState>);
  private readonly destroy$ = new Subject<void>();

  readonly categories$ = this.store.select(getCategoriesSelector);
  readonly loading$ = this.store.select(getCategoryListLoadingSelector);
  readonly meta$ = this.store.select(getMetaSelector);

  readonly tableState$ = this.meta$.pipe(
    map((meta) => ({
      total: meta?.totalItems || 0,
      pageIndex: meta?.currentPage || 1,
      pageSize: meta?.itemsPerPage || DEFAULT_LIMIT,
    }))
  );

  private readonly selectedIds = new Set<number>();
  readonly selection$: Observable<SelectionState> = combineLatest([
    this.categories$,
  ]).pipe(
    map(([categories]) => ({
      selectedIds: this.selectedIds,
      hasSelection: this.selectedIds.size > 0,
      selectionCount: this.selectedIds.size,
      allSelected:
        categories.length > 0 &&
        categories.every((item) => this.selectedIds.has(item.id)),
      indeterminate:
        this.selectedIds.size > 0 &&
        categories.some((item) => !this.selectedIds.has(item.id)),
    }))
  );

  readonly statusTypeMap = statusTypeMapFull;
  categories: Category[] = [];
  checked = false;
  indeterminate = false;

  ngOnInit(): void {
    this.subscribeToCategories();
  }

  private subscribeToCategories(): void {
    this.categories$.pipe(takeUntil(this.destroy$)).subscribe((categories) => {
      this.categories = categories;
      this.updateSelectionState();
    });
  }

  onChangeStatus(params: { id: string | number; status: string }): void {
    const currentStatus = params.status as StatusType;
    const nextStatus = STATUS_TRANSITIONS[currentStatus] || StatusType.DRAFT;

    this.store.dispatch(
      changeCategoryStatus({
        id: params.id,
        status: nextStatus,
      })
    );
  }

  private updateSelectionState(): void {
    this.checked =
      this.categories.length > 0 &&
      this.categories.every((item) => this.selectedIds.has(item.id));

    this.indeterminate = this.selectedIds.size > 0 && !this.checked;
  }

  onCategoryEdit(id: string | number): void {
    this.store.dispatch(showForm({ value: true }));
    this.store.dispatch(loadCategoryForEdit({ categoryId: id }));
  }

  onPageIndexChange(pageIndex: number): void {
    this.store.dispatch(
      changeCategoryPage({
        queryParams: {
          page: pageIndex,
          limit: DEFAULT_LIMIT,
        },
      })
    );
  }

  onPageSizeChange(pageSize: number): void {
    this.store.dispatch(
      changeCategoryPage({
        queryParams: {
          page: 1,
          limit: pageSize,
        },
      })
    );
  }

  onAllChecked(checked: boolean): void {
    if (checked) {
      this.categories.forEach((item) => this.selectedIds.add(item.id));
    } else {
      this.selectedIds.clear();
    }
    this.updateSelectionState();
  }

  onItemChecked(id: number, checked: boolean): void {
    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
    this.updateSelectionState();
  }

  onUpdatePositionMultiple(): void {
    const selectedPositions = this.getSelectedPositions();

    if (selectedPositions.length === 0) {
      return;
    }

    this.store.dispatch(
      updateCategoryPositionMultiple({ dataRequests: selectedPositions })
    );
  }

  onUpdateStatusMultiple(status: string): void {
    const ids = Array.from(this.selectedIds);

    if (ids.length === 0) {
      return;
    }

    this.store.dispatch(
      updateCategoryStatusnMultiple({
        request: { ids, status },
      })
    );
  }

  private getSelectedPositions(): Array<{ id: number; position: number }> {
    return this.categories
      .filter((item) => this.selectedIds.has(item.id))
      .map((item) => ({
        id: item.id,
        position: item.position,
      }));
  }

  onCloseActionBar(): void {
    this.selectedIds.clear();
    this.updateSelectionState();
  }

  isItemSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

  getSelectionCount(): number {
    return this.selectedIds.size;
  }

  hasSelection(): boolean {
    return this.selectedIds.size > 0;
  }

  trackByCategory(index: number, item: Category): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
