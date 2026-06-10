import { useEffect, useState } from 'react';
import './Footer.css';

interface FooterProps {
  className?: string;
}

interface VersionInfo {
  version?: string;
  build?: string;
  release?: string;
}

const Footer = ({ className = '' }: FooterProps) => {
  const [versionInfo, setVersionInfo] = useState<VersionInfo>({});
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    let isMounted = true;

    // Fetch version information from the API
    // This mirrors the Angular application's version display behavior
    const fetchVersionInfo = async () => {
      try {
        const response = await fetch('/api?attributes=server_info');
        if (response.ok && isMounted) {
          const data = await response.json();
          setVersionInfo({
            version: data.server_info?.version,
            build: data.server_info?.build,
            release: data.server_info?.release,
          });
        }
      } catch {
        // Silently fail - version info is not critical
        // In production, this would be logged to a monitoring service
      }
    };

    fetchVersionInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  const versionText = versionInfo.version
    ? `ManageIQ ${versionInfo.version}`
    : 'ManageIQ';

  const buildText = versionInfo.build ? ` (${versionInfo.build})` : '';

  return (
    <footer className={`app-footer ${className}`}>
      <div className="app-footer__content">
        <div className="app-footer__version">
          {versionText}
          {buildText}
        </div>
        <div className="app-footer__copyright">
          © {currentYear} ManageIQ. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
