import {
  Box,
  Button,
  Flex,
  Input,
  SimpleGrid,
  Spacer,
  Text,
} from '@chakra-ui/react';
import PostCard from './PostCard';
import { mockPosts, SORTBY, STATUS } from '../../../constant/PostsConfigProps';
import { useEffect, useState, useMemo } from 'react';
import useDebounce from '../../../hooks/useDebounce';
import PrimarySelect from '../../../components/common/PrimarySelect';

function BlogPost() {
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortValue, setSortValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');

  const authorList = mockPosts.map((post) => {
    return { label: post.author, value: post.author };
  });

  const categoryList = [...new Set(mockPosts.map((post) => post.category))].map(
    (category) => ({
      label: category,
      value: category,
    }),
  );

  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const isSearching = searchQuery !== debouncedSearchQuery;
  const isLoading = isLoadingPosts || isSearching;

  const filteredPosts = useMemo(() => {
    let result = [...mockPosts];

    if (debouncedSearchQuery) {
      result = result.filter((post) =>
        post.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter((post) => post.status === statusFilter);
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
    }

    return result;
  }, [debouncedSearchQuery, sortValue, statusFilter, author, category]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingPosts(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  function renderPosts() {
    return (
      <>
        <Flex mb='5'>
          <Box w={'50%'}>
            <Input
              width={'100%'}
              value={searchQuery}
              placeholder='Search posts'
              onChange={handleChange}
            />
          </Box>
          <Spacer />
          <Box>
            <PrimarySelect
              placeholder='Sort'
              value={sortValue}
              onChange={handleChangeSort}
              options={SORTBY}
            />
          </Box>
        </Flex>
        <Flex align='center' gap={3} mb={5} wrap='wrap'>
          <Text fontWeight='bold' mr={2}>
            Status:
          </Text>
          {STATUS.map((status) => (
            <Button
              key={status}
              size='sm'
              variant={statusFilter === status ? 'solid' : 'ghost'}
              colorScheme={statusFilter === status ? 'blue' : 'gray'}
              onClick={() => setStatusFilter(status)}
              borderRadius='full'
            >
              {status}
            </Button>
          ))}
        </Flex>
        <Flex mb='5' gap={5}>
          <PrimarySelect
            placeholder='Authors'
            value={author}
            onChange={handleAuthorChange}
            options={authorList}
          />
          <PrimarySelect
            placeholder='Category'
            value={category}
            onChange={handleCategoryChange}
            options={categoryList}
          />
          <Button onClick={handleReset}>Reset</Button>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={2}>
          {isLoading && <Text>Loading Posts...</Text>}
          {!isLoading &&
            (filteredPosts.length > 0 ? (
              filteredPosts?.map((post, key) => {
                return <PostCard key={`post-${key + 1}`} post={post} />;
              })
            ) : (
              <Text>No Posts Found</Text>
            ))}
        </SimpleGrid>
      </>
    );
  }
  return <>{renderPosts()}</>;
}
export default BlogPost;
