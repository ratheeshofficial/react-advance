import { Select } from 'chakra-react-select';

export interface IOptionProps<T = string | number> {
  label: string;
  value: T;
  tooltip?: string;
}

interface IPrimarySelectProps<T = string | number> {
  options: IOptionProps<T>[];
  value?: T;
  onChange?: (value: IOptionProps<T> | null) => void;
  placeholder?: string;
}

function PrimarySelect<T = string | number>({
  options,
  value,
  onChange,
  placeholder,
}: IPrimarySelectProps<T>) {
  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <Select<IOptionProps<T>>
      isClearable={true}
      placeholder={placeholder || 'Select'}
      isSearchable={false}
      options={options}
      value={selectedOption}
      onChange={(newValue) => onChange?.(newValue as IOptionProps<T> | null)}
    />
  );
}

export default PrimarySelect;
