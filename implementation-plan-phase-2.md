# Implementation Plan Phase 2 — Super Admin & Admin Master Data

**Project:** Smart Billiard POS Frontend  
**Phase:** 2  
**Scope:** Tenant CRUD, outlet CRUD, user CRUD, table type CRUD, table CRUD, pricing rule CRUD, additional fee CRUD, dan package CRUD.  
**Sumber:** `agent-docs/FRONTEND_IMPLEMENTATION_PLAN.md`, `agent-docs/task-status.md`, dan kondisi source saat plan dibuat.
**Deployed Backend API Docs:** `https://smart-billiard-pos-be.helipod.app/api/docs/`

---

## 1. Ringkasan Phase 2

Phase 1 sudah menyelesaikan auth, token refresh, profile bootstrap, protected route, role guard, role-based sidebar, profile page, shared loading/error/empty/forbidden state, serta validasi `npm run lint`, `npm run build`, dan `npm run format`.

Phase 2 mengubah route placeholder master data menjadi halaman CRUD yang terhubung ke backend. Fokusnya adalah data konfigurasi bisnis yang diperlukan sebelum Phase 3 POS core berjalan.

Target utama Phase 2:

- `super_admin` dapat mengelola tenants, outlets, dan users global.
- `admin` dapat mengelola users outlet, table types, tables, pricing rules, additional fees, dan packages.
- Form memakai React Hook Form + Zod dan memanfaatkan helper error Phase 1.
- List page memakai pola query/mutation TanStack Query yang konsisten.
- Route/menu tidak memberi akses CRUD master data ke `officer`.
- Build production tetap sukses tanpa TypeScript error.

---

## 2. Keputusan Scope dan Batasan

- Phase 2 hanya mencakup master data. POS table board, shift operation, session flow, payment, receipt, dashboard analytics, dan audit log tetap di luar scope.
- `officer` tidak mendapat halaman CRUD di Phase 2. Jika data tables/packages diperlukan oleh officer, itu akan dibaca lewat flow POS Phase 3, bukan melalui halaman CRUD master data.
- Backend tetap menjadi sumber kebenaran tenant/outlet scoping. Frontend tidak menambahkan filter keamanan manual untuk menggantikan permission backend.
- Nominal uang dari API diperlakukan sebagai string decimal-safe. Frontend hanya memformat dan mengirim string, bukan menghitung business total.
- Delete action wajib memakai confirm dialog sederhana sebelum mutation.
- Jika backend belum punya data seed, UI tetap boleh menampilkan empty state, tetapi acceptance criteria CRUD final perlu diverifikasi terhadap backend nyata.

---

## 3. Endpoint Phase 2

| Area | Endpoint | Method | Role UI |
| --- | --- | --- | --- |
| Tenants | `/tenants/`, `/tenants/{id}/` | GET/POST/PUT/PATCH/DELETE | `super_admin` |
| Outlets | `/outlets/`, `/outlets/{id}/` | GET/POST/PUT/PATCH/DELETE | `super_admin` |
| Users | `/users/`, `/users/{id}/` | GET/POST/PUT/PATCH/DELETE | `super_admin`, `admin` |
| Table Types | `/table-types/`, `/table-types/{id}/` | GET/POST/PUT/PATCH/DELETE | `admin` |
| Tables | `/tables/`, `/tables/{id}/` | GET/POST/PUT/PATCH/DELETE | `admin` |
| Pricing Rules | `/pricing-rules/`, `/pricing-rules/{id}/` | GET/POST/PUT/PATCH/DELETE | `admin` |
| Additional Fees | `/additional-fees/`, `/additional-fees/{id}/` | GET/POST/PUT/PATCH/DELETE | `admin` |
| Packages | `/packages/`, `/packages/{id}/` | GET/POST/PUT/PATCH/DELETE | `admin` |

Query keys mengikuti rencana utama:

```ts
['tenants', params]
['outlets', params]
['users', params]
['table-types', params]
['tables', params]
['pricing-rules', params]
['additional-fees', params]
['packages', params]
```

---

## 4. Pola Implementasi yang Harus Diikuti

Setiap feature CRUD memakai struktur yang sama:

```text
src/features/<feature>/
├── api.ts
├── hooks.ts
├── schemas.ts
├── types.ts
├── components/
└── pages/
```

Pola minimal per feature:

- `types.ts`: response type, create request, update request, list params bila dibutuhkan.
- `schemas.ts`: Zod schema untuk create/edit form.
- `api.ts`: fungsi `list`, `create`, `update`, `delete` memakai `apiClient`.
- `hooks.ts`: TanStack Query hooks dan mutation invalidation.
- `pages/*Page.tsx`: list page menggantikan `PlaceholderPage`.
- `components/*Form.tsx`: form reusable create/edit.

