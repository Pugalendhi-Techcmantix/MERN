import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Spin } from 'antd';


// Lazy-loaded components
const AppLayout = lazy(() => import('./Layout/Layout'));
const Login = lazy(() => import('./Log/Login'));
const Dashboard = lazy(() => import('./components/pages/Dashboard'));
const Customers = lazy(() => import('./components/pages/Customer/Customers'));
const CustomerAdd =lazy(()=>import('./components/pages/Customer/CustomerAdd'));

const Sample = lazy(() => import('./components/pages/Sample'));

// Protected Route Wrapper
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" replace />;
};

// Redirect If Already Logged In
const RedirectIfLoggedIn = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/" replace /> : element;
};

// Fallback Loading Component
const LoadingScreen = () => (
  <div className="flex justify-center items-center h-screen">
    <Spin size="large" />
  </div>
);

const RoutesConfig = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
        {/* Redirect logged-in users from Login page */}
        <Route path="/login" element={<RedirectIfLoggedIn element={<Login />} />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute element={<AppLayout />} />}>
            <Route index element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customer-add" element={<CustomerAdd />} />
            <Route path="/sample" element={<Sample />} />
          </Route>

          {/* Redirect all unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default RoutesConfig;
