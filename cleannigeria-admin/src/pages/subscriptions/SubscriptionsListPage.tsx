import { useState } from 'react';
import { Search, Filter, Download, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAdminSubscriptions } from '@/hooks/useAdminUsers';
import { format } from 'date-fns';

export default function SubscriptionsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading } = useAdminSubscriptions();

  const subscriptions = data?.data || [];

  const filteredSubscriptions = subscriptions.filter((sub: any) => 
    (sub.userId?.firstName?.toLowerCase() + ' ' + sub.userId?.lastName?.toLowerCase()).includes(searchTerm.toLowerCase()) ||
    sub._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Subscriptions</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage system-wide subscription statuses.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              placeholder="Search subscriptions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-white dark:bg-neutral-950" 
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto h-10">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                <TableHead>Subscriber</TableHead>
                <TableHead>Plan Details</TableHead>
                <TableHead>Monthly Value</TableHead>
                <TableHead>Next Renewal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-neutral-500">
                    Loading subscriptions...
                  </TableCell>
                </TableRow>
              ) : filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((sub: any) => (
                  <TableRow key={sub._id}>
                    <TableCell>
                      <div className="font-medium text-neutral-900 dark:text-white">{sub.userId?.firstName} {sub.userId?.lastName}</div>
                      <div className="text-xs text-neutral-500">ID: {sub._id.substring(0, 8)} • {sub.userId?.accountType}</div>
                    </TableCell>
                    <TableCell>
                      <div>{sub.planId?.name || 'Standard'}</div>
                      <div className="text-xs text-neutral-500">{sub.planId?.billingCycle || 'Monthly'} Billing</div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₦{((sub.planId?.price || 0) / 100).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div>{sub.currentPeriodEnd ? format(new Date(sub.currentPeriodEnd), 'MMM dd, yyyy') : 'N/A'}</div>
                      <div className="text-xs text-neutral-500">Started {format(new Date(sub.createdAt || sub.startDate), 'MMM dd, yyyy')}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        sub.status === 'ACTIVE' 
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/20 border-green-200' 
                          : 'bg-red-50 text-red-700 dark:bg-red-900/20 border-red-200'
                      }>
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View history</DropdownMenuItem>
                          <DropdownMenuItem>Change plan</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Cancel subscription</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-neutral-500">
                    No subscriptions found matching "{searchTerm}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
