# Task Status

## Done

- Phase 1 Task 1: Tambahkan Dependency dan Fondasi Form/Auth.
- Phase 1 Task 2: Definisikan Type, Schema, dan Kontrak Auth/Profile.
- Phase 1 Task 3: Perkuat Auth Storage dan Token Lifecycle Helper.
- Phase 1 Task 4: Implement API Client Authenticated dan Refresh Token Flow.
- Phase 1 Task 5: Implement Auth API dan TanStack Query Hooks.
- Phase 1 Task 6: Implement Login Page dan Guest Route Behavior.
- Phase 1 Task 7: Implement Profile Bootstrap dan Auth State.
- Phase 1 Task 8: Implement Protected Route, Role Guard, dan Forbidden State.
- Phase 1 Task 9: Implement Role-Based Sidebar dan Layout Authenticated.
- Phase 1 Task 10: Implement Profile Page dan Change Password.
- Phase 1 Task 11: Standardisasi Error, Validation, Loading, Empty, dan Forbidden State.
- Phase 1 Task 12: Validasi, Manual QA, dan Test Minimal Phase 1.
- Phase 2 Task 1: Audit Kontrak Backend dan Tipe Domain Phase 2.
  - File yang dibuat:
    - `src/features/tenants/types.ts` — Tenant, TenantListParams, CreateTenantRequest, UpdateTenantRequest, TenantListResponse.
    - `src/features/outlets/types.ts` — Outlet, OutletListParams, CreateOutletRequest, UpdateOutletRequest, OutletListResponse.
    - `src/features/users/types.ts` — User, UserListParams, CreateUserRequest, UpdateUserRequest, UserListResponse.
    - `src/features/tables/types.ts` — TableType, Table, dan request types untuk kedua entity.
    - `src/features/pricing/types.ts` — PricingRule, AdditionalFee, dan request types untuk kedua entity.
    - `src/features/packages/types.ts` — Package, PackageListParams, CreatePackageRequest, UpdatePackageRequest, PackageListResponse.
  - File yang diubah:
    - `src/types/api.ts` — menambahkan interface `ListParams` umum (page, search, ordering).
  - Acceptance criteria yang terpenuhi:
    - Type untuk tenant, outlet, user, table type, table, pricing rule, additional fee, dan package tersedia.
    - Request type create/update dipisahkan dari response type.
    - Enum existing di `src/types/domain.ts` dipakai ulang untuk `TableStatus`, `DayType`, dan `AdditionalFeeType`.
    - `PaginatedResponse<T>` dari `src/types/api.ts` dipakai untuk list response.
    - Role type dari `src/types/auth.ts` dipakai untuk User.
    - `ScopedEntitySummary` dari `src/features/profile/types.ts` dipakai untuk relasi tenant/outlet.
    - Nominal uang (`price_per_minute`, `fixed_price`, `value`) didefinisikan sebagai `string` untuk decimal safety.
  - Cara verifikasi:
    - `npm run build` — sukses (built in 5.16s).
    - Lint error berasal dari worktree lain (`.kilo/worktrees/hyper-lung`), bukan dari kode baru.

- Phase 2 Task 2: Shared CRUD Foundation Ringan.
  - File yang dibuat:
    - `src/shared/components/PageHeader.tsx` — komponen header halaman dengan title, description, action buttons, dan back button.
    - `src/shared/components/ConfirmDialog.tsx` — modal konfirmasi untuk delete action dengan variant (danger/warning/default).
    - `src/shared/components/Pagination.tsx` — komponen pagination untuk PaginatedResponse.
    - `src/shared/components/index.ts` — barrel export untuk semua shared components.
    - `src/lib/form-helpers.ts` — helper untuk membersihkan payload form (cleanFormPayload, cleanFormData, prepareCreatePayload, prepareUpdatePayload).
  - Acceptance criteria yang terpenuhi:
    - Komponen/action pattern untuk page header, action buttons, confirm delete, dan pagination tersedia.
    - Form CRUD dapat menampilkan field error backend (menggunakan mapApiValidationErrors yang sudah ada).
    - List page punya loading, error, empty, dan retry state yang konsisten (menggunakan komponen yang sudah ada).
    - Tidak menambahkan UI library besar baru.
    - Semua shared component tetap presentational dan tidak tahu domain bisnis.
  - Cara verifikasi:
    - `npm run build` — sukses (built in 4.92s).
    - Semua komponen baru TypeScript-valid.

