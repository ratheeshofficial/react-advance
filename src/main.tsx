import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from './components/ui/provider.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/error/ErrorFallback.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            // Clear state, refetch data, or reset app state here
            console.log('Boundary reset triggered');
          }}
        >
          <App />
          {/* <TestCallback /> */}
        </ErrorBoundary>
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
);
