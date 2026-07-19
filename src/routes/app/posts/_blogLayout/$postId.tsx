import { createFileRoute } from '@tanstack/react-router'
import BlogView from '../../../../pages/posts/component/BlogView'

export const Route = createFileRoute('/app/posts/_blogLayout/$postId')({
  component: BlogView,
})


