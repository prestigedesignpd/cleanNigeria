import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  CreditCard, 
  TrendingUp, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  CalendarDays,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { PaymentStatsGrid } from '@/components/payments/PaymentStatsGrid';
import { PaymentDetailsModal } from '@/components/payments/PaymentDetailsModal';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAdminPayments } from '@/hooks/useAdminPayments';

export default function PaymentsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'date', 
    direction: 'desc' 
  });
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useAdminPayments({ page: 1, limit: 1000 });
  const rawPayments = data?.data || [];

  const mappedPayments = rawPayments.map((p: any) => {
    const subscriberName = p.userId 
      ? `${p.userId.firstName || ''} ${p.userId.lastName || ''}`.trim() 
      : 'CleanNigeria Client';
    const customerEmail = p.userId?.email || 'client@cleannigeria.org';
    const status = p.status === 'SUCCESS' ? 'Success' : p.status === 'PENDING' ? 'Pending' : 'Failed';
    const method = p.channel || 'Paystack';
    const date = p.createdAt || new Date().toISOString();
    const amount = (p.amount || 0) / 100; // Assuming amount is in kobo, convert to Naira
    
    return {
      id: p._id,
      reference: p.reference || 'REF-N/A',
      subscriberName,
      customerEmail,
      amount,
      type: p.type || 'Subscription',
      status,
      method,
      date,
      billingPeriod: 'N/A',
      failureReason: p.metadata?.failureReason || null
    };
  });

  const filteredPayments = mappedPayments
    .filter((payment: any) => {
      const matchesSearch = 
        payment.subscriberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a: any, b: any) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleViewDetails = (payment: any) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Preparing financial report...',
        success: 'Master ledger exported to CSV',
        error: 'Export failed',
      }
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Financial Ledger</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Real-time monitoring of system-wide revenue and transaction status.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-10" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          <Button className="bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold flex-1 md:flex-none h-10">
            <ShieldCheck className="h-4 w-4 mr-2" /> Reconciliation
          </Button>
        </div>
      </div>

      <PaymentStatsGrid />

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col lg:flex-row gap-4 justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              placeholder="Search by name, email, or reference..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 shadow-none focus-visible:ring-green-500" 
            />
          </div>
          <div className="flex gap-2 w-full lg:w-auto">
            <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
               {['All', 'Success', 'Pending', 'Failed'].map((status) => (
                 <Button 
                   key={status}
                   variant="ghost" 
                   size="sm" 
                   onClick={() => setStatusFilter(status)}
                   className={cn(
                     "h-8 px-3 text-xs font-bold transition-all",
                     statusFilter === status 
                       ? "bg-white dark:bg-neutral-900 shadow-sm text-neutral-900 dark:text-white" 
                       : "text-neutral-500 hover:text-neutral-700"
                   )}
                 >
                   {status}
                 </Button>
               ))}
            </div>
            <Button variant="outline" className="h-10 border-neutral-200 dark:border-neutral-800">
              <CalendarDays className="h-4 w-4 mr-2" /> Date Range
            </Button>
            <Button variant="outline" className="h-10 border-neutral-200 dark:border-neutral-800">
              <Filter className="h-4 w-4 mr-2" /> More Filters
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <p className="text-neutral-500 text-sm font-medium">Loading transactions...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <TableHead className="font-semibold py-4">Transaction Ref</TableHead>
                  <TableHead className="font-semibold">Subscriber Details</TableHead>
                  <TableHead 
                    className="font-semibold cursor-pointer hover:text-green-600 transition-colors"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center gap-1">
                      Amount
                      <TrendingUp className={cn("h-3 w-3", sortConfig.key === 'amount' ? "opacity-100" : "opacity-0")} />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Gateway / Method</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead 
                    className="font-semibold cursor-pointer hover:text-green-600 transition-colors"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Settled Date
                      <CalendarDays className={cn("h-3 w-3", sortConfig.key === 'date' ? "opacity-100" : "opacity-0")} />
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-semibold pr-8">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment: any) => (
                    <TableRow key={payment.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors group">
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white uppercase">
                            {payment.reference}
                          </span>
                          <span className="text-[10px] font-medium text-neutral-400 mt-0.5">ID: {payment.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-neutral-900 dark:text-white">{payment.subscriberName}</span>
                          <span className="text-xs text-neutral-500 font-medium truncate max-w-[180px]">{payment.customerEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-neutral-900 dark:text-white">₦{payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">{payment.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-6 w-6 rounded flex items-center justify-center",
                            payment.method === 'Paystack' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                          )}>
                             <CreditCard className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs font-bold">{payment.method}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "font-bold text-[10px] uppercase px-2 py-0.5 border-2",
                          payment.status === 'Success' 
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 border-green-100 dark:border-green-800' 
                            : payment.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800'
                            : 'bg-red-50 text-red-700 dark:bg-red-900/20 border-red-100 dark:border-red-800'
                        )}>
                          {payment.status === 'Success' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {payment.status === 'Pending' && <Clock className="h-3 w-3 mr-1" />}
                          {payment.status === 'Failed' && <XCircle className="h-3 w-3 mr-1" />}
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{format(new Date(payment.date), 'MMM dd, yyyy')}</span>
                          <span className="text-[10px] text-neutral-400 font-bold uppercase">{format(new Date(payment.date), 'hh:mm a')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-neutral-950">
                            <DropdownMenuLabel>Ledger Controls</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewDetails(payment)}>
                              <ExternalLink className="h-3.5 w-3.5 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info('Initiating receipt download...')}>
                              <Download className="h-3.5 w-3.5 mr-2" /> Download Receipt
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 cursor-pointer font-semibold focus:bg-red-50 dark:focus:bg-red-950/20" onClick={() => handleViewDetails(payment)}>
                              <TrendingUp className="h-3.5 w-3.5 mr-2" /> Dispute/Refund
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <CreditCard className="h-12 w-12 text-neutral-200" />
                         <div>
                            <p className="text-lg font-bold text-neutral-900 dark:text-white">No transactions found</p>
                            <p className="text-sm text-neutral-500">Try adjusting your filters or search terms</p>
                         </div>
                         <Button variant="outline" onClick={() => setSearchTerm('')}>Clear all filters</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-500 bg-neutral-50/30">
          <div>Displaying <b>{filteredPayments.length}</b> records from the master ledger</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 border-neutral-200 dark:border-neutral-800 shadow-none px-4 font-bold" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="h-9 border-neutral-200 dark:border-neutral-800 shadow-none px-4 font-bold" disabled>Next</Button>
          </div>
        </div>
      </div>

      <PaymentDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        payment={selectedPayment} 
      />
    </div>
  );
}
