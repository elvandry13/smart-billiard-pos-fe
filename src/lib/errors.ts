interface ApiErrorLike {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiErrorLike;
    return apiError.detail ?? apiError.message ?? 'Terjadi kesalahan. Silakan coba lagi.';
  }

  return 'Terjadi kesalahan. Silakan coba lagi.';
}