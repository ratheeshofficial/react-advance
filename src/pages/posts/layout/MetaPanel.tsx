import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import { hideScrollbarCss } from '../../../constant/styles';
import { usePosts } from '../../../hooks/usePosts';
import { useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { formatDate } from '../../../utils/date.utils';

export const MetaPanel = () => {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const postId = (params as { postId?: string }).postId;
  const {
    singlePost,
    getById,
    isLoadingPosts,
    isUpdatingPosts,
    title,
    handleSavePost,
    handleDeletePost,
  } = usePosts();

  useEffect(() => {
    if (postId) {
      getById(postId);
    }
  }, [postId]);

  const handleDelete = async () => {
    if (postId) {
      await handleDeletePost(postId, navigate);
    }
  };

  const handleSave = async () => {
    if (postId) {
      await handleSavePost(postId, navigate);
    }
  };

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
              Title
            </Text>
            <Text fontSize='sm' color='gray.800' fontWeight='medium' mt='1'>
              {title || singlePost?.title || 'N/A'}
            </Text>
          </Box>
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

          <HStack w='100%' pt='4' gap={3}>
            <Button
              flex={1}
              size='sm'
              bg='red.500'
              color='white'
              _hover={{ bg: 'red.600' }}
              onClick={handleDelete}
            >
              Delete Post
            </Button>
            <Button
              flex={1}
              size='sm'
              disabled={isUpdatingPosts}
              bg='green.500'
              color='white'
              _hover={{ bg: 'green.600' }}
              onClick={handleSave}
            >
              Save Post
            </Button>
          </HStack>
        </VStack>
      )}
    </Box>
  );
};
