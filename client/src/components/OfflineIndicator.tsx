import React from 'react';
import { WifiOff } from 'lucide-react';
import useNetworkStatus from '@/hooks/useNetworkStatus';

/**
 * Component that displays an offline notification when the user loses connection
 */
const OfflineIndicator: React.FC = () => {
  const { isOnline, since } = useNetworkStatus();

  if (isOnline) return null;

  let durationText: string | null = null;
  if (since) {
    const minutes = Math.floor((Date.now() - since.getTime()) / 60000);
    if (minutes > 0) {
      durationText = `${minutes} minute${minutes === 1 ? '' : 's'}`;
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-md shadow-lg z-50 flex items-center gap-2">
      <WifiOff className="h-4 w-4" />
      <span>
        You are currently offline{durationText ? ` (${durationText})` : ''}. Some features may be unavailable.
      </span>
    </div>
  );
};

/**
 * HOC that adds offline detection to any component
 * @param WrappedComponent - Component to wrap
 * @returns Wrapped component with offline notification
 */
export function withOfflineDetection<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const ComponentWithOfflineDetection = (props: P) => (
    <>
      <OfflineIndicator />
      <WrappedComponent {...props} />
    </>
  );
  
  ComponentWithOfflineDetection.displayName = `withOfflineDetection(${displayName})`;
  
  return ComponentWithOfflineDetection;
}

export default OfflineIndicator;