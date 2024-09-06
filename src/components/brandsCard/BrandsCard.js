import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBrands } from "../../functions/brands";
import "./BrandsCard.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import Skeleton from "react-loading-skeleton";
import BrandBannerSkull from "../Skeletons/BrandBannerSkull";
import CategoryBannerSkull from "../Skeletons/CategoryBannerSkull";

export default function BrandsCard() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const Allactives = document.querySelectorAll(".clsremove");
      Allactives.forEach((Elemactive) => {
        Elemactive.classList.remove("active");
      });
      const default_active = document.querySelector(`.${query.get("brand")}`);
      if (default_active) {
        default_active.classList.add("active");
      }
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query.get("brand")]);

  useEffect(() => {
    getBrands().then((b) => {
      setLoading(false);
      setBrands(b.data);
    });
  }, []);

  return (
    <div class="cardcontainer">
      <div class="insidecont">
        <div class="mainhead colorhead">
          <div class="colorheading centerhead">
            <span> Official Brands </span>
          </div>
        </div>
        <div class="contentcont categorycont">
          {loading ? (
            // <CategoryBannerSkull clone={12} />
            <BrandBannerSkull clone={12} />
          ) : (
            brands.map((b) => (
              <div
                class={`itemcolum colecitem clsremove ${b.slug}`}
                key={b._id}
              >
                <Link to={`/brand/?brand=${b.slug}`}>
                  <img
                    class="colecimg"
                    src={b.image.url}
                    alt={b.name}
                    onLoad={() => setImageLoaded(true)}
                    style={{ display: imageLoaded ? "block" : "none" }}
                  />
                  {!imageLoaded && (
                    <Skeleton
                      class="colecimg"
                      style={{
                        display: imageLoaded ? "none" : "inline-block",
                        height: 70,
                      }}
                    />
                  )}
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
