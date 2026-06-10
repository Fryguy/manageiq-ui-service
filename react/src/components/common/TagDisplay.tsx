import React from 'react';
import { Tag, DismissibleTag } from '@carbon/react';
import classNames from 'classnames';
import './TagDisplay.scss';

export interface TagItem {
  /** Tag identifier */
  id: string;
  /** Tag label */
  label: string;
  /** Tag type for styling */
  type?: 'default' | 'blue' | 'green' | 'red' | 'purple' | 'gray';
}

export interface TagDisplayProps {
  /** Array of tags to display */
  tags: TagItem[];
  /** Whether tags are removable */
  removable?: boolean;
  /** Callback when tag is removed */
  onRemove?: (tagId: string) => void;
  /** Maximum number of tags to display */
  maxDisplay?: number;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * TagDisplay component for displaying tags/labels.
 * Built on Carbon's Tag component with additional features.
 */
export const TagDisplay: React.FC<TagDisplayProps> = ({
  tags,
  removable = false,
  onRemove,
  maxDisplay,
  className,
  testId = 'tag-display',
}) => {
  const displayTags = maxDisplay ? tags.slice(0, maxDisplay) : tags;
  const remainingCount = maxDisplay && tags.length > maxDisplay ? tags.length - maxDisplay : 0;

  const tagDisplayClasses = classNames('miq-tag-display', className);

  if (tags.length === 0) {
    return null;
  }

  const handleRemove = (tagId: string) => {
    if (removable && onRemove) {
      onRemove(tagId);
    }
  };

  return (
    <div className={tagDisplayClasses} data-testid={testId}>
      {displayTags.map((tag, index) => {
        const TagComponent = removable ? DismissibleTag : Tag;
        const tagProps = removable
          ? {
              onClose: () => handleRemove(tag.id),
            }
          : {};

        return (
          <TagComponent
            key={tag.id}
            type={tag.type || 'default'}
            data-testid={`${testId}-tag-${index}`}
            {...tagProps}
          >
            {tag.label}
          </TagComponent>
        );
      })}
      {remainingCount > 0 && (
        <Tag
          type="gray"
          data-testid={`${testId}-more`}
        >
          +{remainingCount} more
        </Tag>
      )}
    </div>
  );
};

export default TagDisplay;