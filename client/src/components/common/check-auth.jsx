import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const { pathname } = useLocation();

  // helper flags
  const isAuthPage =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");

  const isAdminRoute = pathname.startsWith("/admin");
  const isShopRoute = pathname.startsWith("/shop");

  //  debug (keep for now, remove later)
  console.log(pathname, isAuthenticated);

  if (pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/shop/home" replace />;
      }
    }
  }

  //  Not logged in → block everything except auth pages
  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/auth/login" replace />;
  }

  //  Logged in → MUST leave auth pages
  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/shop/home" replace />;
  }

  //  Normal user trying to access admin routes
  if (isAuthenticated && isAdminRoute && user?.role !== "admin") {
    return <Navigate to="/unauth-page" replace />;
  }

  // Admin trying to access shop routes
  if (isAuthenticated && isShopRoute && user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Allowed → render page
  return <>{children}</>;
}

export default CheckAuth;
