export const extractFileNameFromUrl = (url: string): string => {
  try {
    // URL format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/filename.jpg
    const parts = url.split('/');
    const fileNameWithExt = parts[parts.length - 1];
    return fileNameWithExt;
  } catch (error) {
    return 'image.jpg';
  }
};

export function extractPublicId(url: string): string {
  const parts = url.split('/upload/')[1].split('/');
  const versionAndFile = parts.slice(1).join('/');
  return versionAndFile.replace(/\.[^/.]+$/, ''); // bỏ extension
}
