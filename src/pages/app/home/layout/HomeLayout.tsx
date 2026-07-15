import { Flex, Box } from '@chakra-ui/react';
import { Outlet } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function HomeLayout() {
  return (
    <Flex h='100vh' w='100vw' overflow='hidden' bg='gray.50'>
      <Sidebar />
      <Flex flex='1' direction='column' overflow='hidden'>
        <Topbar />
        <Box flex='1' p='4' overflowY='auto'>
          <Box
            maxW='7xl'
            mx='auto'
            bg='white'
            p='4'
            borderRadius='xl'
            // shadow='sm'
            minH='full'
            color='black'
          >
            <Outlet />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
