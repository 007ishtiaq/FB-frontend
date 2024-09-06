import React from "react";
import Skeleton from "react-loading-skeleton";
import "./ProductCardSkull.css";

export default function ProductCardSkull({ clone, contWidth, FlashSalesCont }) {
  const widthadjust = () => {
    const rootwidth = document.getElementById("root").clientWidth;

    if (rootwidth >= 1113) {
      return { width: `${(contWidth * 16.32) / 100 - 4}px` };
    }
    if (rootwidth >= 975) {
      return { width: `${(contWidth * 16.29) / 100 - 4}px` };
    }
    if (rootwidth >= 750) {
      return { width: `${(contWidth * 19.5) / 100 - 4}px` };
    }
    if (rootwidth >= 701) {
      return { width: `${(contWidth * 24.5) / 100 - 4}px` };
    }
    if (rootwidth >= 530) {
      return { width: `${(contWidth * 28.0) / 100 - 4}px` };
    }
    if (rootwidth >= 320) {
      return { width: `${(contWidth * 38.8) / 100 - 4}px` };
    }

    // Default case if none of the conditions are met
    return {};
  };

  return Array(clone)
    .fill(0)
    .map((item, i) => (
      <div
        key={i}
        style={FlashSalesCont ? widthadjust() : {}}
        class={`itemcolum searchitemcol`}
      >
        <div className="skullcontainer">
          <div className="imgskull">
            <Skeleton className="imgskull" />
          </div>
        </div>
        <div className="imgratecont">
          <div className="whalf">
            <Skeleton />
          </div>
          <div className="whalf">
            <Skeleton />
          </div>
        </div>
        <p class="prodnameside">
          <Skeleton />
          <Skeleton />
          <div className="whalfmore">
            <Skeleton />
          </div>
        </p>
        <div className="imgratecont">
          <div className="whalf">
            <Skeleton />
          </div>
          <div className="whalf">
            <Skeleton />
          </div>
        </div>
      </div>
    ));
}
