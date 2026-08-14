import {
  Box,
  Button,
  Flex,
  Input,
  SimpleGrid,
  Text,
  HStack,
} from '@chakra-ui/react';
import PostCard from './PostCard';
import { SORTBY } from '../../../constant/PostsConfigProps';
import { useEffect, useState, useMemo } from 'react';
import useDebounce from '../../../hooks/useDebounce';
import PrimarySelect from '../../../components/common/PrimarySelect';
import { usePosts } from '../../../hooks/usePosts';
import { FiSearch } from 'react-icons/fi';
import { ErrorBoundary } from 'react-error-boundary';
import { ListingErrorFallback } from '../../../components/error/ErrorFallback';

const STATUS_TABS = [
  { name: 'All', color: '' },
  { name: 'Draft', color: 'var(--draft)' },
  { name: 'In review', color: 'var(--review)' },
  { name: 'Approved', color: 'var(--approved)' },
  { name: 'Scheduled', color: 'var(--scheduled)' },
  { name: 'Published', color: 'var(--published)' },
];

function BlogPost() {
  const { list, posts, isLoadingPosts: isPostsLoading } = usePosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortValue, setSortValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');

  const uniqueAuthors = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.author) set.add(p.author);
    });
    return Array.from(set);
  }, [posts]);

  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [posts]);

  const categoryList = useMemo(() => {
    return uniqueCategories.map((c) => ({
      label: c,
      value: c,
    }));
  }, [uniqueCategories]);

  const authorList = useMemo(() => {
    return uniqueAuthors.map((a) => ({
      label: a,
      value: a,
    }));
  }, [uniqueAuthors]);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const isSearching = searchQuery !== debouncedSearchQuery;
  const isLoading = isPostsLoading || isSearching;

  useEffect(() => {
    list();
  }, []);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: posts.length,
      Draft: 0,
      'In review': 0,
      Approved: 0,
      Scheduled: 0,
      Published: 0,
    };
    posts.forEach((p) => {
      const st = p.status ? p.status.trim().toLowerCase() : 'draft';
      if (st === 'draft') counts.Draft += 1;
      else if (st === 'in review' || st === 'review' || st === 'inreview')
        counts['In review'] += 1;
      else if (st === 'approved') counts.Approved += 1;
      else if (st === 'scheduled') counts.Scheduled += 1;
      else if (st === 'published') counts.Published += 1;
    });
    return counts;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          (post.author && post.author.toLowerCase().includes(q)) ||
          (post.category && post.category.toLowerCase().includes(q)) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(q)),
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter((post) => {
        const st = (post.status || 'Draft').toLowerCase();
        const sf = statusFilter.toLowerCase();
        if (sf === 'in review')
          return st === 'in review' || st === 'review' || st === 'inreview';
        return st === sf;
      });
    }

    if (author !== '') {
      result = result.filter((post) => post.author === author);
    }

    if (category !== '') {
      result = result.filter((post) => post.category === category);
    }

    if (sortValue === 'lastUpdated') {
      result.sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
      );
    } else if (sortValue === 'publishDate') {
      result.sort((a, b) => {
        const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
        const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
        return dateB - dateA;
      });
    } else {
      // Default: newest first by last updated or id
      result.sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
      );
    }

    return result;
  }, [posts, debouncedSearchQuery, sortValue, statusFilter, author, category]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  function handleChangeSort(e: { label: string; value: string } | null) {
    setSortValue(e ? e.value : '');
  }

  function handleAuthorChange(e: { label: string; value: string } | null) {
    setAuthor(e ? e.value : '');
  }

  function handleCategoryChange(e: { label: string; value: string } | null) {
    setCategory(e ? e.value : '');
  }

  function handleReset() {
    setSearchQuery('');
    setSortValue('');
    setStatusFilter('All');
    setAuthor('');
    setCategory('');
  }

  return (
    <Box>
      {/* Search & Sort Toolbar Row */}
      <Flex gap='3' align='center' mb='4.5' wrap='wrap'>
        <Flex
          flex='1'
          align='center'
          gap='2.5'
          bg='var(--paper-raised)'
          border='1px solid var(--rule)'
          borderRadius='9px'
          px='3.5'
          py='2'
          shadow='var(--shadow-sm)'
        >
          <FiSearch size={15} color='var(--muted-2)' />
          <Input
            border='none'
            outline='none'
            _focus={{ outline: 'none', boxShadow: 'none' }}
            fontFamily="'Inter', sans-serif"
            fontSize='13.5px'
            w='100%'
            bg='transparent'
            color='var(--ink)'
            placeholder='Search posts by title, author, or tag…'
            value={searchQuery}
            onChange={handleChange}
            p='0'
            h='auto'
          />
        </Flex>

        <Box minW='170px'>
          <PrimarySelect
            placeholder='Newest first'
            value={sortValue}
            onChange={handleChangeSort}
            options={SORTBY}
          />
        </Box>
      </Flex>

      {/* Signature Interaction: Status Tabs Bar */}
      <Flex
        gap='4px'
        bg='var(--rule-soft)'
        p='4px'
        borderRadius='10px'
        mb='4'
        overflowX='auto'
        css={{
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {STATUS_TABS.map((tab) => {
          const isActive = statusFilter === tab.name;
          const count = statusCounts[tab.name] ?? 0;
          return (
            <Button
              key={tab.name}
              onClick={() => setStatusFilter(tab.name)}
              bg={isActive ? '#ffffff' : 'transparent'}
              color={isActive ? 'var(--ink)' : 'var(--muted)'}
              borderRadius='7px'
              px='3.5'
              py='2'
              h='auto'
              fontFamily="'Inter', sans-serif"
              fontSize='13px'
              fontWeight='600'
              shadow={isActive ? 'var(--shadow-sm)' : 'none'}
              _hover={{ color: 'var(--ink)' }}
              whiteSpace='nowrap'
            >
              <HStack gap='7px' align='center'>
                {tab.color && (
                  <Box w='7px' h='7px' borderRadius='2px' bg={tab.color} />
                )}
                <Text>{tab.name}</Text>
                <Text
                  fontFamily="'IBM Plex Mono', monospace"
                  fontSize='11px'
                  fontWeight='500'
                  opacity={0.7}
                >
                  {count}
                </Text>
              </HStack>
            </Button>
          );
        })}
      </Flex>

      {/* Filter Row */}
      <Flex gap='2.5' mb='4' wrap='wrap' align='center'>
        <Box minW='170px'>
          <PrimarySelect
            prefixLabel='Author:'
            value={author}
            onChange={handleAuthorChange}
            options={authorList}
          />
        </Box>

        <Box minW='170px'>
          <PrimarySelect
            prefixLabel='Category:'
            value={category}
            onChange={handleCategoryChange}
            options={categoryList}
          />
        </Box>

        <Button
          size='sm'
          bg='var(--ink)'
          color='white'
          borderRadius='8px'
          fontSize='12.5px'
          fontWeight='500'
          px='3.5'
          py='2'
          h='auto'
          _hover={{ bg: 'var(--ink-soft)' }}
          onClick={handleReset}
        >
          Reset filters
        </Button>
      </Flex>

      {/* Post Cards Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap='18px'>
        {isLoading ? (
          <Box p='6' color='var(--muted)'>
            <Text fontFamily="'IBM Plex Mono', monospace" fontSize='13px'>
              Loading editorial desk posts...
            </Text>
          </Box>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <Box
            p='10'
            textAlign='center'
            color='var(--muted)'
            gridColumn='1 / -1'
          >
            <Text
              fontFamily="'Fraunces', serif"
              fontSize='18px'
              color='var(--ink-soft)'
              mb='2'
            >
              No posts found
            </Text>
            <Text fontSize='13px'>
              Try adjusting your search query, status filter, or author/category
              filters.
            </Text>
          </Box>
        )}
      </SimpleGrid>
    </Box>
  );
}

export function BlogPostWithErrorBoundary() {
  return (
    <ErrorBoundary FallbackComponent={ListingErrorFallback}>
      <BlogPost />
    </ErrorBoundary>
  );
}

export default BlogPostWithErrorBoundary;
