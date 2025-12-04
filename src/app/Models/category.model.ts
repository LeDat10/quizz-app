import { StatusType } from '../shared/enums/status.enum';

export interface Category {
  id: number;
  title: string;
  description?: string | null;
  thumbnail: string;
  status: StatusType;
  position: number;
  slug: string;
  createAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
