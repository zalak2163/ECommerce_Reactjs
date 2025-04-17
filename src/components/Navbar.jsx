import React, { useState, useContext, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { setShowSearch, getCartCount, user, logout } = useContext(ShopContext);
  const navigate = useNavigate();

  const isAdmin = user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between py-5 px-4 font-medium relative">
      <Link to={"/"}>
        <img src={assets.forever_icon} className="w-36" alt="Logo" />
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        {!isAdmin && (
          <>
            <NavLink to="/" className="flex flex-col items-center gap-1">
              <p>HOME</p>
            </NavLink>
            <NavLink
              to="/collaction"
              className="flex flex-col items-center gap-1"
            >
              <p>COLLECTION</p>
            </NavLink>
            <NavLink to="/about" className="flex flex-col items-center gap-1">
              <p>ABOUT</p>
            </NavLink>
            <NavLink to="/contact" className="flex flex-col items-center gap-1">
              <p>CONTACT</p>
            </NavLink>
          </>
        )}
      </ul>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        {/* Show search & cart only if user is not admin */}
        {!isAdmin && (
          <>
            <img
              onClick={() => setShowSearch(true)}
              src={assets.search_icon}
              className="w-5 cursor-pointer"
              alt="Search"
            />
            <Link to="/cart" className="relative">
              <img className="w-5 min-w-5" src={assets.cart_icon} alt="Cart" />
              <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                {getCartCount()}
              </p>
            </Link>
          </>
        )}

        {/* Profile Dropdown */}
        <div className="relative">
          <img
            onClick={() => setDropdownOpen(!dropdownOpen)}
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt="Profile"
          />
          {dropdownOpen && (
            <div className="absolute right-0 pt-4 z-50">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg">
                <p className="cursor-pointer hover:text-black">
                  {user ? user.username : "My Profile"}
                </p>
                <p className="cursor-pointer hover:text-black">Orders</p>
                {user ? (
                  <p
                    className="cursor-pointer hover:text-black"
                    onClick={handleLogout}
                  >
                    Logout
                  </p>
                ) : (
                  <p
                    className="cursor-pointer hover:text-black"
                    onClick={handleLogin}
                  >
                    Login
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all duration-300 ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img
              className="h-4 rotate-180"
              src={assets.dropdown_icon}
              alt="Back"
            />
            <p>Back</p>
          </div>

          {!isAdmin && (
            <>
              <NavLink
                onClick={() => setVisible(false)}
                className="py-2 pl-6 border"
                to="/"
              >
                HOME
              </NavLink>
              <NavLink
                onClick={() => setVisible(false)}
                className="py-2 pl-6 border"
                to="/collaction"
              >
                COLLECTION
              </NavLink>
              <NavLink
                onClick={() => setVisible(false)}
                className="py-2 pl-6 border"
                to="/about"
              >
                ABOUT
              </NavLink>
              <NavLink
                onClick={() => setVisible(false)}
                className="py-2 pl-6 border"
                to="/contact"
              >
                CONTACT
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
