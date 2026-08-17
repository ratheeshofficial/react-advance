import { Box, VStack, Text, Flex } from '@chakra-ui/react';
import { Link, useParams } from '@tanstack/react-router';
import { hideScrollbarCss } from '../../../constant/styles';
import { usePosts } from '../../../hooks/usePosts';
import { FiGrid } from 'react-icons/fi';

export const BlogSidebar = () => {
  const { posts } = usePosts();
  const params = useParams({ strict: false });
  const activePostId = (params as { postId?: string }).postId;

  return (
    <Box
      h={{ base: 'auto', xl: '100%' }}
      w={{ base: '100%', md: '220px' }}
      bg='bg.surface'
      color='text.primary'
      borderRight={{ base: 'none', md: '1px solid' }}
      borderRightColor={{ md: 'border.default' }}
      borderBottom={{ base: '1px solid', md: 'none' }}
      borderBottomColor={{ base: 'border.default' }}
      py='5'
      px='4'
      overflowY={{ base: 'visible', xl: 'auto' }}
      css={hideScrollbarCss}
      flexShrink={0}
    >
      {/* Posts Section */}
      <Box mb='6'>
        <Text
          fontFamily="'IBM Plex Mono', monospace"
          fontSize='10.5px'
          letterSpacing='0.08em'
          color='text.muted'
          textTransform='uppercase'
          fontWeight='500'
          mb='2.5'
          px='2'
        >
          Posts
        </Text>
        <VStack align='stretch' gap='1'>
          {posts && posts.length > 0 ? (
            posts.slice(0, 8).map((post) => {
              const isActive = activePostId === String(post.id);
              return (
                <Link
                  key={post.id}
                  to='/app/posts/$postId'
                  params={{ postId: String(post.id) }}
                  style={{ textDecoration: 'none' }}
                >
                  <Flex
                    align='center'
                    gap='2.5'
                    px='2.5'
                    py='2'
                    borderRadius='7px'
                    fontSize='13.5px'
                    fontWeight='500'
                    cursor='pointer'
                    transition='all 0.12s ease'
                    bg={isActive ? 'accent.subtle' : 'transparent'}
                    color={isActive ? 'accent.fg' : 'text.secondary'}
                    _hover={{
                      bg: isActive ? 'accent.subtle' : 'bg.subtle',
                    }}
                  >
                    <Box
                      w='6px'
                      h='6px'
                      borderRadius='full'
                      bg={isActive ? 'accent.solid' : 'text.muted'}
                      flexShrink={0}
                    />
                    <Text
                      overflow='hidden'
                      textOverflow='ellipsis'
                      whiteSpace='nowrap'
                      flex={1}
                    >
                      {post.title || 'Untitled'}
                    </Text>
                  </Flex>
                </Link>
              );
            })
          ) : (
            <Text
              fontSize='12px'
              color='text.muted'
              px='2'
              fontStyle='italic'
            >
              No posts created yet
            </Text>
          )}
        </VStack>
      </Box>

      {/* Divider */}
      <Box h='1px' bg='border.subtle' my='4' mx='2' />

      {/* Views Section */}
      <Box>
        <Text
          fontFamily="'IBM Plex Mono', monospace"
          fontSize='10.5px'
          letterSpacing='0.08em'
          color='text.muted'
          textTransform='uppercase'
          fontWeight='500'
          mb='2.5'
          px='2'
        >
          Views
        </Text>
        <VStack align='stretch' gap='1'>
          <Link to='/' style={{ textDecoration: 'none' }}>
            <Flex
              align='center'
              gap='2.5'
              px='2.5'
              py='2'
              borderRadius='7px'
              fontSize='13.5px'
              fontWeight='500'
              color='text.secondary'
              cursor='pointer'
              _hover={{ bg: 'bg.subtle' }}
            >
              <FiGrid size={14} color='currentColor' />
              <Text>All posts</Text>
            </Flex>
          </Link>
          {/* <Flex
            align='center'
            gap='2.5'
            px='2.5'
            py='2'
            borderRadius='7px'
            fontSize='13.5px'
            fontWeight='500'
            color='var(--ink-soft)'
            cursor='pointer'
            _hover={{ bg: 'var(--rule-soft)' }}
          >
            <FiClock size={14} color='var(--muted)' />
            <Text>Scheduled</Text>
          </Flex>
          <Flex
            align='center'
            gap='2.5'
            px='2.5'
            py='2'
            borderRadius='7px'
            fontSize='13.5px'
            fontWeight='500'
            color='var(--ink-soft)'
            cursor='pointer'
            _hover={{ bg: 'var(--rule-soft)' }}
          >
            <FiBarChart2 size={14} color='var(--muted)' />
            <Text>Analytics</Text>
          </Flex> */}
        </VStack>
      </Box>
    </Box>
  );
};