Gunakan shared component yang sudah ada:

- `LoadingState` untuk query loading.
- `ErrorState` untuk query error.
- `EmptyState` untuk list kosong.
- `getApiErrorMessage`, `ApiError`, dan `mapApiValidationErrors` untuk form error.
- `formatMoney`/formatter yang sudah tersedia untuk field uang bila cocok.

---

## 5. Task Breakdown

## Task 1 — Audit Kontrak Backend dan Tipe Domain Phase 2

### Tujuan

Menetapkan bentuk data internal untuk semua master data Phase 2 sebelum membangun halaman CRUD.

### Acceptance Criteria

- Type untuk tenant, outlet, user, table type, table, pricing rule, additional fee, dan package tersedia.
- Request type create/update dipisahkan dari response type jika field backend berbeda.
- Enum existing di `src/types/domain.ts` dipakai ulang untuk `TableStatus`, `DayType`, dan `AdditionalFeeType`.
- `PaginatedResponse<T>` dari `src/types/api.ts` dipakai untuk list response.

### File Terkait

- `src/types/domain.ts`
- `src/types/api.ts`
- `src/features/tenants/types.ts`
- `src/features/outlets/types.ts`
- `src/features/users/types.ts`
- `src/features/tables/types.ts`
- `src/features/pricing/types.ts`
- `src/features/packages/types.ts`

### Subtask

- [ ] Definisikan field minimal Tenant: `id`, `name`, `is_active`, timestamps bila tersedia.
- [ ] Definisikan field minimal Outlet: `id`, `tenant`, `name`, `address`, `timezone`, `is_active` bila tersedia.
- [ ] Definisikan field minimal User: `id`, `username`, `email`, `phone`, `role`, `tenant`, `outlet`, `is_active` bila tersedia.
- [ ] Definisikan TableType dan Table di `features/tables/types.ts`.
- [ ] Definisikan PricingRule dan AdditionalFee di `features/pricing/types.ts`.
- [ ] Definisikan Package di `features/packages/types.ts`.
- [ ] Buat tipe list params umum: `page`, `search`, `ordering`, dan filter spesifik bila endpoint mendukung.

---

## Task 2 — Shared CRUD Foundation Ringan

### Tujuan

Mengurangi duplikasi UI CRUD tanpa membuat abstraction besar yang mengunci desain.

### Acceptance Criteria

- Ada komponen/action pattern untuk page header, action buttons, confirm delete, dan pagination sederhana bila belum tersedia.
- Form CRUD dapat menampilkan field error backend.
- List page punya loading, error, empty, dan retry state yang konsisten.
- Tidak menambahkan UI library besar baru.

### File Terkait

- `src/shared/components/`
- `src/lib/errors.ts`
- `src/lib/formatters.ts`

### Subtask

- [ ] Buat atau perluas `PageHeader` bila belum ada.
- [ ] Buat `ConfirmDialog` sederhana jika belum ada, atau pakai modal inline per page jika lebih minimal.
- [ ] Buat `Pagination` sederhana untuk `PaginatedResponse<T>`.
- [ ] Buat helper kecil untuk membersihkan payload form dari string kosong menjadi `null`/`undefined` sesuai kebutuhan backend.
- [ ] Pastikan semua shared component tetap presentational dan tidak tahu domain bisnis.

---

## Task 3 — Super Admin Tenant CRUD

### Tujuan

Mengganti placeholder `/tenants` menjadi halaman list/create/edit/delete tenant untuk `super_admin`.

### Acceptance Criteria

- `/tenants` menampilkan list tenant dari `/tenants/`.
- User dapat create tenant.
- User dapat edit tenant.
- User dapat delete tenant setelah confirm.
- Loading/error/empty state tampil dengan benar.
- Mutation meng-invalidate `['tenants']`.

### File Terkait

- `src/features/tenants/api.ts`
- `src/features/tenants/hooks.ts`
- `src/features/tenants/schemas.ts`
- `src/features/tenants/types.ts`
- `src/features/tenants/pages/TenantsPage.tsx`
- `src/features/tenants/components/TenantForm.tsx`
- `src/app/router.tsx`

### Subtask

- [ ] Implement `listTenantsApi`, `createTenantApi`, `updateTenantApi`, `deleteTenantApi`.
- [ ] Implement `useTenantsQuery` dan mutation hooks.
- [ ] Implement tenant schema sesuai field backend.
- [ ] Implement `TenantsPage` dengan search/filter ringan bila backend mendukung.
- [ ] Replace placeholder route `/tenants` dengan `TenantsPage`.

