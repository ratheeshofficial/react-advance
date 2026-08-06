import { useState } from 'react';
import {
  Dialog,
  Grid,
  Text,
  VStack,
  HStack,
  Box,
  Flex,
  Input,
  Badge,
  IconButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { LuSearch, LuX } from 'react-icons/lu';
import type { IDialogProps } from '../../../../types/common';
import type { BlockType, ColumnLayoutType } from '../../../../types/posts/block';
import { BLOCK_OPTIONS } from '../../../../constant/PostsConfigProps';
import ColumnLayoutPicker from './ColumnLayoutPicker';

interface AddBlockPickerProps extends IDialogProps {
  onSelectBlock?: (type: BlockType, columnLayout?: ColumnLayoutType) => void;
  allowColumnBlock?: boolean;
}

export function AddBlockPicker({
  open,
  onClose,
  onOpenChange,
  onSelectBlock,
  allowColumnBlock = true,
}: AddBlockPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    open: c_open,
    onClose: c_onClose,
    onOpen: c_onOpen,
  } = useDisclosure();

  const filteredOptions = BLOCK_OPTIONS.filter(
    (opt) =>
      (allowColumnBlock || opt.type !== 'column') &&
      (opt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.subtitle.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleSelect = (type: BlockType) => {
    if (type === 'column') {
      c_onOpen();
      return;
    }

    if (onSelectBlock) {
      onSelectBlock(type);
    }
    onClose();
  };

  const handleSelectColumnLayout = (layout: ColumnLayoutType) => {
    if (onSelectBlock) {
      onSelectBlock('column', layout);
    }
    c_onClose();
    onClose();
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange} size='lg'>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            borderRadius='2xl'
            overflow='hidden'
            boxShadow='2xl'
            border='1px solid'
            borderColor='gray.100'
          >
            {/* Custom Header */}
            <Box
              px='6'
              pt='5'
              pb='3'
              borderBottom='1px solid'
              borderColor='gray.100'
              bg='white'
            >
              <Flex justify='space-between' align='center'>
                <VStack align='start' gap='0'>
                  <Dialog.Title
                    fontSize='xl'
                    fontWeight='bold'
                    color='gray.800'
                  >
                    Add Block
                  </Dialog.Title>
                  <Text fontSize='xs' color='gray.500'>
                    Choose a block type to add content to your post
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

              {/* Search Bar */}
              <Box mt='4' position='relative'>
                <Box
                  position='absolute'
                  left='3'
                  top='2.5'
                  color='gray.400'
                  zIndex='1'
                >
                  <LuSearch />
                </Box>
                <Input
                  pl='9'
                  size='sm'
                  placeholder='Search blocks (e.g. Paragraph, Image, Code...)'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  borderRadius='xl'
                  bg='gray.50'
                  _focus={{ bg: 'white', borderColor: 'purple.500' }}
                />
              </Box>
            </Box>

            {/* Modal Body */}
            <Dialog.Body p='5' maxH='60vh' overflowY='auto' bg='gray.50/50'>
              {filteredOptions.length === 0 ? (
                <VStack py='8' gap='2' color='gray.500'>
                  <Text fontSize='sm'>
                    No blocks found matching "{searchTerm}"
                  </Text>
                  <Button
                    size='xs'
                    variant='subtle'
                    onClick={() => setSearchTerm('')}
                  >
                    Clear search
                  </Button>
                </VStack>
              ) : (
                <Grid
                  templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                  gap='3'
                >
                  {filteredOptions.map((opt) => {
                    const IconComp = opt.icon;
                    return (
                      <Box
                        key={opt.type}
                        as='button'
                        textAlign='left'
                        p='3.5'
                        bg='white'
                        borderRadius='xl'
                        borderWidth='1px'
                        borderColor='gray.200'
                        transition='all 0.2s ease-in-out'
                        cursor='pointer'
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: 'md',
                          borderColor: opt.color,
                        }}
                        onClick={() => handleSelect(opt.type)}
                        display='flex'
                        alignItems='center'
                        gap='3'
                      >
                        <Flex
                          w='10'
                          h='10'
                          borderRadius='xl'
                          bg={opt.bg}
                          color={opt.color}
                          align='center'
                          justify='center'
                          fontSize='lg'
                          flexShrink={0}
                        >
                          <IconComp />
                        </Flex>

                        <VStack
                          align='start'
                          gap='0.5'
                          flex='1'
                          overflow='hidden'
                        >
                          <HStack width='100%' justify='space-between'>
                            <Text
                              fontSize='sm'
                              fontWeight='bold'
                              color='gray.800'
                              lineClamp={1}
                            >
                              {opt.title}
                            </Text>
                            {opt.badge && (
                              <Badge
                                size='xs'
                                variant='subtle'
                                colorPalette='purple'
                              >
                                {opt.badge}
                              </Badge>
                            )}
                          </HStack>
                          <Text fontSize='xs' color='gray.500' lineClamp={1}>
                            {opt.subtitle}
                          </Text>
                        </VStack>
                      </Box>
                    );
                  })}
                </Grid>
              )}
            </Dialog.Body>

            {/* Footer */}
            <Dialog.Footer
              px='6'
              py='3'
              bg='white'
              borderTop='1px solid'
              borderColor='gray.100'
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
      <ColumnLayoutPicker
        open={c_open}
        onOpenChange={(e) => (e.open ? c_onOpen() : c_onClose())}
        onClose={c_onClose}
        onSelectLayout={handleSelectColumnLayout}
      />
    </>
  );
}

export default AddBlockPicker;

