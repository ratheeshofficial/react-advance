import { Input, type InputProps } from '@chakra-ui/react';

interface PrimaryInputProps extends InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PrimaryInput({
  placeholder,
  value,
  onChange,
  ...rest
}: PrimaryInputProps) {
  return (
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...rest}
    />
  );
}

export default PrimaryInput;
