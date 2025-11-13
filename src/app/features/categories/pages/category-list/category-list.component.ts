import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';
import { AppState } from '../../../../store/app.state';
import { Store } from '@ngrx/store';
import { showForm } from '../../states/category.actions';

@Component({
  selector: 'app-category-list',
  imports: [NgIconComponent, CategoryFormComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent {
  store: Store<AppState> = inject(Store);
  OnShowForm() {
    this.store.dispatch(showForm({ value: true }));
  }
}
