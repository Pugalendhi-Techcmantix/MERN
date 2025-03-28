import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Spin } from 'antd';
import ProductAdd from './components/pages/Product/ProductAdd';

// Lazy-loaded components
const AppLayout = lazy(() => import('./Layout/Layout'));
const Login = lazy(() => import('./Log/Login'));
const Dashboard = lazy(() => import('./components/pages/Dashboard'));
const Customers = lazy(() => import('./components/pages/Customer/Customers'));
const CustomerAdd = lazy(() =>
  import('./components/pages/Customer/CustomerAdd'),
);
const Orders = lazy(() => import('./components/pages/Orders/Orders'));
const Products = lazy(() => import('./components/pages/Product/Products'));

const Sample = lazy(() => import('./components/pages/Sample'));

// Protected Route Wrapper
// const ProtectedRoute = ({ element }) => {
//   const token = localStorage.getItem('token');
//   return token ? element : <Navigate to="/login" replace />;
// };

const ProtectedRoute = ({ element, requiredRole }) => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('userData');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const roleId = user?.roleId;

  if (!token) return <Navigate to="/login" replace />;

  // Check if the requiredRole exists and matches user's role
  if (requiredRole && roleId !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return element;
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

// const RoutesConfig = () => {
//   return (
//     <Router>
//       <Suspense fallback={<LoadingScreen />}>
//         <Routes>
//         {/* Redirect logged-in users from Login page */}
//         <Route path="/login" element={<RedirectIfLoggedIn element={<Login />} />} />

//           {/* Protected Routes */}
//           <Route path="/" element={<ProtectedRoute element={<AppLayout />} />}>
//             <Route index element={<Dashboard />} />
//             <Route path="/customers" element={<Customers />} />
//             <Route path="/customer-add" element={<CustomerAdd />} />
//             <Route path="/orders" element={<Orders />} />
//             <Route path="/products" element={<Products />} />
//             <Route path="/product-add" element={<ProductAdd />} />
//             <Route path="/sample" element={<Sample />} />
//           </Route>

//           {/* Redirect all unknown routes to login */}
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       </Suspense>
//     </Router>
//   );
// };
const RoutesConfig = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Redirect logged-in users from Login page */}
          <Route
            path="/login"
            element={<RedirectIfLoggedIn element={<Login />} />}
          />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute element={<AppLayout />} />}>
            <Route index element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sample" element={<Sample />} />

            {/* Admin-Only Routes */}
            <Route
              path="/customer-add"
              element={
                <ProtectedRoute element={<CustomerAdd />} requiredRole={1} />
              }
            />
            <Route
              path="/product-add"
              element={
                <ProtectedRoute element={<ProductAdd />} requiredRole={1} />
              }
            />
          </Route>

          {/* Redirect all unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default RoutesConfig;
