import React, { useState, useEffect } from "react";
import { trackEvent } from "../utils/facebookPixel";
import Sliderdiv from "../components/SliderDiv/Sliderdiv";
import ProductsGroup from "../components/productsSlidable/productGroup/ProductsGroup";
import CommonProductsCont from "../components/CommonProductsCont/CommonProductsCont";
import CategoriesCard from "../components/categoriesCard/CategoriesCard";
import MegaBanner from "../components/megabanner/MegaBanner";
import { Online } from "react-detect-offline";
import { getRelatedBanners } from "../functions/banner";
import Catebanner from "../components/catebanner/Catebanner";

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.onLine) {
      loadBannerData();
    }
  }, [navigator.onLine, Online]);

  useEffect(() => {
    trackEvent("HomePageView", { page: "home" });
  }, []);

  const loadBannerData = () => {
    getRelatedBanners("FlashSaleBanner")
      .then((res) => {
        setBanners(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="centercont">
        <Sliderdiv />
        <CategoriesCard />
        <ProductsGroup />
        <MegaBanner loading={loading} banner={banners[0]} />
        <CommonProductsCont WidthIdea={"Fullwidth"} />
        <Catebanner />
      </div>
    </>
  );
};

export default Home;
