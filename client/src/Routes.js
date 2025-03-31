// import React, { Suspense, lazy } from 'react';
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from 'react-router-dom';
// import { Spin } from 'antd';

// // Lazy-loaded components
// const AppLayout = lazy(() => import('./Layout/Layout'));
// const UserLayout = lazy(() => import('./Layout/UserLayout'));

// const Login = lazy(() => import('./Log/Login'));
// const Dashboard = lazy(() => import('./components/pages/Dashboard'));
// const Customers = lazy(() => import('./components/pages/Customer/Customers'));
// const CustomerAdd = lazy(() =>
//   import('./components/pages/Customer/CustomerAdd'),
// );
// const Orders = lazy(() => import('./components/pages/Orders/Orders'));
// const Products = lazy(() => import('./components/pages/Product/Products'));
// const ProductAdd = lazy(() => import('./components/pages/Product/ProductAdd'));
// const ProductsPage = lazy(() =>
//   import('./components/pages/User/Products/ProductsPage'),
// );

// const Sample = lazy(() => import('./components/pages/Sample'));

// // Protected Route Wrapper
// // const ProtectedRoute = ({ element }) => {
// //   const token = localStorage.getItem('token');
// //   return token ? element : <Navigate to="/login" replace />;
// // };

// // const ProtectedRoute = ({ element, requiredRole }) => {
// //   const token = localStorage.getItem('token');
// //   const storedUser = localStorage.getItem('userData');
// //   const user = storedUser ? JSON.parse(storedUser) : null;
// //   const roleId = user?.roleId;

// //   if (!token) return <Navigate to="/login" replace />;

// //   // Check if the requiredRole exists and matches user's role
// //   if (requiredRole && roleId !== requiredRole) {
// //     return <Navigate to="/" replace />;
// //   }

// //   return element;
// // };
// const ProtectedRoute = ({ element, requiredRole }) => {
//   const token = localStorage.getItem('token');
//   const storedUser = localStorage.getItem('userData');
//   const user = storedUser ? JSON.parse(storedUser) : null;
//   const roleId = user?.roleId;

//   if (!token) return <Navigate to="/login" replace />;

//   if (requiredRole && roleId !== requiredRole) {
//     return <Navigate to="/" replace />;
//   }

//   return <>{element}</>;
// };
// // Redirect If Already Logged In
// const RedirectIfLoggedIn = ({ element }) => {
//   const token = localStorage.getItem('token');
//   return token ? <Navigate to="/" replace /> : element;
// };

// // Fallback Loading Component
// const LoadingScreen = () => (
//   <div className="flex justify-center items-center h-screen">
//     <Spin size="large" />
//   </div>
// );

// // const RoutesConfig = () => {
// //   return (
// //     <Router>
// //       <Suspense fallback={<LoadingScreen />}>
// //         <Routes>
// //         {/* Redirect logged-in users from Login page */}
// //         <Route path="/login" element={<RedirectIfLoggedIn element={<Login />} />} />

// //           {/* Protected Routes */}
// //           <Route path="/" element={<ProtectedRoute element={<AppLayout />} />}>
// //             <Route index element={<Dashboard />} />
// //             <Route path="/customers" element={<Customers />} />
// //             <Route path="/customer-add" element={<CustomerAdd />} />
// //             <Route path="/orders" element={<Orders />} />
// //             <Route path="/products" element={<Products />} />
// //             <Route path="/product-add" element={<ProductAdd />} />
// //             <Route path="/sample" element={<Sample />} />
// //           </Route>

// //           {/* Redirect all unknown routes to login */}
// //           <Route path="*" element={<Navigate to="/login" replace />} />
// //         </Routes>
// //       </Suspense>
// //     </Router>
// //   );
// // };
// const RoutesConfig = () => {
//   return (
//     <Router>
//       <Suspense fallback={<LoadingScreen />}>
//         <Routes>
//           {/* Redirect logged-in users from Login page */}
//           <Route
//             path="/login"
//             element={<RedirectIfLoggedIn element={<Login />} />}
//           />

//           {/* Protected Routes */}
//           <Route path="/" element={<ProtectedRoute element={<AppLayout />} />}>
//             <Route index element={<Dashboard />} />

//             {/* Admin-Only Routes */}
//             <Route
//               path="/customers"
//               element={
//                 <ProtectedRoute element={<Customers />} requiredRole={1} />
//               }
//             />
//             <Route
//               path="/customer-add"
//               element={
//                 <ProtectedRoute element={<CustomerAdd />} requiredRole={1} />
//               }
//             />
//             <Route
//               path="/products"
//               element={
//                 <ProtectedRoute element={<Products />} requiredRole={1} />
//               }
//             />
//             <Route
//               path="/product-add"
//               element={
//                 <ProtectedRoute element={<ProductAdd />} requiredRole={1} />
//               }
//             />
//             <Route
//               path="/orders"
//               element={<ProtectedRoute element={<Orders />} requiredRole={1} />}
//             />
//           </Route>

//           {/* User-Specific Routes */}
//           <Route
//             path="/user"
//             element={<ProtectedRoute element={<UserLayout />} />}
//           >
//             <Route index element={<ProductsPage />} />

//             <Route
//               path="sample"
//               element={<ProtectedRoute element={<Sample />} requiredRole={2} />}
//             />
//           </Route>

//           {/* Redirect all unknown routes to login */}
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       </Suspense>
//     </Router>
//   );
// };

// export default RoutesConfig;

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
const UserLayout = lazy(() => import('./Layout/UserLayout'));

const Login = lazy(() => import('./Log/Login'));
const Dashboard = lazy(() => import('./components/pages/Dashboard'));
const Customers = lazy(() => import('./components/pages/Customer/Customers'));
const CustomerAdd = lazy(() =>
  import('./components/pages/Customer/CustomerAdd'),
);
const Orders = lazy(() => import('./components/pages/Orders/Orders'));
const Products = lazy(() => import('./components/pages/Product/Products'));
const ProductAdd = lazy(() => import('./components/pages/Product/ProductAdd'));
const ProductsPage = lazy(() =>
  import('./components/pages/User/Products/ProductsPage'),
);
const Sample = lazy(() => import('./components/pages/Sample'));

// Protected Route Wrapper
const ProtectedRoute = ({ element, requiredRole }) => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('userData');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const roleId = user?.roleId;

  if (!token) return <Navigate to="/login" replace />;
  if (requiredRole && roleId !== requiredRole) {
    return <Navigate to={roleId === 1 ? '/' : '/user'} replace />;
  }

  return <>{element}</>;
};

// Redirect If Already Logged In
const RedirectIfLoggedIn = ({ element }) => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('userData');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (token) {
    return <Navigate to={user?.roleId === 1 ? '/' : '/user'} replace />;
  }

  return element;
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
          <Route
            path="/login"
            element={<RedirectIfLoggedIn element={<Login />} />}
          />

          {/* Admin Routes (roleId: 1) */}
          <Route
            path="/"
            element={
              <ProtectedRoute element={<AppLayout />} requiredRole={1} />
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customer-add" element={<CustomerAdd />} />
            <Route path="products" element={<Products />} />
            <Route path="product-add" element={<ProductAdd />} />
            <Route path="orders" element={<Orders />} />
          </Route>

          {/* User Routes (roleId: 2) */}
          <Route
            path="/user"
            element={
              <ProtectedRoute element={<UserLayout />} requiredRole={2} />
            }
          >
            <Route index element={<ProductsPage />} />
            <Route path="category" element={<Sample />} />
          </Route>

          {/* Redirect all unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default RoutesConfig;
