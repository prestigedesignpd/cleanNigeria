import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  ChevronRight, 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Activity,
  Zap,
  ArrowDownToLine,
  Map as MapIcon,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { useAdminPayments } from '@/hooks/useAdminPayments';
import { useAdminCollectors } from '@/hooks/useAdminEntities';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';

const reportTypes = [
  {
    id: 'rev-summary',
    title: 'Revenue Summary',
    description: 'Detailed analysis of collections, subscriptions, and payment trends.',
    icon: TrendingUp,
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-900/20',
    lastGenerated: '2026-05-13T16:45:00Z'
  },
  {
    id: 'ops-efficiency',
    title: 'Operations Efficiency',
    description: 'Track collection rates, route optimization, and missed pickup analytics.',
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    lastGenerated: '2026-05-14T09:00:00Z'
  },
  {
    id: 'staff-perf',
    title: 'Staff Performance',
    description: 'Individual and team metrics for collectors and zone commanders.',
    icon: Activity,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    lastGenerated: '2026-05-12T14:20:00Z'
  }
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  // Live queries
  const { data: paymentsRes } = useAdminPayments({ limit: 1000 });
  const { data: collectors = [] } = useAdminCollectors();
  const { data: analytics } = useAdminAnalytics();

  const payments = paymentsRes?.data || [];

  const downloadCSV = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateReport = async (reportId: string, reportTitle: string) => {
    setIsGenerating(reportId);
    
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            if (reportId === 'rev-summary') {
              if (!payments || payments.length === 0) {
                // Generate a placeholder CSV with structure if empty
                const headers = ['Payment ID', 'Date', 'Amount (NGN)', 'User Name', 'User Email', 'Method', 'Status'];
                const placeholderRows = [
                  ['PAY-MOCK-001', new Date().toLocaleDateString(), '5000.00', 'John Doe', 'john@example.com', 'Card', 'SUCCESS'],
                  ['PAY-MOCK-002', new Date().toLocaleDateString(), '12500.00', 'Mary Slessor', 'mary@example.com', 'Bank Transfer', 'SUCCESS']
                ];
                const csvContent = [headers.join(','), ...placeholderRows.map(r => r.map(val => `"${val}"`).join(','))].join('\n');
                downloadCSV(`revenue_summary_${Date.now()}.csv`, csvContent);
                resolve({ count: 2, isMock: true });
                return;
              }

              const headers = ['Payment ID', 'Date', 'Amount (NGN)', 'User Name', 'User Email', 'Method', 'Status'];
              const rows = payments.map((p: any) => [
                p._id,
                new Date(p.createdAt).toLocaleDateString(),
                (p.amount / 100).toFixed(2),
                p.userId ? `${p.userId.firstName || ''} ${p.userId.lastName || ''}`.trim() : 'N/A',
                p.userId?.email || 'N/A',
                p.paymentMethod || 'PAYSTACK',
                p.status
              ]);
              const csvContent = [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))].join('\n');
              downloadCSV(`revenue_summary_${Date.now()}.csv`, csvContent);
              resolve({ count: payments.length });

            } else if (reportId === 'staff-perf') {
              if (!collectors || collectors.length === 0) {
                const headers = ['Collector ID', 'Name', 'Email', 'Phone', 'Assigned Zone', 'Status'];
                const placeholderRows = [
                  ['COLL-MOCK-001', 'Babajide Sanwo', 'babs@collector.cleannigeria.org', '08012345678', 'Ikeja Hub', 'ACTIVE'],
                  ['COLL-MOCK-002', 'Ngozi Okonjo', 'ngozi@collector.cleannigeria.org', '08087654321', 'Victoria Island', 'ACTIVE']
                ];
                const csvContent = [headers.join(','), ...placeholderRows.map(r => r.map(val => `"${val}"`).join(','))].join('\n');
                downloadCSV(`staff_performance_${Date.now()}.csv`, csvContent);
                resolve({ count: 2, isMock: true });
                return;
              }

              const headers = ['Collector ID', 'Name', 'Email', 'Phone', 'Assigned Zone', 'Status'];
              const rows = collectors.map((c: any) => [
                c._id,
                `${c.firstName || ''} ${c.lastName || ''}`.trim(),
                c.email,
                c.phone || 'N/A',
                c.currentZoneId?.name || c.zone?.name || 'Unassigned',
                c.status
              ]);
              const csvContent = [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))].join('\n');
              downloadCSV(`staff_performance_${Date.now()}.csv`, csvContent);
              resolve({ count: collectors.length });

            } else if (reportId === 'ops-efficiency') {
              const headers = ['Metric Category', 'Name / Month', 'Value / Residential Revenue', 'Business Revenue'];
              const rows: any[] = [];

              if (analytics) {
                rows.push(['Monthly Revenue Breakdown', '', '', '']);
                analytics.revenueMonthly?.forEach((item: any) => {
                  rows.push(['Revenue Summary', item.name, `₦${item.residential.toLocaleString()}`, `₦${item.business.toLocaleString()}`]);
                });
                rows.push(['', '', '', '']);

                rows.push(['Regional User Growth', '', '', '']);
                analytics.userGrowthMonthly?.forEach((item: any) => {
                  rows.push(['User Growth', item.name, `${item.users} Registered Users`, '']);
                });
                rows.push(['', '', '', '']);

                rows.push(['User Demographics', '', '', '']);
                analytics.userTypes?.forEach((item: any) => {
                  rows.push(['User Distribution', item.name, `${item.value} Accounts`, '']);
                });
              } else {
                // Seed some operational mock statistics if analytics is currently empty
                rows.push(['Operational Metrics', 'Total pickup compliance', '94.2%', '']);
                rows.push(['Operational Metrics', 'Missed pickups rate', '1.8%', '']);
                rows.push(['Operational Metrics', 'Active service fleet vehicles', '24 operational', '']);
                rows.push(['Operational Metrics', 'Average issue resolution time', '4.2 hours', '']);
              }

              const csvContent = [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))].join('\n');
              downloadCSV(`operations_efficiency_${Date.now()}.csv`, csvContent);
              resolve({ count: rows.length, isMock: !analytics });
            } else {
              reject(new Error('Unknown report type'));
            }
          } catch (err) {
            reject(err);
          }
        }, 1500);
      }),
      {
        loading: `Aggregating database contents for ${reportTitle}...`,
        success: (res: any) => `${reportTitle} successfully compiled! ${res.count} records extracted ${res.isMock ? '(Sample seed data)' : '(Live database)'}.`,
        error: 'Could not generate report.',
      }
    ).finally(() => setIsGenerating(null));
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight">Intelligence & Reports</h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">Generate and export high-fidelity data summaries for regional operations.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-11 border-neutral-200 dark:border-neutral-800">
            <Download className="h-4 w-4 mr-2" /> Export History
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Controls Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-4 px-6">
               <CardTitle className="text-sm font-black uppercase tracking-widest text-neutral-400">Report Parameters</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Time Horizon</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="h-11 rounded-xl border-neutral-200">
                      <Calendar className="h-4 w-4 mr-2 text-neutral-400" />
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Today">Today</SelectItem>
                      <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
                      <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
                      <SelectItem value="Custom">Custom Range...</SelectItem>
                    </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Geographic Scope</label>
                  <Select value={selectedZone} onValueChange={setSelectedZone}>
                    <SelectTrigger className="h-11 rounded-xl border-neutral-200">
                      <MapIcon className="h-4 w-4 mr-2 text-neutral-400" />
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Zones">All Regions (Lagos)</SelectItem>
                      <SelectItem value="Ikeja">Ikeja Operational Hub</SelectItem>
                      <SelectItem value="Victoria Island">Victoria Island Zone</SelectItem>
                      <SelectItem value="Surulere">Surulere Region</SelectItem>
                    </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Output Format</label>
                  <div className="grid grid-cols-2 gap-2">
                     <Button variant="outline" className="rounded-xl font-bold h-11 bg-green-50/50 border-green-100 text-green-700">CSV</Button>
                     <Button variant="outline" className="rounded-xl font-bold h-11 border-neutral-200">PDF</Button>
                  </div>
               </div>

               <Separator className="bg-neutral-100" />

               <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/50">
                  <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-400">
                     <Clock className="h-4 w-4" />
                     <span className="text-xs font-bold uppercase tracking-wider">Next Auto-Report</span>
                  </div>
                  <p className="text-xs font-medium text-blue-600/80 leading-relaxed">
                     Weekly operational summary will be dispatched on <span className="font-bold">Monday, May 18th</span> at 08:00 AM.
                  </p>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Cards Grid */}
        <div className="lg:col-span-3 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportTypes.map((report) => (
                <Card key={report.id} className="border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all group">
                   <div className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                         <div className={cn(
                           "h-14 w-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform",
                           report.bg,
                           report.color
                         )}>
                            <report.icon className="h-7 w-7" />
                         </div>
                         <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-widest text-neutral-400">
                            Available
                         </Badge>
                      </div>
                      
                      <div className="space-y-2 flex-1">
                         <h3 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">{report.title}</h3>
                         <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                            {report.description}
                         </p>
                      </div>

                      <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Last Gen</span>
                            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mt-1">
                               {formatDistanceToNow(new Date(report.lastGenerated), { addSuffix: true })}
                            </span>
                         </div>
                         <Button 
                           onClick={() => handleGenerateReport(report.id, report.title)}
                           className="bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold rounded-xl h-10 px-6"
                           disabled={isGenerating !== null}
                         >
                            <ArrowDownToLine className="h-4 w-4 mr-2" /> Generate
                         </Button>
                      </div>
                   </div>
                </Card>
              ))}
           </div>

           {/* Export History Section */}
           <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden mt-8">
              <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-4 px-6 flex flex-row items-center justify-between">
                 <div>
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-neutral-400">Export History</CardTitle>
                 </div>
                 <Button variant="ghost" size="sm" className="font-bold text-xs text-neutral-500">View All</Button>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-5 flex items-center justify-between hover:bg-neutral-50/50 transition-colors">
                         <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
                               <FileText className="h-5 w-5" />
                            </div>
                            <div>
                               <p className="text-sm font-bold">rev_summary_lagos_may_{i+10}.csv</p>
                               <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                  <span>Generated by Admin</span>
                                  <span className="h-1 w-1 rounded-full bg-neutral-300" />
                                  <span>May {i+10}, 2026 • 1.2 MB</span>
                                </div>
                            </div>
                         </div>
                         <Button variant="ghost" size="icon" className="rounded-xl hover:bg-green-50 hover:text-green-600">
                            <Download className="h-4 w-4" />
                         </Button>
                      </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

const Separator = ({ className }: { className?: string }) => (
  <div className={cn("h-px w-full", className)} />
);
