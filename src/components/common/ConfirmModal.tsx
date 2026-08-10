import { Dialog, Button, Text, HStack, Portal } from '@chakra-ui/react';
import type { IDialogProps } from '../../types/common';

export interface ConfirmModalProps extends IDialogProps {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColorScheme?: string;
  isLoading?: boolean;
  onConfirm: () => void;
}

export function ConfirmModal({
  open,
  onOpenChange,
  onClose,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColorScheme = 'red',
  isLoading = false,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} size='sm'>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius='xl' p='4'>
            <Dialog.Header>
              <Dialog.Title fontSize='md' fontWeight='bold' color='gray.800'>
                {title}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body py='2'>
              <Text fontSize='sm' color='gray.600'>
                {description}
              </Text>
            </Dialog.Body>
            <Dialog.Footer pt='4'>
              <HStack justify='flex-end' gap='3' w='100%'>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  onClick={onClose}
                  disabled={isLoading}
                >
                  {cancelText}
                </Button>
                <Button
                  type='button'
                  size='sm'
                  colorPalette={confirmColorScheme}
                  onClick={onConfirm}
                  disabled={isLoading}
                >
                  {confirmText}
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default ConfirmModal;
