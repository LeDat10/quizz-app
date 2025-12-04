import { Component, inject, OnInit } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';
import { AppState } from '../../../../store/app.state';
import { Store } from '@ngrx/store';
import { getCategories, showForm } from '../../states/categories.actions';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { getCategoriesSelector } from '../../states/categories.selector';
import { getCloudinarySignature } from '../../../../shared/states/shared.action';
import { CategoryTableComponent } from '../../components/category-table/category-table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  imports: [
    CategoryFormComponent,
    NzGridModule,
    NzButtonModule,
    NzIconModule,
    CategoryTableComponent,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  store: Store<AppState> = inject(Store);
  router: Router = inject(Router);
  ngOnInit(): void {
    this.store.dispatch(getCategories());
  }

  OnAddCategory() {
    this.store.dispatch(showForm({ value: true }));
    this.store.dispatch(
      getCloudinarySignature({ cloudinary: { folder: 'categories' } })
    );
  }
}
