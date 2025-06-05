import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ThemeProvider } from '@/providers/ThemeProvider';
import App from './App';
import { Router } from '@/router/wouterCompat';
import './index.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router>
            <App />
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);