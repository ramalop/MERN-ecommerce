import { House, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";


// ================= MENU ITEMS =================

function MenuItems({ closeMenuSheet }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(menuItem) {
    const currentFilter =
      menuItem?.id !== "home" &&
      menuItem?.id !== "products" &&
      menuItem?.id !== "search"
        ? { category: [menuItem.id] }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname.includes("listing") && currentFilter !== null) {
      setSearchParams(
        new URLSearchParams(`?category=${menuItem?.id}`)
      );
    } else {
      navigate(menuItem.path);
    }

    // ✅ close mobile sheet after click
    closeMenuSheet?.();
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          key={menuItem.id}
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}


// ================= RIGHT HEADER CONTENT =================

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  const [openCartSheet, setOpenCartSheet] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">

      {/* CART SHEET  */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenCartSheet(true)}
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="sr-only">User Cart</span>

          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems?.items?.length || 0}
          </span>
        </Button>

        <SheetContent side="right" className="w-full max-w-md">
          <UserCartWrapper
            setOpenCartSheet={setOpenCartSheet}
            cartItems={cartItems?.items || []}
          />
        </SheetContent>
      </Sheet>


      {/* USER DROPDOWN  */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>
            Logged in as {user?.userName}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="cursor-pointer"
          >
            <UserCog className="mr-1 h-4 w-4" />
            Account
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer"
          >
            <LogOut className="mr-1 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
}


// ================= MAIN HEADER =================

const ShoppingHeader = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // ✅ mobile menu sheet state here
  const [openMenuSheet, setOpenMenuSheet] = useState(false);

  return (
    <header className="fixed top-0 w-full z-40 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">

        {/* ===== LOGO ===== */}
        <Link to="/shop/home" className="flex items-center gap-2">
          <House className="h-6 w-6" />
          <span className="font-bold">E Commerce</span>
        </Link>


        {/* ===== MOBILE MENU SHEET ===== */}
        <Sheet open={openMenuSheet} onOpenChange={setOpenMenuSheet}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="max-w-xs w-full">
            <MenuItems closeMenuSheet={() => setOpenMenuSheet(false)} />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>


        {/* ===== DESKTOP MENU ===== */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>

      </div>
    </header>
  );
};

export default ShoppingHeader;
