import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { hideScrollbarCss } from '../../../constant/styles';
import { usePosts } from '../../../hooks/usePosts';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { formatDate } from '../../../utils/date.utils';
import PrimarySelect from '../../../components/common/PrimarySelect';
import {
  mockPosts,
  metaPanelSchema,
  type MetaPanelFormValues,
} from '../../../constant/PostsConfigProps';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiPlus, FiX } from 'react-icons/fi';
import type { IPost } from '../../../types/posts/posts';
import { showToast } from '../../../utils/toast.utils';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { slugify } from '../../../utils/common.utils';

export const MetaPanel = () => {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const postId = (params as { postId?: string }).postId;

  const {
    posts,
    singlePost,
    getById,
    isLoadingPosts,
    isUpdatingPosts,
    title,
    excerpt,
    coverImage,
    update,
    handleDeletePost,
    isAutoUpdating,
    setIsAutoUpdating,
    isDirty: isContextDirty,
    setIsDirty: setIsContextDirty,
  } = usePosts();

  const [tagInput, setTagInput] = useState('');
  const [tagError, setTagError] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const schema = useMemo(() => metaPanelSchema(posts, postId), [posts, postId]);

  const defaultValues: MetaPanelFormValues = {
    author: '',
    category: '',
    slug: '',
    tags: [],
    seoTitle: '',
    seoDescription: '',
    editorialNotes: '',
  };

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    trigger,
    formState: { errors },
  } = useForm<MetaPanelFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const formValues = useWatch({ control });

  useEffect(() => {
    if (postId) {
      getById(postId);
    }
  }, [postId]);

  useEffect(() => {
    if (singlePost) {
      const generatedSlug = singlePost.slug || slugify(singlePost.title || '', postId);

      reset({
        author: singlePost.author || 'Admin',
        category: singlePost.category || 'General',
        slug: generatedSlug || `post-${postId}`,
        tags: singlePost.tags || [],
        seoTitle: singlePost.seoTitle || singlePost.title || '',
        seoDescription: singlePost.seoDescription || singlePost.excerpt || '',
        editorialNotes: singlePost.editorialNotes || '',
      });
    }
  }, [singlePost, postId, reset]);

  const authorOptions = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.author) set.add(p.author);
    });
    mockPosts.forEach((p) => {
      if (p.author) set.add(p.author);
    });
    return Array.from(set).map((a) => ({ label: a, value: a }));
  }, [posts]);

  const categoryOptions = useMemo(() => {
    const set = new Set<string>([
      'Technology',
      'Engineering',
      'Design',
      'AI',
      'Architecture',
    ]);
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).map((c) => ({ label: c, value: c }));
  }, [posts]);

  useEffect(() => {
    if (!singlePost || !postId) return;

    const isChanged =
      (formValues.author ?? '') !== (singlePost.author || '') ||
      (formValues.category ?? '') !== (singlePost.category || '') ||
      (formValues.slug ?? '') !== (singlePost.slug || '') ||
      JSON.stringify(formValues.tags || []) !==
        JSON.stringify(singlePost.tags || []) ||
      (formValues.seoTitle ?? '') !== (singlePost.seoTitle || '') ||
      (formValues.seoDescription ?? '') !== (singlePost.seoDescription || '') ||
      (formValues.editorialNotes ?? '') !== (singlePost.editorialNotes || '');

    if (!isChanged) return;

    setIsContextDirty(true);

    const timer = setTimeout(async () => {
      const isValid = await trigger();
      if (isValid) {
        setIsAutoUpdating(true);
        const updatedPayload: IPost = {
          ...singlePost,
          author: formValues.author,
          category: formValues.category,
          slug: formValues.slug,
          tags: formValues.tags,
          seoTitle: formValues.seoTitle,
          seoDescription: formValues.seoDescription,
          editorialNotes: formValues.editorialNotes,
          title: title || singlePost.title,
          excerpt: excerpt || singlePost.excerpt,
          cover_image: (coverImage ?? singlePost.cover_image) as string,
          lastUpdated: new Date().toISOString(),
        };
        await update(postId, updatedPayload);
        setIsContextDirty(false);
        setTimeout(() => {
          setIsAutoUpdating(false);
        }, 1000);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    formValues,
    singlePost,
    postId,
    title,
    excerpt,
    coverImage,
    trigger,
    update,
    setIsAutoUpdating,
    setIsContextDirty,
  ]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    const currentTags = getValues('tags') || [];
    const exists = currentTags.some(
      (t) => t.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) {
      setTagError('Tag already added');
      return;
    }
    setTagError('');
    setValue('tags', [...currentTags, trimmed], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setTagInput('');
  };

  const handleKeyDownTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = getValues('tags') || [];
    setValue(
      'tags',
      currentTags.filter((t) => t !== tagToRemove),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const onSubmit = async (data: MetaPanelFormValues) => {
    if (!postId) return;
    const payload: IPost = {
      ...(singlePost || {}),
      ...data,
      id: postId,
      title: title || singlePost?.title || 'Untitled',
      excerpt: excerpt || singlePost?.excerpt,
      cover_image: (coverImage ?? singlePost?.cover_image) as string,
      status: singlePost?.status || 'Draft',
      lastUpdated: new Date().toISOString(),
    } as IPost;

    await update(postId, payload);
    setIsContextDirty(false);
  };

  const handleDelete = () => {
    if (postId) {
      setIsDeleteConfirmOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleteConfirmOpen(false);
    if (postId) {
      await handleDeletePost(postId, navigate);
      showToast.error('Post Deleted', 'The post has been deleted successfully.');
    }
  };

  const handleManualSave = async () => {
    if (!postId) return;
    const currentValues = getValues();
    if (!currentValues.author) setValue('author', 'Admin');
    if (!currentValues.category) setValue('category', 'General');
    if (!currentValues.slug) {
      const generatedSlug = slugify(singlePost?.title || '', postId);
      setValue('slug', generatedSlug);
    }
    const isValid = await trigger();
    if (isValid) {
      const data = getValues();
      await onSubmit(data);
      showToast.success('Post Saved', 'Your metadata changes have been saved successfully.');
    } else {
      showToast.error('Save Failed', 'Please fix the form errors before saving.');
    }
  };

  const seoDesc = formValues.seoDescription || '';
  const seoCharCount = seoDesc.length;

  const getSeoBadge = (count: number) => {
    if (count === 0)
      return { label: 'Empty (150-160 recommended)', color: 'gray' };
    if (count < 120)
      return { label: 'Too Short (150-160 recommended)', color: 'orange' };
    if (count <= 160) return { label: 'Optimal length', color: 'green' };
    return { label: 'Too Long (>160 limit)', color: 'red' };
  };

  const seoBadgeInfo = getSeoBadge(seoCharCount);

  return (
    <Box
      h={{ base: 'auto', xl: '100%' }}
      overflowY={{ base: 'visible', xl: 'auto' }}
      w={{ base: '100%', xl: '340px' }}
      bg='gray.50'
      borderTop={{ base: '1px solid', xl: 'none' }}
      borderLeft={{ base: 'none', xl: '1px solid' }}
      borderColor='gray.200'
      p='5'
      css={hideScrollbarCss}
    >
      <Flex align='center' justify='space-between' mb='4'>
        <Heading size='md' color='gray.800'>
          Post Metadata
        </Heading>
        {isAutoUpdating ? (
          <Badge colorPalette='blue' variant='subtle'>
            Auto Saving...
          </Badge>
        ) : isContextDirty ? (
          <Badge colorPalette='amber' variant='subtle'>
            Unsaved Changes
          </Badge>
        ) : (
          <Badge colorPalette='green' variant='subtle'>
            Saved
          </Badge>
        )}
      </Flex>

      {!postId ? (
        <Text fontSize='sm' color='gray.500'>
          Select a post to view details and SEO settings.
        </Text>
      ) : isLoadingPosts ? (
        <Text fontSize='sm' color='gray.500'>
          Loading post metadata...
        </Text>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack align='stretch' gap='5'>
            {/* Publishing Details */}
            <Box
              bg='white'
              p='4'
              borderRadius='md'
              border='1px solid'
              borderColor='gray.200'
            >
              <Heading
                size='xs'
                textTransform='uppercase'
                color='gray.500'
                mb='3'
              >
                Details
              </Heading>

              <VStack align='stretch' gap='3'>
                {/* Author Field */}
                <Box>
                  <Text
                    fontSize='xs'
                    fontWeight='semibold'
                    color='gray.700'
                    mb='1'
                  >
                    Author *
                  </Text>
                  <Controller
                    name='author'
                    control={control}
                    render={({ field }) => (
                      <PrimarySelect
                        options={authorOptions}
                        value={field.value}
                        onChange={(opt) => field.onChange(opt ? opt.value : '')}
                        placeholder='Select Author'
                      />
                    )}
                  />
                  {errors.author && (
                    <Text fontSize='xs' color='red.500' mt='1'>
                      {errors.author.message}
                    </Text>
                  )}
                </Box>

                {/* Category Field */}
                <Box>
                  <Text
                    fontSize='xs'
                    fontWeight='semibold'
                    color='gray.700'
                    mb='1'
                  >
                    Category *
                  </Text>
                  <Controller
                    name='category'
                    control={control}
                    render={({ field }) => (
                      <PrimarySelect
                        options={categoryOptions}
                        value={field.value}
                        onChange={(opt) => field.onChange(opt ? opt.value : '')}
                        placeholder='Select Category'
                      />
                    )}
                  />
                  {errors.category && (
                    <Text fontSize='xs' color='red.500' mt='1'>
                      {errors.category.message}
                    </Text>
                  )}
                </Box>

                {/* Slug Field */}
                <Box>
                  <Text
                    fontSize='xs'
                    fontWeight='semibold'
                    color='gray.700'
                    mb='1'
                  >
                    URL Slug *
                  </Text>
                  <Flex
                    align='center'
                    borderRadius='md'
                    border='1px solid'
                    borderColor={errors.slug ? 'red.400' : 'gray.300'}
                    overflow='hidden'
                  >
                    <Text
                      px='2.5'
                      py='1.5'
                      bg='gray.100'
                      fontSize='xs'
                      color='gray.600'
                      fontWeight='medium'
                      borderRight='1px solid'
                      borderColor='gray.300'
                    >
                      /blog/
                    </Text>
                    <Controller
                      name='slug'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          border='none'
                          outline='none'
                          _focus={{ outline: 'none', boxShadow: 'none' }}
                          size='sm'
                          placeholder='my-post-slug'
                        />
                      )}
                    />
                  </Flex>
                  {errors.slug && (
                    <Text
                      fontSize='xs'
                      color='red.500'
                      mt='1'
                      fontWeight='medium'
                    >
                      {errors.slug.message}
                    </Text>
                  )}
                </Box>

                {/* Status & Last Updated Info */}
                <HStack
                  justify='space-between'
                  pt='2'
                  borderTop='1px dashed'
                  borderColor='gray.200'
                >
                  <Box>
                    <Text fontSize='xs' color='gray.500'>
                      Status
                    </Text>
                    <Badge
                      colorPalette={
                        singlePost?.status === 'Published' ? 'green' : 'gray'
                      }
                      mt='0.5'
                    >
                      {singlePost?.status || 'Draft'}
                    </Badge>
                  </Box>
                  <Box textAlign='right'>
                    <Text fontSize='xs' color='gray.500'>
                      Last Updated
                    </Text>
                    <Text
                      fontSize='xs'
                      color='gray.700'
                      fontWeight='medium'
                      mt='0.5'
                    >
                      {formatDate(singlePost?.lastUpdated ?? '')}
                    </Text>
                  </Box>
                </HStack>
              </VStack>
            </Box>

            {/* Tags Section */}
            <Box
              bg='white'
              p='4'
              borderRadius='md'
              border='1px solid'
              borderColor='gray.200'
            >
              <Heading
                size='xs'
                textTransform='uppercase'
                color='gray.500'
                mb='3'
              >
                Tags
              </Heading>
              <VStack align='stretch' gap='2'>
                <HStack gap='2'>
                  <Input
                    size='sm'
                    placeholder='Add a tag...'
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                      if (tagError) setTagError('');
                    }}
                    onKeyDown={handleKeyDownTag}
                  />
                  <Button
                    size='sm'
                    colorPalette='purple'
                    variant='solid'
                    onClick={handleAddTag}
                  >
                    <FiPlus />
                  </Button>
                </HStack>

                {tagError && (
                  <Text fontSize='xs' color='red.500'>
                    {tagError}
                  </Text>
                )}

                <Flex wrap='wrap' gap='1.5' mt='2'>
                  {(getValues('tags') || []).map((tag) => (
                    <Badge
                      key={tag}
                      colorPalette='purple'
                      variant='subtle'
                      px='2'
                      py='1'
                      borderRadius='full'
                      display='inline-flex'
                      alignItems='center'
                      gap='1'
                    >
                      {tag}
                      <IconButton
                        aria-label={`Remove tag ${tag}`}
                        size='2xs'
                        variant='ghost'
                        colorPalette='purple'
                        minW='auto'
                        h='auto'
                        p='0'
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <FiX size={12} />
                      </IconButton>
                    </Badge>
                  ))}
                  {(getValues('tags') || []).length === 0 && (
                    <Text fontSize='xs' color='gray.400' fontStyle='italic'>
                      No tags added yet.
                    </Text>
                  )}
                </Flex>
              </VStack>
            </Box>

            {/* SEO Section */}
            <Box
              bg='white'
              p='4'
              borderRadius='md'
              border='1px solid'
              borderColor='gray.200'
            >
              <Heading
                size='xs'
                textTransform='uppercase'
                color='gray.500'
                mb='3'
              >
                SEO Settings
              </Heading>
              <VStack align='stretch' gap='3'>
                {/* SEO Title */}
                <Box>
                  <Text
                    fontSize='xs'
                    fontWeight='semibold'
                    color='gray.700'
                    mb='1'
                  >
                    SEO Title
                  </Text>
                  <Controller
                    name='seoTitle'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        size='sm'
                        placeholder='Custom SEO Title'
                      />
                    )}
                  />
                </Box>

                {/* SEO Description with Character Counter */}
                <Box>
                  <Flex justify='space-between' align='center' mb='1'>
                    <Text fontSize='xs' fontWeight='semibold' color='gray.700'>
                      SEO Description
                    </Text>
                    <Text
                      fontSize='xs'
                      fontWeight='semibold'
                      color={seoCharCount > 160 ? 'red.500' : 'gray.500'}
                    >
                      {seoCharCount} / 160 chars
                    </Text>
                  </Flex>
                  <Controller
                    name='seoDescription'
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        size='sm'
                        rows={3}
                        placeholder='Enter meta description for search engines...'
                      />
                    )}
                  />
                  <Flex align='center' justify='space-between' mt='1.5'>
                    <Badge
                      colorPalette={seoBadgeInfo.color}
                      variant='subtle'
                      fontSize='2xs'
                    >
                      {seoBadgeInfo.label}
                    </Badge>
                  </Flex>
                </Box>
              </VStack>
            </Box>

            {/* Editorial Notes */}
            <Box
              bg='white'
              p='4'
              borderRadius='md'
              border='1px solid'
              borderColor='gray.200'
            >
              <Heading
                size='xs'
                textTransform='uppercase'
                color='gray.500'
                mb='3'
              >
                Editorial Notes
              </Heading>
              <Controller
                name='editorialNotes'
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    size='sm'
                    rows={3}
                    placeholder='Internal editorial notes, review status, or comments...'
                  />
                )}
              />
            </Box>

            {/* Action Buttons */}
            <HStack gap='3' pt='2'>
              <Button
                type='button'
                flex={1}
                size='sm'
                colorPalette='red'
                variant='outline'
                onClick={handleDelete}
              >
                Delete Post
              </Button>
              <Button
                type='button'
                flex={1}
                size='sm'
                disabled={isUpdatingPosts}
                colorPalette='green'
                variant='solid'
                onClick={handleManualSave}
              >
                Save Post
              </Button>
            </HStack>
          </VStack>
        </form>
      )}

      <ConfirmModal
        open={isDeleteConfirmOpen}
        onOpenChange={(e) => setIsDeleteConfirmOpen(e.open)}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title='Delete Post?'
        description='Are you sure you want to delete this post? This action cannot be undone.'
        confirmText='Delete'
        cancelText='Cancel'
        confirmColorScheme='red'
      />
    </Box>
  );
};
