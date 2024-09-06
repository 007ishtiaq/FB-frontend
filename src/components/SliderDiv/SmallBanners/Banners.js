import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRelatedBanners } from "../../../functions/banner";
import SmallBannerSkull from "../../Skeletons/SmallBannerSkull";

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    getRelatedBanners("HomePageSmallBanner").then((b) => {
      setLoading(false);
      setBanners(b.data);
    });
  }, []);

  return (
    <div class="sliderrightdiv">
      <div class="banner1">
        {loading ? (
          <SmallBannerSkull />
        ) : (
          <Link to={banners && banners.length > 0 && banners[1].link}>
            <img
              src={banners && banners.length > 0 && banners[1].image.url}
              alt={banners && banners.length > 0 && banners[1].name}
              onLoad={() => setImageLoaded(true)}
              style={{ display: imageLoaded ? "block" : "none" }}
            />
            {!imageLoaded && (
              <SmallBannerSkull
                style={{ display: imageLoaded ? "none" : "inline-block" }}
              />
            )}
          </Link>
        )}
      </div>
      <div class="banner2">
        {loading ? (
          <SmallBannerSkull />
        ) : (
          <Link to={banners && banners.length > 0 && banners[0].link}>
            <img
              src={banners && banners.length > 0 && banners[0].image.url}
              alt={banners && banners.length > 0 && banners[0].name}
              onLoad={() => setImageLoaded(true)}
              style={{ display: imageLoaded ? "block" : "none" }}
            />
            {!imageLoaded && (
              <SmallBannerSkull
                style={{ display: imageLoaded ? "none" : "inline-block" }}
              />
            )}
          </Link>
        )}
      </div>
    </div>
  );
}
