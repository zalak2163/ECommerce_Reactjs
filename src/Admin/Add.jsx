import React, { useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import { ShopContext } from "../context/ShopContext"; // Ensure this is imported from the correct path
import { toast } from "react-toastify";
import axios from "axios";

const Add = () => {
  const { products } = useContext(ShopContext);

  const [imageUrls, setImageUrls] = useState(["", "", "", ""]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const handleImageUrlChange = (value, index) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = value;
    setImageUrls(updatedUrls);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const product = {
      name,
      description,
      price,
      category,
      subCategory,
      sizes: sizes.join(","),
      images: imageUrls.filter((url) => url.trim() !== "").join(","),
      bestSeller: bestseller,
    };

    try {
      const response = await axios.post(
        "https://localhost:7039/api/Products",
        product,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Product added:", response.data);

      // Show success toast message
      toast.success("Product added successfully!");

      // Update the product list in the context (or local state)
      products((prevProducts) => [...prevProducts, response.data]); // Add new product to list
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      toast.error("Upload failed: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <form
        onSubmit={onSubmitHandler}
        className="ml-3 flex flex-col w-full max-w-2xl gap-3 p-6 rounded"
      >
        {/* Image URL Inputs */}
        <div>
          <p className="mb-2 font-semibold">Product Image URLs</p>
          <div className="flex flex-col gap-3">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleImageUrlChange(e.target.value, idx)}
                  placeholder={`Image URL ${idx + 1}`}
                  className="w-full px-3 py-2 border-2 rounded"
                />
                {url && (
                  <img
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    className="w-16 h-16 object-cover rounded border"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full">
          <p className="mb-2">Product Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full px-3 py-2 border-2 rounded"
            type="text"
            placeholder="Type here"
            required
          />
        </div>

        <div className="w-full">
          <p className="mb-2">Product Description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full px-3 py-2 border-2 rounded"
            placeholder="Write content here"
            required
          />
        </div>

        {/* Category, Subcategory, Price */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
          <div>
            <p className="mb-2">Category</p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2"
              value={category}
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <p className="mb-2">Sub Category</p>
            <select
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full px-3 py-2"
              value={subCategory}
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>
          <div>
            <p className="mb-2">Price</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full px-3 py-2 sm:w-[120px]"
              type="number"
              placeholder="25"
              required
            />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <p className="mb-2">Product Sizes</p>
          <div className="flex gap-3">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(size)
                      ? prev.filter((s) => s !== size)
                      : [...prev, size]
                  )
                }
              >
                <p
                  className={`${
                    sizes.includes(size) ? "bg-pink-200" : "bg-slate-200"
                  } px-3 py-1 cursor-pointer rounded`}
                >
                  {size}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <div className="flex gap-2 mt-2">
          <input
            onChange={() => setBestseller((prev) => !prev)}
            checked={bestseller}
            type="checkbox"
            id="bestseller"
          />
          <label className="cursor-pointer" htmlFor="bestseller">
            Add to bestseller
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;

// import React, { useState, useContext } from "react";
// import { ShopContext } from "../context/ShopContext"; // Ensure this is imported from the correct path
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; // Import for navigation
// import Sidebar from "../components/Sidebar";

// const Add = () => {
//   const { addProduct } = useContext(ShopContext); // Get addProduct from context
//   const navigate = useNavigate(); // Hook to redirect after form submission

//   // States for form input
//   const [imageUrls, setImageUrls] = useState(["", "", "", ""]);
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [category, setCategory] = useState("Men");
//   const [subCategory, setSubCategory] = useState("Topwear");
//   const [bestseller, setBestseller] = useState(false);
//   const [sizes, setSizes] = useState([]);

//   // Handle change for image URLs
//   const handleImageUrlChange = (value, index) => {
//     const updatedUrls = [...imageUrls];
//     updatedUrls[index] = value;
//     setImageUrls(updatedUrls);
//   };

//   // Form submission handler
//   const onSubmitHandler = async (e) => {
//     e.preventDefault();

//     // Create product object to send to API
//     const product = {
//       name,
//       description,
//       price,
//       category,
//       subCategory,
//       sizes: sizes.join(","),
//       images: imageUrls.filter((url) => url.trim() !== "").join(","),
//       bestSeller: bestseller,
//     };

//     try {
//       // Send POST request to API
//       const response = await axios.post(
//         "https://localhost:7039/api/Products",
//         product,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // Show success message
//       toast.success("Product added successfully!");

//       // Update global product state in context
//       addProduct(response.data);

//       // Redirect to product list page
//       navigate("/list");
//     } catch (err) {
//       console.error("Upload failed:", err.response?.data || err.message);
//       toast.error("Upload failed: " + (err.response?.data || err.message));
//     }
//   };

//   return (
//     <div className="flex w-full min-h-screen">
//       <Sidebar />
//       <form
//         onSubmit={onSubmitHandler}
//         className="ml-3 flex flex-col w-full max-w-2xl gap-3 p-6 rounded"
//       >
//         {/* Image URL Inputs */}
//         <div>
//           <p className="mb-2 font-semibold">Product Image URLs</p>
//           <div className="flex flex-col gap-3">
//             {imageUrls.map((url, idx) => (
//               <div key={idx} className="flex gap-3 items-center">
//                 <input
//                   type="text"
//                   value={url}
//                   onChange={(e) => handleImageUrlChange(e.target.value, idx)}
//                   placeholder={`Image URL ${idx + 1}`}
//                   className="w-full px-3 py-2 border-2 rounded"
//                 />
//                 {url && (
//                   <img
//                     src={url}
//                     alt={`Preview ${idx + 1}`}
//                     className="w-16 h-16 object-cover rounded border"
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Product Info */}
//         <div className="w-full">
//           <p className="mb-2">Product Name</p>
//           <input
//             onChange={(e) => setName(e.target.value)}
//             value={name}
//             className="w-full px-3 py-2 border-2 rounded"
//             type="text"
//             placeholder="Type here"
//             required
//           />
//         </div>

//         <div className="w-full">
//           <p className="mb-2">Product Description</p>
//           <textarea
//             onChange={(e) => setDescription(e.target.value)}
//             value={description}
//             className="w-full px-3 py-2 border-2 rounded"
//             placeholder="Write content here"
//             required
//           />
//         </div>

//         {/* Category, Subcategory, Price */}
//         <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
//           <div>
//             <p className="mb-2">Category</p>
//             <select
//               onChange={(e) => setCategory(e.target.value)}
//               className="w-full px-3 py-2"
//               value={category}
//             >
//               <option value="Men">Men</option>
//               <option value="Women">Women</option>
//               <option value="Kids">Kids</option>
//             </select>
//           </div>
//           <div>
//             <p className="mb-2">Sub Category</p>
//             <select
//               onChange={(e) => setSubCategory(e.target.value)}
//               className="w-full px-3 py-2"
//               value={subCategory}
//             >
//               <option value="Topwear">Topwear</option>
//               <option value="Bottomwear">Bottomwear</option>
//               <option value="Winterwear">Winterwear</option>
//             </select>
//           </div>
//           <div>
//             <p className="mb-2">Price</p>
//             <input
//               onChange={(e) => setPrice(e.target.value)}
//               value={price}
//               className="w-full px-3 py-2 sm:w-[120px]"
//               type="number"
//               placeholder="25"
//               required
//             />
//           </div>
//         </div>

//         {/* Sizes */}
//         <div>
//           <p className="mb-2">Product Sizes</p>
//           <div className="flex gap-3">
//             {["S", "M", "L", "XL", "XXL"].map((size) => (
//               <div
//                 key={size}
//                 onClick={() =>
//                   setSizes((prev) =>
//                     prev.includes(size)
//                       ? prev.filter((s) => s !== size)
//                       : [...prev, size]
//                   )
//                 }
//               >
//                 <p
//                   className={`${
//                     sizes.includes(size) ? "bg-pink-200" : "bg-slate-200"
//                   } px-3 py-1 cursor-pointer rounded`}
//                 >
//                   {size}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Bestseller */}
//         <div className="flex gap-2 mt-2">
//           <input
//             onChange={() => setBestseller((prev) => !prev)}
//             checked={bestseller}
//             type="checkbox"
//             id="bestseller"
//           />
//           <label className="cursor-pointer" htmlFor="bestseller">
//             Add to bestseller
//           </label>
//         </div>

//         {/* Submit Button */}
//         <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
//           ADD
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Add;
