import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const recentUsers = [
  { name: 'Alice Johnson', email: 'alice@example.com', amount: '+$250.00' },
  { name: 'Bob Smith', email: 'bob@example.com', amount: '+$180.00' },
  { name: 'Carol White', email: 'carol@example.com', amount: '+$320.00' },
  { name: 'David Brown', email: 'david@example.com', amount: '+$90.00' },
  { name: 'Eve Davis', email: 'eve@example.com', amount: '+$430.00' },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>5 new users this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {recentUsers.map((user) => (
            <div key={user.email} className='flex items-center gap-4'>
              <Avatar className='h-9 w-9'>
                <AvatarFallback>{user.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{user.name}</p>
                <p className='truncate text-xs text-muted-foreground'>{user.email}</p>
              </div>
              <span className='text-sm font-medium text-green-600'>{user.amount}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
