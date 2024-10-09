import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
// import "./CategoryCreate.css";
import { useSelector } from "react-redux";
import {
  createAdminReview,
  getAdminReviews,
  deleteReview,
  deleteReviewImages,
} from "../../../functions/admin";
import AdminReviewAddForm from "../../../components/forms/AdminReviewAddForm";
import FileUpload from "../../../components/forms/FileUpload";
import "./AddReview.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AddReview = () => {
  let query = useQuery();
  const { user } = useSelector((state) => ({ ...state }));

  const [values, setValues] = useState({ images: [] });
  const [productId, setProductId] = useState("");
  const [posterName, setPosterName] = useState("");
  const [postedDate, setPostedDate] = useState("");
  const [star, setStar] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [productReviews, setProductReviews] = useState([]);

  // Set productId from URL params
  useEffect(() => {
    if (query) {
      setProductId(query.get("productID"));
      loadAdminReviews();
    }
  }, [query.get("productID")]);

  const loadAdminReviews = () => {
    setLoading(true);
    getAdminReviews(query.get("productID"), user.token).then((res) => {
      setProductReviews(res.data);
      setLoading(false);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createAdminReview(
      {
        productId,
        posterName,
        postedDate,
        star,
        comment,
        images: values.images,
      },
      user.token
    )
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setPosterName("");
        setStar("");
        setComment("");
        setValues({ images: [] });
        toast.success(`Review Added Successfully`);
        loadAdminReviews();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  function showDate(postedOn) {
    const date = new Date(postedOn);
    const options = {
      // weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formattedDate = date.toLocaleDateString("en-US", options);

    return formattedDate;
  }

  const handleRemove = (reviewId, imagesArray) => {
    if (window.confirm("Delete?")) {
      // Extract all public_ids from the images array
      const publicIds = imagesArray.map((image) => image.public_id);
      deleteReviewImages(publicIds, user.token)
        .then(() => {
          // After images are deleted, proceed to delete the review
          deleteReview(reviewId, user.token)
            .then((res) => {
              loadAdminReviews(); // Reload reviews
              toast.success(`Review and associated images are deleted`);
            })
            .catch((err) => {
              if (err.response.status === 400) toast.error(err.response.data);
              console.log(err);
            });
        })
        .catch((err) => {
          // console.log("Failed to delete images", err);
          toast.error("Failed to delete images");
        });
    }
  };

  return (
    <div className="col">
      {loading ? (
        <h4 className="text-danger">Loading..</h4>
      ) : (
        <h4>Add A Review</h4>
      )}
      <div className="p-3">
        <FileUpload
          values={values}
          setValues={setValues}
          setLoading={setLoading}
        />
      </div>
      <AdminReviewAddForm
        handleSubmit={handleSubmit}
        productId={productId}
        setProductId={setProductId}
        posterName={posterName}
        setPosterName={setPosterName}
        postedDate={postedDate}
        setPostedDate={setPostedDate}
        star={star}
        setStar={setStar}
        comment={comment}
        setComment={setComment}
      />
      <div>
        {productReviews &&
          productReviews.map((review, index) => (
            <div key={index} className="adminreviewcont">
              <span>{review.posterName}------</span>

              <span>{showDate(review.postedOn)}------</span>
              <span>
                <img
                  src={review.product.image.url}
                  alt=""
                  className="reviewimgcont"
                />
                ------
              </span>
              <span>{review.product.title.substring(0, 55)}</span>
              <br />
              <span>{review.star}</span>
              <span>-----{review.comment.substring(0, 85)}</span>
              <span>
                -----
                {review.images.length ? (
                  <img
                    src={review.images[0].url}
                    alt=""
                    className="reviewimgcont"
                  />
                ) : (
                  <span>no Img</span>
                )}
              </span>
              <span
                className="reviewdelbtn"
                onClick={() => handleRemove(review._id, review.images)}
              >
                Delete
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AddReview;