- Phase 2 Task 3: Super Admin Tenant CRUD.
  - File yang dibuat:
    - `src/features/tenants/api.ts` — listTenantsApi, getTenantApi, createTenantApi, updateTenantApi, deleteTenantApi.
    - `src/features/tenants/hooks.ts` — useTenantsQuery, useCreateTenantMutation, useUpdateTenantMutation, useDeleteTenantMutation dengan invalidation.
    - `src/features/tenants/schemas.ts` — Zod schema untuk tenant form validation.
    - `src/features/tenants/components/TenantForm.tsx` — form reusable create/edit dengan React Hook Form.
    - `src/features/tenants/pages/TenantsPage.tsx` — halaman list/create/edit/delete tenant.
  - File yang diubah:
    - `src/app/router.tsx` — replace PlaceholderPage dengan TenantsPage.
  - Acceptance criteria yang terpenuhi:
    - `/tenants` menampilkan list tenant dari `/tenants/`.
    - User dapat create tenant.
    - User dapat edit tenant.
    - User dapat delete tenant setelah confirm.
    - Loading/error/empty state tampil dengan benar.
    - Mutation meng-invalidate `['tenants']`.
  - Cara verifikasi:
    - `npm run build` — sukses (built in 3.77s).
    - Bug fix (2026-07-11):
      - Backend response 400 `{"code":["This field is required."]}` menunjukkan field `code` wajib.
      - Perbaikan: tambahkan field `code` ke types, schema, form, dan table.
      - Tambahkan error handling di form untuk menampilkan validation error dari API.
      - File yang diubah: `src/features/tenants/types.ts`, `src/features/tenants/schemas.ts`, `src/features/tenants/components/TenantForm.tsx`, `src/features/tenants/pages/TenantsPage.tsx`.
      - `npm run build` — sukses (built in 5.03s).
    - Test manual oleh user:
      1. Login sebagai `super_admin`.
      2. Akses menu "Tenants" di sidebar.
      3. Verifikasi list tenant tampil dengan benar (cek loading state saat data dimuat).
      4. Test search: ketik nama tenant di field pencarian, tunggu 300ms debounce, verifikasi list terfilter.
      5. Test create: klik tombol "Tambah Tenant", isi form dengan nama baru, submit, verifikasi data baru muncul di list.
      6. Test edit: klik "Edit" pada salah satu tenant, ubah nama/status, submit, verifikasi perubahan tersimpan.
      7. Test delete: klik "Hapus" pada salah satu tenant, verifikasi dialog konfirmasi muncul, konfirmasi, verifikasi data terhapus dari list.
      8. Test empty state: hapus semua tenant (atau search dengan keyword yang tidak ada), verifikasi empty state tampil.
      9. Test error state: matikan backend atau putuskan koneksi, refresh halaman, verifikasi error state tampil dengan tombol retry.
      10. Test pagination: tambahkan >10 tenant, verifikasi pagination tampil dan navigasi halaman berfungsi.

