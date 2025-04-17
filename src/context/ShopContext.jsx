// import { createContext, useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export const ShopContext = createContext();

// const ShopContextProvider = (props) => {
//   const currency = "$";
//   const delivery_fee = 10; // Shipping fee
//   const [search, setSearch] = useState("");
//   const [showSearch, setShowSearch] = useState(false);
//   const [cartItems, setCartItems] = useState({});
//   const [products, setProducts] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get("https://localhost:7039/api/Products")
//       .then((response) => {
//         setProducts(response.data);
//         console.log("Fetched products:", response.data); // Log the response for debugging
//       })
//       .catch((error) => {
//         console.error("Error fetching products:", error); // Log error in console for debugging
//         toast.error("Error fetching products: " + error.message); // Show error message to the user
//       });
//   }, []);

//   const addToCart = async (itemId, size) => {
//     if (!size) {
//       toast.error("Select Product Size");
//       return;
//     }
//     let cartData = structuredClone(cartItems);
//     if (cartData[itemId]) {
//       if (cartData[itemId][size]) {
//         cartData[itemId][size] += 1;
//       } else {
//         cartData[itemId][size] = 1;
//       }
//     } else {
//       cartData[itemId] = {};
//       cartData[itemId][size] = 1;
//     }
//     setCartItems(cartData);
//   };

//   const getCartCount = () => {
//     let totalCount = 0;
//     for (const items in cartItems) {
//       for (const item in cartItems[items]) {
//         if (cartItems[items][item] > 0) {
//           totalCount += cartItems[items][item];
//         }
//       }
//     }
//     return totalCount;
//   };

//   const updateQuantity = async (itemId, size, quantity) => {
//     let cartData = structuredClone(cartItems);
//     cartData[itemId][size] = quantity;
//     setCartItems(cartData);
//   };

//   // Calculate cart amount (subtotal)
//   const getCartAmount = () => {
//     let totalAmount = 0;
//     for (const items in cartItems) {
//       const itemInfo = products.find(
//         (product) => product.id === parseInt(items)
//       ); // Ensure correct type matching
//       if (itemInfo) {
//         for (const size in cartItems[items]) {
//           if (cartItems[items][size] > 0) {
//             totalAmount += itemInfo.price * cartItems[items][size];
//           }
//         }
//       }
//     }
//     return totalAmount;
//   };

//   // Calculate cart total including shipping fee
//   const getCartTotal = () => {
//     const subtotal = getCartAmount();
//     const total = subtotal + delivery_fee; // Add shipping fee to subtotal
//     return { subtotal, total };
//   };

//   const value = {
//     products,
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
//     getCartTotal, // Added to provide the cart total
//     navigate,
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
  const [cartItems, setCartItems] = useState({});
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  const navigate = useNavigate();

  // On app load, restore user and cart
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);

      // Load cart from storage for this user
      const savedCart = localStorage.getItem(`cart_${parsedUser.username}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }

    const storedCategory = JSON.parse(localStorage.getItem("category")) || [];
    const storedSubCategory =
      JSON.parse(localStorage.getItem("subCategory")) || [];
    const storedSortType = localStorage.getItem("sortType") || "relavent";
    setCategory(storedCategory);
    setSubCategory(storedSubCategory);
    setSortType(storedSortType);
  }, []);

  // Fetch product data
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products"));
    if (storedProducts) {
      setProducts(storedProducts);
    } else {
      axios
        .get("https://localhost:7039/api/Products")
        .then((response) => {
          setProducts(response.data);
          localStorage.setItem("products", JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          toast.error("Error fetching products: " + error.message);
        });
    }
  }, []);

  // Persist cart when cartItems changes
  useEffect(() => {
    if (user?.username) {
      localStorage.setItem(`cart_${user.username}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  useEffect(() => {
    localStorage.setItem("category", JSON.stringify(category));
    localStorage.setItem("subCategory", JSON.stringify(subCategory));
    localStorage.setItem("sortType", sortType);
  }, [category, subCategory, sortType]);

  const addProduct = (newProduct) => {
    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  const addToCart = async (itemId, size) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItems(cartData);
  };

  const getCartCount = () => {
    if (!isAuthenticated) return 0;

    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        totalCount += cartItems[itemId][size];
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    const updatedCart = structuredClone(cartItems);
    if (quantity <= 0) {
      delete updatedCart[itemId][size];
      if (Object.keys(updatedCart[itemId]).length === 0) {
        delete updatedCart[itemId];
      }
    } else {
      updatedCart[itemId][size] = quantity;
    }
    setCartItems(updatedCart);
  };

  const getCartAmount = () => {
    if (!isAuthenticated) return 0;

    let totalAmount = 0;
    for (const itemId in cartItems) {
      const item = products.find((p) => p.id === parseInt(itemId));
      if (item) {
        for (const size in cartItems[itemId]) {
          totalAmount += item.price * cartItems[itemId][size];
        }
      }
    }
    return totalAmount;
  };

  const getCartTotal = () => {
    const subtotal = getCartAmount();
    return { subtotal, total: subtotal + delivery_fee };
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "https://localhost:7039/api/Auth/login",
        { username, password }
      );

      const { token, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ username, role }));

      setUser({ username, role });
      setIsAuthenticated(true);

      const savedCart = localStorage.getItem(`cart_${username}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems({});
      }

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
    if (user?.username) {
      localStorage.setItem(`cart_${user.username}`, JSON.stringify(cartItems));
    }

    setUser(null);
    setIsAuthenticated(false);
    setCartItems({});
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
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
    category,
    setCategory,
    subCategory,
    setSubCategory,
    sortType,
    setSortType,
    navigate,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
