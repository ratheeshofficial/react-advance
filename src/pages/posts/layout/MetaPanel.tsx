import { Box, Text, VStack } from '@chakra-ui/react';
import { hideScrollbarCss } from '../../../constant/styles';
import { usePosts } from '../../../hooks/usePosts';
import { useEffect } from 'react';
import { useParams } from '@tanstack/react-router';
import { formatDate } from '../../../utils/date.utils';

export const MetaPanel = () => {
  const params = useParams({ strict: false });
  const postId = (params as { postId?: string }).postId;
  const { singlePost, getById, isLoadingPosts } = usePosts();

  useEffect(() => {
    if (postId) {
      getById(postId);
    }
  }, [postId]);

  return (
    <Box
      h={{ base: 'auto', xl: '100%' }}
      overflowY={{ base: 'visible', xl: 'auto' }}
      w={{ base: '100%', xl: '300px' }}
      bg='gray.50'
      // borderLeft={{ base: 'none', xl: '1px solid' }}
      borderTop={{ base: '1px solid', xl: 'none' }}
      borderColor='gray.200'
      p='6'
      css={hideScrollbarCss}
    >
      <Text fontSize='lg' fontWeight='bold' mb='4' color='gray.800'>
        Meta Panel
      </Text>

      {!postId ? (
        <Text fontSize='sm' color='gray.500'>
          Select a post from the list to view its publishing details.
        </Text>
      ) : isLoadingPosts ? (
        <Text fontSize='sm' color='gray.500'>
          Loading post details...
        </Text>
      ) : (
        <VStack align='start' gap='4'>
          <Box>
            <Text fontSize='sm' fontWeight='semibold' color='gray.600'>
              Updated On
            </Text>
            <Text fontSize='sm' color='gray.500' mt='1'>
              {formatDate(singlePost?.lastUpdated ?? '') || 'N/A'}
            </Text>
          </Box>
          <Box>
            <Text fontSize='sm' fontWeight='semibold' color='gray.600'>
              Published On
            </Text>
            <Text fontSize='sm' color='gray.500' mt='1'>
              {formatDate(singlePost?.publishDate ?? '') || 'N/A'}
            </Text>
          </Box>
          <Box>
            <Text fontSize='sm' fontWeight='semibold' color='gray.600'>
              Status
            </Text>
            <Text fontSize='sm' color='gray.500' mt='1'>
              {singlePost?.status || 'N/A'}
            </Text>
          </Box>
          <Box>
            <Text fontSize='sm' fontWeight='semibold' color='gray.600'>
              Author
            </Text>
            <Text fontSize='sm' color='gray.500' mt='1'>
              {singlePost?.author || 'N/A'}
            </Text>
          </Box>
        </VStack>
      )}
    </Box>
  );
};
