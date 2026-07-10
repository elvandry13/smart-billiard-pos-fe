import React from 'react';

type LoadingSize = 'sm' | 'md' | 'lg';

interface LoadingStateProps {
  message?: string;
  size?: LoadingSize;
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses: Record<LoadingSize, string> = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
};

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Memuat...',
  size = 'md',
  fullScreen = false,
  className = '',
}) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50'
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={`${containerClass} ${className}`}>
      <div
        className={`${sizeClasses[size]} border-blue-500 border-t-transparent rounded-full animate-spin`}
      />
      {message && <p className="mt-4 text-gray-600 text-sm font-medium">{message}</p>}
    </div>
  );
};
