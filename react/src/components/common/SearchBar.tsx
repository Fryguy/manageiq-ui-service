import React, { useState, useCallback } from 'react';
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
  light?: boolean;
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
  light = false,
  labelText = 'Search',
  closeButtonLabelText = 'Clear search input',
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue || '');

  // Create debounced onChange handler
  const debouncedOnChange = useCallback(
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
      light={light}
      labelText={labelText}
      closeButtonLabelText={closeButtonLabelText}
    />
  );
};
