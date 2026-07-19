import { Box, VStack, Text } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';

export const BlogSidebar = () => {
  return (
    <Box w={{ base: '100%', md: '250px' }} bg='gray.50' color='black' borderRight={{ base: 'none', md: 'none' }} borderBottom={{ base: '1px solid', md: 'none' }} borderColor="gray.200" p="6" overflowY={{ base: 'visible', xl: 'auto' }}>
      <Text fontSize="sm" fontWeight="bold" color="gray.500" mb="4" textTransform="uppercase" letterSpacing="wider">
        Posts
      </Text>
      <VStack align="start" gap="3">
        <Link to="/app/posts/$postId" params={{ postId: '123' }} >
          Post 1
        </Link>
        <Link to="/app/posts/$postId" params={{ postId: 'react-guide' }} >
          React Guide
        </Link>
      </VStack>
    </Box>
  );
};
