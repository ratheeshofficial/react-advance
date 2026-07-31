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
} from '@chakra-ui/react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { usePosts } from '../../../hooks/usePosts';
import PrimaryInput from '../../../components/common/PrimaryInput';
import { useState, useRef, useEffect } from 'react';
import { FiUploadCloud, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';
import type { IPost } from '../../../types/posts/posts';
import BlockEditor from './block/BlockEditor';

function BlogView() {
  const navigate = useNavigate();
  const { postId } = useParams({ from: '/_layout/app/posts/$postId' });
  const {
    remove,
    getById,
    singlePost,
    update,
    isUpdatingPosts,
    isLoadingPosts,
  } = usePosts();

  const [title, setTitle] = useState(singlePost?.title || '');
  const [excerpt, setExcerpt] = useState(singlePost?.excerpt || '');
  const [coverImage, setCoverImage] = useState<string | null>(
    singlePost?.cover_image || '',
  );
  const [isAutoUpdating, setIsAutoUpdating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSameValue =
    title === (singlePost?.title || '') &&
    excerpt === (singlePost?.excerpt || '') &&
    coverImage === (singlePost?.cover_image || '');

  async function saveDraft() {
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
    async function loadPost() {
      const result = await getById(postId);
      setTitle(result?.title || '');
      setExcerpt(result?.excerpt || '');
      setCoverImage(result?.cover_image || '');
    }
    loadPost();
  }, [postId]);

  function handleDelete() {
    remove(postId);
    navigate({
      to: '/',
    });
  }

  function handleSave() {
    const payload: IPost = {
      ...singlePost,
      title: title,
      excerpt: excerpt,
      status: 'Published',
      lastUpdated: new Date().toISOString(),
      cover_image: coverImage as string,
    };
    update(postId, payload);
    navigate({
      to: '/',
    });
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
    }
  };

  return (
    <>
      <Flex mb='2'>
        <Flex flex={1} gap={2}>
          <Icon
            as={IoIosArrowBack}
            fontSize='2xl'
            cursor='pointer'
            onClick={() => navigate({ to: '/' })}
          />
          <Text fontSize='lg' fontWeight='bold' mb='4' color='gray.800'>
            Blog Editor
          </Text>
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
          p='6'
          bg='gray.50'
          borderRadius='md'
          border='1px dashed'
          borderColor='gray.300'
        >
          <Text my='2'>Title</Text>
          <PrimaryInput
            placeholder='Enter Title'
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />

          <Text mt='4' mb='2'>
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
                  <Text fontWeight='semibold' fontSize='sm' color='gray.700'>
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

          <BlockEditor />

          <Flex justify='flex-end' mt='6' gap={3}>
            <Button
              bg='red.500'
              color='white'
              _hover={{ bg: 'red.600' }}
              onClick={handleDelete}
            >
              Delete Post
            </Button>
            <Button
              disabled={isUpdatingPosts}
              bg='green.500'
              color='white'
              _hover={{ bg: 'green.600' }}
              onClick={handleSave}
            >
              Save Post
            </Button>
          </Flex>
        </Box>
      ) : (
        <Box>Post not found</Box>
      )}
    </>
  );
}

export default BlogView;
