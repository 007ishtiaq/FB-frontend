import React from "react";
import Skeleton from "react-loading-skeleton";
import "./BrandBannerSkull.css";

export default function BrandBannerSkull({ clone }) {
  return Array(clone)
    .fill(0)
    .map((item, i) => (
      <div class="itemcolum colecitem">
        <div className="skullcontainer" key={i}>
          <div className="brandimgskull">
            <Skeleton className="brandimgskull" />
          </div>
        </div>
      </div>
    ));
}
