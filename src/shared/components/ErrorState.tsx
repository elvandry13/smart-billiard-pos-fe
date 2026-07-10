import React from "react";

type ErrorVariant = 'default' | 'warning' | 'danger';

interface ErrorStateProps {
  message?: string;
  description?: string;
  onRetry?: () => void;
  variant?: ErrorVariant;
  className?: string;
}

const variantConfig: Record<ErrorVariant, { icon: React.ReactNode; iconColor: string; bgColor: string }> = {
  default: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  warning: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50',
  },
  danger: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
        />
      </svg>
    ),
    iconColor: 'text-red-600',
    bgColor: 'bg-red-100',
  },
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Terjadi kesalahan",
  description,
  onRetry,
  variant = 'default',
  className = '',
}) => {
  const config = variantConfig[variant];

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className={`${config.bgColor} p-4 rounded-full mb-4`}>
        <div className={config.iconColor}>{config.icon}</div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{message}</h3>
      {description && (
        <p className="text-gray-600 text-center mb-4 max-w-md">{description}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
};

// Convenience component for server errors
interface ServerErrorStateProps {
  onRetry?: () => void;
  className?: string;
}

export const ServerErrorState: React.FC<ServerErrorStateProps> = ({
  onRetry,
  className = '',
}) => {
  return (
    <ErrorState
      variant="danger"
      message="Kesalahan Server"
      description="Terjadi kesalahan di server. Silakan coba beberapa saat lagi."
      onRetry={onRetry}
      className={className}
    />
  );
};

// Convenience component for network errors
interface NetworkErrorStateProps {
  onRetry?: () => void;
  className?: string;
}

export const NetworkErrorState: React.FC<NetworkErrorStateProps> = ({
  onRetry,
  className = '',
}) => {
  return (
    <ErrorState
      variant="warning"
      message="Tidak Ada Koneksi"
      description="Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
      onRetry={onRetry}
      className={className}
    />
  );
};