---

## Task 4 — Super Admin Outlet CRUD

### Tujuan

Mengganti placeholder `/outlets` menjadi halaman CRUD outlet, termasuk pilihan tenant.

### Acceptance Criteria

- `/outlets` menampilkan list outlet dari `/outlets/`.
- Form outlet menyediakan pilihan tenant dari query tenants.
- Create/edit/delete outlet berjalan.
- Mutation meng-invalidate `['outlets']` dan data tenant selector tetap konsisten.
- Error validation backend tampil di field.

### File Terkait

- `src/features/outlets/api.ts`
- `src/features/outlets/hooks.ts`
- `src/features/outlets/schemas.ts`
- `src/features/outlets/types.ts`
- `src/features/outlets/pages/OutletsPage.tsx`
- `src/features/outlets/components/OutletForm.tsx`
- `src/features/tenants/hooks.ts`
- `src/app/router.tsx`

### Subtask

- [ ] Implement API/hook/schema outlet.
- [ ] Reuse tenant query untuk tenant select.
- [ ] Implement create/edit form.
- [ ] Implement delete confirm.
- [ ] Replace placeholder route `/outlets`.

---

## Task 5 — User CRUD untuk Super Admin dan Admin

### Tujuan

Mengganti placeholder `/users` menjadi halaman user management yang mengikuti role login.

### Acceptance Criteria

- `super_admin` dapat melihat dan mengelola user global sesuai scope backend.
- `admin` dapat melihat dan mengelola user outlet sesuai scope backend.
- Form create user mendukung `username`, `email`, `phone`, `role`, `password`, `tenant`, dan `outlet` sesuai kontrak backend.
- Role options dibatasi di UI: `super_admin` boleh membuat role global sesuai backend, `admin` hanya role outlet yang diizinkan, minimal `admin`/`officer` bila backend mendukung.
- Password wajib saat create dan tidak dikirim saat edit kecuali backend memang mendukung update password via endpoint user.
- Mutation meng-invalidate `['users']`.

### File Terkait

- `src/features/users/api.ts`
- `src/features/users/hooks.ts`
- `src/features/users/schemas.ts`
- `src/features/users/types.ts`
- `src/features/users/pages/UsersPage.tsx`
- `src/features/users/components/UserForm.tsx`
- `src/features/tenants/hooks.ts`
- `src/features/outlets/hooks.ts`
- `src/shared/hooks/useAuthState.ts`
- `src/app/router.tsx`

### Subtask

- [ ] Implement API/hook/schema user.
- [ ] Baca current user dari `useAuthState` untuk menentukan opsi role/form.
- [ ] Reuse tenant/outlet query untuk selector bila user adalah `super_admin`.
- [ ] Untuk `admin`, jangan tampilkan pilihan tenant/outlet yang tidak relevan jika backend sudah men-scope otomatis.
- [ ] Implement create/edit/delete user.
- [ ] Replace placeholder route `/users`.

---

## Task 6 — Admin Table Type dan Table CRUD

### Tujuan

Mengganti placeholder `/tables` menjadi halaman admin untuk mengelola tipe meja dan meja.

### Acceptance Criteria

- `/tables` hanya menjadi halaman CRUD untuk `admin` pada Phase 2.
- Table type dapat di-list/create/edit/delete lewat `/table-types/`.
- Table dapat di-list/create/edit/delete lewat `/tables/`.
- Form table menyediakan pilihan table type.
- Status table memakai enum `available`, `occupied`, `maintenance`, `reserved`.
- Mutation table type meng-invalidate `['table-types']` dan dapat memengaruhi selector table.
- Mutation table meng-invalidate `['tables']`.

### File Terkait

- `src/features/tables/api.ts`
- `src/features/tables/hooks.ts`
- `src/features/tables/schemas.ts`
- `src/features/tables/types.ts`
- `src/features/tables/pages/TablesPage.tsx`
- `src/features/tables/components/TableTypeForm.tsx`
- `src/features/tables/components/TableForm.tsx`
- `src/lib/permissions.ts`
- `src/lib/navigation.ts`
- `src/app/router.tsx`

### Subtask

- [ ] Implement API/hook/schema table type.
- [ ] Implement API/hook/schema table.
- [ ] Buat page dengan dua tab/section: `Table Types` dan `Tables`.
- [ ] Tambahkan filter status/type untuk table list bila sederhana.
- [ ] Align route guard/menu agar `/tables` CRUD tidak muncul untuk `officer` di Phase 2.
- [ ] Replace placeholder route `/tables`.

---

