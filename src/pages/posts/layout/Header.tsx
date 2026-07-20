import { Flex, Text } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';

export const Header = () => {
  const navItems = [
    {
      name: 'Posts',
      to: '/app/posts',
    },
  ];
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
