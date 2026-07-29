import { Box, Flex, Text, HStack, VStack, Image } from '@chakra-ui/react';
import { FiClock, FiCalendar } from 'react-icons/fi';
import { Link } from '@tanstack/react-router';
import type { IPost } from '../../../types/posts/posts';
import { getStatusColor } from '../../../constant/PostsConfigProps';
import { formatDate } from '../../../utils/date.utils';
import { getInitials } from '../../../utils/common.utils';
import { useState } from 'react';

const DEFAULT_COVER_IMAGE =
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80';

function PostCard({ post }: { post: IPost }) {
  const [imgSrc, setImgSrc] = useState(post.cover_image || DEFAULT_COVER_IMAGE);

  return (
    <Link to='/app/posts/$postId' params={{ postId: String(post.id) }}>
      <Flex
        role='group'
        direction='column'
        p='2'
        bg='white'
        borderRadius='2xl'
        borderWidth='1px'
        borderColor='gray.100'
        boxShadow='sm'
        transition='all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        _hover={{
          transform: 'translateY(-6px)',
          boxShadow: 'xl',
          borderColor: 'purple.200',
        }}
        gap='3'
        h='full'
        overflow='hidden'
      >
        {/* Cover Image Header */}
        <Box
          position='relative'
          w='100%'
          h='160px'
          borderRadius='xl'
          overflow='hidden'
          bg='gray.100'
        >
          <Image
            src={imgSrc}
            alt={post.title}
            w='100%'
            h='100%'
            objectFit='cover'
            transition='transform 0.4s ease'
            _groupHover={{ transform: 'scale(1.06)' }}
            onError={() => setImgSrc(DEFAULT_COVER_IMAGE)}
          />

          {/* Category Badge overlay */}
          <Box
            position='absolute'
            top='3'
            left='3'
            px='3'
            py='1'
            bg='whiteAlpha.900'
            backdropFilter='blur(8px)'
            color='purple.700'
            borderRadius='full'
            fontSize='xs'
            fontWeight='bold'
            textTransform='uppercase'
            boxShadow='sm'
          >
            {post.category || 'General'}
          </Box>

          {/* Status Badge overlay */}
          <HStack
            position='absolute'
            top='3'
            right='3'
            px='2.5'
            py='1'
            bg='whiteAlpha.900'
            backdropFilter='blur(8px)'
            borderRadius='full'
            gap='1.5'
            boxShadow='sm'
          >
            <Box
              w='2'
              h='2'
              borderRadius='full'
              bg={getStatusColor(post?.status ?? 'draft')}
            />
            <Text fontSize='xs' fontWeight='semibold' color='gray.700'>
              {post.status}
            </Text>
          </HStack>
        </Box>

        {/* Title & Excerpt */}
        <VStack align='start' gap='1.5' flex='1'>
          <Text
            fontSize='md'
            fontWeight='bold'
            color='gray.800'
            lineHeight='snug'
            lineClamp={2}
            _groupHover={{ color: 'purple.600' }}
            transition='color 0.2s ease'
          >
            {post.title}
          </Text>

          {post.excerpt && (
            <Text fontSize='xs' color='gray.500' lineClamp={2}>
              {post.excerpt}
            </Text>
          )}
        </VStack>

        {/* Dates Info */}
        <VStack align='start' gap='1' mt='auto' pt='2'>
          <HStack color='gray.400' fontSize='xs'>
            <FiClock />
            <Text>Updated: {formatDate(post.lastUpdated)}</Text>
          </HStack>
          <HStack color='gray.400' fontSize='xs'>
            <FiCalendar />
            <Text>
              {post.status === 'Scheduled' ? 'Scheduled for ' : 'Published: '}
              {formatDate(post.publishDate ?? '')}
            </Text>
          </HStack>
        </VStack>

        {/* Author Footer */}
        <Box borderTopWidth='1px' borderColor='gray.100' pt='3'>
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
              {getInitials(post.author ?? '')}
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
