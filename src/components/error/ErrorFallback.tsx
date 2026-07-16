import { type FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role='alert' style={{ color: 'red', padding: '10px' }}>
      <h2>Something went wrong:</h2>
      <pre>{(error as Error)?.message}</pre>
      {/* 2. Provide a reset button to try recovering */}
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export default ErrorFallback;