## Task 7 — Admin Pricing Rules dan Additional Fees CRUD

### Tujuan

Mengganti placeholder `/pricing-rules` dan `/additional-fees` menjadi halaman konfigurasi pricing dan fee.

### Acceptance Criteria

- `/pricing-rules` menampilkan CRUD pricing rule.
- `/additional-fees` menampilkan CRUD additional fee.
- Pricing rule mendukung `day_type`: `weekday`, `weekend`, `specific_day`.
- Pricing rule mendukung field waktu/tanggal sesuai backend, termasuk `specific_date` bila `specific_day`.
- Additional fee mendukung `type`: `percentage` dan `fixed`.
- Field nominal dikirim sebagai string.
- Client memberi warning ringan untuk potensi rule overlap jika data yang dibutuhkan tersedia, tetapi backend tetap sumber validasi final.

### File Terkait

- `src/features/pricing/api.ts`
- `src/features/pricing/hooks.ts`
- `src/features/pricing/schemas.ts`
- `src/features/pricing/types.ts`
- `src/features/pricing/pages/PricingRulesPage.tsx`
- `src/features/pricing/pages/AdditionalFeesPage.tsx`
- `src/features/pricing/components/PricingRuleForm.tsx`
- `src/features/pricing/components/AdditionalFeeForm.tsx`
- `src/app/router.tsx`

### Subtask

- [ ] Implement pricing rule API/hook/schema/form/page.
- [ ] Implement additional fee API/hook/schema/form/page.
- [ ] Gunakan conditional validation untuk `specific_date` saat `day_type = specific_day`.
- [ ] Gunakan conditional display untuk field percentage/fixed fee.
- [ ] Replace placeholder routes `/pricing-rules` dan `/additional-fees`.

---

## Task 8 — Admin Package CRUD

### Tujuan

Mengganti placeholder `/packages` menjadi halaman admin untuk mengelola paket billing.

### Acceptance Criteria

- `/packages` hanya menjadi halaman CRUD untuk `admin` pada Phase 2.
- Package dapat di-list/create/edit/delete lewat `/packages/`.
- Form mendukung field utama: `name`, `type`, `duration_minutes`, `fixed_price`, `price_per_minute`, `valid_day_type`, `specific_date`, `valid_start_time`, `valid_end_time`, dan `is_active` sesuai backend.
- Conditional validation berjalan untuk package fixed/duration/time window sesuai kontrak backend yang tersedia.
- Mutation meng-invalidate `['packages']`.

### File Terkait

- `src/features/packages/api.ts`
- `src/features/packages/hooks.ts`
- `src/features/packages/schemas.ts`
- `src/features/packages/types.ts`
- `src/features/packages/pages/PackagesPage.tsx`
- `src/features/packages/components/PackageForm.tsx`
- `src/lib/permissions.ts`
- `src/lib/navigation.ts`
- `src/app/router.tsx`

### Subtask

- [ ] Implement API/hook/schema package.
- [ ] Implement list/create/edit/delete package.
- [ ] Align route guard/menu agar `/packages` CRUD tidak muncul untuk `officer` di Phase 2.
- [ ] Replace placeholder route `/packages`.

---

## Task 9 — Router, Navigation, dan Permission Alignment

### Tujuan

Memastikan route Phase 2 sesuai batas role dan tidak membocorkan halaman CRUD ke role yang salah.

### Acceptance Criteria

- `/tenants` dan `/outlets` hanya `super_admin`.
- `/users` hanya `super_admin` dan `admin`.
- `/tables`, `/pricing-rules`, `/additional-fees`, dan `/packages` hanya `admin` untuk halaman CRUD Phase 2.
- `officer` tidak melihat menu CRUD master data.
- Default route by role tetap: `super_admin -> /tenants`, `owner/admin -> /dashboard`, `officer -> /pos`.
- Placeholder yang belum masuk Phase 2 tetap tidak rusak.

### File Terkait

- `src/app/router.tsx`
- `src/lib/navigation.ts`
- `src/lib/permissions.ts`

### Subtask

- [ ] Replace `PlaceholderPage` pada route Phase 2 dengan page nyata.
- [ ] Review `allowedRoles` untuk `/tables` dan `/packages` karena saat Phase 1 masih mencantumkan `officer`.
- [ ] Pastikan route guard dan sidebar memakai keputusan role yang sama.
- [ ] Jika officer butuh read-only packages/tables di Phase 3, siapkan catatan agar diakses dari `/pos`, bukan route CRUD.

---

## Task 10 — Validasi, Manual QA, dan Regression Check Phase 2

### Tujuan

