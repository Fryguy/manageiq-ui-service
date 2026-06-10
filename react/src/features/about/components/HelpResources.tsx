/**
 * HelpResources - displays help and support resources
 */

import React from 'react';
import { Tile, Link, SkeletonText } from '@carbon/react';
import { DocumentDownload, Help, Chat, Book } from '@carbon/icons-react';
import { __ } from '../../../i18n';

export interface HelpResource {
  title: string;
  description: string;
  url: string;
  icon: React.ComponentType<{ size?: number }>;
}

export interface HelpResourcesProps {
  resources?: HelpResource[];
  loading?: boolean;
}

const defaultResources: HelpResource[] = [
  {
    title: 'Documentation',
    description: 'Browse the complete ManageIQ documentation',
    url: 'https://www.manageiq.org/docs/',
    icon: Book,
  },
  {
    title: 'User Guide',
    description: 'Learn how to use the Service UI',
    url: 'https://www.manageiq.org/docs/reference/latest/doc-Self_Service_User_Interface_Guide/miq/',
    icon: DocumentDownload,
  },
  {
    title: 'Community Support',
    description: 'Get help from the ManageIQ community',
    url: 'https://talk.manageiq.org/',
    icon: Chat,
  },
  {
    title: 'Report an Issue',
    description: 'Report bugs or request features',
    url: 'https://github.com/ManageIQ/manageiq/issues',
    icon: Help,
  },
];

export const HelpResources: React.FC<HelpResourcesProps> = ({
  resources = defaultResources,
  loading = false,
}) => {
  if (loading) {
    return (
      <div data-testid="help-resources-loading">
        <SkeletonText heading />
        <SkeletonText paragraph lineCount={4} />
      </div>
    );
  }

  return (
    <div data-testid="help-resources">
      <h3 style={{ marginBottom: '1rem' }}>{__('Help & Support')}</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem',
        }}
      >
        {resources.map((resource) => {
          const IconComponent = resource.icon;
          return (
            <Tile key={resource.url} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <IconComponent size={32} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>
                    <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                      {resource.title}
                    </Link>
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#525252' }}>
                    {resource.description}
                  </p>
                </div>
              </div>
            </Tile>
          );
        })}
      </div>
    </div>
  );
};
