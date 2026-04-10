import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
  { month: 'Jan', revenue: 18000 },
  { month: 'Feb', revenue: 22000 },
  { month: 'Mar', revenue: 19500 },
  { month: 'Apr', revenue: 28000 },
  { month: 'May', revenue: 24000 },
  { month: 'Jun', revenue: 32000 },
  { month: 'Jul', revenue: 35000 },
  { month: 'Aug', revenue: 29000 },
  { month: 'Sep', revenue: 38000 },
  { month: 'Oct', revenue: 42000 },
  { month: 'Nov', revenue: 39000 },
  { month: 'Dec', revenue: 45000 },
]

export function OverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>Monthly revenue and user growth</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='hsl(var(--primary))' stopOpacity={0.2} />
                <stop offset='95%' stopColor='hsl(var(--primary))' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
            <XAxis dataKey='month' className='text-xs' tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis className='text-xs' tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--card-foreground))',
              }}
            />
            <Area
              type='monotone'
              dataKey='revenue'
              stroke='hsl(var(--primary))'
              fillOpacity={1}
              fill='url(#colorRevenue)'
              strokeWidth={2}
              name='Revenue ($)'
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