Memastikan semua CRUD Phase 2 stabil, tidak merusak auth/RBAC Phase 1, dan siap menjadi fondasi Phase 3 POS.

### Acceptance Criteria

- `npm run lint` sukses.
- `npm run build` sukses.
- `npm run format:check` sukses atau `npm run format` dijalankan lalu dicek ulang.
- Login `super_admin` dapat mengakses tenants/outlets/users dan tidak mengakses admin-only outlet master data bila route tidak diizinkan.
- Login `admin` dapat mengakses users/tables/pricing/additional-fees/packages dan tidak mengakses tenants/outlets.
- Login `officer` tidak melihat menu CRUD master data Phase 2.
- Create/edit/delete minimal satu entity per feature tervalidasi terhadap backend nyata bila credential dan seed tersedia.
- Error validation backend tampil pada form.
- Empty state tampil saat list kosong.

### File Terkait

- Semua file Phase 2.
- `agent-docs/task-status.md` hanya diperbarui oleh implementer jika memang diminta sebagai bagian pelaporan berikutnya.

### Subtask

- [ ] Jalankan lint/build/format check.
- [ ] Manual QA route access per role.
- [ ] Manual QA CRUD tenants.
- [ ] Manual QA CRUD outlets.
- [ ] Manual QA CRUD users.
- [ ] Manual QA CRUD table types dan tables.
- [ ] Manual QA CRUD pricing rules dan additional fees.
- [ ] Manual QA CRUD packages.
- [ ] Catat endpoint atau field yang mismatch dengan backend schema untuk ditindaklanjuti.

---

## 6. Urutan Implementasi yang Disarankan

1. Task 1 — Audit kontrak backend dan tipe domain Phase 2.
2. Task 2 — Shared CRUD foundation ringan.
3. Task 3 — Tenant CRUD.
4. Task 4 — Outlet CRUD.
5. Task 5 — User CRUD.
6. Task 6 — Table type dan table CRUD.
7. Task 7 — Pricing rule dan additional fee CRUD.
8. Task 8 — Package CRUD.
9. Task 9 — Router, navigation, dan permission alignment.
10. Task 10 — Validasi dan QA.

Prioritas teknis: kerjakan super admin entities dulu karena outlet/user selector akan dipakai oleh form berikutnya. Setelah itu kerjakan admin master data yang dibutuhkan POS Phase 3: table type, table, pricing rule, fee, package.

---

## 7. Definition of Done Phase 2

Phase 2 dianggap selesai jika:

- Semua route placeholder master data Phase 2 diganti page nyata.
- `super_admin` dapat CRUD tenants, outlets, dan users global sesuai permission backend.
- `admin` dapat CRUD users outlet, table types, tables, pricing rules, additional fees, dan packages.
- Officer tidak melihat atau mengakses halaman CRUD master data.
- Semua mutation meng-invalidate query key yang benar.
- Semua form utama punya validasi Zod dan mapping error backend.
- Semua list page punya loading, error, empty, dan delete confirmation.
- `npm run lint`, `npm run build`, dan format check sukses.

---

## 8. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Field backend berbeda dari asumsi plan | Form gagal submit atau data tidak tampil | Mulai Task 1 dengan inspeksi OpenAPI/schema aktual, lalu sesuaikan tipe/schema sebelum membuat UI banyak |
| Route Phase 1 masih memberi officer akses `/tables` dan `/packages` | Officer bisa melihat halaman CRUD yang bukan scope Phase 2 | Align `navigationItems`, `routeRoles`, dan `RoleGuard` pada Task 9 |
| Delete entity gagal karena dipakai entity lain | User melihat error membingungkan | Tampilkan error backend via `getApiErrorMessage`, jangan sembunyikan constraint error |
| Pagination/filter backend tidak seragam | List page tidak konsisten | Mulai dengan `page` dan `search` opsional, jangan memaksa filter yang tidak didukung endpoint |
| Decimal uang salah format | Pricing/package/fee invalid | Simpan input sebagai string, validasi format string, jangan kalkulasi uang dengan float |
| Selector tenant/outlet/table type kosong | Form create entity tidak usable | Tampilkan empty/error state pada selector dan disable submit jika dependency wajib belum tersedia |

---

## 9. Catatan untuk Phase Berikutnya

- Data `tables` dan `packages` yang dibaca officer di POS sebaiknya masuk lewat `/pos` dan hooks read-only pada Phase 3.
- Session, shift, payment, receipt, dashboard, dan audit log tetap mengikuti roadmap Phase 3 sampai Phase 5.
- Jika kebutuhan mock data muncul untuk UI master data, letakkan di layer terpisah dan jangan mengganti kontrak API nyata sebagai sumber kebenaran.
