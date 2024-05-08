import { TaskFiles } from '@/types';

export interface DashboardDocumentsResponse {
  id: number;
  categoryDocs: {
    fileKey: string;
    fileName: string;
    files: TaskFiles[];
    id: number;
    templateName: string;
    templateUrl: string;
  }[];
  collapse: boolean;
  categoryKey: string;
  categoryName: string;
}
