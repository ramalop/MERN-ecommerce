
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "./components/ui/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";

import AdminLayout from "./components/admin-view/layout";
import ShoppingLayout from "./components/shopping-view/layout";

import CheckAuth from "./components/common/check-auth";
import NotFound from "./pages/not-found";
import UnauthPage from "./pages/unauth-page";

import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";

// 🔥 Lazy loaded ADMIN pages
const AdminDashboard = lazy(() => import("./pages/admin-view/dashboard"));
const AdminProducts = lazy(() => import("./pages/admin-view/products"));
const AdminOrders = lazy(() => import("./pages/admin-view/orders"));
const AdminFeatures = lazy(() => import("./pages/admin-view/features"));
const UsersForAdmin = lazy(() => import("./pages/admin-view/users"));

//  Lazy loaded SHOP pages 
const ShoppingHome = lazy(() => import("./pages/shopping-view/home"));
const ShoppingListing = lazy(() => import("./pages/shopping-view/listing"));
const ShoppingAccount = lazy(() => import("./pages/shopping-view/account"));
const ShoppingCheckout = lazy(() => import("./pages/shopping-view/checkout"));
const PaypalReturnPage = lazy(() => import("./pages/shopping-view/paypal-return"));
const PaymentSuccessPage = lazy(() => import("./pages/shopping-view/payment-success"));
const Search = lazy(() => import("./pages/shopping-view/search"));

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    dispatch(checkAuth(token));
  }, [dispatch]);

  // Preload admin pages after login 
  useEffect(() => {
    if (user?.role === "admin") {
      import("./pages/admin-view/dashboard");
      import("./pages/admin-view/products");
      import("./pages/admin-view/orders");
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 w-full flex rounded-xl">
        <Skeleton className="h-[600px] w-[600px]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white">
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
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

