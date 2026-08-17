import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuX, LuCheck } from 'react-icons/lu';
import { COLUMN_LAYOUT_OPTIONS } from '../../../../constant/PostsConfigProps';

export type ColumnLayoutType = '100' | '50-50' | '33-67' | '67-33';

export interface ColumnLayoutOption {
  id: ColumnLayoutType;
  title: string;
  subtitle: string;
  columns: number[]; // flex weights
}


interface ColumnLayoutPickerProps {
  open: boolean;
  onClose: () => void;
  onOpenChange: (e: { open: boolean }) => void;
  onSelectLayout?: (layout: ColumnLayoutType) => void;
}

function ColumnLayoutPicker({
  open,
  onClose,
  onOpenChange,
  onSelectLayout,
}: ColumnLayoutPickerProps) {
  const [selectedLayout, setSelectedLayout] = useState<ColumnLayoutType | null>(
    null,
  );

  const handleSelect = (layoutId: ColumnLayoutType) => {
    setSelectedLayout(layoutId);
    if (onSelectLayout) {
      onSelectLayout(layoutId);
    }
    onClose();
  };

  return (
    <Dialog.Root size='lg' open={open} onOpenChange={onOpenChange}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          borderRadius='2xl'
          overflow='hidden'
          boxShadow='2xl'
          border='1px solid'
          borderColor='border.subtle'
        >
          {/* Modal Header */}
          <Dialog.Header
            px='6'
            pt='5'
            pb='3'
            borderBottom='1px solid'
            borderColor='border.subtle'
            bg='bg.surface'
          >
            <Flex justify='space-between' align='center' w='100%'>
              <VStack align='start' gap='0' w='90%'>
                <Dialog.Title fontSize='xl' fontWeight='bold' color='text.primary'>
                  Choose Column Layout
                </Dialog.Title>
                <Text fontSize='xs' color='text.muted'>
                  Select a layout to structure your content
                </Text>
              </VStack>
              <IconButton
                aria-label='Close dialog'
                size='sm'
                variant='ghost'
                borderRadius='full'
                onClick={onClose}
              >
                <LuX />
              </IconButton>
            </Flex>
          </Dialog.Header>

          {/* Modal Body */}
          <Dialog.Body p='5' maxH='60vh' overflowY='auto' bg='bg.muted'>
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap='4'
            >
              {COLUMN_LAYOUT_OPTIONS.map((opt) => {
                const isSelected = selectedLayout === opt.id;
                return (
                  <Box
                    key={opt.id}
                    as='button'
                    textAlign='left'
                    p='4'
                    bg='bg.surface'
                    borderRadius='xl'
                    borderWidth='2px'
                    borderColor={isSelected ? 'accent.solid' : 'border.default'}
                    boxShadow={isSelected ? 'md' : 'sm'}
                    transition='all 0.2s ease-in-out'
                    cursor='pointer'
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                      borderColor: 'accent.hover',
                    }}
                    onClick={() => handleSelect(opt.id)}
                  >
                    {/* Visual Layout Representation */}
                    <Box
                      p='3'
                      bg='bg.muted'
                      borderRadius='lg'
                      borderWidth='1px'
                      borderColor='border.default'
                      mb='3'
                    >
                      <Flex gap='2' h='10' align='stretch'>
                        {opt.columns.map((weight, idx) => (
                          <Box
                            key={idx}
                            flex={weight}
                            bg={isSelected ? 'accent.subtle' : 'bg.subtle'}
                            borderWidth='1.5px'
                            borderStyle='dashed'
                            borderColor={
                              isSelected ? 'accent.solid' : 'accent.subtle'
                            }
                            borderRadius='md'
                            transition='all 0.2s'
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                          >
                            <Box
                              w={
                                weight === 1 && opt.columns.length === 1
                                  ? '40%'
                                  : '60%'
                              }
                              h='8px'
                              bg={isSelected ? 'accent.solid' : 'accent.subtle'}
                              borderRadius='full'
                              opacity={0.8}
                            />
                          </Box>
                        ))}
                      </Flex>
                    </Box>

                    {/* Content Details */}
                    <Flex justify='space-between' align='center'>
                      <VStack align='start' gap='0.5'>
                        <Text fontSize='sm' fontWeight='bold' color='text.primary'>
                          {opt.title}
                        </Text>
                        <Text fontSize='xs' color='text.muted'>
                          {opt.subtitle}
                        </Text>
                      </VStack>
                      {isSelected && (
                        <Flex
                          w='6'
                          h='6'
                          borderRadius='full'
                          bg='accent.solid'
                          color='text.inverse'
                          align='center'
                          justify='center'
                          fontSize='xs'
                          flexShrink={0}
                        >
                          <LuCheck />
                        </Flex>
                      )}
                    </Flex>
                  </Box>
                );
              })}
            </Grid>
          </Dialog.Body>

          {/* Footer */}
          <Dialog.Footer
            px='6'
            py='3'
            bg='bg.surface'
            borderTop='1px solid'
            borderColor='border.subtle'
          >
            <Button
              variant='outline'
              size='sm'
              onClick={onClose}
              borderRadius='lg'
            >
              Cancel
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

export default ColumnLayoutPicker;
