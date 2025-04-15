import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [imageUrls, setImageUrls] = useState(["", "", "", ""]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7039/api/Products/${id}`
        );
        const data = response.data;
        setProduct(data);

        // Prepare image URLs
        const imgArray = Array.isArray(data.images)
          ? data.images
          : data.images?.split(",").map((img) => img.trim()) || [];
        setImageUrls([...imgArray, "", "", "", ""].slice(0, 4));

        // Parse sizes
        setSizes(data.sizes ? data.sizes.split(",").map((s) => s.trim()) : []);
      } catch (error) {
        toast.error("Failed to fetch product data");
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setProduct((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleImageUrlChange = (value, index) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = value;
    setImageUrls(updatedUrls);
  };

  const handleSizeToggle = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      ...product,
      images: imageUrls.filter((url) => url.trim() !== "").join(","),
      sizes: sizes.join(","),
    };

    try {
      await axios.put(
        `https://localhost:7039/api/Products/${id}`,
        updatedProduct
      );
      toast.success("Product updated successfully");
      setTimeout(() => {
        window.location.href = "/list";
      }, 1000); // 1 second delay so the user sees the toast
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <form
        onSubmit={handleSubmit}
        className="ml-3 flex flex-col w-full max-w-2xl gap-4 p-6 rounded"
      >
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>

        {/* Image URLs */}
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

        {/* Product Name */}
        <div className="w-full">
          <p className="mb-2">Product Name</p>
          <input
            onChange={handleInputChange}
            value={product.name}
            name="name"
            className="w-full px-3 py-2 border-2 rounded"
            type="text"
            required
          />
        </div>

        {/* Description */}
        <div className="w-full">
          <p className="mb-2">Product Description</p>
          <textarea
            onChange={handleInputChange}
            value={product.description}
            name="description"
            className="w-full px-3 py-2 border-2 rounded"
            required
          />
        </div>

        {/* Category, Subcategory, Price */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <p className="mb-2">Category</p>
            <select
              name="category"
              value={product.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border-2 rounded"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div className="flex-1">
            <p className="mb-2">Sub Category</p>
            <select
              name="subCategory"
              value={product.subCategory}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border-2 rounded"
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div className="flex-1">
            <p className="mb-2">Price</p>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border-2 rounded"
              required
            />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <p className="mb-2">Product Sizes</p>
          <div className="flex gap-3">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div key={size} onClick={() => handleSizeToggle(size)}>
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

        {/* Bestseller Checkbox */}
        <div className="flex gap-2 mt-2 items-center">
          <input
            type="checkbox"
            id="bestseller"
            name="bestSeller"
            checked={product.bestSeller || false}
            onChange={handleInputChange}
          />
          <label htmlFor="bestseller">Add to Bestseller</label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-32 py-3 mt-4 bg-black text-white rounded"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default Edit;
