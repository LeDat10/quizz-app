import { createAction, props } from '@ngrx/store';
import {
  CloudinarySignature,
  CloudinaryRequest,
  DeleteCloudinaryRequest,
} from '../interfaces/cloudinary.interface';

export const getCloudinarySignature = createAction(
  '[shared] get cloudinary signature',
  props<{
    cloudinary: CloudinaryRequest;
  }>()
);

export const getCloudinarySignatureSuccess = createAction(
  '[shared] get cloudinary signature success',
  props<{ cloudinaryResponse: CloudinarySignature }>()
);

export const deleteCloudinaryFile = createAction(
  '[shared] delete cloudinary file',
  props<{ deleteCloudinaryRequest: DeleteCloudinaryRequest }>()
);
