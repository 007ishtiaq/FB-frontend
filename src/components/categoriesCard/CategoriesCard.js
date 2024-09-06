import React, { useState, useEffect } from "react";
import "./CategoryCard.css";
import { Link } from "react-router-dom";
import { getCategories } from "../../functions/category";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import Skeleton from "react-loading-skeleton";
import CategoryBannerSkull from "../Skeletons/CategoryBannerSkull";

export default function CategoriesCard({ slug }) {
  const [categories, setCategories] = useState([]);
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
      const default_active = document.querySelector(
        `.${query.get("category")}`
      );
      if (default_active) {
        default_active.classList.add("active");
      }
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query.get("category")]);

  useEffect(() => {
    getCategories().then((c) => {
      setCategories(c.data);
      setLoading(false);
    });
  }, []);

  return (
    <div class="cardcontainer">
      <div class="insidecont">
        {loading ? (
          <div class="contentcont categorycont">
            <CategoryBannerSkull clone={12} />
          </div>
        ) : (
          <div class="contentcont categorycont">
            {categories.map((c) => (
              <div class={`itemcolum clsremove ${c.slug}`} key={c._id}>
                <Link to={`/category/?category=${c.slug}`}>
                  <img
                    class="cateimg"
                    src={c.image.url}
                    alt={c.name}
                    onLoad={() => setImageLoaded(true)}
                    style={{ display: imageLoaded ? "block" : "none" }}
                  />
                  {!imageLoaded && (
                    <Skeleton
                      class="cateimg"
                      style={{
                        display: imageLoaded ? "none" : "inline-block",
                        height: 100,
                      }}
                    />
                  )}
                  <p class="catenameside">{c.name}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
