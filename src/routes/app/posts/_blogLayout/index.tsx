import { createFileRoute } from '@tanstack/react-router';
import BlogPost from '../../../../pages/posts/component/BlogPost';

export const Route = createFileRoute('/app/posts/_blogLayout/')({
  component: BlogPost,
});
