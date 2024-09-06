import React, { useState, useEffect } from "react";
import "./SliderDiv.css";
import Slider from "./Slider/Slider";
import CategoriesPanal from "./categoriesPanal/CategoriesPanal";
import { getCategoriesslider } from "../../functions/category";
// import categorydata from "./responses/categorydata";
// Categories={categorydata.Categories}

export default function () {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    getCategoriesslider().then((res) => {
      setLoading(false);
      setCategories(res.data);
    });

    // Check if the screen width is less than 700px
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);

  return (
    <>
      <div className="sliderdiv">
        {!isMobile && (
          <CategoriesPanal loading={loading} Categories={categories} />
        )}
        <div className="slidercenterdiv">
          <Slider />
        </div>
      </div>
    </>
  );
}
