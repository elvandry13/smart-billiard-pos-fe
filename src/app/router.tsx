import { createBrowserRouter, Navigate } from 'react-router-dom';

import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { TenantsPage } from '@/features/tenants/pages/TenantsPage';
import { OutletsPage } from '@/features/outlets/pages/OutletsPage';
import { UsersPage } from '@/features/users/pages/UsersPage';
import { TablesPage } from '@/features/tables/pages/TablesPage';
import { PricingRulesPage } from '@/features/pricing/pages/PricingRulesPage';
import { AdditionalFeesPage } from '@/features/pricing/pages/AdditionalFeesPage';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PosLayout } from '@/layouts/PosLayout';
import { PlaceholderPage } from '@/shared/components/PlaceholderPage';
import { ProtectedRoute, RoleGuard } from '@/app/guards';

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
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['owner', 'admin']}>
          <DashboardLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
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
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['officer']}>
          <PosLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
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
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['super_admin', 'owner', 'admin', 'officer']}>
          <DashboardLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ProfilePage />,
      },
    ],
  },
  // Placeholder routes untuk routes lain yang masuk permission matrix
  // Route-route ini belum memiliki page component karena masuk phase berikutnya
  {
    path: '/tenants',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['super_admin']}>
          <DashboardLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <TenantsPage />,
      },
    ],
  },
  {
    path: '/outlets',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['super_admin']}>
          <DashboardLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <OutletsPage />,
      },
    ],
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['super_admin', 'admin']}>
          <DashboardLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <UsersPage />,
      },
    ],
  },
  {
    path: '/sessions',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['owner', 'admin', 'officer']}>
          <DashboardLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PlaceholderPage
            title="Sessions"
            description="Manajemen sesi akan dibangun pada fase berikutnya."
          />
        ),
      },
    ],
  },
  {
    path: '/tables',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['admin']}>
          <DashboardLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <TablesPage />
        ),
      },
    ],
  },
  {
    path: '/pricing-rules',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['admin']}>
          <DashboardLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <PricingRulesPage />,
      },
    ],
  },
  {
    path: '/additional-fees',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['admin']}>
          <DashboardLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdditionalFeesPage />,
      },
    ],
  },
  {
    path: '/packages',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['admin', 'officer']}>
          <DashboardLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PlaceholderPage
            title="Packages"
            description="Manajemen paket akan dibangun pada fase berikutnya."
          />
        ),
      },
    ],
  },
  {
    path: '/shifts',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['admin', 'officer']}>
          <DashboardLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PlaceholderPage
            title="Shifts"
            description="Manajemen shift akan dibangun pada fase berikutnya."
          />
        ),
      },
    ],
  },
  {
    path: '/payments',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['admin', 'officer']}>
          <DashboardLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PlaceholderPage
            title="Payments"
            description="Manajemen pembayaran akan dibangun pada fase berikutnya."
          />
        ),
      },
    ],
  },
  {
    path: '/receipts',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['admin', 'officer']}>
          <DashboardLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PlaceholderPage
            title="Receipts"
            description="Manajemen struk akan dibangun pada fase berikutnya."
          />
        ),
      },
    ],
  },
  {
    path: '/audit-logs',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['admin']}>
          <DashboardLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PlaceholderPage
            title="Audit Logs"
            description="Log audit akan dibangun pada fase berikutnya."
          />
        ),
      },
    ],
  },
]);
