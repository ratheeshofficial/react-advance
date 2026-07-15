function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role='alert' style={{ color: 'red', padding: '10px' }}>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      {/* 2. Provide a reset button to try recovering */}
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export default ErrorFallback;
