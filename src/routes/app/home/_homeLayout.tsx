import { createFileRoute } from '@tanstack/react-router';
import { HomeLayout } from '../../../pages/app/home/layout/HomeLayout';

export const Route = createFileRoute('/app/home/_homeLayout')({
  component: HomeLayout,
});
