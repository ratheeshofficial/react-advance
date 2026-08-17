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
      backgroundColor: 'bg.muted',
      borderColor: state.isFocused ? 'accent.solid' : 'border.default',
      borderRadius: '8px',
      minHeight: '36px',
      height: '36px',
      boxShadow: state.isFocused ? '0 0 0 1px var(--chakra-colors-accent-solid)' : 'sm',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      color: 'text.secondary',
      transition: 'all 0.15s ease',
      '&:hover': {
        borderColor: state.isFocused ? 'accent.solid' : 'text.muted',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 10px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'text.secondary',
      fontWeight: '500',
      fontSize: '13px',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: prefixLabel ? 'text.secondary' : 'text.muted',
      fontWeight: '500',
      fontSize: '13px',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: 'text.muted',
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
      color: 'text.muted',
      padding: '0 4px',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'bg.surface',
      borderRadius: '9px',
      border: '1px solid',
      borderColor: 'border.default',
      boxShadow: 'md',
      zIndex: 9999,
      overflow: 'hidden',
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '4px',
      backgroundColor: 'bg.surface',
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '13px',
      fontWeight: '500',
      borderRadius: '6px',
      padding: '6px 10px',
      cursor: 'pointer',
      backgroundColor: state.isSelected
        ? 'accent.subtle'
        : state.isFocused
        ? 'bg.subtle'
        : 'transparent',
      color: state.isSelected ? 'accent.fg' : 'text.secondary',
      '&:active': {
        backgroundColor: 'accent.subtle',
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
