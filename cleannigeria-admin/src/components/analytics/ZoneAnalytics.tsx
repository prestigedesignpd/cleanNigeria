import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { useFullAnalytics } from '@/hooks/useAdminAnalytics';
import { Loader2 } from 'lucide-react';

const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];

export function ZoneAnalytics() {
  const { data, isLoading } = useFullAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  const performance = data?.zones?.performance || [];

  return (
    <div className="space-y-6">
      <div className="bg-neutral-50 dark:bg-neutral-900/30 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-lg font-semibold mb-6">Waste Volume by Zone (Tons)</h3>
        {performance.length > 0 ? (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height={400} minWidth={0}>
              <BarChart data={performance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#888" opacity={0.2} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={100} />
                <Tooltip 
                  formatter={(value: number) => `${value.toLocaleString()} Tons`}
                  contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="volume" radius={[0, 4, 4, 0]}>
                  {performance.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-sm text-neutral-500">
            No zone data yet. Zones will appear here once waste collection begins.
          </div>
        )}
      </div>
    </div>
  );
}
