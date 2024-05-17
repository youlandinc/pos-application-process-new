export enum HttpErrorType {
  tokenExpired = '40001',
  state_verify_error = '40005',
}

export enum HttpVariantType {
  error = 'error',
  success = 'success',
  warning = 'warning',
  info = 'info',
}

export interface HttpError {
  message: string;
  header: string;
  variant: HttpVariantType;
  code?: string;
}
