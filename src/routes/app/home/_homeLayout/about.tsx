import { createFileRoute } from '@tanstack/react-router';
import { AboutPage } from '../../../../pages/app/home/about/AboutPage';

export const Route = createFileRoute('/app/home/_homeLayout/about')({
  component: AboutPage,
});
