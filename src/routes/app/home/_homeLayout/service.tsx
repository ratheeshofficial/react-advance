import { createFileRoute } from '@tanstack/react-router';
import { ServicePage } from '../../../../pages/app/home/service/ServicePage';

export const Route = createFileRoute('/app/home/_homeLayout/service')({
  component: ServicePage,
});
