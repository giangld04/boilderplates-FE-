# Phase 02: Dashboard + Charts

## Context Links
- Current dashboard: `packages/template-vite/src/routes/_authenticated/dashboard.tsx`
- Page layout: `packages/template-vite/src/components/layout/page-layout.tsx`
- UI card: `packages/template-vite/src/components/ui/card.tsx`
- Reference: https://github.com/satnaing/shadcn-admin (dashboard page)

## Overview
- **Priority:** P1
- **Status:** pending
- **Description:** Replace placeholder dashboard with stats cards and recharts overview chart. Add feature-scoped dashboard components.

## Key Insights
- Current dashboard renders 4 placeholder cards with `---` values
- recharts already in optional deps -- will be in base after phase-01
- Keep it simple: stats cards + one area/bar chart + recent activity section
- Use shadcn Card component for consistent styling
- All data is mock/static (no API calls needed for boilerplate)

## Requirements

### Functional
- 4 stats cards: Total Users, Active Sessions, Revenue, Growth Rate
- Each card shows: label, value, trend indicator (up/down %), icon
- Overview chart: monthly data (last 6 months), area or bar chart
- Recent activity section: simple list of 5-6 recent events
- Responsive: 1 col mobile, 2 col tablet, 4 col desktop for stats

### Non-functional
- Dashboard loads in <1s (no API calls, static data)
- recharts tree-shaken (import only used components)
- Each component file < 200 lines

## Architecture

```
dashboard.tsx (route)
  -> PageLayout
  -> StatsCards (4 cards grid)
  -> OverviewChart (recharts AreaChart)
  -> RecentActivity (simple list)
```

## Related Code Files

### Files to Modify
- `packages/template-vite/src/routes/_authenticated/dashboard.tsx` -- rewrite with new components

### Files to Create
- `packages/template-vite/src/features/dashboard/components/stats-cards.tsx`
- `packages/template-vite/src/features/dashboard/components/overview-chart.tsx`
- `packages/template-vite/src/features/dashboard/components/recent-activity.tsx`
- `packages/template-vite/src/features/dashboard/data/dashboard-data.ts` -- mock data

### Files to Modify (vite config)
- `packages/template-vite/vite.config.ts` -- add recharts to manualChunks

## Implementation Steps

### 1. Create mock data file
`src/features/dashboard/data/dashboard-data.ts`:
```typescript
export const statsData = [
  { label: 'Total Users', value: '2,847', change: '+12.5%', trend: 'up' as const, icon: 'Users' },
  { label: 'Active Sessions', value: '1,024', change: '+8.2%', trend: 'up' as const, icon: 'Activity' },
  { label: 'Revenue', value: '$48,250', change: '+15.3%', trend: 'up' as const, icon: 'DollarSign' },
  { label: 'Growth Rate', value: '24.5%', change: '-2.1%', trend: 'down' as const, icon: 'TrendingUp' },
]

export const monthlyData = [
  { month: 'Nov', users: 1200, revenue: 32000 },
  { month: 'Dec', users: 1800, revenue: 38000 },
  { month: 'Jan', users: 2100, revenue: 41000 },
  { month: 'Feb', users: 2400, revenue: 44000 },
  { month: 'Mar', users: 2600, revenue: 46000 },
  { month: 'Apr', users: 2847, revenue: 48250 },
]

export const recentActivity = [
  { user: 'John Doe', action: 'Created account', time: '2 minutes ago' },
  { user: 'Jane Smith', action: 'Updated profile', time: '15 minutes ago' },
  { user: 'Bob Wilson', action: 'Placed an order', time: '1 hour ago' },
  { user: 'Alice Brown', action: 'Submitted a ticket', time: '3 hours ago' },
  { user: 'Charlie Lee', action: 'Upgraded plan', time: '5 hours ago' },
]
```

### 2. Create `stats-cards.tsx`
- Import `Card, CardContent, CardHeader, CardTitle` from shadcn
- Import lucide icons dynamically by name
- Render 4-col grid of cards
- Each card: icon top-right, label, large value, colored trend badge
- Use `cn()` for trend coloring: green for up, red for down

### 3. Create `overview-chart.tsx`
- Import from recharts: `AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer`
- Wrap in shadcn Card with "Overview" title
- Render area chart with monthlyData
- Use `hsl(var(--primary))` for area fill color via CSS variable
- Set height to 350px

### 4. Create `recent-activity.tsx`
- Simple list inside a Card
- Each item: avatar placeholder (initials), user name, action, relative time
- Use shadcn Avatar component

### 5. Update `dashboard.tsx` route
```typescript
import { PageLayout } from '@/components/layout/page-layout'
import { StatsCards } from '@/features/dashboard/components/stats-cards'
import { OverviewChart } from '@/features/dashboard/components/overview-chart'
import { RecentActivity } from '@/features/dashboard/components/recent-activity'

function DashboardPage() {
  return (
    <PageLayout title="Dashboard" description="Overview of key metrics">
      <div className="space-y-6">
        <StatsCards />
        <div className="grid gap-6 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <OverviewChart />
          </div>
          <div className="lg:col-span-3">
            <RecentActivity />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
```

### 6. Update vite.config.ts
Add `recharts` to manualChunks:
```typescript
manualChunks: {
  // ...existing
  charts: ['recharts'],
}
```

## Todo List
- [ ] Create `src/features/dashboard/data/dashboard-data.ts`
- [ ] Create `src/features/dashboard/components/stats-cards.tsx`
- [ ] Create `src/features/dashboard/components/overview-chart.tsx`
- [ ] Create `src/features/dashboard/components/recent-activity.tsx`
- [ ] Rewrite `src/routes/_authenticated/dashboard.tsx`
- [ ] Update `vite.config.ts` manualChunks
- [ ] Verify: `pnpm --filter template-vite build` succeeds
- [ ] Visual check: dashboard renders correctly in dev

## Success Criteria
- Dashboard shows 4 stats cards with values and trend indicators
- Area chart renders monthly data with proper labels
- Recent activity shows 5 items with avatars
- All components < 200 lines each
- No TypeScript errors
- Responsive layout works on mobile/tablet/desktop

## Risk Assessment
- **recharts SSR** -- not applicable (Vite SPA)
- **CSS variable for chart colors** -- recharts accepts string colors; use hardcoded HSL matching theme or access CSS vars via JS

## Security Considerations
- N/A -- all mock data, no API calls

## Next Steps
- Phase 04 (Sentry) modifies `main.tsx` and `vite.config.ts` -- coordinate
