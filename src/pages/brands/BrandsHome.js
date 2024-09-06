import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./BrandsHome.css";
import { Online } from "react-detect-offline";
import { getBrand } from "../../functions/brands";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import BrandsCard from "../../components/brandsCard/BrandsCard";
import ProductsCardAll from "../../components/ProductsCardAll/ProductsCardAll";
import { toast } from "react-hot-toast";

export default function BrandsHome({ history }) {
  const [brandprodcount, setBrandprodcount] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery();
  let slug = query.get("brand");

  useEffect(() => {
    if (navigator.onLine) {
      loadBrandProducts();
    } else {
      dispatch({
        type: "SET_NETMODAL_VISIBLE",
        payload: true,
      });
    }
  }, [query.get("brand"), navigator.onLine, Online]);

  const loadBrandProducts = () => {
    getBrand(slug)
      .then((res) => {
        setBrandprodcount(res.data.brand);
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          toast.error(error.response.data.error);
          history.push("/404");
          setLoading(false);
          // console.error("Brand not found:", error);
        } else {
          // Handle other errors
          toast.error("Error fetching brand");
          console.error("Error fetching brand:", error);
          setLoading(false);
        }
      });
  };

  return (
    <div className="centercont">
      <BrandsCard />
      <Online onChange={loadBrandProducts} />
      <ProductsCardAll products={products} loading={loading} />
    </div>
  );
}
