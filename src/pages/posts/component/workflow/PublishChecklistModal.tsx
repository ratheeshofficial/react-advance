import {
  Dialog,
  Button,
  Text,
  HStack,
  VStack,
  Portal,
  Badge,
  Box,
} from '@chakra-ui/react';
import { FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import type { IPost } from '../../../../types/posts/posts';
import { validatePostForPublish } from '../../../../types/posts/workflow';

export interface PublishChecklistModalProps {
  open: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  onClose: () => void;
  post: Partial<IPost> | null;
  blocksCount?: number;
  onPublishNow?: () => void;
  onOpenScheduleModal?: () => void;
}

export function PublishChecklistModal({
  open,
  onOpenChange,
  onClose,
  post,
  blocksCount,
  onPublishNow,
  onOpenScheduleModal,
}: PublishChecklistModalProps) {
  const result = validatePostForPublish(post, blocksCount);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} size='md'>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius='xl' p='5' maxW='550px' bg='bg.surface' color='text.primary'>
            <Dialog.Header>
              <HStack justify='space-between' align='center'>
                <Dialog.Title fontSize='lg' fontWeight='bold' color='text.primary'>
                  Publish Readiness Checklist
                </Dialog.Title>
                <Badge
                  colorPalette={result.isValid ? 'green' : 'amber'}
                  variant='subtle'
                  size='lg'
                  px='3'
                  py='1'
                  borderRadius='full'
                >
                  {result.isValid ? 'Ready to Publish' : 'Action Required'}
                </Badge>
              </HStack>
            </Dialog.Header>

            <Dialog.Body py='4'>
              {/* Alert Warning Box if missing items exist */}
              {!result.isValid && (
                <Box
                  bg='stamp.subtle'
                  borderColor='stamp.fg'
                  borderWidth='1px'
                  borderRadius='lg'
                  p='4'
                  mb='5'
                >
                  <HStack gap='3' align='flex-start'>
                    <Box color='stamp.fg' fontSize='xl' pt='0.5'>
                      <FiAlertTriangle />
                    </Box>
                    <VStack align='start' gap='1'>
                      <Text fontWeight='bold' fontSize='sm' color='stamp.fg'>
                        {result.missingItems.length} missing requirement
                        {result.missingItems.length > 1 ? 's' : ''} for
                        publishing
                      </Text>
                      <Text fontSize='xs' color='stamp.fg'>
                        Please fill out all mandatory fields before publishing
                        or scheduling this post.
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              )}

              {/* Checklist Items */}
              <VStack align='stretch' gap='3'>
                {result.checks.map((check) => (
                  <HStack
                    key={check.id}
                    p='3'
                    borderRadius='md'
                    bg={check.passed ? 'bg.muted' : 'danger.subtle'}
                    borderWidth='1px'
                    borderColor={check.passed ? 'border.default' : 'danger.border'}
                    justify='space-between'
                    align='center'
                  >
                    <HStack gap='3'>
                      <Box
                        color={check.passed ? 'status.published.fg' : 'danger.fg'}
                        fontSize='lg'
                      >
                        {check.passed ? <FiCheckCircle /> : <FiXCircle />}
                      </Box>
                      <VStack align='start' gap='0'>
                        <Text
                          fontSize='sm'
                          fontWeight='semibold'
                          color={check.passed ? 'text.primary' : 'danger.fg'}
                        >
                          {check.label}
                        </Text>
                        {!check.passed && (
                          <Text fontSize='xs' color='danger.fg'>
                            {check.missingMessage}
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                    <Badge
                      colorPalette={check.passed ? 'green' : 'red'}
                      variant='solid'
                      size='sm'
                    >
                      {check.passed ? 'PASSED' : 'MISSING'}
                    </Badge>
                  </HStack>
                ))}
              </VStack>
            </Dialog.Body>

            <Dialog.Footer pt='4'>
              <HStack justify='flex-end' gap='3' w='100%'>
                <Button size='sm' variant='outline' onClick={onClose}>
                  Close
                </Button>
                {onOpenScheduleModal && (
                  <Button
                    size='sm'
                    variant='outline'
                    colorPalette='purple'
                    disabled={!result.isValid}
                    onClick={() => {
                      onClose();
                      onOpenScheduleModal();
                    }}
                  >
                    Schedule
                  </Button>
                )}
                {onPublishNow && (
                  <Button
                    size='sm'
                    colorPalette='green'
                    disabled={!result.isValid}
                    onClick={() => {
                      onClose();
                      onPublishNow();
                    }}
                  >
                    Publish Now
                  </Button>
                )}
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default PublishChecklistModal;
