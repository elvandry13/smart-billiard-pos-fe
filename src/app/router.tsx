import { createBrowserRouter, Navigate } from 'react-router-dom';

import { LoginPage } from '@/features/auth/pages/LoginPage';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PosLayout } from '@/layouts/PosLayout';
import { PlaceholderPage } from '@/shared/components/PlaceholderPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: (
          <PlaceholderPage
            title="Dashboard"
            description="KPI, revenue trend, dan top customers akan terhubung ke API pada fase berikutnya."
          />
        ),
      },
    ],
  },
  {
    path: '/pos',
    element: <PosLayout />,
    children: [
      {
        index: true,
        element: (
          <PlaceholderPage
            title="POS Table Board"
            description="Board meja dan workflow officer akan dibangun setelah bootstrap selesai."
          />
        ),
      },
    ],
  },
  {
    path: '/profile',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: (
          <PlaceholderPage
            title="Profile"
            description="Profile user, update data, dan change password masuk ke Phase 1."
          />
        ),
      },
    ],
  },
]);