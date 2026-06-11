import { useMemo, useState, useEffect } from 'react';
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
  Dropdown,
} from '@carbon/react';
import { UserAvatar, Notification, ChevronDown, Logout, Help } from '@carbon/icons-react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { logout } from '../../auth/store/authSlice';
import { fetchAboutModalInfo } from '../../about/store/aboutSlice';
import { AboutModal } from '../../about/components/AboutModal';
import { useNavigate } from 'react-router-dom';
import {
  AVAILABLE_LOCALES,
  LocaleCode,
  getStoredLocale,
  switchLocale,
  getLocaleName,
} from '../../../i18n/config';
import { __ } from '../../../i18n';
import './Header.css';

interface HeaderProps {
  onMenuClick?: () => void;
  isSideNavExpanded?: boolean;
}

const Header = ({ onMenuClick, isSideNavExpanded = false }: HeaderProps) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const identity = useAppSelector((state) => state.auth.session.identity);
  const aboutModalInfo = useAppSelector((state) => state.about.modalInfo);

  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch about modal info on mount
    dispatch(fetchAboutModalInfo());
  }, [dispatch]);

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

  const handleAboutClick = () => {
    setIsAboutModalOpen(true);
  };

  const handleCloseAboutModal = () => {
    setIsAboutModalOpen(false);
  };

  const navigate = useNavigate();
  const [currentLocale, setCurrentLocale] = useState<LocaleCode>(getStoredLocale());
  const [isChangingLocale, setIsChangingLocale] = useState(false);

  const languageItems = AVAILABLE_LOCALES.map((locale) => ({
    id: locale.code,
    text: locale.name,
  }));

  const handleLogout = async () => {
    handleCloseProfileMenu();
    await dispatch(logout());
    navigate('/login');
  };

  const handleLocaleChange = async (event: { selectedItem: { id: string } }) => {
    const newLocale = event.selectedItem.id as LocaleCode;

    if (newLocale === currentLocale) {
      return;
    }

    setIsChangingLocale(true);

    try {
      await switchLocale(newLocale);
      setCurrentLocale(newLocale);
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch locale:', error);
      setIsChangingLocale(false);
    }
  };

  return (
    <>
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
                aria-label="Help"
                tooltipAlignment="end"
                onClick={handleAboutClick}
              >
                <Help size={20} />
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
                  <div className="user-profile-menu__divider" />
                  <div className="user-profile-menu__section">
                    <Dropdown
                      id="language-switcher-profile"
                      titleText={__('Language')}
                      label={getLocaleName(currentLocale)}
                      items={languageItems}
                      itemToString={(item) => (item as { id: string; text: string } | null)?.text || ''}
                      onChange={handleLocaleChange}
                      disabled={isChangingLocale}
                      size="sm"
                    />
                  </div>
                  <div className="user-profile-menu__divider" />
                  <button
                    className="user-profile-menu__item user-profile-menu__item--logout"
                    onClick={handleLogout}
                    type="button"
                  >
                    <Logout size={16} />
                    <span>{__('Logout')}</span>
                  </button>
                </div>
              </Theme>
            </HeaderPanel>
          </CarbonHeader>
        )}
      />
      <AboutModal
        open={isAboutModalOpen}
        onClose={handleCloseAboutModal}
        appInfo={aboutModalInfo || undefined}
      />
    </>
  );
};

export default Header;