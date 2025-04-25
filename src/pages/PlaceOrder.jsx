import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localCartItems, setLocalCartItems] = useState([]);

  const {
    navigate,
    token,
    cartItems,
    getCartAmount,
    delivery_fee,
    products,
    user,
    setOrders,
  } = useContext(ShopContext);

  useEffect(() => {
    setLocalCartItems(cartItems || []);
    console.log("cartItems:", cartItems);
  }, [cartItems]);

  const userId = user?.userId;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    console.log("UserId in PlaceOrder Component: ", userId);
  }, [userId]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!userId) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    setIsSubmitting(true);
    toast.info("Placing your order, please wait...");

    try {
      const orderItems = localCartItems
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (product) {
            return {
              ...product,
              size: item.size,
              quantity: item.quantity,
            };
          }
          return null;
        })
        .filter(Boolean);

      const orderData = {
        address: JSON.stringify(formData),
        items: JSON.stringify(orderItems),
        amount: getCartAmount() + delivery_fee,
        userId,
        status: "Pending",
        paymentMethod: method.toUpperCase(),
        payment: false,
        date: Date.now(),
      };

      const response = await axios.post(
        "https://localhost:7039/api/Orders/place-order-cod",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response);

      if (response.data) {
        toast.success("🎉 Order placed successfully!");

        // 🧹 Clear cart from backend
        await Promise.all(
          cartItems.map((item) =>
            axios.delete(
              `https://localhost:7039/api/cart/delete/${item.cartId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
          )
        );

        setLocalCartItems([]); // Clear local cart
        setOrders((prevOrders) => [
          ...prevOrders,
          {
            ...orderData,
            id: response.data.orderId,
            date: new Date().toLocaleString(),
          },
        ]);

        setTimeout(() => navigate("/orders"), 2000);
      }
    } catch (error) {
      console.error("Caught error:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      } else if (error.request) {
        console.error("Request made but no response:", error.request);
      } else {
        console.error("General Error:", error.message);
      }

      toast.error("Something went wrong while placing the order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
      >
        {/* Left Side: Delivery Info */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
          <div className="text-xl sm:text-2xl my-3">
            <Title text1={"DELIVERY"} text2={"INFORMATION"} />
          </div>
          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              type="text"
              placeholder="First Name"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            />
            <input
              required
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
              type="text"
              placeholder="Last Name"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            />
          </div>
          <input
            required
            onChange={onChangeHandler}
            name="email"
            value={formData.email}
            type="email"
            placeholder="Email address"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="street"
            value={formData.street}
            type="text"
            placeholder="Street"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
              type="text"
              placeholder="City"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            />
            <input
              required
              onChange={onChangeHandler}
              name="state"
              value={formData.state}
              type="text"
              placeholder="State"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            />
          </div>
          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="zipcode"
              value={formData.zipcode}
              type="number"
              placeholder="Zipcode"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            />
            <input
              required
              onChange={onChangeHandler}
              name="country"
              value={formData.country}
              type="text"
              placeholder="Country"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            />
          </div>
          <input
            required
            onChange={onChangeHandler}
            name="phone"
            value={formData.phone}
            type="number"
            placeholder="Phone"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>

        {/* Right Side: Cart & Payment */}
        <div className="mt-8">
          <div className="mt-8 min-w-80">
            <CartTotal />
          </div>
          <div className="mt-12">
            <Title text1={"PAYMENT"} text2={"METHOD"} />
            <div className="flex gap-3 flex-col lg:flex-row">
              <div
                onClick={() => setMethod("stripe")}
                className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
              >
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${
                    method === "stripe" ? "bg-green-400" : ""
                  }`}
                ></p>
                <img
                  className="h-5 mx-4"
                  src={assets.stripe_logo}
                  alt="stripe"
                />
              </div>
              <div
                onClick={() => setMethod("razorpay")}
                className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
              >
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${
                    method === "razorpay" ? "bg-green-400" : ""
                  }`}
                ></p>
                <img
                  className="h-5 mx-4"
                  src={assets.Razorpay_logo}
                  alt="razorpay"
                />
              </div>
              <div
                onClick={() => setMethod("cod")}
                className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
              >
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${
                    method === "cod" ? "bg-green-400" : ""
                  }`}
                ></p>
                <img className="h-5 mx-4" src={assets.cod} alt="cod" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`mt-8 px-6 py-2 text-white rounded ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </>
  );
};

export default PlaceOrder;