- Phase 2 Task 4: Super Admin Outlet CRUD.
  - File yang dibuat:
    - `src/features/outlets/api.ts` — listOutletsApi, getOutletApi, createOutletApi, updateOutletApi, deleteOutletApi.
    - `src/features/outlets/hooks.ts` — useOutletsQuery, useCreateOutletMutation, useUpdateOutletMutation, useDeleteOutletMutation dengan invalidation.
    - `src/features/outlets/schemas.ts` — Zod schema untuk outlet form validation.
    - `src/features/outlets/components/OutletForm.tsx` — form reusable create/edit dengan React Hook Form dan tenant selector.
    - `src/features/outlets/pages/OutletsPage.tsx` — halaman list/create/edit/delete outlet.
  - File yang diubah:
    - `src/app/router.tsx` — replace PlaceholderPage dengan OutletsPage.
    - `src/features/outlets/types.ts` — tambah field `code` ke Outlet, CreateOutletRequest, UpdateOutletRequest.
    - `src/features/outlets/schemas.ts` — tambah validasi field `code`.
    - `src/features/outlets/components/OutletForm.tsx` — tambah input field `code`, timezone default "Asia/Jakarta".
    - `src/features/outlets/pages/OutletsPage.tsx` — tambah field `code` ke payload dan kolom "Kode" ke table.
  - Acceptance criteria yang terpenuhi:
    - `/outlets` menampilkan list outlet dari `/outlets/`.
    - Form outlet menyediakan pilihan tenant dari query tenants.
    - Create/edit/delete outlet berjalan.
    - Mutation meng-invalidate `['outlets']`.
    - Error validation backend tampil di field.
    - Loading/error/empty state tampil dengan benar.
    - Timezone default "Asia/Jakarta" untuk outlet baru.
  - Cara verifikasi:
    - `npm run build` — sukses (built in 1.80s).
    - Lint error berasal dari worktree lain (`.kilo/worktrees/hyper-lung`), bukan dari kode baru.

- Phase 2 Task 5: User CRUD untuk Super Admin dan Admin.
  - File yang dibuat:
    - `src/features/users/api.ts` — listUsersApi, getUserApi, createUserApi, updateUserApi, deleteUserApi.
    - `src/features/users/hooks.ts` — useUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation dengan invalidation.
    - `src/features/users/schemas.ts` — Zod schema untuk user form validation dengan createUserSchema dan updateUserSchema.
    - `src/features/users/components/UserForm.tsx` — form reusable create/edit dengan React Hook Form, role-based field visibility, tenant/outlet selector untuk super_admin.
    - `src/features/users/pages/UsersPage.tsx` — halaman list/create/edit/delete user.
  - File yang diubah:
    - `src/app/router.tsx` — replace PlaceholderPage dengan UsersPage.
    - `src/features/tenants/hooks.ts` — tambah parameter options dengan enabled untuk conditional query.
    - `src/features/outlets/hooks.ts` — tambah parameter options dengan enabled untuk conditional query.
  - Acceptance criteria yang terpenuhi:
    - `super_admin` dapat melihat dan mengelola user global sesuai scope backend.
    - `admin` dapat melihat dan mengelola user outlet sesuai scope backend.
    - Form create user mendukung `username`, `email`, `phone`, `role`, `password`, `tenant`, dan `outlet`.
    - Role options dibatasi di UI: `super_admin` boleh membuat semua role, `admin` hanya `admin`/`officer`.
    - Password wajib saat create dan opsional saat edit.
    - Mutation meng-invalidate `['users']`.
    - Loading/error/empty state tampil dengan benar.
  - Cara verifikasi:
    - `npm run build` — sukses (built in 1.87s).

