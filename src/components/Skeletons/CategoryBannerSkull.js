import React from "react";
import Skeleton from "react-loading-skeleton";
import "./CategoryBannerSkull.css";

export default function CategoryBannerSkull({ clone }) {
  return Array(clone)
    .fill(0)
    .map((item, i) => (
      <div class="itemcolum" key={i}>
        <div className="skullcontainer">
          <div className="cateimgskull">
            <Skeleton className="cateimgskull" />
          </div>
        </div>
        <p class="catenameside">
          <Skeleton />
        </p>
      </div>
    ));
}
