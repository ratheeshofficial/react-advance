import { Box, VStack, Heading, Flex, Text, CloseButton } from '@chakra-ui/react';
import { Link as RouterLink } from '@tanstack/react-router';
import { FiHome, FiInfo, FiServer } from 'react-icons/fi';

const navItems = [
  { name: 'Home', path: '/app/home', icon: FiHome },
  { name: 'About', path: '/app/home/about', icon: FiInfo },
  { name: 'Service', path: '/app/home/service', icon: FiServer },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <Box
      w={{ base: 'full', md: '260px' }}
      bg='bg.surface'
      p='6'
      borderRightWidth='1px'
      borderColor='border.default'
      h='100%'
      // boxShadow='sm'
      display='flex'
      flexDirection='column'
      zIndex='10'
    >
      <Flex align='center' justify='space-between' mb='8' px='2'>
        <Heading
          size='md'
          color='accent.fg'
          fontWeight='black'
          letterSpacing='tighter'
        >
          REACT
        </Heading>
        {onClose && <CloseButton color='text.muted' display={{ base: 'flex', md: 'none' }} onClick={onClose} />}
      </Flex>
      <VStack align='stretch' gap='2'>
        {navItems.map((item) => (
          <RouterLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            style={{
              display: 'block',
              textDecoration: 'none',
              borderRadius: '8px',
              color: 'var(--chakra-colors-text-muted)',
            }}
            activeProps={{
              style: {
                backgroundColor: 'var(--chakra-colors-accent-subtle)',
                color: 'var(--chakra-colors-accent-fg)',
              },
            }}
            activeOptions={{ exact: true }}
          >
            <Flex
              align='center'
              px='4'
              py='3'
              borderRadius='8px'
              cursor='pointer'
              color='inherit'
              _hover={{
                bg: 'bg.subtle',
              }}
              transition='all 0.2s'
            >
              <item.icon size={18} />
              <Text fontSize='sm' fontWeight='bold' ml='3'>
                {item.name}
              </Text>
            </Flex>
          </RouterLink>
        ))}
      </VStack>
    </Box>
  );
}
