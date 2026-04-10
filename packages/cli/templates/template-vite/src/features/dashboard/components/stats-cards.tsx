import { Activity, DollarSign, TrendingUp, Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCard {
  title: string
  value: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  trend: string
}

const stats: StatCard[] = [
  { title: 'Total Users', value: '12,345', description: '+12% from last month', icon: Users, trend: 'up' },
  { title: 'Active Sessions', value: '2,891', description: '+8% from last month', icon: Activity, trend: 'up' },
  { title: 'Revenue', value: '$45,231', description: '+20.1% from last month', icon: DollarSign, trend: 'up' },
  { title: 'Growth Rate', value: '+18.2%', description: '+4% from last month', icon: TrendingUp, trend: 'up' },
]

export function StatsCards() {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
            <stat.icon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stat.value}</div>
            <p className='text-xs text-muted-foreground'>{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
