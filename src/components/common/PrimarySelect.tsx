import { Select, type ChakraStylesConfig } from 'chakra-react-select';

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
  prefixLabel?: string;
}

function PrimarySelect<T = string | number>({
  options,
  value,
  onChange,
  placeholder,
  prefixLabel,
}: IPrimarySelectProps<T>) {
  const selectedOption = options.find((opt) => opt.value === value) || null;

  const displayPlaceholder = prefixLabel
    ? `${prefixLabel} All`
    : placeholder || 'Select';

  const chakraStyles: ChakraStylesConfig<IOptionProps<T>> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'var(--paper-raised)',
      borderColor: state.isFocused ? 'var(--accent)' : 'var(--rule)',
      borderRadius: '8px',
      minHeight: '36px',
      height: '36px',
      boxShadow: state.isFocused ? '0 0 0 1px var(--accent)' : 'var(--shadow-sm)',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      color: 'var(--ink-soft)',
      transition: 'all 0.15s ease',
      '&:hover': {
        borderColor: state.isFocused ? 'var(--accent)' : 'var(--muted-2)',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 10px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'var(--ink-soft)',
      fontWeight: '500',
      fontSize: '13px',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: prefixLabel ? 'var(--ink-soft)' : 'var(--muted-2)',
      fontWeight: '500',
      fontSize: '13px',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: 'var(--muted-2)',
      padding: '0 8px',
      background: 'transparent',
      svg: {
        width: '11px',
        height: '11px',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: 'var(--muted-2)',
      padding: '0 4px',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'var(--paper-raised)',
      borderRadius: '9px',
      border: '1px solid var(--rule)',
      boxShadow: 'var(--shadow-md)',
      zIndex: 9999,
      overflow: 'hidden',
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '4px',
      backgroundColor: 'var(--paper-raised)',
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '13px',
      fontWeight: '500',
      borderRadius: '6px',
      padding: '6px 10px',
      cursor: 'pointer',
      backgroundColor: state.isSelected
        ? 'var(--accent-soft)'
        : state.isFocused
        ? 'var(--rule-soft)'
        : 'transparent',
      color: state.isSelected ? 'var(--accent)' : 'var(--ink-soft)',
      '&:active': {
        backgroundColor: 'var(--accent-soft)',
      },
    }),
  };

  const formattedValue = selectedOption && prefixLabel
    ? { ...selectedOption, label: `${prefixLabel} ${selectedOption.label}` }
    : selectedOption;

  return (
    <Select<IOptionProps<T>>
      isClearable={true}
      placeholder={displayPlaceholder}
      isSearchable={false}
      options={options}
      value={formattedValue}
      onChange={(newValue) => onChange?.(newValue as IOptionProps<T> | null)}
      chakraStyles={chakraStyles}
    />
  );
}

export default PrimarySelect;

