import {
  Box,
  Button,
  Flex,
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
      const generatedSlug =
        singlePost.slug || slugify(singlePost.title || '', postId);

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
      // showToast.error(
      //   'Post Deleted',
      //   'The post has been deleted successfully.',
      // );
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
      showToast.success(
        'Post Saved',
        'Your metadata changes have been saved successfully.',
      );
    } else {
      showToast.error(
        'Save Failed',
        'Please fix the form errors before saving.',
      );
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
      bg='bg.surface'
      borderTop={{ base: '1px solid', xl: 'none' }}
      borderTopColor={{ base: 'border.default' }}
      borderLeft={{ base: 'none', xl: '1px solid' }}
      borderLeftColor={{ xl: 'border.default' }}
      p='5'
      css={hideScrollbarCss}
      flexShrink={0}
    >
      <Flex align='center' justify='space-between' mb='4.5'>
        <Text
          fontFamily="'Inter', sans-serif"
          fontWeight='700'
          fontSize='14px'
          color='text.primary'
        >
          Post Metadata
        </Text>
        {postId &&
          (isAutoUpdating ? (
            <Badge
              bg='accent.subtle'
              color='accent.fg'
              fontSize='10.5px'
              fontFamily="'IBM Plex Mono', monospace"
              px='2'
              py='0.5'
              borderRadius='5px'
            >
              Auto Saving...
            </Badge>
          ) : isContextDirty ? (
            <Badge
              bg='stamp.subtle'
              color='stamp.fg'
              fontSize='10.5px'
              fontFamily="'IBM Plex Mono', monospace"
              px='2'
              py='0.5'
              borderRadius='5px'
            >
              Unsaved
            </Badge>
          ) : (
            <Badge
              bg='status.published.subtle'
              color='status.published.fg'
              fontSize='10.5px'
              fontFamily="'IBM Plex Mono', monospace"
              px='2'
              py='0.5'
              borderRadius='5px'
            >
              Saved
            </Badge>
          ))}
      </Flex>

      {!postId ? (
        <Flex
          direction='column'
          align='center'
          textAlign='center'
          py='12'
          px='3'
          color='text.muted'
        >
          <Flex
            w='52px'
            h='52px'
            borderRadius='full'
            bg='bg.subtle'
            align='center'
            justify='center'
            color='text.muted'
            mb='4'
          >
            <svg
              width='22'
              height='22'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.8'
            >
              <path d='M9 12h6m-6 4h6M9 8h1M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z' />
            </svg>
          </Flex>
          <Text
            fontFamily="'Fraunces', serif"
            fontWeight='600'
            fontSize='15px'
            color='text.secondary'
            mb='1.5'
          >
            No post selected
          </Text>
          <Text
            fontSize='12.5px'
            lineHeight='1.5'
            color='text.muted'
            maxW='200px'
          >
            Choose a post from the list to view SEO settings, revision history,
            and publish details.
          </Text>
        </Flex>
      ) : isLoadingPosts ? (
        <Text
          fontSize='13px'
          color='text.muted'
          fontFamily="'IBM Plex Mono', monospace"
          py='4'
        >
          Loading post metadata...
        </Text>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack align='stretch' gap='4'>
            {/* Publishing Details */}
            <Box
              bg='bg.muted'
              p='4'
              borderRadius='9px'
              border='1px solid'
              borderColor='border.default'
              shadow='sm'
            >
              <Text
                fontFamily="'IBM Plex Mono', monospace"
                fontSize='10.5px'
                fontWeight='600'
                textTransform='uppercase'
                letterSpacing='0.08em'
                color='text.muted'
                mb='3'
              >
                Details
              </Text>

              <VStack align='stretch' gap='3'>
                {/* Author Field */}
                <Box>
                  <Text
                    fontSize='xs'
                    fontWeight='semibold'
                    color='text.secondary'
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
                    <Text fontSize='xs' color='danger.fg' mt='1'>
                      {errors.author.message}
                    </Text>
                  )}
                </Box>

                {/* Category Field */}
                <Box>
                  <Text
                    fontSize='xs'
                    fontWeight='semibold'
                    color='text.secondary'
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
                    <Text fontSize='xs' color='danger.fg' mt='1'>
                      {errors.category.message}
                    </Text>
                  )}
                </Box>

                {/* Slug Field */}
                <Box>
                  <Text
                    fontSize='xs'
                    fontWeight='semibold'
                    color='text.secondary'
                    mb='1'
                  >
                    URL Slug *
                  </Text>
                  <Flex
                    align='center'
                    borderRadius='md'
                    border='1px solid'
                    borderColor={errors.slug ? 'danger.fg' : 'border.default'}
                    overflow='hidden'
                  >
                    <Text
                      px='2.5'
                      py='1.5'
                      bg='bg.subtle'
                      fontSize='xs'
                      color='text.muted'
                      fontWeight='medium'
                      borderRight='1px solid'
                      borderColor='border.default'
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
                      color='danger.fg'
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
                  borderColor='border.subtle'
                >
                  <Box>
                    <Text fontSize='xs' color='text.muted'>
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
                    <Text fontSize='xs' color='text.muted'>
                      Last Updated
                    </Text>
                    <Text
                      fontSize='xs'
                      color='text.secondary'
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
              bg='bg.muted'
              p='4'
              borderRadius='9px'
              border='1px solid'
              borderColor='border.default'
              shadow='sm'
            >
              <Text
                fontFamily="'IBM Plex Mono', monospace"
                fontSize='10.5px'
                fontWeight='600'
                textTransform='uppercase'
                letterSpacing='0.08em'
                color='text.muted'
                mb='3'
              >
                Tags
              </Text>
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
                    borderRadius='7px'
                  />
                  <Button
                    size='sm'
                    bg='accent.solid'
                    color='text.inverse'
                    _hover={{ bg: 'accent.hover' }}
                    onClick={handleAddTag}
                    borderRadius='7px'
                  >
                    <FiPlus />
                  </Button>
                </HStack>

                {tagError && (
                  <Text fontSize='xs' color='danger.fg'>
                    {tagError}
                  </Text>
                )}

                <Flex wrap='wrap' gap='1.5' mt='2'>
                  {(getValues('tags') || []).map((tag) => (
                    <Badge
                      key={tag}
                      bg='accent.subtle'
                      color='accent.fg'
                      px='2.5'
                      py='1'
                      borderRadius='full'
                      display='inline-flex'
                      alignItems='center'
                      gap='1'
                      fontSize='11px'
                      fontFamily="'IBM Plex Mono', monospace"
                    >
                      {tag}
                      <IconButton
                        aria-label={`Remove tag ${tag}`}
                        size='2xs'
                        variant='ghost'
                        color='accent.fg'
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
                    <Text
                      fontSize='12px'
                      color='text.muted'
                      fontStyle='italic'
                    >
                      No tags added yet.
                    </Text>
                  )}
                </Flex>
              </VStack>
            </Box>

            {/* SEO Section */}
            <Box
              bg='bg.muted'
              p='4'
              borderRadius='9px'
              border='1px solid'
              borderColor='border.default'
              shadow='sm'
            >
              <Text
                fontFamily="'IBM Plex Mono', monospace"
                fontSize='10.5px'
                fontWeight='600'
                textTransform='uppercase'
                letterSpacing='0.08em'
                color='text.muted'
                mb='3'
              >
                SEO Settings
              </Text>
              <VStack align='stretch' gap='3'>
                {/* SEO Title */}
                <Box>
                  <Text
                    fontSize='12px'
                    fontWeight='600'
                    color='text.secondary'
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
                        borderRadius='7px'
                      />
                    )}
                  />
                </Box>

                {/* SEO Description with Character Counter */}
                <Box>
                  <Flex justify='space-between' align='center' mb='1'>
                    <Text
                      fontSize='12px'
                      fontWeight='600'
                      color='text.secondary'
                    >
                      SEO Description
                    </Text>
                    <Text
                      fontFamily="'IBM Plex Mono', monospace"
                      fontSize='10.5px'
                      fontWeight='500'
                      color={seoCharCount > 160 ? 'danger.fg' : 'text.muted'}
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
                        borderRadius='7px'
                      />
                    )}
                  />
                  <Flex align='center' justify='space-between' mt='1.5'>
                    <Badge
                      bg={
                        seoCharCount === 0
                          ? 'bg.subtle'
                          : seoCharCount <= 160
                            ? 'status.published.subtle'
                            : 'danger.subtle'
                      }
                      color={
                        seoCharCount === 0
                          ? 'text.muted'
                          : seoCharCount <= 160
                            ? 'status.published.fg'
                            : 'danger.fg'
                      }
                      fontSize='10px'
                      fontFamily="'IBM Plex Mono', monospace"
                      px='2'
                      py='0.5'
                      borderRadius='4px'
                    >
                      {seoBadgeInfo.label}
                    </Badge>
                  </Flex>
                </Box>
              </VStack>
            </Box>

            {/* Editorial Notes */}
            <Box
              bg='bg.muted'
              p='4'
              borderRadius='9px'
              border='1px solid'
              borderColor='border.default'
              shadow='sm'
            >
              <Text
                fontFamily="'IBM Plex Mono', monospace"
                fontSize='10.5px'
                fontWeight='600'
                textTransform='uppercase'
                letterSpacing='0.08em'
                color='text.muted'
                mb='3'
              >
                Editorial Notes
              </Text>
              <Controller
                name='editorialNotes'
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    size='sm'
                    rows={3}
                    placeholder='Internal editorial notes, review status, or comments...'
                    borderRadius='7px'
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
                bg='danger.subtle'
                color='danger.fg'
                border='1px solid'
                borderColor='danger.border'
                borderRadius='8px'
                fontSize='13px'
                fontWeight='600'
                _hover={{ bg: 'danger.border' }}
                onClick={handleDelete}
              >
                Delete Post
              </Button>
              <Button
                type='button'
                flex={1}
                size='sm'
                disabled={isLoadingPosts}
                bg='status.published.fg'
                color='text.inverse'
                borderRadius='8px'
                fontSize='13px'
                fontWeight='600'
                shadow='sm'
                _hover={{ bg: 'status.published.hover' }}
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
