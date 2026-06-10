import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import { LoginPage } from '../features/auth/components/LoginPage';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

function DashboardPage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const features = useAppSelector((state) => state.auth.session.features);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const featureCount = Object.keys(features).length;
  const userLanguage = user?.language;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Dashboard</h1>
      {user && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>
            Welcome, {user.name || user.userid || 'User'}!
          </p>
          {userLanguage && (
            <p style={{ color: '#666', marginBottom: '5px' }}>
              Language: {userLanguage}
            </p>
          )}
        </div>
      )}
      
      <button 
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#0f62fe',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          marginBottom: '30px',
        }}
      >
        Logout
      </button>

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f4f4f4', 
        borderRadius: '4px',
        border: '1px solid #ddd'
      }}>
        <h2 style={{ marginTop: 0, fontSize: '18px', marginBottom: '15px' }}>
          Diagnostics
        </h2>
        <div style={{ marginBottom: '15px' }}>
          <strong>User Role:</strong> {user?.role || 'N/A'}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>User Group:</strong> {user?.group || 'N/A'}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>Auth Features:</strong> {featureCount} features loaded
        </div>
        <details style={{ marginTop: '15px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
            View All Features ({featureCount})
          </summary>
          <pre style={{ 
            backgroundColor: '#fff', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px',
            fontSize: '12px',
            border: '1px solid #ddd'
          }}>
            {JSON.stringify(features, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return <div>Page not found</div>;
}

export const appRoutes = [
  {
    path: '/',
    element: <PrivateRoutes />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(appRoutes);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
