import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { RevenueAnalytics } from '@/components/analytics/RevenueAnalytics';
import { CollectionAnalytics } from '@/components/analytics/CollectionAnalytics';
import { UserAnalytics } from '@/components/analytics/UserAnalytics';
import { ZoneAnalytics } from '@/components/analytics/ZoneAnalytics';

export default function AnalyticsOverviewPage() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Analytics Overview
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Comprehensive breakdown of system performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 border-neutral-200 dark:border-neutral-800">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="bg-neutral-100 dark:bg-neutral-900/50 p-1">
          <TabsTrigger value="revenue" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm">Revenue</TabsTrigger>
          <TabsTrigger value="collections" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm">Collections</TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm">Users</TabsTrigger>
          <TabsTrigger value="zones" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm">Zones</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6 outline-none">
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Detailed financial performance metrics.</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueAnalytics />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-6 outline-none">
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <CardHeader>
              <CardTitle>Collection Analytics</CardTitle>
              <CardDescription>Operational performance and efficiency metrics.</CardDescription>
            </CardHeader>
            <CardContent>
              <CollectionAnalytics />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 outline-none">
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>Customer acquisition and retention metrics.</CardDescription>
            </CardHeader>
            <CardContent>
              <UserAnalytics />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones" className="space-y-6 outline-none">
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <CardHeader>
              <CardTitle>Zone Analytics</CardTitle>
              <CardDescription>Geographic performance breakdown.</CardDescription>
            </CardHeader>
            <CardContent>
              <ZoneAnalytics />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
