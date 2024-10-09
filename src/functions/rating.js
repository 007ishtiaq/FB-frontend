import axios from "axios";
import React from "react";
import StarRating from "react-star-ratings";

export const showAverage = (avr) => {
  if (avr) {
    return (
      <div className="">
        <span>
          <StarRating
            starDimension="15px"
            starSpacing="0px"
            starRatedColor="var(--org-primary)"
            rating={avr}
            editing={false}
          />
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