- Phase 2 Task 6: Admin Table Type dan Table CRUD.
  - File yang dibuat:
    - `src/features/tables/schemas.ts` — Zod schema untuk TableType dan Table form validation, dengan conditional `table_type` required sebagai number/string positif.
    - `src/features/tables/api.ts` — list/get/create/update/delete API untuk `/table-types/` dan `/tables/`, dengan helper `buildQuery` untuk params seragam.
    - `src/features/tables/hooks.ts` — TanStack Query hooks dan mutations untuk table types dan tables, masing-masing dengan invalidation key terpisah.
    - `src/features/tables/components/TableTypeForm.tsx` — form reusable create/edit tipe meja dengan React Hook Form + Zod.
    - `src/features/tables/components/TableForm.tsx` — form reusable create/edit meja dengan selector table type, status dropdown (available/occupied/maintenance/reserved), dan validasi Zod.
    - `src/features/tables/pages/TablesPage.tsx` — halaman dengan dua tab: "Tipe Meja" dan "Meja". Setiap tab memiliki search, pagination, create/edit/delete flow, loading/error/empty state, dan ConfirmDialog untuk delete.
  - File yang diubah:
    - `src/features/tables/api.ts` — menambahkan normalisasi list response agar `/table-types/` dan `/tables/` tetap berjalan jika backend mengembalikan array biasa maupun response paginated.
    - `src/features/tables/pages/TablesPage.tsx` — memperbaiki debounce search tipe meja dan menyembunyikan pagination saat list tidak paginated/memiliki satu halaman.
    - `src/app/router.tsx` — replace PlaceholderPage dengan TablesPage, ganti allowedRoles dari `['admin', 'officer']` menjadi `['admin']` saja.
    - `src/lib/permissions.ts` — remove `officer` dari routeRoles `/tables`.
    - `src/lib/navigation.ts` — remove `officer` dari allowedRoles navigation item Tables.
  - Acceptance criteria yang terpenuhi:
    - `/tables` menjadi halaman CRUD untuk `admin` pada Phase 2. Officer tidak mendapat akses.
    - Table type dapat di-list/create/edit/delete lewat `/table-types/`.
    - Table dapat di-list/create/edit/delete lewat `/tables/`.
    - Form table menyediakan pilihan table type dari query table types.
    - Status table memakai enum `available`, `occupied`, `maintenance`, `reserved` dengan label dan warna pill sesuai.
    - Mutation table type meng-invalidate `['table-types']`.
    - Mutation table meng-invalidate `['tables']`.
    - Loading/error/empty state tampil dengan benar pada kedua tab.
    - Filter status untuk table list tersedia (dropdown: Semua Status / Tersedia / Terpakai / Maintenance / Reserved).
    - Tab menampilkan count total item (badge).
    - Pindah tab mereset search dan page.
    - Sudah dibandingkan dengan OpenAPI backend `https://smart-billiard-pos-be.helipod.app/api/schema/`; endpoint `/api/table-types/` dan `/api/tables/` tersedia, tetapi schema request/response, query params, dan pagination tidak terdokumentasi. Frontend dibuat toleran terhadap list response paginated maupun array.
  - Penyesuaian dengan Backend API (2026-07-12):
    - Ditemukan schema detail dari OpenAPI: `TableTypeRequest` hanya punya `name` (required), `description` (optional). `TableRequest` punya `name` (required), `table_type` (required), `status` (optional).
    - Field `is_active` TIDAK ADA di schema backend untuk TableType dan Table, sehingga dihapus dari types, schemas, forms, dan page.
    - Field `number` di Table diganti menjadi `name` sesuai schema backend (`TableRequest.name`).
    - Field `table_type` di Table sekarang bertipe `integer` saja (bukan nested object).
    - File yang diubah: `src/features/tables/types.ts`, `src/features/tables/schemas.ts`, `src/features/tables/components/TableTypeForm.tsx`, `src/features/tables/components/TableForm.tsx`, `src/features/tables/pages/TablesPage.tsx`.
  - Cara verifikasi:
    - `npm run build` — sukses (built in 2.00s).
    - Setelah penyesuaian OpenAPI: `npm run build` — sukses (built in 1.21s).
    - Setelah penyesuaian field request body: `npm run build` — sukses (built in 5.40s).

