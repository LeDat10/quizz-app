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

export interface CloudinaryResponse {
  api_key: string;
  asset_folder: string;
  asset_id: string;
  bytes: number;
  created_at: string;
  display_name: string;
  etag: string;
  format: string;
  height: number;
  original_filename: string;
  placeholder: boolean;
  public_id: string;
  resource_type: string;
  secure_url: string;
  signature: string;
  tags: string[];
  type: string;
  url: string;
  version: number;
  version_id: string;
  width: number;
}
