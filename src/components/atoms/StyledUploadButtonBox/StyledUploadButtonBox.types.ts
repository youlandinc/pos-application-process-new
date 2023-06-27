import { CSSProperties, ReactNode } from 'react';
import { SUploadData } from '@/models/common/UploadFile';

export interface StyledUploadButtonBoxProps {
  fileList: SUploadData[];
  label: string | ReactNode;
  onSuccess: (files: FileList) => void;
  onDelete: (index: number) => void;
  loading?: boolean;
  fileSize?: number;
  style?: CSSProperties;
  children?: ReactNode;
  accept?: string;
  uploadText?: string;
}
