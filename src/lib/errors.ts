export interface ApiErrorPayload {
  detail?: string;
  message?: string;
  non_field_errors?: string[];
  [key: string]: unknown;
}

/**
 * Field-level validation error from Django REST Framework
 * Example: { "username": ["This field is required."], "password": ["Invalid credentials."] }
 */
export type FieldValidationErrors = Record<string, string[]>;

export interface ValidationErrorPayload {
  [key: string]: string | string[] | ValidationErrorPayload | ValidationErrorPayload[];
}

export class ApiError extends Error {
  status: number;
  payload?: unknown;
  fieldErrors?: FieldValidationErrors;

  constructor(status: number, payload?: unknown, message?: string) {
    super(message ?? getApiErrorMessage(payload));
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;

    // Extract field-level validation errors if present
    if (typeof payload === 'object' && payload !== null) {
      const fieldErrors = extractFieldErrors(payload);
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        this.fieldErrors = fieldErrors;
      }
    }
  }

  /**
   * Check if this error has field-level validation errors
   */
  hasFieldErrors(): boolean {
    return this.fieldErrors !== undefined && Object.keys(this.fieldErrors).length > 0;
  }

  /**
   * Get error message for a specific field
   */
  getFieldError(field: string): string | undefined {
    return this.fieldErrors?.[field]?.[0];
  }
}

function extractFieldErrors(payload: unknown): FieldValidationErrors | null {
  if (typeof payload !== 'object' || payload === null) {
    return null;
  }

  const obj = payload as Record<string, unknown>;
  const fieldErrors: FieldValidationErrors = {};

  for (const [key, value] of Object.entries(obj)) {
    // Skip non-field error keys
    if (key === 'detail' || key === 'message' || key === 'non_field_errors') {
      continue;
    }

    // Check if it's an array of strings (validation errors)
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
      fieldErrors[key] = value as string[];
    }
    // Check for nested validation errors (e.g., nested serializers)
    else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      const nested = extractFieldErrors(value[0]);
      if (nested) {
        for (const [nestedKey, nestedMessages] of Object.entries(nested)) {
          fieldErrors[`${key}.${nestedKey}`] = nestedMessages;
        }
      }
    }
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
}

/**
 * Get a human-readable error message from various error formats
 * Handles Django REST Framework error formats:
 * - { detail: "string" }
 * - { message: "string" }
 * - { non_field_errors: ["error1", "error2"] }
 * - { field_name: ["error1", "error2"] }
 * - Nested error objects
 */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiErrorPayload;

    // Handle non_field_errors (Django DRF)
    if (
      Array.isArray(apiError.non_field_errors) &&
      typeof apiError.non_field_errors[0] === 'string'
    ) {
      return apiError.non_field_errors[0];
    }

    // Handle detail
    if (typeof apiError.detail === 'string') {
      return apiError.detail;
    }

    // Handle message
    if (typeof apiError.message === 'string') {
      return apiError.message;
    }

    // Handle DRF field-level errors (return first error found)
    for (const [key, value] of Object.entries(apiError)) {
      if (key === 'detail' || key === 'message' || key === 'non_field_errors') {
        continue;
      }

      if (Array.isArray(value) && value.length > 0) {
        if (typeof value[0] === 'string') {
          return value[0];
        }
        // Handle nested errors
        if (typeof value[0] === 'object') {
          const nestedMessage = getApiErrorMessage(value[0]);
          if (nestedMessage !== 'Terjadi kesalahan. Silakan coba lagi.') {
            return nestedMessage;
          }
        }
      }
    }

    return apiError.detail ?? apiError.message ?? 'Terjadi kesalahan. Silakan coba lagi.';
  }

  return 'Terjadi kesalahan. Silakan coba lagi.';
}

/**
 * Get a summary of all field validation errors as a single string
 * Useful for displaying multiple errors at once
 */
export function getValidationSummary(fieldErrors: FieldValidationErrors): string {
  const messages: string[] = [];

  for (const [field, errors] of Object.entries(fieldErrors)) {
    if (errors.length > 0) {
      // Convert field name to readable format (e.g., "first_name" -> "First name")
      const readableField = field
        .split('.')
        .map((part) => {
          const spaced = part.replace(/_/g, ' ');
          return spaced.charAt(0).toUpperCase() + spaced.slice(1);
        })
        .join('.');

      messages.push(`${readableField}: ${errors[0]}`);
    }
  }

  return messages.join('; ');
}

/**
 * Map API validation errors to a format compatible with React Hook Form's setError
 * Usage:
 * ```typescript
 * const { setError } = useForm();
 *
 * try {
 *   await mutation();
 * } catch (error) {
 *   if (error instanceof ApiError && error.fieldErrors) {
 *     mapApiValidationErrors(error.fieldErrors, setError);
 *   }
 * }
 * ```
 */
export function mapApiValidationErrors(
  fieldErrors: FieldValidationErrors,
  setError: (name: string, error: { type: string; message: string }) => void,
): void {
  for (const [field, errors] of Object.entries(fieldErrors)) {
    if (errors.length > 0) {
      setError(field, {
        type: 'server',
        message: errors[0],
      });
    }
  }
}

/**
 * Check if error is an authentication error (401 Unauthorized)
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 401;
  }
  return false;
}

/**
 * Check if error is a forbidden error (403 Forbidden)
 */
export function isForbiddenError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 403;
  }
  return false;
}

/**
 * Check if error is a not found error (404 Not Found)
 */
export function isNotFoundError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 404;
  }
  return false;
}

/**
 * Check if error is a validation error (400 Bad Request)
 */
export function isValidationError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 400;
  }
  return false;
}

/**
 * Check if error is a server error (500 Internal Server Error)
 */
export function isServerError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status >= 500 && error.status < 600;
  }
  return false;
}

/**
 * Get HTTP status text in Indonesian
 */
export function getHttpStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    400: 'Permintaan tidak valid',
    401: 'Tidak terotorisasi',
    403: 'Akses ditolak',
    404: 'Halaman tidak ditemukan',
    405: 'Metode tidak diizinkan',
    408: 'Request timeout',
    409: 'Konflik data',
    422: 'Data tidak valid',
    429: 'Terlalu banyak permintaan',
    500: 'Kesalahan server',
    502: 'Gateway error',
    503: 'Layanan tidak tersedia',
    504: 'Gateway timeout',
  };

  return statusTexts[status] ?? 'Terjadi kesalahan';
}
