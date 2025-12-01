export interface Category {
  id: number;
  title: string;
  description?: string | null;
  thumbnail: string;
  status: string;
  position: number;
  slug: string;
  createAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
