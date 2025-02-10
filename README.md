// components/ProtectedRoute.js




// routes/index.js
import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import BlogPage from './pages/BlogPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import Chaine from './pages/chaine-de-valeur';
import Risque from './pages/Risque';
import Group from './pages/group';
import Filter from './pages/filter';
import Apex from './pages/apex'; // Assurez-vous que ce fichier existe et est correctement nommé


const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: '', element: <Navigate to="app" />, index: true, key: 'dashboard-index' },
        { path: 'app', element: <DashboardAppPage />, key: 'dashboard-app' },
        { path: 'risque', element: <Risque />, key: 'risque' },
        { path: 'products', element: <ProductsPage />, key: 'products' },
        { path: 'blog', element: <BlogPage />, key: 'blog' },
        { path: 'chaine-de-valeur', element: <Chaine />, key: 'chaine-de-valeur' },
        { path: 'groupe', element: <Group />, key: 'group' },
        { path: 'filter', element: <Filter />, key: 'filter' },
        { path: 'products/chart', element: <Apex />, key: 'products-chart' }
      ],
    },
    {
      path: '/',
      element: <Navigate to="/login" replace />, // Redirection unique vers /login
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '*',
      element: (
        <SimpleLayout>
          <Navigate to="/404" replace />
        </SimpleLayout>
      ),
    },
    {
      path: '/404',
      element: (
        <SimpleLayout>
          <Page404 />
        </SimpleLayout>
      ),
    }
  ]);

  return routes;
}
