import { createFileRoute } from '@tanstack/react-router';
import BlogView from '../../../../pages/posts/component/BlogView';

export const Route = createFileRoute('/_layout/app/posts/$postId')({
  component: BlogView,
});
