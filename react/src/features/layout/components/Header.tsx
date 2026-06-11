import { useMemo, useState } from 'react';
import {
  Header as CarbonHeader,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuButton,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderPanel,
  Theme,
} from '@carbon/react';
import { UserAvatar, Notification, ChevronDown } from '@carbon/icons-react';
import { useAppSelector } from '../../../store/hooks';
import './Header.css';

interface HeaderProps {
  onMenuClick?: () => void;
  isSideNavExpanded?: boolean;
}

const Header = ({ onMenuClick, isSideNavExpanded = false }: HeaderProps) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const identity = useAppSelector((state) => state.auth.session.identity);

  const displayName = useMemo(() => {
    if (!identity) {
      return 'User';
    }

    const name = typeof identity.name === 'string' ? identity.name : undefined;
    const userid = typeof identity.userid === 'string' ? identity.userid : undefined;
    const username = typeof identity.username === 'string' ? identity.username : undefined;

    return name || userid || username || 'User';
  }, [identity]);

  const roleLabel = useMemo(() => {
    if (!identity) {
      return null;
    }

    return typeof identity.role === 'string' ? identity.role : null;
  }, [identity]);

  const handleProfileClick = () => {
    setIsProfileMenuOpen((current) => !current);
  };

  const handleCloseProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  return (
    <HeaderContainer
      render={() => (
        <CarbonHeader aria-label="ManageIQ Service UI">
          <HeaderMenuButton
            aria-label={isSideNavExpanded ? 'Close navigation' : 'Open navigation'}
            onClick={onMenuClick}
            isActive={isSideNavExpanded}
          />
          <HeaderName href="/" prefix="">
            ManageIQ Service UI
          </HeaderName>
          <HeaderNavigation aria-label="ManageIQ Service UI" />
          <HeaderGlobalBar>
            <HeaderGlobalAction
              aria-label="Notifications"
              tooltipAlignment="end"
              onClick={() => {
                // TODO: Implement notifications panel
                console.log('Notifications clicked');
              }}
            >
              <Notification size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-controls="user-profile-panel"
              aria-expanded={isProfileMenuOpen}
              aria-label="User Profile"
              tooltipAlignment="end"
              onClick={handleProfileClick}
            >
              <UserAvatar size={20} />
              <ChevronDown size={16} />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
          <HeaderPanel
            aria-label="User profile panel"
            expanded={isProfileMenuOpen}
          >
            <Theme theme="g100">
              <div className="user-profile-menu">
                <div className="user-profile-menu__header">
                  <p className="user-profile-menu__eyebrow">Signed in as</p>
                  <p className="user-profile-menu__name">{displayName}</p>
                  {roleLabel && <p className="user-profile-menu__meta">{roleLabel}</p>}
                </div>
                <button
                  className="user-profile-menu__item"
                  onClick={handleCloseProfileMenu}
                  type="button"
                >
                  User information
                </button>
              </div>
            </Theme>
          </HeaderPanel>
        </CarbonHeader>
      )}
    />
  );
};

export default Header;
