import { Box, Flex, Input, Text, Image, VStack } from '@chakra-ui/react';
import { LuLink, LuImage } from 'react-icons/lu';
import { useState, memo } from 'react';
import type { BaseBlockProps } from '../../../../types/posts/block';

const DEFAULT_PLACEHOLDER =
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80';

export const ImageBlock = memo(function ImageBlock({
  block,
  onChange,
  isEditing = true,
}: BaseBlockProps) {
  const imgSrc = block.src || DEFAULT_PLACEHOLDER;
  const [imgError, setImgError] = useState(false);

  return (
    <Box py='1'>
      {isEditing ? (
        <Box
          borderRadius='xl'
          overflow='hidden'
          borderWidth='1px'
          borderColor='border.default'
          bg='bg.muted'
          p='3'
        >
          <VStack gap='3' align='stretch'>
            <Flex gap='2' align='center'>
              <Box color='accent.fg'>
                <LuLink />
              </Box>
              <Input
                size='sm'
                variant='subtle'
                aria-label='Image URL'
                value={block.src || ''}
                onChange={(e) => {
                  setImgError(false);
                  onChange?.({ ...block, src: e.target.value });
                }}
                placeholder='Paste Image URL (e.g., https://...)'
                bg='bg.surface'
                _focus={{ borderColor: 'accent.solid' }}
              />
            </Flex>

            {/* Alt Text Input (Required for accessibility and publishing) */}
            <Flex gap='2' align='center'>
              <Box color='accent.fg'>
                <LuImage />
              </Box>
              <Input
                size='sm'
                variant='subtle'
                aria-label='Image Alt Text (required for publishing)'
                value={block.altText || ''}
                onChange={(e) => onChange?.({ ...block, altText: e.target.value })}
                placeholder='Image Alt Text (required before publish)…'
                bg='bg.surface'
                _focus={{ borderColor: 'accent.solid' }}
              />
            </Flex>

            <Box
              position='relative'
              maxH='320px'
              borderRadius='lg'
              overflow='hidden'
              bg='bg.subtle'
              display='flex'
              justifyContent='center'
              alignItems='center'
            >
              <Image
                src={imgError ? DEFAULT_PLACEHOLDER : imgSrc}
                alt={block.altText || block.caption || 'Block image'}
                maxH='320px'
                w='100%'
                objectFit='cover'
                onError={() => setImgError(true)}
              />
            </Box>

            <Input
              size='xs'
              variant='subtle'
              aria-label='Image caption'
              value={block.caption || ''}
              onChange={(e) => onChange?.({ ...block, caption: e.target.value })}
              placeholder='Add image caption (optional)...'
              textAlign='center'
              bg='bg.surface'
            />
          </VStack>
        </Box>
      ) : (
        <VStack gap='2' align='center' w='100%'>
          <Image
            src={imgError ? DEFAULT_PLACEHOLDER : imgSrc}
            alt={block.altText || block.caption || 'Block image'}
            borderRadius='xl'
            maxH='420px'
            w='100%'
            objectFit='cover'
            boxShadow='sm'
            onError={() => setImgError(true)}
          />
          {block.caption && (
            <Text fontSize='sm' color='text.muted' fontStyle='italic' textAlign='center'>
              {block.caption}
            </Text>
          )}
        </VStack>
      )}
    </Box>
  );
});

export default ImageBlock;
