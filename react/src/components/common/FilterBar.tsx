import React, { useState } from 'react';
import {
  FilterableMultiSelect,
  Dropdown,
  Button,
  Tag,
} from '@carbon/react';
import { Filter, Close } from '@carbon/icons-react';
import './FilterBar.scss';

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface FilterCategory {
  id: string;
  label: string;
  options: FilterOption[];
  type?: 'multiselect' | 'dropdown';
}

export interface ActiveFilter {
  categoryId: string;
  categoryLabel: string;
  optionId: string;
  optionLabel: string;
}

export interface FilterBarProps {
  categories: FilterCategory[];
  activeFilters: ActiveFilter[];
  onFilterChange: (filters: ActiveFilter[]) => void;
  onClearAll?: () => void;
  disabled?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  activeFilters,
  onFilterChange,
  onClearAll,
  disabled = false,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleMultiSelectChange = (categoryId: string, categoryLabel: string, selectedItems: any[]) => {
    // Remove existing filters for this category
    const otherFilters = activeFilters.filter((f) => f.categoryId !== categoryId);

    // Add new filters for selected items
    const newFilters = selectedItems.map((item) => ({
      categoryId,
      categoryLabel,
      optionId: item.id,
      optionLabel: item.label,
    }));

    onFilterChange([...otherFilters, ...newFilters]);
  };

  const handleDropdownChange = (categoryId: string, categoryLabel: string, selectedItem: any) => {
    // Remove existing filters for this category
    const otherFilters = activeFilters.filter((f) => f.categoryId !== categoryId);

    // Add new filter if an item is selected
    if (selectedItem) {
      const newFilter: ActiveFilter = {
        categoryId,
        categoryLabel,
        optionId: selectedItem.id,
        optionLabel: selectedItem.label,
      };
      onFilterChange([...otherFilters, newFilter]);
    } else {
      onFilterChange(otherFilters);
    }
  };

  const handleRemoveFilter = (filter: ActiveFilter) => {
    const newFilters = activeFilters.filter(
      (f) => !(f.categoryId === filter.categoryId && f.optionId === filter.optionId)
    );
    onFilterChange(newFilters);
  };

  const handleClearAll = () => {
    onFilterChange([]);
    if (onClearAll) {
      onClearAll();
    }
  };

  const getSelectedItemsForCategory = (categoryId: string) => {
    return activeFilters
      .filter((f) => f.categoryId === categoryId)
      .map((f) => ({ id: f.optionId, label: f.optionLabel }));
  };

  const getSelectedItemForCategory = (categoryId: string) => {
    const filter = activeFilters.find((f) => f.categoryId === categoryId);
    return filter ? { id: filter.optionId, label: filter.optionLabel } : null;
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar__controls">
        <div className="filter-bar__categories">
          {categories.map((category) => {
            const isExpanded = expandedCategories.has(category.id);
            const type = category.type || 'multiselect';

            return (
              <div key={category.id} className="filter-bar__category">
                {type === 'multiselect' ? (
                  <FilterableMultiSelect
                    id={`filter-${category.id}`}
                    titleText={category.label}
                    items={category.options}
                    itemToString={(item: FilterOption) => item?.label || ''}
                    selectedItems={getSelectedItemsForCategory(category.id)}
                    onChange={({ selectedItems }: any) =>
                      handleMultiSelectChange(category.id, category.label, selectedItems || [])
                    }
                    disabled={disabled}
                  />
                ) : (
                  <Dropdown
                    id={`filter-${category.id}`}
                    titleText={category.label}
                    items={category.options}
                    itemToString={(item: FilterOption) => item?.label || ''}
                    selectedItem={getSelectedItemForCategory(category.id)}
                    onChange={({ selectedItem }: any) =>
                      handleDropdownChange(category.id, category.label, selectedItem)
                    }
                    disabled={disabled}
                  />
                )}
              </div>
            );
          })}
        </div>
        {activeFilters.length > 0 && (
          <Button
            kind="ghost"
            size="sm"
            onClick={handleClearAll}
            disabled={disabled}
            renderIcon={Close}
          >
            Clear all
          </Button>
        )}
      </div>
      {activeFilters.length > 0 && (
        <div className="filter-bar__active-filters">
          <div className="filter-bar__active-filters-label">
            <Filter size={16} />
            <span>Active filters:</span>
          </div>
          <div className="filter-bar__tags">
            {activeFilters.map((filter, index) => (
              <Tag
                key={`${filter.categoryId}-${filter.optionId}-${index}`}
                type="blue"
                filter
                onClose={() => handleRemoveFilter(filter)}
                disabled={disabled}
              >
                {filter.categoryLabel}: {filter.optionLabel}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
