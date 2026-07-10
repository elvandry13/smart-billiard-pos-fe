import React from "react";
import { Link } from "react-router-dom";
import { Role } from "@/types/auth";
import { defaultRouteByRole } from "@/lib/permissions";
import type { UserProfile } from "@/features/profile/types";

interface ForbiddenStateProps {
  user?: UserProfile | null;
  requiredRoles?: Role[];
  onBackHome?: () => void;
}

export const ForbiddenState: React.FC<ForbiddenStateProps> = ({
  user,
  requiredRoles,
  onBackHome,
}) => {
  const handleBackHome = () => {
    if (onBackHome) {
      onBackHome();
      return;
    }
    // Navigate to default route based on user's role
    if (user?.role) {
      const defaultRoute = defaultRouteByRole[user.role];
      window.location.href = defaultRoute;
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-red-500 text-6xl mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h2>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {requiredRoles && requiredRoles.length > 0
          ? `Anda tidak memiliki izin untuk mengakses halaman ini. Halaman ini hanya dapat diakses oleh role: ${requiredRoles.join(", ")}.`
          : "Anda tidak memiliki izin untuk mengakses halaman ini."}
      </p>
      <div className="flex gap-4">
        <button
          onClick={handleBackHome}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Kembali ke Beranda
        </button>
        <Link
          to="/login"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          Login Ulang
        </Link>
      </div>
    </div>
  );
};
