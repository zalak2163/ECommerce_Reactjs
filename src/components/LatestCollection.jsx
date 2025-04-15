import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 10)); // Only get the first 10 products
      setLoading(false);
    }
  }, [products]);

  if (loading) {
    return <p>Loading latest collection...</p>;
  }

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our fresh and fashionable new arrivals, designed to keep you
          stylish all year round. From casual wear to trendy outfits, explore
          the latest in fashion right here.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((item) => {
          // If the item doesn't have an id, skip it
          if (!item.id) {
            console.warn("Product item missing id:", item);
            return null; // Prevent rendering this item
          }
          console.log("Rendering product:", item);
          return (
            <ProductItem
              key={item.id}
              id={item.id}
              images={item.images}
              name={item.name}
              price={item.price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LatestCollection;
