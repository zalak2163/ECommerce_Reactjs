// import React, { useContext, useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import { ShopContext } from "../context/ShopContext"; // Import the ShopContext
// import { toast } from "react-toastify";
// import { currency } from "../App";
// import axios from "axios";

// const List = () => {
//   const { products, loading } = useContext(ShopContext);
//   const [list, setList] = useState([]);

//   const removeProduct = async (id) => {
//     try {
//       await axios.delete(`https://localhost:7039/api/Products/${id}`);

//       toast.success("Product deleted successfully!");

//       // Remove deleted product from the UI
//       setList((prev) => prev.filter((item) => item.id !== id));
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to delete product.");
//     }
//   };

//   useEffect(() => {
//     if (!loading && products.length > 0) {
//       setList(products);
//     }
//   }, [loading, products]);

//   if (loading) {
//     return <p>Loading products...</p>;
//   }

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Content Area */}
//       <div className="flex-1 m-8">
//         <p className="mb-2">All Products List</p>
//         <div className="flex flex-col gap-2">
//           {/* List Table Title */}
//           <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
//             <b>Image</b>
//             <b>Name</b>
//             <b>Category</b>
//             <b>Price</b>
//             <b className="text-center">Action</b>
//           </div>

//           {/* List Table Rows */}
//           {list.map((item) => {
//             // Safely extract image URL
//             let imageUrl = "";
//             if (Array.isArray(item.images)) {
//               imageUrl = item.images[0];
//             } else if (typeof item.images === "string") {
//               imageUrl = item.images.split(",")[0].trim();
//             }

//             return (
//               <div
//                 key={item.id}
//                 className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border-b"
//               >
//                 <img
//                   src={imageUrl}
//                   alt={item.name}
//                   className="w-16 h-16 object-cover"
//                   onError={(e) => {
//                     e.target.src = "/placeholder.jpg";
//                   }}
//                 />
//                 <p>{item.name}</p>
//                 <p>{item.category}</p>
//                 <p>
//                   {currency}
//                   {item.price}
//                 </p>
//                 <p className="text-center">
//                   <button
//                     onClick={() => removeProduct(item.id)}
//                     className="text-red-600 hover:text-red-800 cursor-pointer"
//                   >
//                     X
//                   </button>
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default List;

import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { currency } from "../App";
import axios from "axios";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const List = () => {
  const { products, loading } = useContext(ShopContext);
  const [list, setList] = useState([]);

  const removeProduct = async (id) => {
    try {
      await axios.delete(`https://localhost:7039/api/Products/${id}`);
      toast.success("Product deleted successfully!");
      setList((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product.");
    }
  };

  useEffect(() => {
    if (!loading && products.length > 0) {
      setList(products);
    }
  }, [loading, products]);

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="flex-1 m-8">
        <p className="mb-2 font-semibold text-lg">All Products List</p>
        <div className="flex flex-col gap-2">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[2fr_3fr_1fr_1fr_2fr_1fr] items-center py-2 px-2 border bg-gray-100 text-sm font-semibold">
            <b>Images</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Sizes</b>
            <b className="text-center">Action</b>
          </div>

          {/* Product Rows */}
          {list.map((item) => {
            // Extract images
            const imageArray = Array.isArray(item.images)
              ? item.images
              : item.images?.split(",").map((img) => img.trim()) || [];

            // Extract sizes
            const sizeArray = item.sizes
              ? item.sizes.split(",").map((size) => size.trim())
              : [];

            return (
              <div
                key={item.id}
                className="grid grid-cols-[2fr_3fr_1fr_1fr_2fr_1fr] items-center gap-2 py-2 px-2 border-b"
              >
                {/* Images */}
                <div className="flex gap-1 flex-wrap">
                  {imageArray.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Product ${item.name} image ${idx + 1}`}
                      className="w-12 h-12 object-cover rounded border"
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />
                  ))}
                </div>

                {/* Name */}
                <p>{item.name}</p>

                {/* Category */}
                <p>{item.category}</p>

                {/* Price */}
                <p>
                  {currency}
                  {item.price}
                </p>

                {/* Sizes */}
                <p className="flex flex-wrap gap-1">
                  {sizeArray.map((size, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-gray-200 rounded-full"
                    >
                      {size}
                    </span>
                  ))}
                </p>

                {/* Actions */}
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={() => removeProduct(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <img
                      className="h-4 w-4"
                      src={assets.bin_icon}
                      alt="Delete"
                    />
                  </button>
                  <Link to={`/edit/${item.id}`}>
                    <button className="text-blue-600 hover:text-blue-800">
                      <img
                        className="h-4 w-4"
                        src={assets.edit_icon}
                        alt="Edit"
                      />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default List;
