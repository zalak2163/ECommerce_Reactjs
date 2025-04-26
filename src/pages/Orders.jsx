import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets"; // Ensure assets.defaultImage exists

const Orders = () => {
  const { user, orders, currency, loading } = useContext(ShopContext);

  // If loading data
  if (loading)
    return <div className="orders-loading">Loading your orders...</div>;

  // If user is not logged in
  if (!user)
    return (
      <div className="text-center py-10">
        <p>Please log in to view your orders.</p>
      </div>
    );

  // If no orders are found
  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <p>You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div>
        {orders.map((order, index) => {
          const address = JSON.parse(order.address); // Parse shipping address
          const items = JSON.parse(order.items); // Parse order items

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col gap-6"
            >
              {/* Loop through all items in the order */}
              {items.map((item, itemIndex) => {
                const imageUrl =
                  item.images && item.images.length
                    ? item.images.split(",")[0].trim()
                    : assets.defaultImage;

                return (
                  <div
                    key={itemIndex}
                    className="flex flex-col md:flex-row items-start gap-6 text-sm"
                  >
                    {/* Item Image */}
                    <img
                      className="w-16 sm:w-20"
                      src={imageUrl}
                      alt={item.name || "Order Item"}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = assets.defaultImage;
                      }}
                    />
                    <div className="flex-1">
                      {/* Order Info */}
                      <p className="sm:text-base font-medium">{item.name}</p>
                      <div className="flex flex-col sm:flex-row items-start gap-3 mt-2 text-base text-gray-700">
                        <p className="text-lg">
                          {currency}
                          {item.price * item.quantity}
                        </p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Size: {item.size}</p>
                      </div>
                      {/* Order Date */}
                      <p className="mt-2">
                        Date:{" "}
                        <span className="text-gray-400">
                          {new Date(order.date).toLocaleString()}
                        </span>
                      </p>
                      <p className="mt-2">Payment: {order.paymentMethod}</p>
                    </div>

                    {/* Right: Order Status & Track */}
                    <div className="flex items-center gap-4 mt-6">
                      <div className="flex items-center gap-2">
                        <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                        <p className="text-sm md:text-base">{order.status}</p>
                      </div>
                      <button
                        // onClick={loadOrderData}
                        className="border px-4 py-2 text-sm font-medium rounded-sm"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
