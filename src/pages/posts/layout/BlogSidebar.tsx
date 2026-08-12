import { Box, VStack, Text, Flex } from '@chakra-ui/react';
import { Link, useParams } from '@tanstack/react-router';
import { hideScrollbarCss } from '../../../constant/styles';
import { usePosts } from '../../../hooks/usePosts';
import { FiGrid, FiClock, FiBarChart2 } from 'react-icons/fi';

export const BlogSidebar = () => {
  const { posts } = usePosts();
  const params = useParams({ strict: false });
  const activePostId = (params as { postId?: string }).postId;

  return (
    <Box
      h={{ base: 'auto', xl: '100%' }}
      w={{ base: '100%', md: '220px' }}
      bg='var(--paper-raised)'
      color='var(--ink)'
      borderRight={{ base: 'none', md: '1px solid var(--rule)' }}
      borderBottom={{ base: '1px solid var(--rule)', md: 'none' }}
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
          color='var(--muted-2)'
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
                    bg={isActive ? 'var(--accent-soft)' : 'transparent'}
                    color={isActive ? 'var(--accent)' : 'var(--ink-soft)'}
                    _hover={{ bg: isActive ? 'var(--accent-soft)' : 'var(--rule-soft)' }}
                  >
                    <Box
                      w='6px'
                      h='6px'
                      borderRadius='full'
                      bg={isActive ? 'var(--accent)' : 'var(--muted-2)'}
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
            <Text fontSize='12px' color='var(--muted)' px='2' fontStyle='italic'>
              No posts created yet
            </Text>
          )}
        </VStack>
      </Box>

      {/* Divider */}
      <Box h='1px' bg='var(--rule-soft)' my='4' mx='2' />

      {/* Views Section */}
      <Box>
        <Text
          fontFamily="'IBM Plex Mono', monospace"
          fontSize='10.5px'
          letterSpacing='0.08em'
          color='var(--muted-2)'
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
              color='var(--ink-soft)'
              cursor='pointer'
              _hover={{ bg: 'var(--rule-soft)' }}
            >
              <FiGrid size={14} color='var(--muted)' />
              <Text>All posts</Text>
            </Flex>
          </Link>
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
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

