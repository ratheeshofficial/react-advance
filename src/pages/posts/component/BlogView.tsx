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
  Icon,
  Heading,
  Badge,
} from '@chakra-ui/react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { usePosts } from '../../../hooks/usePosts';
import PrimaryInput from '../../../components/common/PrimaryInput';
import { useState, useRef, useEffect } from 'react';
import { FiUploadCloud, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';
import type { IPost } from '../../../types/posts/posts';
import BlockEditor from './block/BlockEditor';
import { postsRepository } from '../../../repositories/post.repositories';

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

  async function saveDraft() {
    if (!postId) return;
    const payload: IPost = {
      ...singlePost,
      title: title,
      excerpt: excerpt,
      status: 'Draft',
      lastUpdated: new Date().toISOString(),
      cover_image: coverImage as string,
    };
    await update(postId, payload);
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
        console.log('publicUrl', publicUrl);
        setCoverImage(publicUrl);
      } catch (err) {
        console.log('err', err);
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
    <>
      <Flex mb='2'>
        <Flex flex={1} gap={2} align='center'>
          <Icon
            as={IoIosArrowBack}
            fontSize='2xl'
            cursor='pointer'
            onClick={() => navigate({ to: '/' })}
          />
          <Text fontSize='lg' fontWeight='bold' color='gray.800'>
            {isEditingMode ? 'Blog Editor' : 'Reader View Preview'}
          </Text>
          <Badge
            size='sm'
            variant='subtle'
            colorPalette={isEditingMode ? 'purple' : 'green'}
            ml='2'
          >
            {isEditingMode ? 'Editor Mode' : 'Reader View'}
          </Badge>
        </Flex>
        <Box>
          <Text fontSize='xs' fontWeight='medium' color='gray.500'>
            {isAutoUpdating && 'Auto Saving...'}
          </Text>
        </Box>
      </Flex>
      {isLoadingPosts ? (
        <Box p='6'>
          <Text color='gray.500'>Loading post...</Text>
        </Box>
      ) : singlePost ? (
        <Box
          p={{ base: '4', md: '6' }}
          bg={isEditingMode ? 'gray.50' : 'white'}
          borderRadius='xl'
          borderWidth={isEditingMode ? '1px' : '0px'}
          borderStyle={isEditingMode ? 'dashed' : 'none'}
          borderColor='gray.300'
        >
          {isEditingMode ? (
            <>
              <Text my='2' fontWeight='medium' color='gray.700'>
                Title
              </Text>
              <PrimaryInput
                placeholder='Enter Title'
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
              />

              <Text mt='4' mb='2' fontWeight='medium' color='gray.700'>
                Excerpt
              </Text>
              <Textarea
                placeholder='Enter Excerpt'
                value={excerpt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setExcerpt(e.target.value)
                }
              />

              <Text mt='4' mb='2' fontWeight='medium' color='gray.700'>
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
                  border='2px dashed'
                  borderColor={isDragging ? 'purple.500' : 'gray.300'}
                  bg={isDragging ? 'purple.50' : 'white'}
                  borderRadius='xl'
                  p='6'
                  textAlign='center'
                  cursor='pointer'
                  transition='all 0.2s ease-in-out'
                  _hover={{ borderColor: 'purple.400', bg: 'purple.50' }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <VStack gap='2'>
                    <Box
                      p='3'
                      borderRadius='full'
                      bg='purple.50'
                      color='purple.600'
                      fontSize='xl'
                    >
                      <FiUploadCloud size={24} />
                    </Box>
                    <Box>
                      <Text
                        fontWeight='semibold'
                        fontSize='sm'
                        color='gray.700'
                      >
                        Click to upload{' '}
                        <Text as='span' fontWeight='normal' color='gray.500'>
                          or drag and drop
                        </Text>
                      </Text>
                      <Text fontSize='xs' color='gray.400' mt='1'>
                        SVG, PNG, JPG or GIF (max. 10MB)
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              ) : (
                <Box
                  position='relative'
                  borderRadius='xl'
                  overflow='hidden'
                  borderWidth='1px'
                  borderColor='gray.200'
                  bg='white'
                  shadow='sm'
                >
                  <Image
                    src={coverImage}
                    alt='Cover preview'
                    w='100%'
                    h='200px'
                    objectFit='cover'
                  />
                  <HStack
                    position='absolute'
                    top='3'
                    right='3'
                    gap='2'
                    bg='blackAlpha.600'
                    backdropFilter='blur(8px)'
                    p='1.5'
                    borderRadius='lg'
                  >
                    <Button
                      size='xs'
                      variant='ghost'
                      color='white'
                      _hover={{ bg: 'whiteAlpha.300' }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FiRefreshCw />
                      Change
                    </Button>
                    <Button
                      size='xs'
                      bg='red.500'
                      color='white'
                      _hover={{ bg: 'red.600' }}
                      onClick={handleRemoveImage}
                    >
                      <FiTrash2 />
                      Remove
                    </Button>
                  </HStack>
                </Box>
              )}
            </>
          ) : (
            /* Reader View Header */
            <VStack align='stretch' gap='4' mb='6'>
              {coverImage && (
                <Box
                  overflow='hidden'
                  borderRadius='2xl'
                  boxShadow='md'
                  maxH='380px'
                >
                  <Image
                    src={coverImage}
                    alt={title || 'Cover image'}
                    w='100%'
                    maxH='380px'
                    objectFit='cover'
                  />
                </Box>
              )}
              <HStack gap='2' flexWrap='wrap'>
                {singlePost.category && (
                  <Badge
                    size='sm'
                    colorPalette='purple'
                    variant='solid'
                    borderRadius='full'
                    px='3'
                  >
                    {singlePost.category}
                  </Badge>
                )}
                {singlePost.author && (
                  <Text fontSize='xs' color='gray.500' fontWeight='medium'>
                    By {singlePost.author}
                  </Text>
                )}
              </HStack>
              <Heading
                as='h1'
                size='2xl'
                fontWeight='extrabold'
                color='gray.900'
                lineHeight='tight'
              >
                {title || 'Untitled Article'}
              </Heading>
              {excerpt && (
                <Text
                  fontSize='lg'
                  color='gray.600'
                  fontStyle='italic'
                  lineHeight='relaxed'
                  borderLeft='3px solid'
                  borderColor='purple.300'
                  pl='3'
                  py='0.5'
                >
                  {excerpt}
                </Text>
              )}
            </VStack>
          )}

          <BlockEditor
            isEditingMode={isEditingMode}
            onToggleEditingMode={() => setIsEditingMode((prev) => !prev)}
          />
        </Box>
      ) : (
        <Box>Post not found</Box>
      )}
    </>
  );
}

export default BlogView;
