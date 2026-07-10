export interface ApiErrorPayload {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(status: number, payload?: unknown, message?: string) {
    super(message ?? getApiErrorMessage(payload));
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiErrorPayload;

    if (Array.isArray(apiError.non_field_errors) && typeof apiError.non_field_errors[0] === 'string') {
      return apiError.non_field_errors[0];
    }

    return apiError.detail ?? apiError.message ?? 'Terjadi kesalahan. Silakan coba lagi.';
  }

  return 'Terjadi kesalahan. Silakan coba lagi.';
}