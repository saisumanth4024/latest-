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
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const [since, setSince] = useState<Date | null>(null);

  useEffect(() => {
    if (!navigator.onLine) {
      setWasOffline(true);
      setSince(new Date());
    }
  }, []);

  useEffect(() => {
    // Handler for online status
    const handleOnline = () => {
      if (!isOnline) {
        setIsOnline(true);
        setSince(new Date());
      }
    };

    // Handler for offline status
    const handleOffline = () => {
      if (isOnline) {
        setIsOnline(false);
        setWasOffline(true);
        setSince(new Date());
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);

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
          // Check if the effective type is 2G or 3G (slow connections)
          const isSlowType = connection.effectiveType === '2g' || connection.effectiveType === '3g';
          
          // Check if the downlink is less than 1Mbps
          const isSlowSpeed = connection.downlink < 1;

          // Respect user preference for reduced data usage
          const isSaveData = connection.saveData === true;

          setIsSlowConnection(isSlowType || isSlowSpeed || isSaveData);
        }
      }
    };

    // Initial check
    checkConnectionSpeed();

    // Add event listener for connection changes if available
    if ('connection' in navigator && (navigator as any).connection) {
      const connection = (navigator as any).connection;
      if (typeof connection.addEventListener === 'function') {
        connection.addEventListener('change', checkConnectionSpeed);

        // Remove event listener on cleanup
        return () => {
          if (typeof connection.removeEventListener === 'function') {
            connection.removeEventListener('change', checkConnectionSpeed);
          }
        };
      }
    }
  }, []);

  return isSlowConnection;
}

export default useNetworkStatus;