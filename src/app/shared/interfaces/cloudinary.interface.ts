import { ResourceType } from '../types/cloudinary.type';

export interface CloudinarySignature {
  timestamp: number;
  signature: string;
  cloudName: string;
  apiKey: string;
  folder: string;
  resourceType: string;
}

export interface CloudinaryRequest {
  folder: string;
  resourceType?: ResourceType;
}

export interface DeleteCloudinaryRequest {
  publicId: string;
  resourceType: ResourceType;
}
