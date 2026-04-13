import "./App.css";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "./components/ui/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";

import AdminLayout from "./components/admin-view/layout";
import ShoppingLayout from "./components/shopping-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard"; // CHANGED: eager import for admin dashboard
import ShoppingHome from "./pages/shopping-view/home"; // CHANGED: eager import for shop home

import CheckAuth from "./components/common/check-auth";
import NotFound from "./pages/not-found";
import UnauthPage from "./pages/unauth-page";

import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";

// Loading Skeletons
function InitialLoadingSkeleton() {
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header Skeleton */}
      <div className="border-b">
        <div className="flex items-center justify-between p-4">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-6 w-20" />
            ))}
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Hero Banner Skeleton */}
      <div className="w-full h-96 bg-muted animate-pulse rounded-lg my-4 mx-4">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>

      {/* Shop by Category Section */}
      <div className="p-4">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header Skeleton */}
      <div className="border-b">
        <div className="flex items-center justify-between p-4">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-6 w-20" />
            ))}
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Content Area Skeleton */}
      <div className="p-4">
        <Skeleton className="h-10 w-full mb-6 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

//  Lazy loaded ADMIN pages
// CHANGED: AdminDashboard is now eagerly loaded via static import above
const AdminProducts = lazy(() => import("./pages/admin-view/products"));
const AdminOrders = lazy(() => import("./pages/admin-view/orders"));
const AdminFeatures = lazy(() => import("./pages/admin-view/features"));
const UsersForAdmin = lazy(() => import("./pages/admin-view/users"));

//  Lazy loaded SHOP pages
// CHANGED: ShoppingHome is now eagerly loaded via static import above
const ShoppingListing = lazy(() => import("./pages/shopping-view/listing"));
const ShoppingAccount = lazy(() => import("./pages/shopping-view/account"));
const ShoppingCheckout = lazy(() => import("./pages/shopping-view/checkout"));
const PaypalReturnPage = lazy(
  () => import("./pages/shopping-view/paypal-return"),
);
const PaymentSuccessPage = lazy(
  () => import("./pages/shopping-view/payment-success"),
);
const Search = lazy(() => import("./pages/shopping-view/search"));

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    dispatch(checkAuth(token));
  }, [dispatch]);

  // CHANGED: preload only the remaining lazy admin pages after login
  useEffect(() => {
    if (user?.role === "admin") {
      import("./pages/admin-view/products");
      import("./pages/admin-view/orders");
    }
  }, [user]);

  if (isLoading) {
    return <InitialLoadingSkeleton />;
  }

  return (
    <div className="flex flex-col bg-white">
      <Suspense fallback={<PageLoadingSkeleton />}>
        <Routes>
          {/* Root */}
          <Route
            path="/"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user} />
            }
          />

          {/* Auth */}
          <Route
            path="/auth"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<UsersForAdmin />} />
            <Route path="features" element={<AdminFeatures />} />
          </Route>

          {/* Shop */}
          <Route
            path="/shop"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShoppingLayout />
              </CheckAuth>
            }
          >
            <Route path="home" element={<ShoppingHome />} />
            <Route path="listing" element={<ShoppingListing />} />
            <Route path="account" element={<ShoppingAccount />} />
            <Route path="checkout" element={<ShoppingCheckout />} />
            <Route path="paypal-return" element={<PaypalReturnPage />} />
            <Route path="payment-success" element={<PaymentSuccessPage />} />
            <Route path="search" element={<Search />} />
          </Route>
          <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
