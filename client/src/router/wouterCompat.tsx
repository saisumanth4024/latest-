import {
  BrowserRouter,
  Routes as RRRoutes,
  Route as RRRoute,
  Navigate,
  useLocation as rrUseLocation,
  useNavigate,
  matchPath,
  Link,
  useParams,
} from 'react-router-dom';

export { BrowserRouter as Router, Navigate as Redirect, Link, useParams };

export const Switch = RRRoutes;
export const Route = RRRoute;

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
