import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation as rrUseLocation,
  useNavigate,
  matchPath,
  useParams
} from 'react-router-dom';

export { BrowserRouter as Router, Navigate as Redirect, Link, Route };
// Alias React Router's Routes as Switch for wouter compatibility
export { Routes as Switch } from 'react-router-dom';
export { useParams };

// Custom hooks to mimic wouter's return signatures
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
