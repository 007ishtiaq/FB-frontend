import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCategory } from "../../functions/category";
import { Online } from "react-detect-offline";
import ProductCard from "../../components/cards/ProductCard";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import CategoriesCard from "../../components/categoriesCard/CategoriesCard";
import ProductsCardAll from "../../components/ProductsCardAll/ProductsCardAll";
import { toast } from "react-hot-toast";

const CategoryHome = ({ match, history }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery();
  let slug = query.get("category");

  useEffect(() => {
    if (navigator.onLine) {
      loadCategoryproducts();
    } else {
      dispatch({
        type: "SET_NETMODAL_VISIBLE",
        payload: true,
      });
    }
  }, [query.get("category"), navigator.onLine, Online]);

  const loadCategoryproducts = () => {
    getCategory(slug)
      .then((res) => {
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          toast.error(error.response.data.error);
          history.push("/404");
          // console.error("Brand not found:", error);
        } else {
          // Handle other errors
          toast.error("Error fetching category");
          console.error("Error fetching category:", error);
          setLoading(false);
        }
      });
  };

  return (
    <div className="centercont">
      <CategoriesCard slug={slug} />
      <Online onChange={loadCategoryproducts} />
      <ProductsCardAll products={products} loading={loading} />
    </div>
  );
};

export default CategoryHome;
