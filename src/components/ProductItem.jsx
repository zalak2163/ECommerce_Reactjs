// import React, { useContext } from "react";
// import { ShopContext } from "../context/ShopContext";
// import { Link } from "react-router-dom";

// const ProductItem = ({ id, images, name, price }) => {
//   // Log a stack trace if the id is undefined
//   if (!id) {
//     console.trace(" ProductItem rendered without id!");
//     return null; // Prevent rendering if there's an error with props
//   }

//   const { currency } = useContext(ShopContext);

//   return (
//     <Link className="text-gray-700 cursor-pointer" to={`/products/${id}`}>
//       <div className="overflow-hidden flex justify-center items-center">
//         <img
//           src={images} // Ensure images is a valid URL (add Array handling if needed)
//           className="w-64 h-64 object-cover hover:scale-110 transition-transform duration-300 ease-in-out"
//           alt={name}
//         />
//       </div>
//       <p className="pt-3 pb-1 text-sm text-center">{name}</p>
//       <p className="text-sm font-medium text-center">
//         {currency}
//         {price}
//       </p>
//     </Link>
//   );
// };

// export default ProductItem;
import React from "react";
import { Link } from "react-router-dom";

const ProductItem = ({ id, images, name, price }) => {
  // ✅ Extract the first image from comma-separated string
  const firstImage = images?.split(",")[0]?.trim() || "";

  return (
    <Link to={`/product/${id}`} className="block">
      <div className="w-full bg-gray-100 rounded overflow-hidden shadow hover:shadow-lg transition-shadow">
        <img
          src={firstImage}
          alt={name}
          className="w-full h-60 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/fallback.jpg"; // Optional fallback image
          }}
        />
        <div className="p-2">
          <h3 className="text-sm font-medium truncate">{name}</h3>
          <p className="text-gray-600 text-sm">${price}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
