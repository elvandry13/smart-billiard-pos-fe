import React from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'default' | 'search' | 'folder' | 'data';
  action?: {
    label: string;
    onClick: () => void;
  };
}

const icons = {
  default: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  ),
  search: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  folder: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    </svg>
  ),
  data: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
      />
    </svg>
  ),
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Tidak ada data",
  description,
  icon = "default",
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-4">{icons[icon]}</div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      {description && (
        <p className="text-gray-500 text-center mb-4 max-w-sm">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
