import { Button, Flex, Text, HStack, Box } from '@chakra-ui/react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { usePosts } from '../../../hooks/usePosts';
import type { IPost } from '../../../types/posts/posts';
import WorkflowActionsToolbar from '../component/workflow/WorkflowActionsToolbar';
import { FiPlus } from 'react-icons/fi';

export const Header = () => {
  const { create, singlePost } = usePosts();
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const postId = (params as { postId?: string }).postId;

  async function handleCreateBlog() {
    const randomId = crypto.randomUUID();
    const newPost: IPost = {
      id: randomId,
      title: 'Untitled',
      category: 'General',
      status: 'Draft',
      publishDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      author: 'Admin',
    };
    await create(newPost);
    navigate({ to: `/app/posts/$postId`, params: { postId: randomId } });
  }

  return (
    <Flex
      h='66px'
      bg='var(--paper-raised)'
      borderBottom='1px solid var(--rule)'
      color='var(--ink)'
      align='center'
      px={{ base: '4', md: '7' }}
      justify='space-between'
      gap='4'
      flexShrink={0}
      zIndex={40}
    >
      {/* Left Brand Identity */}
      <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
        <HStack gap='2.5' align='center' cursor='pointer'>
          <Box
            w='10px'
            h='10px'
            borderRadius='2px'
            bg='var(--stamp)'
            transform='rotate(45deg)'
          />
          <Text
            fontFamily="'Fraunces', serif"
            fontSize={{ base: 'lg', md: '21px' }}
            fontWeight='600'
            letterSpacing='0.01em'
            color='var(--ink)'
          >
            Editorial Desk
          </Text>
        </HStack>
      </Link>

      {/* Workflow State Machine Actions Toolbar when in Post Editor view */}
      {postId && singlePost && (
        <WorkflowActionsToolbar postId={postId} post={singlePost} />
      )}

      {/* Right Action: New Blog Button */}
      <Button
        size='sm'
        bg='var(--accent)'
        color='white'
        fontFamily="'Inter', sans-serif"
        fontWeight='600'
        fontSize='13.5px'
        px='4'
        py='2'
        borderRadius='8px'
        shadow='var(--shadow-sm)'
        transition='all 0.12s ease'
        _hover={{
          bg: '#4d3eb5',
          transform: 'translateY(-1px)',
          shadow: 'var(--shadow-md)',
        }}
        onClick={handleCreateBlog}
      >
        <FiPlus size={15} style={{ marginRight: '4px' }} />
        New Blog
      </Button>
    </Flex>
  );
};

