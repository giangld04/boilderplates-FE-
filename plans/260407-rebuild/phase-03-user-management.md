# Phase 03: User Management Module

## Context Links
- Reference: https://github.com/satnaing/shadcn-admin (users page)
- TanStack Table v8 docs: https://tanstack.com/table/v8
- Existing UI components: `packages/template-vite/src/components/ui/`
- Sidebar: `packages/template-vite/src/components/layout/sidebar.tsx`

## Overview
- **Priority:** P1
- **Status:** pending
- **Description:** Full user management page with data table (search, sort, faceted filter, pagination), plus add/edit/delete dialogs. Reusable data-table components.

## Key Insights
- TanStack Table v8 already in template deps (`@tanstack/react-table`)
- shadcn has established data-table patterns -- follow them
- Build generic `data-table` components (reusable), then user-specific wrappers
- Need shadcn `table` component (HTML table wrapper) -- check if exists, add if not
- `@radix-ui/react-popover` already in deps (for faceted filter)
- `cmdk` already in deps (for command palette in faceted filter)
- Sidebar needs Users nav item with `Users` lucide icon

## Requirements

### Functional
- Users page at `/users` route
- Data table with 50+ mock users
- Columns: checkbox, name, email, role, status, created date, actions
- Search: filter by name or email (client-side)
- Sort: click column headers to sort asc/desc
- Faceted filter: filter by role (Admin, User, Manager) and status (Active, Inactive, Suspended)
- Pagination: 10/20/50 rows per page, prev/next, page indicator
- Column visibility toggle
- Add user dialog (form with validation)
- Edit user dialog (pre-filled form)
- Delete user dialog (confirmation)
- Sidebar shows Users nav item between Dashboard and Settings

### Non-functional
- Table renders 50 rows without jank
- Dialogs use react-hook-form + zod validation
- All components < 200 lines

## Architecture

```
/users route
  -> PageLayout (title="Users", actions=[Add User button])
  -> UsersTable
    -> DataTable (generic)
      -> DataTableToolbar (search + faceted filters + view options)
        -> DataTableFacetedFilter (role filter, status filter)
        -> DataTableViewOptions (column visibility)
      -> Table (shadcn HTML table)
        -> DataTableColumnHeader (sortable)
        -> Row cells
      -> DataTablePagination
  -> UserFormDialog (add/edit, controlled by zustand or local state)
  -> UserDeleteDialog (confirmation)
```

State management: use a local context or simple useState in users page to manage dialog open/close state and selected user.

## Related Code Files

### Files to Create

**Generic data-table components:**
- `src/components/data-table/data-table.tsx` -- core table renderer
- `src/components/data-table/data-table-column-header.tsx` -- sortable column header
- `src/components/data-table/data-table-toolbar.tsx` -- search + filter bar
- `src/components/data-table/data-table-pagination.tsx` -- pagination controls
- `src/components/data-table/data-table-faceted-filter.tsx` -- faceted filter popover
- `src/components/data-table/data-table-view-options.tsx` -- column visibility dropdown

**User feature:**
- `src/features/users/types/user.ts` -- User type definition
- `src/features/users/data/users-data.ts` -- 50+ mock users
- `src/features/users/schemas/user-schema.ts` -- zod schemas for forms
- `src/features/users/components/users-columns.tsx` -- column definitions
- `src/features/users/components/users-table.tsx` -- table wrapper with toolbar config
- `src/features/users/components/user-form-dialog.tsx` -- add/edit dialog
- `src/features/users/components/user-delete-dialog.tsx` -- delete confirmation
- `src/routes/_authenticated/users.tsx` -- route file

**shadcn UI (add if missing):**
- `src/components/ui/table.tsx` -- shadcn table component
- `src/components/ui/command.tsx` -- shadcn command (may exist via cmdk dep, check)

### Files to Modify
- `src/components/layout/sidebar.tsx` -- add Users nav item

## Implementation Steps

### 1. Add shadcn table component
Create `src/components/ui/table.tsx` with standard shadcn table primitives:
`Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter`

### 2. Check/add command component
Verify `src/components/ui/command.tsx` exists. If not, create it (shadcn command using cmdk).

### 3. Define User type
`src/features/users/types/user.ts`:
```typescript
export type UserRole = 'admin' | 'user' | 'manager'
export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string // ISO date
  avatar?: string
}
```

### 4. Create mock data
`src/features/users/data/users-data.ts`:
- Generate 50+ users with varied roles, statuses, dates
- Use deterministic data (no Math.random -- hardcoded array)
- Mix of admin/user/manager roles, active/inactive/suspended statuses

### 5. Create zod schema
`src/features/users/schemas/user-schema.ts`:
```typescript
import { z } from 'zod'

export const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'user', 'manager']),
  status: z.enum(['active', 'inactive', 'suspended']),
})

export type UserFormValues = z.infer<typeof userFormSchema>
```

### 6. Build generic data-table components

**`data-table.tsx`** (~80 lines):
- Accepts `columns`, `data`, `toolbar` slot
- Uses `useReactTable` with `getCoreRowModel`, `getSortedRowModel`, `getFilteredRowModel`, `getPaginationRowModel`, `getFacetedRowModel`, `getFacetedUniqueValues`
- Renders shadcn Table with headers + rows
- Includes DataTablePagination at bottom

