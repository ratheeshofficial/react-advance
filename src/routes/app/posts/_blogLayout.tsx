import { createFileRoute } from '@tanstack/react-router'
import BlogLayout from '../../../pages/posts/layout/BlogLayout'

export const Route = createFileRoute('/app/posts/_blogLayout')({
  component: BlogLayout,
})

