// import React, { useState, useEffect, useContext } from "react";
// import Sidebar from "../components/Sidebar";
// import axios from "axios";
// import { ShopContext } from "../context/ShopContext";
// import { assets } from "../assets/assets";

// const AdminOrders = () => {
//   const { token, currency } = useContext(ShopContext);
//   const [localOrders, setLocalOrders] = useState([]);

//   const fetchAllOrders = async () => {
//     if (!token) return;

//     try {
//       const response = await axios.get(
//         "https://localhost:7039/api/Orders/all-orders",
//         {
//           headers: { token },
//         }
//       );
//       console.log(response.data);
//       setLocalOrders(response.data);
//     } catch (error) {
//       console.error("Failed to fetch admin orders:", error);
//     }
//   };

//   const statusHandler = async (event, orderId) => {
//     try {
//       const response = await axios;
//     } catch (error) {}
//   };

//   useEffect(() => {
//     fetchAllOrders();
//   }, [token]);

//   return (
//     <div className="flex w-full min-h-screen">
//       <Sidebar />
//       <div className="flex-1 p-4">
//         <h1 className="text-2xl font-semibold mb-6">Admin Orders</h1>

//         {localOrders.length > 0 ? (
//           localOrders.map((order, index) => {
//             const items = Array.isArray(order.items)
//               ? order.items
//               : JSON.parse(order.items);
//             const address = JSON.parse(order.address);

//             return (
//               <div
//                 key={index}
//                 className="flex flex-wrap md:flex-nowrap justify-between items-start gap-4 border p-5 rounded-lg shadow mb-6 text-sm text-gray-700 bg-white"
//               >
//                 {/* Parcel Icon */}
//                 <div className="flex-shrink-0 flex items-center justify-center">
//                   <img
//                     className="w-12 mb-2"
//                     src={assets.parcel_icon}
//                     alt="parcel"
//                   />
//                 </div>

//                 {/* Items + Address */}
//                 <div className="flex-1 space-y-2">
//                   {items.map((item, itemIndex) => (
//                     <p className="py-0.5" key={itemIndex}>
//                       {item.name} x {item.quantity} <span>{item.size}</span>
//                     </p>
//                   ))}
//                   <div className="pt-2">
//                     <p className="mt-3 mb-2 font-medium">
//                       {address.firstName + " " + address.lastName}
//                     </p>
//                     <p>{address.street}</p>
//                     <p>
//                       {address.city}, {address.state}, {address.country},{" "}
//                       {address.zipcode}
//                     </p>
//                     <p>{address.phone}</p>
//                   </div>
//                 </div>

//                 {/* Order Info */}
//                 <div className="space-y-1 min-w-[140px]">
//                   <p className="text-small sm:text-[15px]">
//                     Items: {items.length}
//                   </p>
//                   <p className="mt-3">Method: {order.paymentMethod}</p>
//                   <p>Payment: {order.payment ? "Done" : "Pending"}</p>
//                   <p>Date: {new Date(order.date).toLocaleDateString()}</p>
//                 </div>

//                 {/* Amount */}
//                 <div className="space-y-1 min-w-[140px]">
//                   <p className="text-small sm:text-[15px]">
//                     {currency}
//                     {order.amount}
//                   </p>
//                 </div>

//                 {/* Order Status Selector */}
//                 <div className="w-[150px]">
//                   <select
//                     value={order.status}
//                     defaultValue={order.status}
//                     className="w-full border font-semibold rounded px-2 py-1 text-sm"
//                   >
//                     <option value="Order Placed">Order Placed</option>
//                     <option value="Packing">Packing</option>
//                     <option value="Shipped">Shipped</option>
//                     <option value="Out for Delivery">Out for Delivery</option>
//                     <option value="Delivered">Delivered</option>
//                   </select>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <p>No orders found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminOrders;

import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast

const AdminOrders = () => {
  const { token, currency } = useContext(ShopContext);
  const [localOrders, setLocalOrders] = useState([]);

  // Fetch all orders from the API
  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.get(
        "https://localhost:7039/api/Orders/all-orders",
        {
          headers: { token },
        }
      );
      console.log(response.data);
      setLocalOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch admin orders:", error);
    }
  };

  // Handle order status change from the dropdown
  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    const stringOrderId = orderId.toString(); // Ensure orderId is a string if necessary

    try {
      const response = await axios.put(
        `https://localhost:7039/api/Orders/update-order-status/${stringOrderId}`,
        newStatus, // Send just the newStatus as a plain string, not as an object
        {
          headers: {
            "Content-Type": "application/json", // Ensure proper content type
            token, // Include token if necessary
          },
        }
      );

      if (response.status === 200) {
        console.log("Order status updated:", response.data);

        // Instead of manually updating the local state, trigger a re-fetch of orders to ensure UI consistency
        fetchAllOrders(); // Re-fetch the orders to get the updated status

        // Show success toast with orderId included
        toast.success(
          `Order ${orderId} status updated to "${newStatus}" successfully!`,
          {
            position: "top-right", // Position of the toast
            autoClose: 5000, // Duration for the toast
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            pauseOnHover: true,
          }
        );
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error(
        `Failed to update order ${orderId} status. Please try again.`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          pauseOnHover: true,
        }
      );
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-semibold mb-6">Admin Orders</h1>

        {localOrders.length > 0 ? (
          localOrders.map((order, index) => {
            const items = Array.isArray(order.items)
              ? order.items
              : JSON.parse(order.items);
            const address = JSON.parse(order.address);

            return (
              <div
                key={index}
                className="flex flex-wrap md:flex-nowrap justify-between items-start gap-4 border p-5 rounded-lg shadow mb-6 text-sm text-gray-700 bg-white"
              >
                {/* Parcel Icon */}
                <div className="flex-shrink-0 flex items-center justify-center">
                  <img
                    className="w-12 mb-2"
                    src={assets.parcel_icon}
                    alt="parcel"
                  />
                </div>

                {/* Items + Address */}
                <div className="flex-1 space-y-2">
                  {items.map((item, itemIndex) => (
                    <p className="py-0.5" key={itemIndex}>
                      {item.name} x {item.quantity} <span>{item.size}</span>
                    </p>
                  ))}
                  <div className="pt-2">
                    <p className="mt-3 mb-2 font-medium">
                      {address.firstName + " " + address.lastName}
                    </p>
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.state}, {address.country},{" "}
                      {address.zipcode}
                    </p>
                    <p>{address.phone}</p>
                  </div>
                </div>

                {/* Order Info */}
                <div className="space-y-1 min-w-[140px]">
                  <p className="text-small sm:text-[15px]">
                    Items: {items.length}
                  </p>
                  <p className="mt-3">Method: {order.paymentMethod}</p>
                  <p>Payment: {order.payment ? "Done" : "Pending"}</p>
                  <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                </div>

                {/* Amount */}
                <div className="space-y-1 min-w-[140px]">
                  <p className="text-small sm:text-[15px]">
                    {currency}
                    {order.amount}
                  </p>
                </div>

                {/* Order Status Selector */}
                <div className="w-[150px]">
                  <select
                    value={order.status} // Controlled Component: `value` prop
                    className="w-full border font-semibold rounded px-2 py-1 text-sm"
                    onChange={(event) => statusHandler(event, order.orderId)} // Use `order.orderId` instead of `order.id`
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            );
          })
        ) : (
          <p>No orders found</p>
        )}
      </div>

      {/* Toast Container - this is where the toasts will appear */}
      <ToastContainer />
    </div>
  );
};

export default AdminOrders;
