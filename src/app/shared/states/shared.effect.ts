import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { CloudinaryService } from '../services/cloudinary.service';
import {
  deleteCloudinaryFile,
  getAllCategoriesForDropDown,
  getAllCategoriesForDropDownFailure,
  getAllCategoriesForDropDownSuccess,
  getCloudinarySignature,
  getCloudinarySignatureSuccess,
} from './shared.action';
import { catchError, exhaustMap, filter, map, of, withLatestFrom } from 'rxjs';
import { CloudinarySignature } from '../interfaces/cloudinary.interface';
import {
  getCloudinarySignatureSelector,
  getIsDropdownLoadedSelector,
} from './shared.selector';
import { SharedService } from '../services/shared.service';
import { CategoryForDropDownReponse } from '../interfaces/category.interface';

@Injectable({ providedIn: 'root' })
export class SharedEffect {
  actions$: Actions = inject(Actions);
  store: Store<AppState> = inject(Store);
  cloudinaryService: CloudinaryService = inject(CloudinaryService);
  sharedService: SharedService = inject(SharedService);
  getCloudinarySignature$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getCloudinarySignature),
      withLatestFrom(this.store.select(getCloudinarySignatureSelector)),
      filter(([action, cloudinaryData]) => {
        if (!cloudinaryData) return true;
        const req = action.cloudinary;
        const stored = cloudinaryData;
        if (req.folder !== stored.folder) return true;
        if (req.resourceType != null) {
          if (req.resourceType !== stored.resourceType) return true;
        }
        return false;
      }),
      exhaustMap(([action]) => {
        return this.cloudinaryService
          .getCloudinarySignature(action.cloudinary)
          .pipe(
            map((response: CloudinarySignature) =>
              getCloudinarySignatureSuccess({ cloudinaryResponse: response })
            )
          );
      })
    );
  });

  deleteCloudinaryFile$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(deleteCloudinaryFile),
        exhaustMap((action) => {
          return this.cloudinaryService.deleteCloudinaryFile(
            action.deleteCloudinaryRequest
          );
        })
      );
    },
    { dispatch: false }
  );

  // categories for dropdown
  getAllCategoriesForDropdown$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getAllCategoriesForDropDown),
      withLatestFrom(this.store.select(getIsDropdownLoadedSelector)),
      filter(([_, loaded]) => !loaded),
      exhaustMap(() => {
        return this.sharedService.getAllCategoiesForDropdown().pipe(
          map((response: CategoryForDropDownReponse) =>
            getAllCategoriesForDropDownSuccess({
              categoriesDropdown: response.data,
            })
          ),
          catchError((error) =>
            of(getAllCategoriesForDropDownFailure({ error }))
          )
        );
      })
    );
  });
}
