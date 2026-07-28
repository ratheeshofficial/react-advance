import { Button, Flex, Text } from '@chakra-ui/react';
import { Link, useNavigate } from '@tanstack/react-router';
import { usePosts } from '../../../hooks/usePosts';
import type { IPost } from '../../../types/posts/posts';

export const Header = () => {
  const { create } = usePosts();
  const navigate = useNavigate();
  const navItems = [
    {
      name: 'Home',
      to: '/',
    },
  ];

  function handleCreateBlog() {
    const randomId = crypto.randomUUID();
    const newPost: IPost = {
      id: randomId,
      title: 'Untitled',
      category: '',
      status: 'Draft',
      publishDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      author: 'Admin',
    };
    create(newPost);
    navigate({ to: `/app/posts/$postId`, params: { postId: randomId } });
  }
  return (
    <Flex
      h='60px'
      bg='gray.900'
      color='white'
      borderBottom='1px solid'
      borderColor='gray.700'
      align='center'
      px='6'
      justify='space-between'
    >
      <Text fontSize='xl' fontWeight='bold' letterSpacing='tight'>
        Editorial Desk
      </Text>
      <Button
        size='sm'
        bg='purple.600'
        color='white'
        _hover={{ bg: 'purple.700' }}
        rounded={'full'}
        onClick={handleCreateBlog}
      >
        + New Blog
      </Button>
      <Flex gap='6' align='center'>
        {navItems.map((item, key) => (
          <Link key={`menu-${key + 1}`} to={item.to}>
            {item.name}
          </Link>
        ))}
      </Flex>
    </Flex>
  );
};
