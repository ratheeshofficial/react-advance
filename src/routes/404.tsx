import { createFileRoute } from '@tanstack/react-router';
import NotFoundPage from '../pages/app/not-found/NotFoundPage';

export const Route = createFileRoute('/404')({
  component: NotFoundPage,
});
