export interface TeamBody {
  id: number;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskBody {
  id: number;
  title: string;
  description: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  teams: TeamBody[];
  createdAt: string;
  updatedAt: string;
}

export interface DataBody<T> {
  data: T;
}

export interface ListBody<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface ErrorBody {
  error: { code: string; message: string; details?: string[] };
}
