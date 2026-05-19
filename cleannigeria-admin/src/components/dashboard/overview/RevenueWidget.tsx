import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { Loader2 } from 'lucide-react';

export function RevenueWidget() {
  const { data, isLoading } = useAdminAnalytics();

  if (isLoading) {
    return (
      <Card className="col-span-4 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 flex items-center justify-center min-h-[350px]">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </Card>
    );
  }

  const revenueData = (data?.revenue?.monthly || []).map((m: any) => ({
    name: m.name,
    revenue: (m.residential || 0) + (m.business || 0)
  }));

  return (
    <Card className="col-span-4 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue growth over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height={300} minWidth={0}>
          <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
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
              tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#16a34a" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
