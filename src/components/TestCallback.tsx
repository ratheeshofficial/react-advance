import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Table,
  Text,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import TestChild from './TestChild';

const TestCallback = () => {
  const searchParams = new URLSearchParams();
  console.log('searchParams', searchParams);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [count, setCount] = useState(0);
  const [skip, setSkip] = useState(0);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const [paginationData, setPaginationData] = useState([]);
  console.log('paginationData', paginationData);
  const [isPaginating, setIsPaginating] = useState(false);
  console.log('search', search);
  console.log('Parent rendering...');

  useEffect(() => {
    async function productPagination() {
      setIsPaginating(true);
      try {
        const res = await fetch(
          `https://dummyjson.com/products?limit=10&skip=${skip}`,
        ).then((res) => res.json());
        setPaginationData(res.products);
      } catch (error) {
        console.log('error', error);
      } finally {
        setIsPaginating(false);
      }
    }
    productPagination();
  }, [skip]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function fetchProduct(search: string) {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${search}`,
        ).then((res) => res.json());
        setSearchList(res.products);
      } catch (error) {
        console.log('error', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (debouncedSearch) {
      fetchProduct(debouncedSearch);
    }
  }, [debouncedSearch]);

  function handlePrev() {
    setSkip((skip) => skip - 10);
  }

  async function handleNext() {
    setSkip((skip) => skip + 10);
  }

  const handleClick = useCallback(() => {
    console.log('clicked');
    setCount((prev) => prev + 1);
  }, []);

  async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  return (
    <>
      <Heading>Search</Heading>
      <Input value={search} onChange={handleSearch} placeholder='Search' />

      <Box>
        {isLoading && <Text>Loading...</Text>}
        {!isLoading &&
          (searchList.length > 0 ? (
            <Table.Root size='sm'>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Product</Table.ColumnHeader>
                  <Table.ColumnHeader>Category</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign='end'>Price</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {searchList.map(
                  (item: {
                    id: number;
                    title: string;
                    category: string;
                    price: number;
                  }) => (
                    <Table.Row key={item?.id}>
                      <Table.Cell>{item.title}</Table.Cell>
                      <Table.Cell>{item.category}</Table.Cell>
                      <Table.Cell textAlign='end'>{item.price}</Table.Cell>
                    </Table.Row>
                  ),
                )}
              </Table.Body>
            </Table.Root>
          ) : (
            'No Search data Found Find to search'
          ))}
      </Box>
      <Text fontWeight='600' fontSize='xl' color='white'>
        Pagination List Testing
      </Text>
      {isPaginating && <Text>Loading Pagination List</Text>}
      {!isPaginating &&
        (paginationData.length > 0 ? (
          <Table.Root size='sm'>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Product</Table.ColumnHeader>
                <Table.ColumnHeader>Category</Table.ColumnHeader>
                <Table.ColumnHeader textAlign='end'>Price</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginationData.map(
                (item: {
                  id: number;
                  title: string;
                  category: string;
                  price: number;
                }) => (
                  <Table.Row key={item?.id}>
                    <Table.Cell>{item.title}</Table.Cell>
                    <Table.Cell>{item.category}</Table.Cell>
                    <Table.Cell textAlign='end'>{item.price}</Table.Cell>
                  </Table.Row>
                ),
              )}
            </Table.Body>
          </Table.Root>
        ) : (
          'No data Found'
        ))}
      <HStack>
        <Button onClick={handlePrev} disabled={skip === 0}>
          Prev
        </Button>
        <Button onClick={handleNext} disabled={paginationData.length < 10}>
          Next
        </Button>
      </HStack>
      <Box>Count {count}</Box>
      <Button onClick={handleClick}>Increment</Button>
      <TestChild onClick={handleClick} />
    </>
  );
};

export default TestCallback;
