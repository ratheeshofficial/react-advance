import React, { useRef, memo } from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  VStack,
  Spinner,
  Badge,
  Link,
} from '@chakra-ui/react';
import {
  FiPaperclip,
  FiDownload,
  FiUploadCloud,
  FiAlertCircle,
  FiFileText,
} from 'react-icons/fi';
import { postsRepository } from '../../../../repositories/post.repositories';
import type { BaseBlockProps } from '../../../../types/posts/block';

export const AttachmentBlock = memo(function AttachmentBlock({
  block,
  onChange,
  isEditing = true,
}: BaseBlockProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onChange?.({
      ...block,
      attachmentName: file.name,
      attachmentSize: file.size,
      uploadStatus: 'uploading',
      uploadError: undefined,
    });

    try {
      const publicUrl = await postsRepository.uploadFile(
        'post-attachments',
        file,
      );
      onChange?.({
        ...block,
        attachmentUrl: publicUrl,
        attachmentName: file.name,
        attachmentSize: file.size,
        content: block.content || file.name,
        uploadStatus: 'completed',
      });
    } catch (err) {
      onChange?.({
        ...block,
        uploadStatus: 'error',
        uploadError: err instanceof Error ? err.message : 'File upload failed',
      });
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Box py='2'>
      <Box
        p='4'
        borderRadius='xl'
        borderWidth='1px'
        borderColor={block.uploadStatus === 'error' ? 'red.300' : 'gray.200'}
        bg={block.uploadStatus === 'error' ? 'red.50' : 'gray.50'}
        _dark={{
          bg: block.uploadStatus === 'error' ? 'red.900' : 'gray.800',
          borderColor: block.uploadStatus === 'error' ? 'red.700' : 'gray.700',
        }}
      >
        <VStack gap='3' align='stretch'>
          <input
            type='file'
            ref={fileInputRef}
            aria-label='File upload input'
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          {block.uploadStatus === 'completed' && block.attachmentUrl ? (
            <Flex
              justify='space-between'
              align='center'
              flexWrap='wrap'
              gap='3'
            >
              <Flex align='center' gap='3'>
                <Box p='2' bg='blue.500' color='white' borderRadius='lg'>
                  <FiPaperclip size={20} />
                </Box>
                <Box>
                  <Text fontWeight='semibold' fontSize='sm'>
                    {block.content || block.attachmentName || 'Download File'}
                  </Text>
                  <Flex align='center' gap='2' mt='0.5'>
                    {block.attachmentName && (
                      <Text fontSize='xs' color='gray.500'>
                        {block.attachmentName}
                      </Text>
                    )}
                    {block.attachmentSize && (
                      <Badge size='xs' variant='subtle' colorPalette='blue'>
                        {formatSize(block.attachmentSize)}
                      </Badge>
                    )}
                  </Flex>
                </Box>
              </Flex>

              <Link
                href={block.attachmentUrl}
                target='_blank'
                rel='noopener noreferrer'
                _hover={{ textDecoration: 'none' }}
              >
                <Button size='sm' colorPalette='blue'>
                  <FiDownload style={{ marginRight: '6px' }} /> Download
                </Button>
              </Link>
            </Flex>
          ) : block.uploadStatus === 'uploading' ? (
            <Flex align='center' gap='3' py='2'>
              <Spinner size='sm' color='blue.500' />
              <Box>
                <Text fontSize='sm' fontWeight='medium'>
                  Uploading {block.attachmentName || 'file'}...
                </Text>
                <Text fontSize='xs' color='gray.500'>
                  Please wait while attachment is uploaded to Supabase Storage
                </Text>
              </Box>
            </Flex>
          ) : (
            <Flex
              direction='column'
              align='center'
              justify='center'
              py='4'
              gap='3'
            >
              <Box p='3' borderRadius='full' bg='gray.100' color='gray.500'>
                <FiUploadCloud size={24} />
              </Box>
              <Box textAlign='center'>
                <Text fontSize='sm' fontWeight='medium'>
                  Upload file attachment
                </Text>
                <Text fontSize='xs' color='gray.500' mt='1'>
                  Upload documents, PDFs, or media to display a download block
                </Text>
              </Box>

              <Button
                size='sm'
                variant='outline'
                aria-label='Select file to upload'
                onClick={() => fileInputRef.current?.click()}
              >
                <FiFileText style={{ marginRight: '6px' }} /> Select File
              </Button>

              {block.uploadStatus === 'error' && (
                <Flex align='center' gap='2' color='red.600' mt='1'>
                  <FiAlertCircle size={16} />
                  <Text fontSize='xs'>
                    {block.uploadError || 'Upload failed. Please try again.'}
                  </Text>
                </Flex>
              )}
            </Flex>
          )}

          {isEditing && block.uploadStatus === 'completed' && (
            <Flex
              gap='2'
              align='center'
              pt='2'
              borderTopWidth='1px'
              borderColor='gray.200'
            >
              <Text fontSize='xs' color='gray.500' whiteSpace='nowrap'>
                Display Label:
              </Text>
              <Input
                size='xs'
                variant='subtle'
                aria-label='Display label for download link'
                value={block.content || ''}
                onChange={(e) =>
                  onChange?.({ ...block, content: e.target.value })
                }
                placeholder='Custom label for download link...'
                bg='white'
              />
              <Button
                size='xs'
                variant='ghost'
                aria-label='Re-upload file'
                onClick={() => fileInputRef.current?.click()}
              >
                Re-upload
              </Button>
            </Flex>
          )}
        </VStack>
      </Box>
    </Box>
  );
});

export default AttachmentBlock;
