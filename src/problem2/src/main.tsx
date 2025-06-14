import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Toaster } from '@/components/ui/toaster.tsx';
import { ThemeProvider } from '@/contexts/theme-context.tsx';

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
    <Toaster />
  </StrictMode>,
);
