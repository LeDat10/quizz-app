import { HttpClient, HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  CloudinarySignature,
  CloudinaryRequest,
  DeleteCloudinaryRequest,
  CloudinaryResponse,
} from '../interfaces/cloudinary.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  http: HttpClient = inject(HttpClient);
  api = environment.apiUrl;
  getCloudinarySignature(
    cloudinaryRequest: CloudinaryRequest
  ): Observable<CloudinarySignature> {
    return this.http.post<CloudinarySignature>(
      `${this.api}/cloudinary/signature`,
      cloudinaryRequest
    );
  }

  deleteCloudinaryFile(deleteCloudinaryRequest: DeleteCloudinaryRequest) {
    return this.http.delete(
      `${this.api}/cloudinary?publicId=${deleteCloudinaryRequest.publicId}&resourceType=${deleteCloudinaryRequest.resourceType}`
    );
  }

  upload(
    file: File,
    cloudinaryData: CloudinarySignature
  ): Observable<HttpEvent<CloudinaryResponse>> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('api_key', cloudinaryData.apiKey);
    formData.append('timestamp', cloudinaryData.timestamp.toString());
    formData.append('signature', cloudinaryData.signature);
    formData.append('folder', cloudinaryData.folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryData.cloudName}/${cloudinaryData.resourceType}/upload`;
    return this.http.post<CloudinaryResponse>(uploadUrl, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
