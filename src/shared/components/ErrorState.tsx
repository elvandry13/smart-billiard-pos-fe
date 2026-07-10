import React from "react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message = "Terjadi kesalahan", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="text-red-500 text-4xl mb-4">!</div>
      <p className="text-gray-700 text-center mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
};
