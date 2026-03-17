import { PageLayout } from '@/components/layout/page-layout'

// Stat card placeholder component
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <PageLayout
      title="Dashboard"
      description="Welcome to your portal. Here's an overview of your account."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value="1,024" />
        <StatCard label="Active Sessions" value="42" />
        <StatCard label="Requests Today" value="8,390" />
        <StatCard label="Uptime" value="99.9%" />
      </div>
    </PageLayout>
  )
}
