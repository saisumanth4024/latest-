import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  container?: HTMLElement | null;
}

export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    return () => setMounted(false);
  }, []);
  
  // Default to document.body if no container is provided
  const targetContainer = container || document.body;
  
  return mounted && targetContainer
    ? createPortal(children, targetContainer)
    : null;
}

export default Portal;