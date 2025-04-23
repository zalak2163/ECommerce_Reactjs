// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import Title from "../components/Title";
// import { assets } from "../assets/assets";
// import CartTotal from "../components/CartTotal";

// const Cart = () => {
//   const { products, currency, cartItems, updateQuantity, navigate, user } =
//     useContext(ShopContext);
//   const [cartData, setCartData] = useState([]);

//   // Update cart data when cartItems or products change
//   useEffect(() => {
//     const tempData = [];
//     for (const items in cartItems) {
//       for (const item in cartItems[items]) {
//         if (cartItems[items][item] > 0) {
//           tempData.push({
//             id: items,
//             size: item,
//             quantity: cartItems[items][item],
//           });
//         }
//       }
//     }
//     setCartData(tempData);
//     console.log("Cart Data:", tempData); // Debugging cart data
//   }, [cartItems, products]);

//   // Update the quantity and handle localStorage
//   const handleUpdateQuantity = (itemId, size, quantity) => {
//     if (quantity <= 0) {
//       // Remove item from cart
//       updateQuantity(itemId, size, 0);
//     } else {
//       // Update the quantity of the item
//       updateQuantity(itemId, size, quantity);
//     }

//     // Save updated cart to localStorage
//     if (user?.username) {
//       localStorage.setItem(`cart_${user.username}`, JSON.stringify(cartItems));
//     }
//   };

//   return (
//     <div className="border-t pt-14">
//       <div className="text-2xl mb-3">
//         <Title text1={"YOUR"} text2={"CART"} />
//       </div>
//       <div>
//         {cartData.length === 0 ? (
//           <p>Your cart is empty.</p>
//         ) : (
//           cartData.map((item) => {
//             const productData = products.find(
//               (product) => product.id.toString() === item.id.toString()
//             );

//             if (!productData) {
//               return (
//                 <div
//                   key={item.id}
//                   className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
//                 >
//                   <div className="flex items-start gap-6">
//                     <p className="text-sm sm:text-lg font-medium">
//                       Product not found
//                     </p>
//                   </div>
//                 </div>
//               );
//             }

//             return (
//               <div
//                 key={item.id}
//                 className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
//               >
//                 <div className="flex items-start gap-6">
//                   <img
//                     className="w-16 sm:w-20"
//                     src={
//                       productData.images
//                         ? productData.images.split(",")[0]
//                         : assets.defaultImage
//                     }
//                     alt={productData.name}
//                   />
//                   <div>
//                     <p className="text-sm sm:text-lg font-medium">
//                       {productData.name}
//                     </p>
//                     <div className="flex items-center gap-5 mt-2">
//                       <p>
//                         {currency}
//                         {productData.price}
//                       </p>
//                       <p className="px-2 sm:px-3 sm:py-1 border bg-scale-50">
//                         {item.size}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <input
//                   onChange={(e) =>
//                     e.target.value === "" || e.target.value === "0"
//                       ? null
//                       : handleUpdateQuantity(
//                           item.id,
//                           item.size,
//                           Number(e.target.value)
//                         )
//                   }
//                   className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
//                   type="number"
//                   min={1}
//                   defaultValue={item.quantity}
//                 />
//                 <img
//                   onClick={() => handleUpdateQuantity(item.id, item.size, 0)} // Delete item when quantity is set to 0
//                   className="w-4 mr-4 sm:w-5 cursor-pointer"
//                   src={assets.bin_icon}
//                   alt="Delete"
//                 />
//               </div>
//             );
//           })
//         )}
//       </div>
//       <div className="flex justify-end my-20">
//         <div className="w-full sm:w-[450px]">
//           <CartTotal />
//           <div className="w-full text-end">
//             <button
//               onClick={() => navigate("/place-order")}
//               className="bg-black text-white text-sm my-8 px-8 py-3"
//             >
//               PROCEED TO CHECKOUT
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;

import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import axios from "axios";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, user } =
    useContext(ShopContext);

  // Fetch the cart data from the API when user is authenticated
  useEffect(() => {
    if (user && user.userId) {
      const fetchCartData = async () => {
        try {
          const response = await axios.get(
            `https://localhost:7039/api/cart/user/${user.userId}`
          );
          // We should be updating the cartItems in context to reflect the fetched data.
          // This is managed in the context itself, so you don't need to manage cart data here directly.
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      };

      fetchCartData();
    }
  }, [user]); // Fetch cart only when user is logged in

  // Update the quantity and handle localStorage
  const handleUpdateQuantity = (itemId, size, quantity) => {
    if (quantity <= 0) {
      // Remove item from cart
      updateQuantity(itemId, size, 0);
    } else {
      // Update the quantity of the item
      updateQuantity(itemId, size, quantity);
    }
  };

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      <div>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => {
            const productData = products.find(
              (product) => product.id === item.productId
            );

            if (!productData) {
              return (
                <div
                  key={item.cartId}
                  className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                >
                  <div className="flex items-start gap-6">
                    <p className="text-sm sm:text-lg font-medium">
                      Product not found
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={item.cartId}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                <div className="flex items-start gap-6">
                  <img
                    className="w-16 sm:w-20"
                    src={
                      productData.images
                        ? productData.images.split(",")[0]
                        : assets.defaultImage
                    }
                    alt={productData.name}
                  />
                  <div>
                    <p className="text-sm sm:text-lg font-medium">
                      {productData.name}
                    </p>
                    <div className="flex items-center gap-5 mt-2">
                      <p>
                        {currency}
                        {productData.price}
                      </p>
                      <p className="px-2 sm:px-3 sm:py-1 border bg-scale-50">
                        {item.size}
                      </p>
                    </div>
                  </div>
                </div>
                <input
                  onChange={(e) =>
                    e.target.value === "" || e.target.value === "0"
                      ? null
                      : handleUpdateQuantity(
                          item.productId,
                          item.size,
                          Number(e.target.value)
                        )
                  }
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                />
                <img
                  onClick={() =>
                    handleUpdateQuantity(item.productId, item.size, 0)
                  }
                  className="w-4 mr-4 sm:w-5 cursor-pointer"
                  src={assets.bin_icon}
                  alt="Delete"
                />
              </div>
            );
          })
        )}
      </div>
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
