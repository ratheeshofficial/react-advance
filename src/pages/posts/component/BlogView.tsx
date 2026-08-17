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
import type { IBlock } from '../../../types/posts/block';
import BlockEditor from './block/BlockEditor';
import { postsRepository } from '../../../repositories/post.repositories';

import { showToast } from '../../../utils/toast.utils';
import { ErrorBoundary } from 'react-error-boundary';
import { EditorErrorFallback } from '../../../components/error/ErrorFallback';

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
  const [blocks, setBlocks] = useState<IBlock[]>(singlePost?.blocks || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track saved baseline using state adjusted during render
  const [savedState, setSavedState] = useState({
    postId: singlePost?.id,
    lastUpdated: singlePost?.lastUpdated,
    title: singlePost?.title || '',
    excerpt: singlePost?.excerpt || '',
    coverImage: singlePost?.cover_image || null,
    blocksJson: JSON.stringify(singlePost?.blocks || []),
  });

  // Adjust savedState during render when singlePost data loads or updates
  if (
    singlePost &&
    (singlePost.id !== savedState.postId ||
      singlePost.lastUpdated !== savedState.lastUpdated)
  ) {
    const postBlocks = singlePost.blocks || [];
    setSavedState({
      postId: singlePost.id,
      lastUpdated: singlePost.lastUpdated,
      title: singlePost.title || '',
      excerpt: singlePost.excerpt || '',
      coverImage: singlePost.cover_image || null,
      blocksJson: JSON.stringify(postBlocks),
    });
    setBlocks(postBlocks);
  }

  const hasChanges =
    title !== savedState.title ||
    excerpt !== savedState.excerpt ||
    coverImage !== savedState.coverImage ||
    JSON.stringify(blocks) !== savedState.blocksJson;

  async function saveDraft(showNotification = false) {
    if (!postId) return;
    try {
      const currentBlocksJson = JSON.stringify(blocks);
      const newLastUpdated = new Date().toISOString();
      const payload: IPost = {
        ...singlePost,
        title: title,
        excerpt: excerpt,
        blocks: blocks,
        status: singlePost?.status || 'Draft',
        lastUpdated: newLastUpdated,
        cover_image: coverImage as string,
      };

      setSavedState({
        postId: postId,
        lastUpdated: newLastUpdated,
        title: title,
        excerpt: excerpt,
        coverImage: coverImage,
        blocksJson: currentBlocksJson,
      });

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
    if (!singlePost || !hasChanges) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsAutoUpdating(true);
      await saveDraft();
      setTimeout(() => {
        setIsAutoUpdating(false);
      }, 1000);
    }, 1500);

    return () => clearTimeout(timer);
  }, [title, excerpt, coverImage, blocks, hasChanges]);

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
        bg='bg.surface'
        borderBottomWidth='1px'
        borderBottomStyle='solid'
        borderBottomColor='border.default'
        borderRadius='12px'
        mb='6'
        shadow='sm'
        position='sticky'
        top='0'
        zIndex={30}
      >
        <HStack gap='3.5' align='center'>
          <Flex
            w='32px'
            h='32px'
            borderRadius='8px'
            borderWidth='1px'
            borderStyle='solid'
            borderColor='border.default'
            bg='bg.surface'
            align='center'
            justify='center'
            color='text.secondary'
            cursor='pointer'
            transition='all 0.12s ease'
            _hover={{ bg: 'bg.subtle', color: 'text.primary' }}
            onClick={() => navigate({ to: '/' })}
          >
            <FiArrowLeft size={16} />
          </Flex>
          <HStack gap='2.5' align='center'>
            <Text
              fontFamily="'Fraunces', serif"
              fontWeight='600'
              fontSize='19px'
              color='text.primary'
            >
              Blog Editor
            </Text>
            <Box
              bg={
                isEditingMode ? 'accent.subtle' : 'status.published.subtle'
              }
              color={isEditingMode ? 'accent.fg' : 'status.published.fg'}
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
            color='text.muted'
          >
            <Box
              w='6px'
              h='6px'
              borderRadius='full'
              bg={isAutoUpdating ? 'stamp.fg' : 'status.published.fg'}
            />
            <Text>{isAutoUpdating ? 'Auto Saving...' : 'Saved to Cloud'}</Text>
          </HStack>

          <Button
            size='sm'
            variant='outline'
            borderColor='border.default'
            bg='bg.surface'
            color='text.secondary'
            fontFamily="'Inter', sans-serif"
            fontSize='13px'
            fontWeight='600'
            borderRadius='8px'
            px='3.5'
            py='2'
            _hover={{ bg: 'bg.subtle' }}
            onClick={() => setIsEditingMode((prev) => !prev)}
          >
            <FiEye size={14} style={{ marginRight: '5px' }} />
            {isEditingMode ? 'Preview' : 'Edit'}
          </Button>

          {/* <Button
            size='sm'
            bg='accent.solid'
            color='text.inverse'
            fontFamily="'Inter', sans-serif"
            fontSize='13px'
            fontWeight='600'
            borderRadius='8px'
            px='4'
            py='2'
            shadow='sm'
            _hover={{ bg: 'accent.hover' }}
            onClick={() => saveDraft(true)}
          >
            <FiCheck size={14} style={{ marginRight: '4px' }} />
            Save Draft
          </Button> */}
        </HStack>
      </Flex>

      {isLoadingPosts ? (
        <Box p='8' textAlign='center' color='text.muted'>
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
                  color='text.secondary'
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
                  borderBottomWidth='2px'
                  borderBottomStyle='solid'
                  borderBottomColor='border.default'
                  borderRadius='0'
                  bg='transparent'
                  fontFamily="'Fraunces', serif"
                  fontSize='28px'
                  fontWeight='600'
                  color='text.primary'
                  py='2'
                  px='1'
                  outline='none'
                  _focus={{ borderColor: 'accent.solid', boxShadow: 'none' }}
                  transition='border-color 0.15s ease'
                />
              </Box>

              {/* Excerpt Input */}
              <Box mt='2'>
                <Text
                  fontFamily="'Inter', sans-serif"
                  fontSize='12px'
                  fontWeight='700'
                  color='text.secondary'
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
                  borderWidth='1px'
                  borderStyle='solid'
                  borderColor='border.default'
                  borderRadius='9px'
                  bg='bg.muted'
                  fontFamily="'Inter', sans-serif"
                  fontSize='13.5px'
                  color='text.secondary'
                  p='3'
                  minH='60px'
                  outline='none'
                  _focus={{ borderColor: 'accent.solid', boxShadow: 'none' }}
                />
                <Text
                  fontFamily="'IBM Plex Mono', monospace"
                  fontSize='10.5px'
                  color='text.muted'
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
                  color='text.secondary'
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
                    borderWidth='2px'
                    borderStyle='dashed'
                    borderColor={isDragging ? 'accent.solid' : 'border.default'}
                    bg={isDragging ? 'accent.subtle' : 'bg.muted'}
                    borderRadius='12px'
                    p='6'
                    textAlign='center'
                    cursor='pointer'
                    transition='all 0.15s ease'
                    _hover={{
                      borderColor: 'accent.solid',
                      bg: 'accent.subtle',
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
                        bg='accent.subtle'
                        color='accent.fg'
                        align='center'
                        justify='center'
                      >
                        <FiUploadCloud size={20} />
                      </Flex>
                      <Box>
                        <Text
                          fontWeight='600'
                          fontSize='13.5px'
                          color='text.secondary'
                        >
                          Click to upload{' '}
                          <Text as='span' fontWeight='400' color='text.muted'>
                            or drag and drop
                          </Text>
                        </Text>
                        <Text
                          fontFamily="'IBM Plex Mono', monospace"
                          fontSize='11px'
                          color='text.muted'
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
                    bg='bg.subtle'
                    shadow='sm'
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
                        bg='bg.overlay'
                        color='text.inverse'
                        backdropFilter='blur(6px)'
                        borderRadius='7px'
                        fontSize='12px'
                        fontWeight='600'
                        _hover={{ bg: 'bg.overlay' }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <FiRefreshCw size={12} style={{ marginRight: '4px' }} />
                        Change
                      </Button>
                      <Button
                        size='xs'
                        bg='danger.overlay'
                        color='text.inverse'
                        backdropFilter='blur(6px)'
                        borderRadius='7px'
                        fontSize='12px'
                        fontWeight='600'
                        _hover={{ bg: 'danger.overlay' }}
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
              bg='bg.surface'
              borderRadius='12px'
              shadow='sm'
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
                    bg='accent.subtle'
                    color='accent.fg'
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
                  <Text fontSize='13px' color='text.muted' fontWeight='500'>
                    By {singlePost.author}
                  </Text>
                )}
              </HStack>
              <Text
                fontFamily="'Fraunces', serif"
                fontSize='32px'
                fontWeight='600'
                color='text.primary'
                lineHeight='1.25'
              >
                {title || 'Untitled Article'}
              </Text>
              {excerpt && (
                <Text
                  fontSize='15px'
                  color='text.muted'
                  fontStyle='italic'
                  lineHeight='1.6'
                  borderLeftWidth='3px'
                  borderLeftStyle='solid'
                  borderLeftColor='accent.solid'
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
            initialBlocks={singlePost?.blocks}
            onChangeBlocks={setBlocks}
          />
        </Box>
      ) : (
        <Box p='8' textAlign='center' color='text.muted'>
          Post not found
        </Box>
      )}
    </Box>
  );
}

export function BlogViewWithErrorBoundary() {
  return (
    <ErrorBoundary FallbackComponent={EditorErrorFallback}>
      <BlogView />
    </ErrorBoundary>
  );
}

export default BlogViewWithErrorBoundary;
