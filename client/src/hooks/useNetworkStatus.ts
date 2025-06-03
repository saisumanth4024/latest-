import { useEffect, useState } from 'react';

interface NetworkStatusResult {
  isOnline: boolean;
  wasOffline: boolean;
  since: Date | null;
}

/**
 * Hook to track online/offline status with additional context
 * @returns Object containing network status information
 */
export function useNetworkStatus(): NetworkStatusResult {
  const initialOnline = navigator.onLine;
  const [isOnline, setIsOnline] = useState<boolean>(initialOnline);
  const [wasOffline, setWasOffline] = useState<boolean>(!initialOnline);
  const [since, setSince] = useState<Date | null>(initialOnline ? null : new Date());

  useEffect(() => {
    // Handler for online status
    const handleOnline = () => {
      setIsOnline(true);
      setSince(new Date());
    };

    // Handler for offline status
    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setSince(new Date());
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasOffline, since };
}

/**
 * Hook to detect slow network connections
 * @returns Boolean indicating if the connection is slow
 */
export function useSlowConnection(): boolean {
  const [isSlowConnection, setIsSlowConnection] = useState<boolean>(false);

  useEffect(() => {
    // Function to check connection speed
    const checkConnectionSpeed = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        
        if (connection) {
          const isSlowType = connection.effectiveType === '2g' || connection.effectiveType === '3g';
          const isSlowSpeed = connection.downlink < 1;
          const isSaveData = connection.saveData === true;
          setIsSlowConnection(isSlowType || isSlowSpeed || isSaveData);
        }
      }
    };

    // Initial check
    checkConnectionSpeed();

    // Add event listener for connection changes if available
    const connection = (navigator as any).connection;
    if (connection && typeof connection.addEventListener === 'function') {
      connection.addEventListener('change', checkConnectionSpeed);

      // Remove event listener on cleanup
      return () => {
        connection.removeEventListener('change', checkConnectionSpeed);
      };
    }
  }, []);

  return isSlowConnection;
}

export default useNetworkStatus;