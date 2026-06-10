/**
 * Toolbar Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Toolbar, ToolbarSection, ToolbarDivider, ToolbarGroup } from './Toolbar';

describe('Toolbar', () => {
  describe('Basic Rendering', () => {
    it('renders toolbar with left content', () => {
      render(<Toolbar left={<div>Left Content</div>} />);
      expect(screen.getByText('Left Content')).toBeInTheDocument();
    });

    it('renders toolbar with center content', () => {
      render(<Toolbar center={<div>Center Content</div>} />);
      expect(screen.getByText('Center Content')).toBeInTheDocument();
    });

    it('renders toolbar with right content', () => {
      render(<Toolbar right={<div>Right Content</div>} />);
      expect(screen.getByText('Right Content')).toBeInTheDocument();
    });

    it('renders toolbar with all sections', () => {
      render(
        <Toolbar
          left={<div>Left</div>}
          center={<div>Center</div>}
          right={<div>Right</div>}
        />
      );
      expect(screen.getByText('Left')).toBeInTheDocument();
      expect(screen.getByText('Center')).toBeInTheDocument();
      expect(screen.getByText('Right')).toBeInTheDocument();
    });

    it('renders with default aria label', () => {
      render(<Toolbar left={<div>Content</div>} />);
      expect(screen.getByRole('toolbar', { name: 'Toolbar' })).toBeInTheDocument();
    });

    it('renders with custom aria label', () => {
      render(<Toolbar left={<div>Content</div>} ariaLabel="Custom toolbar" />);
      expect(screen.getByRole('toolbar', { name: 'Custom toolbar' })).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies bordered class when bordered is true', () => {
      render(<Toolbar left={<div>Content</div>} bordered />);
      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toHaveClass('toolbar--bordered');
    });

    it('does not apply bordered class by default', () => {
      render(<Toolbar left={<div>Content</div>} />);
      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).not.toHaveClass('toolbar--bordered');
    });

    it('applies padded class by default', () => {
      render(<Toolbar left={<div>Content</div>} />);
      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toHaveClass('toolbar--padded');
    });

    it('does not apply padded class when padded is false', () => {
      render(<Toolbar left={<div>Content</div>} padded={false} />);
      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).not.toHaveClass('toolbar--padded');
    });

    it('applies custom className', () => {
      render(<Toolbar left={<div>Content</div>} className="custom-toolbar" />);
      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toHaveClass('custom-toolbar');
    });
  });

  describe('Empty Sections', () => {
    it('does not render left section when not provided', () => {
      const { container } = render(<Toolbar right={<div>Right</div>} />);
      const leftSection = container.querySelector('.toolbar__section--left');
      expect(leftSection).not.toBeInTheDocument();
    });

    it('does not render center section when not provided', () => {
      const { container } = render(<Toolbar left={<div>Left</div>} />);
      const centerSection = container.querySelector('.toolbar__section--center');
      expect(centerSection).not.toBeInTheDocument();
    });

    it('does not render right section when not provided', () => {
      const { container } = render(<Toolbar left={<div>Left</div>} />);
      const rightSection = container.querySelector('.toolbar__section--right');
      expect(rightSection).not.toBeInTheDocument();
    });
  });
});

describe('ToolbarSection', () => {
  it('renders with left alignment by default', () => {
    const { container } = render(<ToolbarSection>Content</ToolbarSection>);
    const section = container.querySelector('.toolbar__section--left');
    expect(section).toBeInTheDocument();
    expect(section).toHaveTextContent('Content');
  });

  it('renders with center alignment', () => {
    const { container } = render(<ToolbarSection align="center">Content</ToolbarSection>);
    const section = container.querySelector('.toolbar__section--center');
    expect(section).toBeInTheDocument();
    expect(section).toHaveTextContent('Content');
  });

  it('renders with right alignment', () => {
    const { container } = render(<ToolbarSection align="right">Content</ToolbarSection>);
    const section = container.querySelector('.toolbar__section--right');
    expect(section).toBeInTheDocument();
    expect(section).toHaveTextContent('Content');
  });

  it('applies custom className', () => {
    const { container } = render(<ToolbarSection className="custom-section">Content</ToolbarSection>);
    const section = container.querySelector('.custom-section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveTextContent('Content');
  });
});

describe('ToolbarDivider', () => {
  it('renders divider with separator role', () => {
    const { container } = render(<ToolbarDivider />);
    const divider = container.querySelector('[role="separator"]');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies toolbar__divider class', () => {
    const { container } = render(<ToolbarDivider />);
    const divider = container.querySelector('.toolbar__divider');
    expect(divider).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<ToolbarDivider className="custom-divider" />);
    const divider = container.querySelector('.custom-divider');
    expect(divider).toBeInTheDocument();
  });
});

describe('ToolbarGroup', () => {
  it('renders group with children', () => {
    render(
      <ToolbarGroup>
        <div>Item 1</div>
        <div>Item 2</div>
      </ToolbarGroup>
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('applies medium gap by default', () => {
    const { container } = render(
      <ToolbarGroup>
        <div>Item</div>
      </ToolbarGroup>
    );
    const group = container.querySelector('.toolbar__group--gap-md');
    expect(group).toBeInTheDocument();
  });

  it('applies small gap', () => {
    const { container } = render(
      <ToolbarGroup gap="sm">
        <div>Item</div>
      </ToolbarGroup>
    );
    const group = container.querySelector('.toolbar__group--gap-sm');
    expect(group).toBeInTheDocument();
  });

  it('applies large gap', () => {
    const { container } = render(
      <ToolbarGroup gap="lg">
        <div>Item</div>
      </ToolbarGroup>
    );
    const group = container.querySelector('.toolbar__group--gap-lg');
    expect(group).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ToolbarGroup className="custom-group">
        <div>Item</div>
      </ToolbarGroup>
    );
    const group = container.querySelector('.custom-group');
    expect(group).toBeInTheDocument();
  });
});

describe('Toolbar Integration', () => {
  it('renders complex toolbar with multiple components', () => {
    render(
      <Toolbar
        left={
          <ToolbarGroup>
            <div>Title</div>
            <ToolbarDivider />
            <div>Subtitle</div>
          </ToolbarGroup>
        }
        right={
          <ToolbarGroup gap="sm">
            <button>Action 1</button>
            <button>Action 2</button>
          </ToolbarGroup>
        }
      />
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
  });
});
