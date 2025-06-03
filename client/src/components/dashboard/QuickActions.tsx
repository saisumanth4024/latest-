import { useCreateUserMutation, useDeployApiMutation, useLazyViewLogsQuery, useConfigureRulesMutation } from '@/features/api/apiSlice';
import { useToast } from '@/hooks/use-toast';

export default function QuickActions() {
  const { toast } = useToast();
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [deployApi, { isLoading: isDeploying }] = useDeployApiMutation();
  const [viewLogs, { isLoading: isViewingLogs }] = useLazyViewLogsQuery();
  const [configureRules, { isLoading: isConfiguring }] = useConfigureRulesMutation();

  const handleCreateUser = async () => {
    try {
      await createUser().unwrap();
      toast({
        title: "Success",
        description: "User created successfully",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleDeployApi = async () => {
    try {
      await deployApi().unwrap();
      toast({
        title: "Success",
        description: "API deployed successfully",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to deploy API",
        variant: "destructive",
      });
    }
  };

  const handleViewLogs = async () => {
    try {
      const logs = await viewLogs().unwrap();
      toast({
        title: "Logs Retrieved",
        description: `Retrieved ${logs.length} log entries`,
        variant: "default",
      });
      // Typically you would display these logs in a modal or navigate to a logs page
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to retrieve logs",
        variant: "destructive",
      });
    }
  };

  const handleConfigureRules = async () => {
    try {
      await configureRules().unwrap();
      toast({
        title: "Success",
        description: "Rules configured successfully",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to configure rules",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">Quick Actions</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Frequently used operations.</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleCreateUser}
            disabled={isCreatingUser}
            className="py-3 px-4 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg text-center disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-slate-600 dark:text-slate-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            <span className="block mt-2 text-sm font-medium text-slate-900 dark:text-white">
              {isCreatingUser ? 'Creating...' : 'Create User'}
            </span>
          </button>
          
          <button
            onClick={handleDeployApi}
            disabled={isDeploying}
            className="py-3 px-4 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg text-center disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-slate-600 dark:text-slate-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="block mt-2 text-sm font-medium text-slate-900 dark:text-white">
              {isDeploying ? 'Deploying...' : 'Deploy API'}
            </span>
          </button>
          
          <button
            onClick={handleViewLogs}
            disabled={isViewingLogs}
            className="py-3 px-4 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg text-center disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-slate-600 dark:text-slate-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="block mt-2 text-sm font-medium text-slate-900 dark:text-white">
              {isViewingLogs ? 'Loading...' : 'View Logs'}
            </span>
          </button>
          
          <button
            onClick={handleConfigureRules}
            disabled={isConfiguring}
            className="py-3 px-4 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg text-center disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-slate-600 dark:text-slate-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span className="block mt-2 text-sm font-medium text-slate-900 dark:text-white">
              {isConfiguring ? 'Configuring...' : 'Configure'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
