import React from "react";
import { ReactComponent as StarFull } from "../../images/searchpage/starfull.svg";
import { ReactComponent as StarHalf } from "../../images/searchpage/starhalf.svg";
import { ReactComponent as StarEmpty } from "../../images/searchpage/starempty.svg";

export default function Mystars({
  rating,
  containerclass,
  StarFullclass,
  StarHalfclass,
  StarEmptyclass,
}) {
  return (
    <span className={containerclass}>
      <span>
        {rating >= 1 ? (
          <StarFull className={StarFullclass}></StarFull>
        ) : rating >= 0.5 ? (
          <StarHalf className={StarHalfclass}></StarHalf>
        ) : (
          <StarEmpty className={StarEmptyclass}></StarEmpty>
        )}
      </span>
      <span>
        {rating >= 2 ? (
          <StarFull className={StarFullclass}></StarFull>
        ) : rating >= 1.5 ? (
          <StarHalf className={StarHalfclass}></StarHalf>
        ) : (
          <StarEmpty className={StarEmptyclass}></StarEmpty>
        )}
      </span>
      <span>
        {rating >= 3 ? (
          <StarFull className={StarFullclass}></StarFull>
        ) : rating >= 2.5 ? (
          <StarHalf className={StarHalfclass}></StarHalf>
        ) : (
          <StarEmpty className={StarEmptyclass}></StarEmpty>
        )}
      </span>
      <span>
        {rating >= 4 ? (
          <StarFull className={StarFullclass}></StarFull>
        ) : rating >= 3.5 ? (
          <StarHalf className={StarHalfclass}></StarHalf>
        ) : (
          <StarEmpty className={StarEmptyclass}></StarEmpty>
        )}
      </span>
      <span>
        {rating >= 5 ? (
          <StarFull className={StarFullclass}></StarFull>
        ) : rating >= 4.5 ? (
          <StarHalf className={StarHalfclass}></StarHalf>
        ) : (
          <StarEmpty className={StarEmptyclass}></StarEmpty>
        )}
      </span>
    </span>
  );
}