**`data-table-column-header.tsx`** (~60 lines):
- Renders sortable header with arrow icons
- Uses `column.getIsSorted()` for state
- Dropdown with asc/desc/hide options

**`data-table-toolbar.tsx`** (~70 lines):
- Props: `table`, `filterKey` (column to search), `facetedFilters` config array
- Input for search, faceted filter buttons, reset button, view options

**`data-table-pagination.tsx`** (~60 lines):
- Rows per page select (10/20/50)
- Page X of Y indicator
- First/prev/next/last buttons
- Selected row count

**`data-table-faceted-filter.tsx`** (~100 lines):
- Popover with Command list
- Checkbox items for each unique value
- Badge showing selected count
- Clear button

**`data-table-view-options.tsx`** (~50 lines):
- DropdownMenu with checkboxes for each column
- Toggle column visibility

### 7. Build user-specific components

**`users-columns.tsx`** (~100 lines):
- Define `ColumnDef<User>[]`
- Columns: select (checkbox), name (with avatar), email, role (badge), status (badge), createdAt (formatted), actions (dropdown: edit, delete)
- Actions column uses DropdownMenu

**`users-table.tsx`** (~50 lines):
- Wrapper around DataTable with users-specific toolbar config
- Passes faceted filters for role and status

**`user-form-dialog.tsx`** (~120 lines):
- Dialog with form (react-hook-form + zod resolver)
- Fields: name, email, role select, status select
- Mode: 'add' | 'edit' (edit pre-fills values)
- onSubmit: add to / update mock data, show toast, close dialog

**`user-delete-dialog.tsx`** (~60 lines):
- AlertDialog with confirmation message
- Shows user name/email being deleted
- onConfirm: remove from data, show toast

### 8. Create users route
`src/routes/_authenticated/users.tsx`:
```typescript
import { createFileRoute } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/page-layout'
import { UsersTable } from '@/features/users/components/users-table'
// ... dialog imports, state management

function UsersPage() {
  // State for dialogs (open/close, selected user)
  return (
    <PageLayout title="Users" description="Manage user accounts" actions={<AddUserButton />}>
      <UsersTable />
      <UserFormDialog />
      <UserDeleteDialog />
    </PageLayout>
  )
}
```

### 9. Update sidebar
In `src/components/layout/sidebar.tsx`, update navItems:
```typescript
const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const
```
Import `Users` from lucide-react. Remove Profile nav item.

### 10. Wire up dialog state
Use simple useState in UsersPage or a small zustand store in `src/features/users/stores/user-dialog-store.ts` to manage:
- `isFormOpen: boolean`
- `isDeleteOpen: boolean`
- `selectedUser: User | null`
- `mode: 'add' | 'edit'`

## Todo List
- [ ] Create `src/components/ui/table.tsx` (shadcn table)
- [ ] Verify/create `src/components/ui/command.tsx`
- [ ] Create `src/features/users/types/user.ts`
- [ ] Create `src/features/users/data/users-data.ts` (50+ mock users)
- [ ] Create `src/features/users/schemas/user-schema.ts`
- [ ] Create `src/components/data-table/data-table.tsx`
- [ ] Create `src/components/data-table/data-table-column-header.tsx`
- [ ] Create `src/components/data-table/data-table-toolbar.tsx`
- [ ] Create `src/components/data-table/data-table-pagination.tsx`
- [ ] Create `src/components/data-table/data-table-faceted-filter.tsx`
- [ ] Create `src/components/data-table/data-table-view-options.tsx`
- [ ] Create `src/features/users/components/users-columns.tsx`
- [ ] Create `src/features/users/components/users-table.tsx`
- [ ] Create `src/features/users/components/user-form-dialog.tsx`
- [ ] Create `src/features/users/components/user-delete-dialog.tsx`
- [ ] Create `src/routes/_authenticated/users.tsx`
- [ ] Update `src/components/layout/sidebar.tsx` (add Users nav)
- [ ] Verify: TypeScript compiles without errors
- [ ] Visual check: table renders, search/sort/filter/pagination work

## Success Criteria
- `/users` route renders data table with 50+ users
- Search filters by name/email in real-time
- Column headers sort asc/desc on click
- Faceted filters for role and status work (multi-select)
- Pagination shows correct page count, rows-per-page selector works
- Add dialog: validates form, adds user to table, shows toast
- Edit dialog: pre-fills form, updates user, shows toast
- Delete dialog: confirms, removes user, shows toast
- Sidebar shows Dashboard > Users > Settings
- All files < 200 lines
- No TypeScript errors

## Risk Assessment
- **Data-table component complexity** -- follow shadcn patterns closely, keep each file focused
- **Dialog state management** -- simple zustand store keeps it clean
- **Mock data won't persist on refresh** -- expected for boilerplate, document in comments

## Security Considerations
- Form inputs validated with zod (XSS prevention via React's escaping)
- No real API calls -- all client-side mock data

## Next Steps
- After this phase, the template has a complete Users CRUD example
- Future: replace mock data with real API calls (TanStack Query)
