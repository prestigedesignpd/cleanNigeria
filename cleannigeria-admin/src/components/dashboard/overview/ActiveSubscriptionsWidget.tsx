import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { Loader2 } from 'lucide-react';

export function ActiveSubscriptionsWidget() {
  const { data, isLoading } = useAdminAnalytics();

  if (isLoading) {
    return (
      <Card className="col-span-4 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 flex items-center justify-center min-h-[350px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </Card>
    );
  }

  const subscriptionsData = (data?.users?.growth || []).map((g: any) => ({
    name: g.name,
    active: g.users
  }));

  return (
    <Card className="col-span-4 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <CardHeader>
        <CardTitle>Active Subscriptions</CardTitle>
        <CardDescription>Total active subscriptions trend.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height={300} minWidth={0}>
          <AreaChart data={subscriptionsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#888' }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#888' }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => [value.toLocaleString(), 'Active Subs']}
            />
            <Area 
              type="monotone" 
              dataKey="active" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSubs)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
