import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Text,
  Textarea,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { usePosts } from '../../../hooks/usePosts';
import { useState, useRef, useEffect } from 'react';
import {
  FiUploadCloud,
  FiTrash2,
  FiRefreshCw,
  FiArrowLeft,
  FiEye,
} from 'react-icons/fi';
import type { IPost } from '../../../types/posts/posts';
import BlockEditor from './block/BlockEditor';
import { postsRepository } from '../../../repositories/post.repositories';

import { showToast } from '../../../utils/toast.utils';

function BlogView() {
  const navigate = useNavigate();
  const { postId } = useParams({ from: '/_layout/app/posts/$postId' });
  const {
    getById,
    singlePost,
    update,
    isLoadingPosts,
    title,
    setTitle,
    excerpt,
    setExcerpt,
    coverImage,
    setCoverImage,
    isAutoUpdating,
    setIsAutoUpdating,
  } = usePosts();

  const [isEditingMode, setIsEditingMode] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSameValue =
    title === (singlePost?.title || '') &&
    excerpt === (singlePost?.excerpt || '') &&
    coverImage === (singlePost?.cover_image || '');

  async function saveDraft(showNotification = false) {
    if (!postId) return;
    try {
      const payload: IPost = {
        ...singlePost,
        title: title,
        excerpt: excerpt,
        status: singlePost?.status || 'Draft',
        lastUpdated: new Date().toISOString(),
        cover_image: coverImage as string,
      };
      await update(postId, payload);
      if (showNotification) {
        showToast.success(
          'Draft Saved',
          'Your post draft has been saved successfully.',
        );
      }
    } catch (err) {
      showToast.error('Save Failed', 'Failed to save post draft.');
      console.log('err', err);
    }
  }

  useEffect(() => {
    if (!singlePost || isSameValue) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsAutoUpdating(true);
      await saveDraft();
      setTimeout(() => {
        setIsAutoUpdating(false);
      }, 1000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, excerpt, coverImage]);

  useEffect(() => {
    if (postId) {
      getById(postId);
    }
  }, [postId]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const publicUrl = await postsRepository.uploadFile(
          'post-attachments',
          file,
        );
        setCoverImage(publicUrl);
      } catch (err) {
        console.error('Error uploading cover image to Supabase:', err);
      }
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const publicUrl = await postsRepository.uploadFile(
          'post-attachments',
          file,
        );
        setCoverImage(publicUrl);
      } catch (err) {
        console.error('Error uploading dropped cover image to Supabase:', err);
      }
    }
  };

  return (
    <Box pb='80px'>
      {/* Sticky Editor Header */}
      <Flex
        align='center'
        justify='space-between'
        py='3.5'
        px='5'
        bg='var(--paper-raised)'
        borderBottom='1px solid var(--rule)'
        borderRadius='12px'
        mb='6'
        shadow='var(--shadow-sm)'
        position='sticky'
        top='0'
        zIndex={30}
      >
        <HStack gap='3.5' align='center'>
          <Flex
            w='32px'
            h='32px'
            borderRadius='8px'
            border='1px solid var(--rule)'
            bg='var(--paper-raised)'
            align='center'
            justify='center'
            color='var(--ink-soft)'
            cursor='pointer'
            transition='all 0.12s ease'
            _hover={{ bg: 'var(--rule-soft)', color: 'var(--ink)' }}
            onClick={() => navigate({ to: '/' })}
          >
            <FiArrowLeft size={16} />
          </Flex>
          <HStack gap='2.5' align='center'>
            <Text
              fontFamily="'Fraunces', serif"
              fontWeight='600'
              fontSize='19px'
              color='var(--ink)'
            >
              Blog Editor
            </Text>
            <Box
              bg={
                isEditingMode ? 'var(--accent-soft)' : 'var(--published-soft)'
              }
              color={isEditingMode ? 'var(--accent)' : 'var(--published)'}
              fontSize='11px'
              fontWeight='700'
              px='2.5'
              py='1'
              borderRadius='full'
              letterSpacing='0.02em'
            >
              {isEditingMode ? 'Editor Mode' : 'Reader View'}
            </Box>
          </HStack>
        </HStack>

        <HStack gap='3' align='center'>
          <HStack
            gap='1.5'
            fontFamily="'IBM Plex Mono', monospace"
            fontSize='11.5px'
            color='var(--muted-2)'
          >
            <Box
              w='6px'
              h='6px'
              borderRadius='full'
              bg={isAutoUpdating ? 'var(--stamp)' : 'var(--published)'}
            />
            <Text>{isAutoUpdating ? 'Auto Saving...' : 'Saved to Cloud'}</Text>
          </HStack>

          <Button
            size='sm'
            variant='outline'
            borderColor='var(--rule)'
            bg='var(--paper-raised)'
            color='var(--ink-soft)'
            fontFamily="'Inter', sans-serif"
            fontSize='13px'
            fontWeight='600'
            borderRadius='8px'
            px='3.5'
            py='2'
            _hover={{ bg: 'var(--rule-soft)' }}
            onClick={() => setIsEditingMode((prev) => !prev)}
          >
            <FiEye size={14} style={{ marginRight: '5px' }} />
            {isEditingMode ? 'Preview' : 'Edit'}
          </Button>

          {/* <Button
            size='sm'
            bg='var(--accent)'
            color='white'
            fontFamily="'Inter', sans-serif"
            fontSize='13px'
            fontWeight='600'
            borderRadius='8px'
            px='4'
            py='2'
            shadow='var(--shadow-sm)'
            _hover={{ bg: '#4d3eb5' }}
            onClick={() => saveDraft(true)}
          >
            <FiCheck size={14} style={{ marginRight: '4px' }} />
            Save Draft
          </Button> */}
        </HStack>
      </Flex>

      {isLoadingPosts ? (
        <Box p='8' textAlign='center' color='var(--muted)'>
          <Text fontFamily="'IBM Plex Mono', monospace">
            Loading post content...
          </Text>
        </Box>
      ) : singlePost ? (
        <Box maxW='760px' mx='auto'>
          {isEditingMode ? (
            <VStack align='stretch' gap='5' mb='6'>
              {/* Title Input */}
              <Box>
                <Text
                  fontFamily="'Inter', sans-serif"
                  fontSize='12px'
                  fontWeight='700'
                  color='var(--ink-soft)'
                  textTransform='uppercase'
                  letterSpacing='0.05em'
                  mb='2'
                >
                  Title
                </Text>
                <Input
                  value={title}
                  placeholder='Enter title…'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTitle(e.target.value)
                  }
                  border='none'
                  borderBottom='2px solid var(--rule)'
                  borderRadius='0'
                  bg='transparent'
                  fontFamily="'Fraunces', serif"
                  fontSize='28px'
                  fontWeight='600'
                  color='var(--ink)'
                  py='2'
                  px='1'
                  outline='none'
                  _focus={{ borderColor: 'var(--accent)', boxShadow: 'none' }}
                  transition='border-color 0.15s ease'
                />
              </Box>

              {/* Excerpt Input */}
              <Box mt='2'>
                <Text
                  fontFamily="'Inter', sans-serif"
                  fontSize='12px'
                  fontWeight='700'
                  color='var(--ink-soft)'
                  textTransform='uppercase'
                  letterSpacing='0.05em'
                  mb='2'
                >
                  Excerpt
                </Text>
                <Textarea
                  value={excerpt}
                  placeholder='Write a one-sentence summary readers will see in previews…'
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setExcerpt(e.target.value)
                  }
                  border='1px solid var(--rule)'
                  borderRadius='9px'
                  bg='var(--paper-raised)'
                  fontFamily="'Inter', sans-serif"
                  fontSize='13.5px'
                  color='var(--ink-soft)'
                  p='3'
                  minH='60px'
                  outline='none'
                  _focus={{ borderColor: 'var(--accent)', boxShadow: 'none' }}
                />
                <Text
                  fontFamily="'IBM Plex Mono', monospace"
                  fontSize='10.5px'
                  color='var(--muted-2)'
                  textAlign='right'
                  mt='1.5'
                >
                  {excerpt.length} / 160
                </Text>
              </Box>

              {/* Cover Image Upload */}
              <Box>
                <Text
                  fontFamily="'Inter', sans-serif"
                  fontSize='12px'
                  fontWeight='700'
                  color='var(--ink-soft)'
                  textTransform='uppercase'
                  letterSpacing='0.05em'
                  mb='2'
                >
                  Cover Image
                </Text>

                <Input
                  type='file'
                  ref={fileInputRef}
                  accept='image/*'
                  display='none'
                  onChange={handleImageChange}
                />

                {!coverImage ? (
                  <Box
                    border='2px dashed var(--rule)'
                    borderColor={isDragging ? 'var(--accent)' : 'var(--rule)'}
                    bg={
                      isDragging ? 'var(--accent-soft)' : 'var(--paper-raised)'
                    }
                    borderRadius='12px'
                    p='6'
                    textAlign='center'
                    cursor='pointer'
                    transition='all 0.15s ease'
                    _hover={{
                      borderColor: 'var(--accent)',
                      bg: 'var(--accent-soft)',
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <VStack gap='2'>
                      <Flex
                        w='40px'
                        h='40px'
                        borderRadius='full'
                        bg='var(--accent-soft)'
                        color='var(--accent)'
                        align='center'
                        justify='center'
                      >
                        <FiUploadCloud size={20} />
                      </Flex>
                      <Box>
                        <Text
                          fontWeight='600'
                          fontSize='13.5px'
                          color='var(--ink-soft)'
                        >
                          Click to upload{' '}
                          <Text as='span' fontWeight='400' color='var(--muted)'>
                            or drag and drop
                          </Text>
                        </Text>
                        <Text
                          fontFamily="'IBM Plex Mono', monospace"
                          fontSize='11px'
                          color='var(--muted-2)'
                          mt='1'
                        >
                          SVG, PNG, JPG or GIF (max. 10MB)
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                ) : (
                  <Box
                    position='relative'
                    borderRadius='12px'
                    overflow='hidden'
                    aspectRatio={16 / 7}
                    bg='var(--rule-soft)'
                    shadow='var(--shadow-sm)'
                  >
                    <Image
                      src={coverImage}
                      alt='Cover preview'
                      w='100%'
                      h='100%'
                      objectFit='cover'
                    />
                    <HStack position='absolute' top='12px' right='12px' gap='2'>
                      <Button
                        size='xs'
                        bg='rgba(22,26,35,0.72)'
                        color='white'
                        backdropFilter='blur(6px)'
                        borderRadius='7px'
                        fontSize='12px'
                        fontWeight='600'
                        _hover={{ bg: 'rgba(22,26,35,0.85)' }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <FiRefreshCw size={12} style={{ marginRight: '4px' }} />
                        Change
                      </Button>
                      <Button
                        size='xs'
                        bg='rgba(196,40,40,0.85)'
                        color='white'
                        backdropFilter='blur(6px)'
                        borderRadius='7px'
                        fontSize='12px'
                        fontWeight='600'
                        _hover={{ bg: 'rgba(196,40,40,0.95)' }}
                        onClick={handleRemoveImage}
                      >
                        <FiTrash2 size={12} style={{ marginRight: '4px' }} />
                        Remove
                      </Button>
                    </HStack>
                  </Box>
                )}
              </Box>
            </VStack>
          ) : (
            /* Reader View Header */
            <VStack
              align='stretch'
              gap='4'
              mb='6'
              p='6'
              bg='var(--paper-raised)'
              borderRadius='12px'
              shadow='var(--shadow-sm)'
            >
              {coverImage && (
                <Box overflow='hidden' borderRadius='12px' aspectRatio={16 / 7}>
                  <Image
                    src={coverImage}
                    alt={title || 'Cover image'}
                    w='100%'
                    h='100%'
                    objectFit='cover'
                  />
                </Box>
              )}
              <HStack gap='2' flexWrap='wrap'>
                {singlePost.category && (
                  <Badge
                    bg='var(--accent-soft)'
                    color='var(--accent)'
                    borderRadius='5px'
                    px='2.5'
                    py='1'
                    fontFamily="'IBM Plex Mono', monospace"
                    fontSize='11px'
                    fontWeight='600'
                  >
                    {singlePost.category}
                  </Badge>
                )}
                {singlePost.author && (
                  <Text fontSize='13px' color='var(--muted)' fontWeight='500'>
                    By {singlePost.author}
                  </Text>
                )}
              </HStack>
              <Text
                fontFamily="'Fraunces', serif"
                fontSize='32px'
                fontWeight='600'
                color='var(--ink)'
                lineHeight='1.25'
              >
                {title || 'Untitled Article'}
              </Text>
              {excerpt && (
                <Text
                  fontSize='15px'
                  color='var(--muted)'
                  fontStyle='italic'
                  lineHeight='1.6'
                  borderLeft='3px solid var(--accent)'
                  pl='3'
                  py='1'
                >
                  {excerpt}
                </Text>
              )}
            </VStack>
          )}

          {/* Block Editor Component */}
          <BlockEditor
            isEditingMode={isEditingMode}
            onToggleEditingMode={() => setIsEditingMode((prev) => !prev)}
          />
        </Box>
      ) : (
        <Box p='8' textAlign='center' color='var(--muted)'>
          Post not found
        </Box>
      )}
    </Box>
  );
}

export default BlogView;
