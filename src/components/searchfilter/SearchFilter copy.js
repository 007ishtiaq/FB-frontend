import React, { useState } from "react";

const SearchFilter = ({ setFilters }) => {
  const [query, setQuery] = useState("");
  const [price, setPrice] = useState([0, 1000]);
  const [category, setCategory] = useState(null);
  const [stars, setStars] = useState(null);
  const [sub, setSub] = useState(null);
  const [shipping, setShipping] = useState(null);
  const [color, setColor] = useState(null);
  const [brand, setBrand] = useState(null);

  // Function to apply all filters together
  const applyFilters = () => {
    const filterParams = {
      ...(query && { query }),
      ...(price.length && { price }),
      ...(category && { category }),
      ...(stars && { stars }),
      ...(sub && { sub }),
      ...(shipping && { shipping }),
      ...(color && { color }),
      ...(brand && { brand }),
    };
    setFilters(filterParams); // Update filters in Shop component
  };

  return (
    <div className="search-filter">
      {/* Query Filter */}
      <div>
        <h4>Search Query</h4>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
        />
      </div>

      {/* Price Range Filter */}
      <div>
        <h4>Price Range</h4>
        <input
          type="range"
          min="0"
          max="1000"
          value={price[1]}
          onChange={(e) => setPrice([0, e.target.value])}
        />
      </div>

      {/* Category Filter */}
      <div>
        <h4>Category</h4>
        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          {/* Add more categories dynamically if needed */}
        </select>
      </div>

      {/* Stars Filter */}
      <div>
        <h4>Rating</h4>
        <select onChange={(e) => setStars(e.target.value)}>
          <option value="">Select Rating</option>
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>
      </div>

      {/* Sub-category Filter */}
      <div>
        <h4>Sub-Category</h4>
        <input
          type="text"
          value={sub}
          onChange={(e) => setSub(e.target.value)}
          placeholder="Enter Sub-Category"
        />
      </div>

      {/* Shipping Filter */}
      <div>
        <h4>Shipping</h4>
        <select onChange={(e) => setShipping(e.target.value)}>
          <option value="">Select Shipping</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* Color Filter */}
      <div>
        <h4>Color</h4>
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="Enter Color"
        />
      </div>

      {/* Brand Filter */}
      <div>
        <h4>Brand</h4>
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Enter Brand"
        />
      </div>

      {/* Apply Filters Button */}
      <button onClick={applyFilters}>Apply Filters</button>
    </div>
  );
};

export default SearchFilter;
