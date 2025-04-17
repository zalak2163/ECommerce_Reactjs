import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // This will be used for redirection
  const { products, currency, addToCart, user } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = async () => {
    const productId = Number(id);
    const product = products.find((item) => item.id === productId);

    if (product) {
      setProductData(product);

      const imageArray = product.images
        ? product.images.split(",").map((img) => img.trim())
        : [];
      setImages(imageArray);
      setMainImage(imageArray[0] || "");

      const sizeArray = product.sizes ? product.sizes.split(",") : [];
      if (sizeArray.length > 0) {
        setSize(sizeArray[0]);
      }
    } else {
      console.log("Product not found for id:", productId);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      fetchProductData();
    }
  }, [id, products]);

  // Redirect to login page if user is not logged in
  const handleAddToCart = () => {
    if (!user) {
      // If user is not logged in
      navigate("/login"); // Redirect to the login page
    } else {
      addToCart(productData.id, size); // If user is logged in, add to cart
    }
  };

  if (!productData) {
    return <div>Product not found or loading...</div>;
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Layout */}
      <div className="flex flex-col sm:flex-row gap-12 sm:gap-12">
        {/* Left: Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          {/* Thumbnails (max 4 shown) */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {images.length > 0 &&
              images
                .slice(0, 4)
                .map((item, index) => (
                  <img
                    key={index}
                    src={item}
                    onClick={() => setMainImage(item)}
                    className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border border-gray-200 hover:border-orange-500"
                    alt={`Thumbnail ${index + 1}`}
                  />
                ))}
          </div>

          {/* Main Image */}
          <div className="w-full sm:w-[80%]">
            <img
              className="w-full h-auto object-contain"
              src={mainImage}
              alt="Product Main"
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <img key={i} src={assets.star_icon} alt="" className="w-3.5" />
            ))}
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          {/* Sizes */}
          <div className="flex flex-col gap-4 my-8 ">
            <p>Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {productData.sizes.split(",").map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`bg-gray-100 py-2 px-4 border ${
                    item === size ? "border-orange-500" : "border-gray-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original products.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
