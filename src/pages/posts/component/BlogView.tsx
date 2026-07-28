import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { usePosts } from '../../../hooks/usePosts';

function BlogView() {
  const navigate = useNavigate();
  const { postId } = useParams({ from: '/_layout/app/posts/$postId' });
  const { remove } = usePosts();

  function handleDelete() {
    remove(postId);
    navigate({
      to: '/',
    });
  }

  return (
    <Box
      p='6'
      bg='gray.50'
      borderRadius='md'
      border='1px dashed'
      borderColor='gray.300'
    >
      <Flex justifyContent='space-between'>
        <Text fontSize='xl' color='gray.700'>
          Currently editing:
        </Text>
        <Button colorScheme='red' size='sm' onClick={handleDelete}>
          Delete
        </Button>
      </Flex>

      <Text fontSize='2xl' fontWeight='bold' color='blue.600' mt='2'>
        {postId}
      </Text>
    </Box>
  );
}

export default BlogView;
