import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, isSameDay } from 'date-fns';
import { 
  Truck, 
  MapPin, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  CalendarDays
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ScheduleCalendarViewProps {
  schedules?: any[];
  onSelectSchedule: (schedule: any) => void;
}

export function ScheduleCalendarView({ schedules = [], onSelectSchedule }: ScheduleCalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const daySchedules = schedules.filter(sch => {
    if (!sch.date) return false;
    return date && isSameDay(new Date(sch.date), date);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="lg:col-span-1 shadow-sm border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="text-xl">Dispatch Calendar</CardTitle>
          <CardDescription>Select a date to view scheduled collections.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-4 bg-white dark:bg-neutral-950"
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 shadow-sm border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                Manifest for {date ? format(date, 'MMMM dd, yyyy') : 'Selected Date'}
              </CardTitle>
              <CardDescription>
                {daySchedules.length} {daySchedules.length === 1 ? 'collection' : 'collections'} scheduled for this day.
              </CardDescription>
            </div>
            {daySchedules.length > 0 && (
               <Badge className="bg-green-600 text-white font-bold">LIVE SYNC</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {daySchedules.length > 0 ? (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {daySchedules.map((sch) => {
                  const fullName = sch.entityName || 'Unnamed Entity';
                  const zoneName = sch.zone || 'Unassigned Zone';
                  const collectorName = sch.collector?.name || 'Awaiting Assignment';
                  const plateNumber = sch.vehicleId || sch.collector?.vehicle?.plateNumber || 'GPS OFFLINE';

                  return (
                    <div 
                      key={sch.id || sch._id} 
                      className="p-6 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group cursor-pointer"
                      onClick={() => onSelectSchedule(sch)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border-2",
                            sch.status === 'Completed' || sch.status === 'COMPLETED' ? 'bg-green-50 text-green-600 border-green-100' :
                            sch.status === 'Delayed' || sch.status === 'DELAYED' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-blue-50 text-blue-600 border-blue-100'
                          )}>
                            {sch.status === 'Completed' || sch.status === 'COMPLETED' ? <CheckCircle2 className="h-6 w-6" /> : <Truck className="h-6 w-6" />}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-neutral-900 dark:text-white leading-none">{fullName}</h4>
                              <Badge variant="outline" className="text-[10px] h-4 font-black uppercase tracking-tighter">
                                {sch.entityType || 'ESTATE'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                              <MapPin className="h-3 w-3" />
                              {zoneName} • {sch.address || 'Operations Zone'}
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                               <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-white">
                                  <Clock className="h-3.5 w-3.5 text-neutral-400" />
                                  {sch.date ? format(new Date(sch.date), 'hh:mm a') : '09:00 AM'}
                               </div>
                               <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                                  {collectorName}
                               </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={cn(
                            "font-bold text-[10px] uppercase",
                            sch.status === 'Completed' || sch.status === 'COMPLETED' ? 'bg-green-600' : 
                            sch.status === 'In Progress' || sch.status === 'IN_PROGRESS' ? 'bg-purple-600' : 
                            sch.status === 'Delayed' || sch.status === 'DELAYED' ? 'bg-red-600' : 'bg-blue-600'
                          )}>
                            {sch.status || 'SCHEDULED'}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-xs font-bold text-neutral-400 hover:text-green-600"
                            onClick={() => onSelectSchedule(sch)}
                          >
                            Details <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center p-8">
                <div className="h-20 w-20 bg-neutral-50 dark:bg-neutral-900 rounded-full flex items-center justify-center text-neutral-200 mb-4">
                   <CalendarDays className="h-10 w-10" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Empty Manifest</h3>
                <p className="text-sm text-neutral-500 max-w-[280px] mx-auto mt-2">
                  There are no waste collection tasks scheduled for this date.
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
