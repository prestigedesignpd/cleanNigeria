import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { Loader2 } from 'lucide-react';

export function RecentSignupsWidget() {
  const { data: response, isLoading } = useAdminUsers({ limit: 5 });
  const users = response?.data || [];

  return (
    <Card className="col-span-4 lg:col-span-2 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <CardHeader>
        <CardTitle>Recent Signups</CardTitle>
        <CardDescription>Latest users registered on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
             <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center text-sm text-neutral-500 py-6">No recent signups</div>
        ) : (
          <div className="space-y-6">
            {users.map((user: any) => (
              <div key={user.id || user._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar?.url} alt={user.firstName} />
                    <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none text-neutral-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{user.accountType}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {user.accountType === 'ESTATE' && (
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-200">
                      Estate
                    </Badge>
                  )}
                  {user.accountType === 'BUSINESS' && (
                    <Badge variant="outline" className="bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400 border-cyan-200">
                      Business
                    </Badge>
                  )}
                  {user.accountType === 'INDIVIDUAL' && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200">
                      Individual
                    </Badge>
                  )}
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