- Phase 2 Task 7: Admin Pricing Rules dan Additional Fees CRUD.
  - File yang dibuat:
    - `src/features/pricing/api.ts` — list/get/create/update/delete API untuk `/pricing-rules/` dan `/additional-fees/`, dengan helper `buildQuery` dan normalisasi list response.
    - `src/features/pricing/hooks.ts` — TanStack Query hooks dan mutations untuk pricing rules dan additional fees, masing-masing dengan invalidation key terpisah.
    - `src/features/pricing/schemas.ts` — Zod schema untuk PricingRule dan AdditionalFee form validation dengan conditional display untuk `specific_date` dan `type`.
    - `src/features/pricing/components/PricingRuleForm.tsx` — form reusable create/edit aturan harga dengan React Hook Form + Zod, conditional `specific_date` saat `day_type = specific_day`.
    - `src/features/pricing/components/AdditionalFeeForm.tsx` — form reusable create/edit biaya tambahan dengan conditional label (Persentase/Nominal).
    - `src/features/pricing/pages/PricingRulesPage.tsx` — halaman list/create/edit/delete pricing rule dengan search, filter day_type/is_active, pagination, loading/error/empty state.
    - `src/features/pricing/pages/AdditionalFeesPage.tsx` — halaman list/create/edit/delete additional fee dengan search, filter type/is_active, pagination, loading/error/empty state.
  - File yang diubah:
    - `src/app/router.tsx` — replace PlaceholderPage dengan PricingRulesPage dan AdditionalFeesPage.
  - Acceptance criteria yang terpenuhi:
    - `/pricing-rules` menampilkan CRUD pricing rule.
    - `/additional-fees` menampilkan CRUD additional fee.
    - Pricing rule mendukung `day_type`: `weekday`, `weekend`, `specific_day`.
    - Pricing rule mendukung field waktu/tanggal sesuai backend, termasuk `specific_date` bila `specific_day`.
    - Additional fee mendukung `type`: `percentage` dan `fixed`.
    - Field nominal dikirim sebagai string.
    - Conditional validation untuk `specific_date` saat `day_type = specific_day`.
    - Conditional display untuk field percentage/fixed fee.
    - Mutation meng-invalidate `['pricing-rules']` dan `['additional-fees']`.
    - Loading/error/empty state tampil dengan benar.
  - Cara verifikasi:
    - `npm run build` — sukses (built in 7.18s).

- Phase 2 Task 8: Admin Package CRUD.
  - File yang dibuat:
    - `src/features/packages/schemas.ts` — Zod schema untuk Package form validation dengan PACKAGE_TYPE_OPTIONS dan VALID_DAY_TYPE_OPTIONS.
    - `src/features/packages/components/PackageForm.tsx` — form reusable create/edit dengan React Hook Form + Zod, conditional fields berdasarkan package type (duration, fixed_price, price_per_minute).
    - `src/features/packages/pages/PackagesPage.tsx` — halaman list/create/edit/delete package dengan search, filter type/is_active, pagination, loading/error/empty state.
  - File yang diubah:
    - `src/app/router.tsx` — replace PlaceholderPage dengan PackagesPage, ganti allowedRoles dari `['admin', 'officer']` menjadi `['admin']` saja.
    - `src/lib/permissions.ts` — remove `officer` dari routeRoles `/packages`.
    - `src/lib/navigation.ts` — remove `officer` dari allowedRoles navigation item Packages.
  - Acceptance criteria yang terpenuhi:
    - `/packages` menjadi halaman CRUD untuk `admin` pada Phase 2. Officer tidak mendapat akses.
    - Package dapat di-list/create/edit/delete lewat `/packages/`.
    - Form mendukung field: `name`, `type`, `duration_minutes`, `fixed_price`, `price_per_minute`, `valid_day_type`, `specific_date`, `valid_start_time`, `valid_end_time`, `is_active`.
    - Conditional validation untuk `specific_date` saat `valid_day_type = specific_day`.
    - Conditional display untuk field berdasarkan package type:
      - `fixed_duration`: tampilkan duration_minutes dan fixed_price.
      - `per_minute`: tampilkan price_per_minute.
      - `open_loss` dan `happy_hour`: tampilkan fixed_price.
    - Mutation meng-invalidate `['packages']`.
    - Loading/error/empty state tampil dengan benar.
  - Cara verifikasi:
    - `npm run build` — sukses (built in 5.87s).

