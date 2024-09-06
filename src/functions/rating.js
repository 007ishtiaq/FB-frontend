import axios from "axios";
import React from "react";
import StarRating from "react-star-ratings";

export const showAverage = (p) => {
  if (p && p.ratings) {
    let ratingsArray = p && p.ratings;
    let total = [];
    let length = ratingsArray.length;
    // console.log("length", length);

    ratingsArray.map((r) => total.push(r.star));
    let totalReduced = total.reduce((p, n) => p + n, 0);
    // console.log("totalReduced", totalReduced);

    let highest = length * 5;
    // console.log("highest", highest);

    let result = (totalReduced * 5) / highest;
    // console.log("result", result);

    return (
      <div className="">
        <span>
          <StarRating
            starDimension="15px"
            starSpacing="0px"
            starRatedColor="var(--org-primary)"
            rating={result}
            editing={false}
          />
          {/* start count show with star */}
          {/* {result.toFixed(1)} */}
        </span>
      </div>
    );
  }
};

export const getAllRatings = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/admin/allratings`, {
    headers: {
      authtoken,
    },
  });

export const setRead = async (productId, ratingId, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/admin/commentRead`,
    { productId, ratingId },
    {
      headers: {
        authtoken,
      },
    }
  );

export const deleteComment = async (productId, ratingId, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/admin/deleteComment`,
    { productId, ratingId },
    {
      headers: {
        authtoken,
      },
    }
  );
