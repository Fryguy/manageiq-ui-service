import { Loading } from '@carbon/react';

interface LoadingSpinnerProps {
  /**
   * Whether the loading spinner is active
   */
  active?: boolean;
  /**
   * Description text for the loading spinner
   */
  description?: string;
  /**
   * Whether to show the loading spinner inline
   */
  small?: boolean;
  /**
   * Whether to show the loading spinner with overlay
   */
  withOverlay?: boolean;
  /**
   * Additional CSS class name
   */
  className?: string;
}

/**
 * LoadingSpinner component using Carbon Design System's Loading component
 * 
 * @example
 * // Basic usage
 * <LoadingSpinner active />
 * 
 * @example
 * // With description
 * <LoadingSpinner active description="Loading services..." />
 * 
 * @example
 * // Small inline spinner
 * <LoadingSpinner active small />
 * 
 * @example
 * // With overlay
 * <LoadingSpinner active withOverlay description="Processing..." />
 */
const LoadingSpinner = ({
  active = true,
  description = 'Loading...',
  small = false,
  withOverlay = false,
  className,
}: LoadingSpinnerProps) => {
  return (
    <Loading
      active={active}
      description={description}
      small={small}
      withOverlay={withOverlay}
      className={className}
    />
  );
};

export default LoadingSpinner;
