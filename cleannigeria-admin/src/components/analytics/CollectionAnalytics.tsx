import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useFullAnalytics } from '@/hooks/useAdminAnalytics';
import { Loader2 } from 'lucide-react';

export function CollectionAnalytics() {
  const { data, isLoading } = useFullAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  const weekly = data?.collections?.weekly || [];
  const byZone = data?.collections?.byZone || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-neutral-50 dark:bg-neutral-900/30 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-lg font-semibold mb-6">Weekly Collection Trends</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height={300} minWidth={0}>
            <LineChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" opacity={0.2} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="completed" name="Completed" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="missed" name="Missed" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-900/30 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-lg font-semibold mb-6">Zone Efficiency</h3>
        <div className="h-[300px]">
          {byZone.length > 0 ? (
            <ResponsiveContainer width="100%" height={300} minWidth={0}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={byZone}>
                <PolarGrid stroke="#888" opacity={0.2} />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Efficiency %"
                  dataKey="efficiency"
                  stroke="#16a34a"
                  fill="#16a34a"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-neutral-500">
              No zone data available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
