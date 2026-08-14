/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { Box, Text } from '@chakra-ui/react';

const LazyBlogView = lazy(() => import('../../../../pages/posts/component/BlogView'));

function LazyEditorWrapper() {
  return (
    <Suspense
      fallback={
        <Box p='10' textAlign='center' color='var(--muted)'>
          <Text fontFamily="'IBM Plex Mono', monospace" fontSize='13px'>
            Loading editor workspace…
          </Text>
        </Box>
      }
    >
      <LazyBlogView />
    </Suspense>
  );
}

export const Route = createFileRoute('/_layout/app/posts/$postId')({
  component: LazyEditorWrapper,
});
