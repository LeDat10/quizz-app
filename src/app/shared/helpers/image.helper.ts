export const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

// cloudinary-upload.helper.ts
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Subscription } from 'rxjs';
import { CloudinarySignature } from '../interfaces/cloudinary.interface';

export function uploadToCloudinaryHelper(
  item: NzUploadXHRArgs,
  cloudinaryData: CloudinarySignature | null,
  onSuccessCallback?: (url: string) => void
): Subscription {
  let file: File | undefined;

  // Extract file
  if (item.file instanceof File) {
    file = item.file;
  } else if ((item.file as NzUploadFile).originFileObj) {
    file = (item.file as NzUploadFile).originFileObj;
  } else if ((item.file as any) instanceof File) {
    file = item.file as any;
  }

  if (!file || !(file instanceof File)) {
    console.error('Invalid file object:', item.file);
    item.onError!(new Error('Invalid file'), item.file as NzUploadFile);
    return new Subscription();
  }

  if (!cloudinaryData) {
    item.onError?.(
      new Error('Cloudinary configuration missing'),
      item.file as NzUploadFile
    );
    return new Subscription();
  }

  const formData = new FormData();
  formData.append('file', file, file.name);
  formData.append('api_key', cloudinaryData.apiKey);
  formData.append('timestamp', cloudinaryData.timestamp.toString());
  formData.append('signature', cloudinaryData.signature);
  formData.append('folder', cloudinaryData.folder);

  const xhr = new XMLHttpRequest();

  // Progress
  xhr.upload.addEventListener('progress', (event) => {
    if (event.lengthComputable) {
      item.onProgress?.(
        { percent: (event.loaded / event.total) * 100 },
        item.file as NzUploadFile
      );
    }
  });

  // Result
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        item.onSuccess?.(response, item.file as NzUploadFile, xhr);
        onSuccessCallback?.(response.secure_url);
      } else {
        let errorMsg = 'Upload failed';
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          errorMsg = errorResponse.error?.message || xhr.responseText;
        } catch (e) {
          errorMsg = `HTTP ${xhr.status}: ${xhr.statusText}`;
        }
        item.onError?.(new Error(errorMsg), item.file as NzUploadFile);
      }
    }
  };

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryData.cloudName}/${cloudinaryData.resourceType}/upload`;

  xhr.open('POST', uploadUrl, true);
  xhr.send(formData);

  return new Subscription();
}

export const handleDownloadHelper = async (file: NzUploadFile) => {
  const url = file.response?.secure_url || file.url;
  if (!url) return;

  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = file.name || 'image.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Giải phóng object URL sau khi download
    URL.revokeObjectURL(a.href);
  } catch (error) {
    console.error('Download failed', error);
  }
};
