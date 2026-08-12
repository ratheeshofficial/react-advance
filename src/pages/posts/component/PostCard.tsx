import { Box, Flex, Text, HStack, Image } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import type { IPost } from '../../../types/posts/posts';
import { formatDate } from '../../../utils/date.utils';
import { getInitials } from '../../../utils/common.utils';
import { useState } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';

const DEFAULT_COVER_IMAGE =
  'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=500&q=80';

const getStatusStyles = (status?: string) => {
  const s = (status || 'draft').toLowerCase();
  if (s === 'published') return { bg: 'var(--published-soft)', color: 'var(--published)' };
  if (s === 'in review' || s === 'review') return { bg: 'var(--review-soft)', color: 'var(--review)' };
  if (s === 'approved') return { bg: 'var(--approved-soft)', color: 'var(--approved)' };
  if (s === 'scheduled') return { bg: 'var(--scheduled-soft)', color: 'var(--scheduled)' };
  return { bg: 'var(--draft-soft)', color: 'var(--draft)' };
};

function PostCard({ post }: { post: IPost }) {
  const [imgSrc, setImgSrc] = useState(post.cover_image || DEFAULT_COVER_IMAGE);
  const statusStyle = getStatusStyles(post.status);

  // Format meta string e.g. UPDATED AUG 12 · PUBLISHED AUG 12
  const updatedDateStr = formatDate(post.lastUpdated).toUpperCase();
  const pubDateStr = post.publishDate ? formatDate(post.publishDate).toUpperCase() : '';
  const metaText =
    post.status === 'Published' && pubDateStr
      ? `UPDATED ${updatedDateStr} · PUBLISHED ${pubDateStr}`
      : post.status === 'Scheduled' && pubDateStr
      ? `UPDATED ${updatedDateStr} · SCHEDULED ${pubDateStr}`
      : `UPDATED ${updatedDateStr} · ${(post.status || 'DRAFT').toUpperCase()}`;

  return (
    <Link to='/app/posts/$postId' params={{ postId: String(post.id) }} style={{ textDecoration: 'none' }}>
      <Box
        role='group'
        bg='var(--paper-raised)'
        border='1px solid var(--rule)'
        borderRadius='var(--radius)'
        overflow='hidden'
        cursor='pointer'
        transition='transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease'
        _hover={{
          transform: 'translateY(-3px)',
          boxShadow: 'var(--shadow-lg)',
          borderColor: 'var(--rule)',
        }}
        h='full'
        display='flex'
        flexDirection='column'
      >
        {/* Aspect Ratio 16:10 Image Wrap */}
        <Box
          position='relative'
          w='100%'
          aspectRatio={16 / 10}
          overflow='hidden'
          bg='var(--rule-soft)'
        >
          <Image
            src={imgSrc}
            alt={post.title}
            w='100%'
            h='100%'
            objectFit='cover'
            display='block'
            transition='transform 0.3s ease'
            _groupHover={{ transform: 'scale(1.04)' }}
            onError={() => setImgSrc(DEFAULT_COVER_IMAGE)}
          />

          {/* Category Badge Overlay */}
          <Box
            position='absolute'
            top='10px'
            left='10px'
            bg='rgba(255,255,255,0.92)'
            px='9px'
            py='4px'
            borderRadius='5px'
            fontFamily="'IBM Plex Mono', monospace"
            fontSize='10px'
            fontWeight='600'
            letterSpacing='0.04em'
            color='var(--ink-soft)'
            backdropFilter='blur(4px)'
          >
            {(post.category || 'General').toUpperCase()}
          </Box>

          {/* Rotated Stamp Badge Overlay */}
          <HStack
            position='absolute'
            top='9px'
            right='9px'
            bg={statusStyle.bg}
            color={statusStyle.color}
            px='10px'
            py='4px'
            borderRadius='full'
            fontSize='10.5px'
            fontWeight='700'
            fontFamily="'Inter', sans-serif"
            letterSpacing='0.02em'
            shadow='0 1px 3px rgba(0,0,0,0.15)'
            transform='rotate(-2deg)'
            gap='5px'
          >
            <Box w='6px' h='6px' borderRadius='full' bg={statusStyle.color} />
            <Text>{post.status || 'Draft'}</Text>
          </HStack>
        </Box>

        {/* Card Body */}
        <Box p='14px 15px 15px' display='flex' flexDirection='column' flex={1}>
          <Text
            fontFamily="'Fraunces', serif"
            fontWeight='600'
            fontSize='16.5px'
            color='var(--ink)'
            lineHeight='1.3'
            mb='5px'
            lineClamp={2}
            _groupHover={{ color: 'var(--accent)' }}
            transition='color 0.15s ease'
          >
            {post.title || 'Untitled Post'}
          </Text>

          <Text
            fontSize='12.5px'
            color='var(--muted)'
            lineHeight='1.45'
            mb='12px'
            lineClamp={2}
          >
            {post.excerpt || 'No excerpt provided for this blog post.'}
          </Text>

          <Text
            fontFamily="'IBM Plex Mono', monospace"
            fontSize='10.5px'
            color='var(--muted-2)'
            mb='12px'
            mt='auto'
          >
            {metaText}
          </Text>

          {/* Card Footer */}
          <Flex
            align='center'
            justify='space-between'
            pt='12px'
            borderTop='1px solid var(--rule-soft)'
          >
            <HStack gap='7px' align='center'>
              <Flex
                w='22px'
                h='22px'
                borderRadius='full'
                bg='var(--accent-soft)'
                color='var(--accent)'
                fontSize='9.5px'
                fontWeight='700'
                fontFamily="'Inter', sans-serif"
                align='center'
                justify='center'
                flexShrink={0}
              >
                {getInitials(post.author || 'Admin')}
              </Flex>
              <Text fontSize='12px' fontWeight='600' color='var(--ink-soft)'>
                {post.author || 'Admin'}
              </Text>
            </HStack>

            <Flex
              w='22px'
              h='22px'
              borderRadius='5px'
              align='center'
              justify='center'
              color='var(--muted-2)'
              transition='all 0.12s ease'
              _hover={{ bg: 'var(--rule-soft)', color: 'var(--ink)' }}
            >
              <FiMoreHorizontal size={14} />
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Link>
  );
}

export default PostCard;

