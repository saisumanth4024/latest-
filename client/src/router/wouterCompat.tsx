import React from 'react';
import {
  BrowserRouter,
  Routes as RRRoutes,
  Route as RRRoute,
  Navigate,
  useLocation as rrUseLocation,
  useNavigate,
  matchPath
} from 'react-router-dom';

export { BrowserRouter as Router, Navigate as Redirect };
export { Link } from 'react-router-dom';
export { useParams } from 'react-router-dom';

export function Switch({ children }: { children: React.ReactNode }) {
  return <RRRoutes>{children}</RRRoutes>;
}

interface RouteProps {
  path: string;
  component?: React.ComponentType<any>;
  children?: React.ReactNode;
  index?: boolean;
}

export function Route({ path, component: Component, children, index }: RouteProps) {
  const element = Component ? <Component /> : undefined;
  return (
    <RRRoute path={path} element={element} index={index}>
      {children}
    </RRRoute>
  );
}

export function useLocation(): [string, (to: string) => void] {
  const location = rrUseLocation();
  const navigate = useNavigate();
  return [location.pathname, (to: string) => navigate(to)];
}

export function useRoute(pattern: string): [boolean, any] {
  const location = rrUseLocation();
  const match = matchPath(pattern, location.pathname);
  return [match != null, match ? match.params : null];
}
