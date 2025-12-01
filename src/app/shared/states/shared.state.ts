import { CloudinarySignature } from '../interfaces/cloudinary.interface';

export interface SharedState {
  cloudinarySignature: CloudinarySignature | null;
}

export const initialState: SharedState = {
  cloudinarySignature: null,
};
