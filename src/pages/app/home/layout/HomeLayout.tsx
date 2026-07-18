import { Flex, Box, useDisclosure } from '@chakra-ui/react';
import { Outlet } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileDrawer } from './MobileDrawer';

export function HomeLayout() {
  const { open, onOpen, onClose } = useDisclosure();
  const isDrawerOpen = open;

  return (
    <Flex h='100vh' w='100vw' overflow='hidden' bg='gray.50'>
      <Box display={{ base: 'none', md: 'block' }} h='full'>
        <Sidebar />
      </Box>

      {/* For Mobile responsive  */}
      <MobileDrawer
        open={isDrawerOpen}
        onOpenChange={(e) => (e.open ? onOpen() : onClose())}
        onClose={onClose}
      />

      <Flex flex='1' direction='column' overflow='hidden'>
        <Topbar onOpen={onOpen} />
        <Box flex='1' p={{ base: '2', md: '4' }} overflowY='auto'>
          <Box
            maxW='7xl'
            mx='auto'
            bg='white'
            p={{ base: '4', md: '6' }}
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
