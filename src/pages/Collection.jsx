import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  // Load filters and sort from localStorage on first render
  useEffect(() => {
    const savedCategory = JSON.parse(localStorage.getItem("category")) || [];
    const savedSubCategory =
      JSON.parse(localStorage.getItem("subCategory")) || [];
    const savedSortType = localStorage.getItem("sortType") || "relavent";

    setCategory(savedCategory);
    setSubCategory(savedSubCategory);
    setSortType(savedSortType);

    // Apply filters with the restored values
    applyFilter(savedCategory, savedSubCategory);
  }, [products]);

  // Re-apply filtering if filters or search change
  useEffect(() => {
    applyFilter(category, subCategory);
  }, [category, subCategory, search, showSearch, products]);

  // Apply sorting whenever sort type or filtered products change
  useEffect(() => {
    if (filterProducts.length > 0) {
      sortProduct();
    }
  }, [sortType, filterProducts.length]);

  const toggleCategory = (e) => {
    const value = e.target.value;
    const updated = category.includes(value)
      ? category.filter((item) => item !== value)
      : [...category, value];
    setCategory(updated);
    localStorage.setItem("category", JSON.stringify(updated));
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    const updated = subCategory.includes(value)
      ? subCategory.filter((item) => item !== value)
      : [...subCategory, value];
    setSubCategory(updated);
    localStorage.setItem("subCategory", JSON.stringify(updated));
  };

  const applyFilter = (category, subCategory) => {
    let filtered = [...products];

    if (showSearch && search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      filtered = filtered.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      filtered = filtered.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(filtered);
  };

  const sortProduct = () => {
    if (!filterProducts.length) return;

    let sorted = [...filterProducts];
    switch (sortType) {
      case "low-high":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        return; // Do nothing for "relavent"
    }

    setFilterProducts(sorted);
  };

  const handleSortChange = (e) => {
    const selected = e.target.value;
    setSortType(selected);
    localStorage.setItem("sortType", selected);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORYES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["Men", "Women", "Kids"].map((label) => (
              <label key={label} className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={label}
                  checked={category.includes(label)}
                  onChange={toggleCategory}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* SubCategory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["Topwear", "Bottomwear", "Winterwear"].map((type) => (
              <label key={type} className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={type}
                  checked={subCategory.includes(type)}
                  onChange={toggleSubCategory}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          {/* Product Sort */}
          <select
            className="border-2 border-gray-300 text-sm px-2"
            onChange={handleSortChange}
            value={sortType}
          >
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item) => (
            <ProductItem
              key={item.id}
              name={item.name}
              id={item.id}
              price={item.price}
              images={item.images}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
