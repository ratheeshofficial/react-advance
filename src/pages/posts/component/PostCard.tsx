import { Box, Flex, Text, HStack, VStack } from '@chakra-ui/react';
import { FiClock, FiCalendar } from 'react-icons/fi';
import { Link } from '@tanstack/react-router';
import type { Post } from '../../../types/posts/posts';
import { getStatusColor } from '../../../constant/PostsConfigProps';
import { formatDate } from '../../../utils/date.utils';
import { getInitials } from '../../../utils/common.utils';

function PostCard({ post }: { post: Post }) {
  return (
    <Link to='/app/posts/$postId' params={{ postId: String(post.id) }}>
      <Flex
        direction='column'
        p='5'
        bg='white'
        borderRadius='xl'
        borderWidth='1px'
        borderColor='gray.100'
        boxShadow='sm'
        transition='all 0.3s ease'
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: 'md',
          borderColor: 'purple.200',
        }}
        gap='4'
        h='full'
      >
        <HStack justify='space-between'>
          <Box
            px='3'
            py='1'
            bg='purple.50'
            color='purple.600'
            borderRadius='full'
            fontSize='xs'
            fontWeight='bold'
            textTransform='uppercase'
          >
            {post.category}
          </Box>
          <HStack gap='1.5'>
            <Box
              w='2'
              h='2'
              borderRadius='full'
              bg={getStatusColor(post.status)}
            />
            <Text fontSize='xs' fontWeight='semibold' color='gray.600'>
              {post.status}
            </Text>
          </HStack>
        </HStack>

        <Text
          fontSize='lg'
          fontWeight='bold'
          color='gray.800'
          lineHeight='tight'
          lineClamp={2}
        >
          {post.title}
        </Text>

        <VStack align='start' gap='1' mt='auto'>
          <HStack color='gray.500' fontSize='xs'>
            <FiClock />
            <Text>Updated: {formatDate(post.lastUpdated)}</Text>
          </HStack>
          <HStack color='gray.500' fontSize='xs'>
            <FiCalendar />
            <Text>
              {post.status === 'Scheduled' ? 'Scheduled for ' : 'Published: '}
              {formatDate(post.publishDate)}
            </Text>
          </HStack>
        </VStack>

        <Box borderTopWidth='1px' borderColor='gray.100' pt='3' mt='2'>
          <HStack gap='3'>
            <Flex
              w='8'
              h='8'
              borderRadius='full'
              bg='linear-gradient(135deg, #a855f7, #3b82f6)'
              color='white'
              fontSize='xs'
              fontWeight='bold'
              align='center'
              justify='center'
              boxShadow='sm'
            >
              {getInitials(post.author)}
            </Flex>
            <Text fontSize='sm' fontWeight='medium' color='gray.700'>
              {post.author}
            </Text>
          </HStack>
        </Box>
      </Flex>
    </Link>
  );
}

export default PostCard;
