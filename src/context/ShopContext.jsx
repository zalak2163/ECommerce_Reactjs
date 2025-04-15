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
  const delivery_fee = 10; // Shipping fee
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  // Fetch products from API on component mount
  useEffect(() => {
    axios
      .get("https://localhost:7039/api/Products")
      .then((response) => {
        setProducts(response.data);
        console.log("Fetched products:", response.data); // Log the response for debugging
      })
      .catch((error) => {
        console.error("Error fetching products:", error); // Log error in console for debugging
        toast.error("Error fetching products: " + error.message); // Show error message to the user
      });
  }, []);

  // Add a new product to the product list in context
  const addProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalCount += cartItems[items][item];
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  // Calculate cart amount (subtotal)
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = products.find(
        (product) => product.id === parseInt(items)
      ); // Ensure correct type matching
      if (itemInfo) {
        for (const size in cartItems[items]) {
          if (cartItems[items][size] > 0) {
            totalAmount += itemInfo.price * cartItems[items][size];
          }
        }
      }
    }
    return totalAmount;
  };

  // Calculate cart total including shipping fee
  const getCartTotal = () => {
    const subtotal = getCartAmount();
    const total = subtotal + delivery_fee; // Add shipping fee to subtotal
    return { subtotal, total };
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
    addProduct, // Provide the addProduct method to context
    navigate,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
