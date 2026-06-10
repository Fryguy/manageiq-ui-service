/**
 * Tests for ProfileInfo component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProfileInfo } from './ProfileInfo';
import type { UserProfile } from '../types';

const mockProfile: UserProfile = {
  id: '1',
  name: 'Test User',
  userid: 'testuser',
  email: 'test@example.com',
  group: {
    id: 'g1',
    description: 'Test Group',
  },
  role: {
    id: 'r1',
    name: 'Test Role',
  },
  current_group: {
    id: 'cg1',
    description: 'Current Test Group',
  },
};

describe('ProfileInfo', () => {
  it('should render loading state', () => {
    render(<ProfileInfo profile={null} loading={true} />);
    expect(screen.getByTestId('profile-info-loading')).toBeInTheDocument();
  });

  it('should render empty state when no profile', () => {
    render(<ProfileInfo profile={null} loading={false} />);
    expect(screen.getByTestId('profile-info-empty')).toBeInTheDocument();
    expect(screen.getByText('No profile information available')).toBeInTheDocument();
  });

  it('should render profile information', () => {
    render(<ProfileInfo profile={mockProfile} loading={false} />);
    expect(screen.getByTestId('profile-info')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Test Group')).toBeInTheDocument();
    expect(screen.getByText('Test Role')).toBeInTheDocument();
    expect(screen.getByText('Current Test Group')).toBeInTheDocument();
  });

  it('should render profile without optional fields', () => {
    const minimalProfile: UserProfile = {
      id: '1',
      name: 'Minimal User',
      userid: 'minimaluser',
    };
    render(<ProfileInfo profile={minimalProfile} loading={false} />);
    expect(screen.getByText('Minimal User')).toBeInTheDocument();
    expect(screen.getByText('minimaluser')).toBeInTheDocument();
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
  });
});
