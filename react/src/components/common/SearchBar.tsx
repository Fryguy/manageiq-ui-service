import React, { useState, useMemo } from 'react';
import { Search } from '@carbon/react';
import { debounce } from 'lodash';

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  labelText?: string;
  closeButtonLabelText?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  onClear,
  debounceMs = 300,
  disabled = false,
  size = 'md',
  labelText = 'Search',
  closeButtonLabelText = 'Clear search input',
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue || '');

  // Create debounced onChange handler
  const debouncedOnChange = useMemo(
    () =>
      debounce((value: string) => {
        onChange(value);
      }, debounceMs),
    [onChange, debounceMs]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInternalValue(newValue);
    debouncedOnChange(newValue);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange('');
    if (onClear) {
      onClear();
    }
  };

  // Use controlled value if provided, otherwise use internal state
  const displayValue = controlledValue !== undefined ? controlledValue : internalValue;

  return (
    <Search
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      onClear={handleClear}
      disabled={disabled}
      size={size}
      labelText={labelText}
      closeButtonLabelText={closeButtonLabelText}
    />
  );
};
