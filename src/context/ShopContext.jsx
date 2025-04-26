// import { createContext, useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export const ShopContext = createContext();

// const ShopContextProvider = (props) => {
//   const currency = "$";
//   const delivery_fee = 10;

//   const [search, setSearch] = useState("");
//   const [showSearch, setShowSearch] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [cartItems, setCartItems] = useState([]);
//   const [user, setUser] = useState(null);
//   const [orders, setOrders] = useState([]); // Added orders state
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [category, setCategory] = useState([]);
//   const [subCategory, setSubCategory] = useState([]);
//   const [sortType, setSortType] = useState("relavent");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("https://localhost:7039/api/Products");
//       setProducts(response.data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       toast.error("Error fetching products: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCart = async (userId) => {
//     try {
//       const response = await axios.get(
//         `https://localhost:7039/api/cart/user/${userId}`
//       );
//       setCartItems(response.data || []);
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//     }
//   };

//   const fetchOrders = async (userId) => {
//     // Fetch orders for the logged-in user
//     try {
//       const response = await axios.get(
//         `https://localhost:7039/api/Orders/user-orders/${userId}`
//       );
//       setOrders(response.data || []); // Set the orders in the context state
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       toast.error("Error fetching orders: " + error.message);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     if (token && storedUser) {
//       const parsedUser = JSON.parse(storedUser);
//       setUser(parsedUser);
//       setIsAuthenticated(true);
//       fetchCart(parsedUser.userId);
//       fetchOrders(parsedUser.userId); // Fetch orders after user authentication
//     }

//     const storedCategory = JSON.parse(localStorage.getItem("category")) || [];
//     const storedSubCategory =
//       JSON.parse(localStorage.getItem("subCategory")) || [];
//     const storedSortType = localStorage.getItem("sortType") || "relavent";
//     setCategory(storedCategory);
//     setSubCategory(storedSubCategory);
//     setSortType(storedSortType);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("category", JSON.stringify(category));
//     localStorage.setItem("subCategory", JSON.stringify(subCategory));
//     localStorage.setItem("sortType", sortType);
//   }, [category, subCategory, sortType]);

//   const addToCart = async (productId, size) => {
//     if (!isAuthenticated) {
//       toast.error("Please login to add items to cart");
//       return;
//     }
//     if (!size) {
//       toast.error("Select Product Size");
//       return;
//     }

//     try {
//       const existingItem = cartItems.find(
//         (item) => item.productId === parseInt(productId) && item.size === size
//       );

//       if (existingItem) {
//         await updateQuantity(productId, size, existingItem.quantity + 1);
//       } else {
//         const payload = {
//           userId: user.userId,
//           productId: parseInt(productId),
//           quantity: 1,
//           size,
//         };
//         await axios.post("https://localhost:7039/api/cart/add", payload);
//         fetchCart(user.userId);
//         toast.success("Item added to cart");
//       }
//     } catch (error) {
//       toast.error("Error adding to cart: " + error.message);
//     }
//   };

//   const updateQuantity = async (productId, size, quantity) => {
//     try {
//       const itemToUpdate = cartItems.find(
//         (item) => item.productId === parseInt(productId) && item.size === size
//       );
//       if (!itemToUpdate) return;

//       if (quantity <= 0) {
//         await axios.delete(
//           `https://localhost:7039/api/cart/delete/${itemToUpdate.cartId}`
//         );
//         toast.success("Item removed from cart");
//       } else {
//         const payload = {
//           ...itemToUpdate,
//           quantity,
//         };
//         await axios.put(
//           `https://localhost:7039/api/cart/update/${itemToUpdate.cartId}`,
//           payload
//         );
//         toast.success("Cart updated");
//       }

//       fetchCart(user.userId);
//     } catch (error) {
//       toast.error("Error updating cart: " + error.message);
//     }
//   };

//   const getCartCount = () => {
//     return cartItems.reduce((total, item) => total + item.quantity, 0);
//   };

//   const getCartAmount = () => {
//     return cartItems.reduce((total, item) => {
//       const product = products.find((p) => p.id === item.productId);
//       return product ? total + product.price * item.quantity : total;
//     }, 0);
//   };

//   const getCartTotal = () => {
//     const subtotal = getCartAmount();
//     return { subtotal, total: subtotal + delivery_fee };
//   };

//   const addProduct = (newProduct) => {
//     setProducts((prevProducts) => [...prevProducts, newProduct]);
//   };

//   const login = async (username, password) => {
//     try {
//       const response = await axios.post(
//         "https://localhost:7039/api/Auth/login",
//         { username, password }
//       );

//       const { token, role, userId } = response.data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify({ username, role, userId }));

//       setUser({ username, role, userId });
//       setIsAuthenticated(true);

//       await fetchCart(userId);
//       fetchOrders(userId); // Fetch orders after login

//       toast.success("Login successful!");
//       navigate("/");
//     } catch (error) {
//       toast.error("Login failed: " + (error.response?.data || error.message));
//     }
//   };
//   const token = localStorage.getItem("token");
//   const register = async (username, password) => {
//     try {
//       await axios.post("https://localhost:7039/api/Auth/register", {
//         username,
//         password,
//       });
//       toast.success("Registration successful! Please log in.");
//     } catch (error) {
//       toast.error(
//         "Registration failed: " + (error.response?.data || error.message)
//       );
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setIsAuthenticated(false);
//     setCartItems([]);
//     setOrders([]); // Clear orders on logout
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     toast.success("Logged out successfully!");
//     navigate("/login");
//   };

//   const value = {
//     token,
//     products,
//     setProducts,
//     fetchProducts,
//     currency,
//     delivery_fee,
//     search,
//     setSearch,
//     showSearch,
//     setShowSearch,
//     cartItems,
//     addToCart,
//     getCartCount,
//     updateQuantity,
//     getCartAmount,
//     getCartTotal,
//     addProduct,
//     login,
//     register,
//     logout,
//     user,
//     isAuthenticated,
//     orders, // Provided orders in the context
//     setOrders, // Set orders in the context
//     category,
//     setCategory,
//     subCategory,
//     setSubCategory,
//     sortType,
//     setSortType,
//     navigate,
//     loading,
//   };

//   return (
//     <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
//   );
// };

// export default ShopContextProvider;

import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]); // Added orders state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://localhost:7039/api/Products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async (userId) => {
    try {
      const response = await axios.get(
        `https://localhost:7039/api/cart/user/${userId}`
      );
      setCartItems(response.data || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const fetchOrders = async (userId) => {
    try {
      const response = await axios.get(
        `https://localhost:7039/api/Orders/user-orders/${userId}`
      );
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders: " + error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      fetchCart(parsedUser.userId);
      fetchOrders(parsedUser.userId); // Fetch orders after user authentication
    }

    const storedCategory = JSON.parse(localStorage.getItem("category")) || [];
    const storedSubCategory =
      JSON.parse(localStorage.getItem("subCategory")) || [];
    const storedSortType = localStorage.getItem("sortType") || "relavent";
    setCategory(storedCategory);
    setSubCategory(storedSubCategory);
    setSortType(storedSortType);
  }, []);

  useEffect(() => {
    localStorage.setItem("category", JSON.stringify(category));
    localStorage.setItem("subCategory", JSON.stringify(subCategory));
    localStorage.setItem("sortType", sortType);
  }, [category, subCategory, sortType]);

  const addToCart = async (productId, size) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    try {
      const existingItem = cartItems.find(
        (item) => item.productId === parseInt(productId) && item.size === size
      );

      if (existingItem) {
        await updateQuantity(productId, size, existingItem.quantity + 1);
      } else {
        const payload = {
          userId: user.userId,
          productId: parseInt(productId),
          quantity: 1,
          size,
        };
        await axios.post("https://localhost:7039/api/cart/add", payload);
        fetchCart(user.userId);
        toast.success("Item added to cart");
      }
    } catch (error) {
      toast.error("Error adding to cart: " + error.message);
    }
  };

  const updateQuantity = async (productId, size, quantity) => {
    try {
      const itemToUpdate = cartItems.find(
        (item) => item.productId === parseInt(productId) && item.size === size
      );
      if (!itemToUpdate) return;

      if (quantity <= 0) {
        await axios.delete(
          `https://localhost:7039/api/cart/delete/${itemToUpdate.cartId}`
        );
        toast.success("Item removed from cart");
      } else {
        const payload = {
          ...itemToUpdate,
          quantity,
        };
        await axios.put(
          `https://localhost:7039/api/cart/update/${itemToUpdate.cartId}`,
          payload
        );
        toast.success("Cart updated");
      }

      fetchCart(user.userId);
    } catch (error) {
      toast.error("Error updating cart: " + error.message);
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartAmount = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? total + product.price * item.quantity : total;
    }, 0);
  };

  const getCartTotal = () => {
    const subtotal = getCartAmount();
    return { subtotal, total: subtotal + delivery_fee };
  };

  const addProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "https://localhost:7039/api/Auth/login",
        { username, password }
      );

      const { token, role, userId } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ username, role, userId }));

      setUser({ username, role, userId });
      setIsAuthenticated(true);

      await fetchCart(userId);
      fetchOrders(userId); // Fetch orders after login

      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error("Login failed: " + (error.response?.data || error.message));
    }
  };

  const register = async (username, password) => {
    try {
      await axios.post("https://localhost:7039/api/Auth/register", {
        username,
        password,
      });
      toast.success("Registration successful! Please log in.");
    } catch (error) {
      toast.error(
        "Registration failed: " + (error.response?.data || error.message)
      );
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCartItems([]);
    setOrders([]); // Clear orders on logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const value = {
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    products,
    setProducts,
    fetchProducts,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    getCartTotal,
    addProduct,
    login,
    register,
    logout,
    user,
    isAuthenticated,
    orders, // Provided orders in the context
    setOrders, // Set orders in the context
    category,
    setCategory,
    subCategory,
    setSubCategory,
    sortType,
    setSortType,
    navigate,
    loading,
    token: localStorage.getItem("token"), // Ensure token is available in context
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
