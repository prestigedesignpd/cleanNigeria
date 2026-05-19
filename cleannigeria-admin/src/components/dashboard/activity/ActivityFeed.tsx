import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSystemActivity } from '@/hooks/useAdminAnalytics';

export function ActivityFeed() {
  const { data, isLoading } = useSystemActivity();

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </Card>
    );
  }

  const activities = data?.map((a: any) => ({
    id: a.id,
    type: a.type,
    message: a.description,
    time: a.date,
    status: a.type === 'Payment' 
      ? (a.description.includes('Failed') ? 'error' : 'success') 
      : (a.type === 'Registration' ? 'info' : 'warning')
  })) || [];

  return (
    <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>System Activity</CardTitle>
        <button className="text-sm text-green-600 dark:text-green-500 hover:text-green-700 flex items-center">
          View all logs <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center text-sm text-neutral-500 py-6">No recent system activities</div>
        ) : (
          <div className="relative border-l border-neutral-200 dark:border-neutral-800 ml-3 space-y-6">
            {activities.map((activity: any, index) => {
              let Icon = Clock;
              let iconColor = "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
              
              if (activity.status === 'success') {
                Icon = CheckCircle2;
                iconColor = "text-green-500 bg-green-50 dark:bg-green-900/20";
              } else if (activity.status === 'warning' || activity.status === 'error') {
                Icon = AlertCircle;
                iconColor = activity.status === 'error' ? "text-red-500 bg-red-50 dark:bg-red-900/20" : "text-amber-500 bg-amber-50 dark:bg-amber-900/20";
              }

              return (
                <div key={activity.id} className="relative pl-6">
                  <div className={`absolute -left-3.5 top-1 h-7 w-7 rounded-full flex items-center justify-center border border-white dark:border-neutral-950 ${iconColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs uppercase tracking-wider">{activity.type}</Badge>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{activity.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
