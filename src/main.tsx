import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from './components/ui/provider.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/error/ErrorFallback.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
  </StrictMode>,
);
