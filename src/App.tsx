import { lazy, Suspense } from 'react';

const Index = lazy(() => import('./Index.tsx'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Index />
    </Suspense>
  );
}

export default App;
