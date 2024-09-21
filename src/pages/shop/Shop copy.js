import React, { useState, useEffect } from "react";
import { Pagination } from "antd";
import { fetchProductsByFilter, getProductsByPage } from "../functions/product";
import SearchFilter from "./SearchFilter";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Handles current page state
  const [filters, setFilters] = useState({}); // Manages filters state
  const [loading, setLoading] = useState(false); // Loading state for UX

  // Fetch products by page (default view without filters)
  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      const { data } = await getProductsByPage(page);
      setProducts(data.products);
      setTotalProducts(data.totalProducts); // Update total products for pagination
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // Fetch products by filters
  const fetchFilteredProducts = async (filters) => {
    setLoading(true);
    try {
      const { data } = await fetchProductsByFilter(filters);
      setProducts(data.products);
      setTotalProducts(data.totalProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      setLoading(false);
    }
  };

  // Effect to fetch products initially and when the page changes
  useEffect(() => {
    if (Object.keys(filters).length === 0) {
      // Fetch without filters
      fetchProducts(currentPage);
    }
  }, [currentPage]);

  // Effect to handle filters change (resets page to 1 when filters are applied)
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      setCurrentPage(1); // Reset page to 1 when filters change
      fetchFilteredProducts(filters);
    }
  }, [filters]);

  return (
    <div className="shop-container">
      <div className="filters">
        {/* SearchFilter component will set the filters */}
        <SearchFilter setFilters={setFilters} />
      </div>
      <div className="products">
        {loading ? (
          <h4>Loading...</h4>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-item">
              {/* Display product details here */}
              <h5>{product.name}</h5>
              {/* Add more product details if needed */}
            </div>
          ))
        )}
      </div>
      <div className="pagination">
        <Pagination
          current={currentPage}
          total={totalProducts}
          onChange={(page) => setCurrentPage(page)} // Changes the current page
          pageSize={2} // Set per page size to match backend limit
        />
      </div>
    </div>
  );
};

export default Shop;
