import { Drawer } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (e: { open: boolean }) => void;
  onClose: () => void;
}

export function MobileDrawer({ open, onOpenChange, onClose }: MobileDrawerProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} placement="start">
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content maxW="260px" p={0}>
          <Drawer.Body p={0}>
            <Sidebar onClose={onClose} />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
