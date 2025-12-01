import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  CloudinarySignature,
  CloudinaryRequest,
  DeleteCloudinaryRequest,
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
}
