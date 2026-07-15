import { Navigate, Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';

export function RootLayout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Outlet />
    </Suspense>
  );
}

export function NotFound() {
  return <Navigate to={'/404'} />;
}
