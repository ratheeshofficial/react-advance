import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '../../../../pages/app/home/HomePage';

export const Route = createFileRoute('/app/home/_homeLayout/')({
  component: HomePage,
});