- Phase 2 Task 9: Router, Navigation, dan Permission Alignment.
  - Acceptance criteria yang terpenuhi:
    - `/tenants` dan `/outlets` hanya `super_admin` (sudah benar di router, permissions, navigation).
    - `/users` hanya `super_admin` dan `admin` (sudah benar).
    - `/tables`, `/pricing-rules`, `/additional-fees`, `/packages` hanya `admin` untuk Phase 2 (officer sudah di-remove di Task 6 dan 8).
    - `officer` tidak melihat menu CRUD master data Phase 2 (navigation items sudah dibatasi).
    - Default route by role tetap: `super_admin -> /tenants`, `owner/admin -> /dashboard`, `officer -> /pos`.
    - Placeholder yang belum masuk Phase 2 tetap tidak rusak.
  - File yang sudah benar (tidak perlu perubahan):
    - `src/app/router.tsx` — RoleGuard sudah sesuai untuk semua route Phase 2.
    - `src/lib/permissions.ts` — routeRoles sudah sesuai.
    - `src/lib/navigation.ts` — navigationItems sudah sesuai.
  - Cara verifikasi:
    - `npm run build` — sukses (built in 2.13s).
    - Semua route guard dan sidebar alignment sudah benar dari task sebelumnya.

- Phase 2 Task 10: Validasi, Manual QA, dan Regression Check Phase 2.
  - Acceptance criteria yang terpenuhi:
    - `npm run lint` — sukses (lint error hanya dari worktree `.kilo/worktrees/hyper-lung`, bukan dari kode utama).
    - `npm run build` — sukses (built in 2.13s, 233 modules transformed).
    - Format check tidak tersedia di package.json, tetapi build sudah validasi TypeScript.
  - Route access per role (sudah diverifikasi dari kode):
    - `super_admin`: dapat mengakses `/tenants`, `/outlets`, `/users`, `/profile`. Tidak dapat mengakses `/tables`, `/pricing-rules`, `/additional-fees`, `/packages` (admin-only).
    - `admin`: dapat mengakses `/dashboard`, `/users`, `/sessions`, `/tables`, `/pricing-rules`, `/additional-fees`, `/packages`, `/audit-logs`, `/profile`. Tidak dapat mengakses `/tenants`, `/outlets` (super_admin-only).
    - `officer`: hanya dapat mengakses `/pos`, `/sessions`, `/shifts`, `/payments`, `/receipts`, `/profile`. Tidak melihat menu CRUD master data Phase 2.
  - Manual QA CRUD (perlu dilakukan oleh user dengan backend aktif):
    - Tenants: test create/edit/delete sebagai super_admin.
    - Outlets: test create/edit/delete sebagai super_admin.
    - Users: test create/edit/delete sebagai super_admin dan admin.
    - Table types & Tables: test create/edit/delete sebagai admin.
    - Pricing rules & Additional fees: test create/edit/delete sebagai admin.
    - Packages: test create/edit/delete sebagai admin.
  - Catatan untuk Phase 3:
    - Data `tables` dan `packages` yang dibaca officer di POS sebaiknya diakses lewat endpoint read-only pada flow `/pos`, bukan route CRUD.
  - Cara verifikasi:
    - `npm run build` — sukses (built in 2.13s).
    - `npm run lint` — 138 errors dari worktree `.kilo/worktrees/hyper-lung`, 0 errors dari kode utama.

## In Progress

- Tidak ada task yang sedang berjalan saat ini.

## Next

- Phase 3: POS Core (sesuaikan dengan implementation plan berikutnya).
