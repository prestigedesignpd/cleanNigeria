import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useFullAnalytics } from '@/hooks/useAdminAnalytics';
import { Loader2 } from 'lucide-react';

const COLORS = ['#16a34a', '#22c55e', '#4ade80'];

export function UserAnalytics() {
  const { data, isLoading } = useFullAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  const growth = data?.users?.growth || [];
  const types = data?.users?.types || [];

  const totalUsers = types.reduce((sum: number, t: any) => sum + (t.value || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-neutral-50 dark:bg-neutral-900/30 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-lg font-semibold mb-6">User Base Growth</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height={300} minWidth={0}>
            <AreaChart data={growth}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" opacity={0.2} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value: number) => [value.toLocaleString(), 'Total Users']}
              />
              <Area type="monotone" dataKey="users" stroke="#16a34a" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-900/30 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-lg font-semibold mb-6">User Distribution</h3>
        {totalUsers === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-neutral-500 text-sm">
            No user distribution data available
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height={300} minWidth={0}>
              <PieChart>
                <Pie
                  data={types}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {types.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
