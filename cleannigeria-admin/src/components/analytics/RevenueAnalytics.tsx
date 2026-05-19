import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useFullAnalytics } from '@/hooks/useAdminAnalytics';
import { Loader2 } from 'lucide-react';

const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac'];

export function RevenueAnalytics() {
  const { data, isLoading } = useFullAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  const monthly = data?.revenue?.monthly || [];
  const byPlan = data?.revenue?.byPlan || [];

  const totalRevenue = byPlan.reduce((sum: number, p: any) => sum + (p.value || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-neutral-50 dark:bg-neutral-900/30 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-lg font-semibold mb-6">Revenue Growth (Estate vs Business)</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height={300} minWidth={0}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" opacity={0.2} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₦${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip 
                formatter={(value: number) => `₦${value.toLocaleString()}`}
                contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="residential" name="Estate" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="business" name="Business" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-900/30 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-lg font-semibold mb-6">Revenue by Plan</h3>
        {totalRevenue === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-neutral-500 text-sm text-center">
            No revenue by plan data available
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height={300} minWidth={0}>
              <PieChart>
                <Pie
                  data={byPlan}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {byPlan.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₦${(value / 100).toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
