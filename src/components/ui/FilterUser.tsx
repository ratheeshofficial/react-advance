import { Button, Heading, Input, Text } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

const users = [
  { id: 1, name: 'Ratheesh' },
  { id: 2, name: 'John' },
  { id: 3, name: 'Alice' },
  { id: 4, name: 'Bob' },
];

function FilterUser() {
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');

  console.log('Component Rendered');

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      console.log('Filtering...');
      return user.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search]);

  return (
    <>
      <Heading>Filter User using useMemo</Heading>
      <Input
        placeholder='search user'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button onClick={() => setCount(count + 1)}> Count: {count}</Button>
      {filteredUsers.map((user) => (
        <Text key={user.id}>{user.name}</Text>
      ))}
    </>
  );
}

export default FilterUser;
