import { createFileRoute } from '@tanstack/react-router'
import BlogLayout from '../pages/posts/layout/BlogLayout'

export const Route = createFileRoute('/')({
  component: BlogLayout,
})


