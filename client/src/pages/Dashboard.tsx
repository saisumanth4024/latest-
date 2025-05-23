import { useGetApiActivitiesQuery, useGetApiStatusQuery, useGetMetricsQuery, useRefreshDataMutation, useLazyExportDataQuery } from '@/features/api/apiSlice';
import MetricCard from '@/components/dashboard/MetricCard';
import ActivityTable from '@/components/dashboard/ActivityTable';
import APIStatus from '@/components/dashboard/APIStatus';
import QuickActions from '@/components/dashboard/QuickActions';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { toast } = useToast();
  
  // Fetch data with RTK Query
  const { 
    data: metrics = { totalUsers: 0, apiRequests: 0, avgResponseTime: 0, errorRate: 0 }, 
    isLoading: metricsLoading 
  } = useGetMetricsQuery();
  
  const { 
    data: activities = [], 
    isLoading: activitiesLoading 
  } = useGetApiActivitiesQuery();
  
  const { 
    data: statuses = [], 
    isLoading: statusesLoading 
  } = useGetApiStatusQuery();
  
  // Mutation for refresh action
  const [refreshData, { isLoading: isRefreshing }] = useRefreshDataMutation();
  
  // Query for export action
  const [exportData, { isLoading: isExporting }] = useLazyExportDataQuery();
  
  const handleRefresh = async () => {
    try {
      await refreshData().unwrap();
      toast({
        title: "Data Refreshed",
        description: "Dashboard data has been updated",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Refresh Failed",
        description: "Could not refresh dashboard data",
        variant: "destructive",
      });
    }
  };
  
  const handleExport = async () => {
    try {
      const blob = await exportData().unwrap();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Dashboard data has been exported",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "Could not export dashboard data",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Monitor your application performance and usage.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-slate-500 dark:text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>{isExporting ? 'Exporting...' : 'Export'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <MetricCard
          title="Total Users"
          value={metricsLoading ? 'Loading...' : metrics.totalUsers.toLocaleString()}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          }
          bgColorClass="bg-indigo-100 dark:bg-indigo-900/30"
          iconColorClass="text-indigo-600 dark:text-indigo-400"
          linkText="View all"
          linkHref="#users"
        />
        
        <MetricCard
          title="API Requests"
          value={metricsLoading ? 'Loading...' : `${(metrics.apiRequests / 1_000_000).toFixed(1)}M`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
          }
          bgColorClass="bg-emerald-100 dark:bg-emerald-900/30"
          iconColorClass="text-emerald-600 dark:text-emerald-400"
          linkText="View analytics"
          linkHref="#analytics"
        />
        
        <MetricCard
          title="Avg. Response Time"
          value={metricsLoading ? 'Loading...' : `${metrics.avgResponseTime}ms`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          }
          bgColorClass="bg-amber-100 dark:bg-amber-900/30"
          iconColorClass="text-amber-600 dark:text-amber-400"
          linkText="View performance"
          linkHref="#performance"
        />
        
        <MetricCard
          title="Error Rate"
          value={metricsLoading ? 'Loading...' : `${metrics.errorRate}%`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600 dark:text-rose-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          }
          bgColorClass="bg-rose-100 dark:bg-rose-900/30"
          iconColorClass="text-rose-600 dark:text-rose-400"
          linkText="View errors"
          linkHref="#errors"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <ActivityTable 
            activities={activities} 
            isLoading={activitiesLoading} 
          />
        </div>

        {/* Quick Access */}
        <div>
          <APIStatus 
            statuses={statuses} 
            isLoading={statusesLoading} 
          />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
