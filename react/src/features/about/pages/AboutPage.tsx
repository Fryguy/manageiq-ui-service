/**
 * AboutPage - main page for application information
 */

import React, { useEffect } from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, InlineNotification } from '@carbon/react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAppInfo } from '../store/aboutSlice';
import { VersionInfo } from '../components/VersionInfo';
import { LicenseInfo } from '../components/LicenseInfo';
import { HelpResources } from '../components/HelpResources';
import { __ } from '../../../i18n';

export const AboutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { appInfo, loading, error } = useAppSelector((state) => state.about);

  useEffect(() => {
    dispatch(fetchAppInfo());
  }, [dispatch]);

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <InlineNotification
          kind="error"
          title={__('Error loading application information')}
          subtitle={error}
          lowContrast
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }} data-testid="about-page">
      <h1 style={{ marginBottom: '2rem' }}>{__('About ManageIQ Service UI')}</h1>

      <Tabs>
        <TabList aria-label={__('About tabs')}>
          <Tab>{__('Version')}</Tab>
          <Tab>{__('License')}</Tab>
          <Tab>{__('Help & Support')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div style={{ marginTop: '2rem' }}>
              <VersionInfo
                version={appInfo?.version}
                buildDate={appInfo?.buildDate}
                gitCommit={appInfo?.gitCommit}
                loading={loading}
              />
            </div>
          </TabPanel>
          <TabPanel>
            <div style={{ marginTop: '2rem' }}>
              <LicenseInfo
                licenseName={appInfo?.licenseName}
                licenseUrl={appInfo?.licenseUrl}
                copyrightYear={appInfo?.copyrightYear}
                copyrightHolder={appInfo?.copyrightHolder}
                loading={loading}
              />
            </div>
          </TabPanel>
          <TabPanel>
            <div style={{ marginTop: '2rem' }}>
              <HelpResources loading={loading} />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};
