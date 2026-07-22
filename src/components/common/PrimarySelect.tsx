import { Select } from 'chakra-react-select';

interface IPrimarySelectProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: { label: string; value: string } | null) => void;
  placeholder?: string;
}

function PrimarySelect({
  options,
  value,
  onChange,
  placeholder,
}: IPrimarySelectProps) {
  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <Select
      isClearable={true}
      placeholder={placeholder || 'Select'}
      isSearchable={false}
      options={options}
      value={selectedOption}
      onChange={onChange}
    />
  );
}

export default PrimarySelect;
