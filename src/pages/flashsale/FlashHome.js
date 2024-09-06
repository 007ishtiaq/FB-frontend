import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Online } from "react-detect-offline";
import "./FlashHome.css";
import ProductsCardAll from "../../components/ProductsCardAll/ProductsCardAll";
import { getcurrentFlash } from "../../functions/product";
import MegaBanner from "../../components/megabanner/MegaBanner";
import { getRelatedBanners } from "../../functions/banner";

export default function FlashHome() {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (navigator.onLine) {
      loadFlashproducts();
    } else {
      dispatch({
        type: "SET_NETMODAL_VISIBLE",
        payload: true,
      });
    }
  }, [navigator.onLine, Online]);

  const loadFlashproducts = () => {
    Promise.all([getRelatedBanners("FlashSaleBanner"), getcurrentFlash()])
      .then(([bannerResponse, productsResponse]) => {
        setBanners(bannerResponse.data);
        setProducts(productsResponse.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  return (
    <div className="centercont">
      <MegaBanner loading={loading} banner={banners[1]} />
      <Online onChange={loadFlashproducts} />
      <ProductsCardAll
        products={products}
        loading={loading}
        flash={true}
        getcurrentFlash={getcurrentFlash}
      />

      <div>
        <h1>Product Sale Countdowns</h1>
      </div>
    </div>
  );
}
