import React, { useEffect, useState } from "react";
import "./productreviews.css";
import { ReactComponent as Personsvg } from "../../images/productpage/personsvg.svg";
import { ReactComponent as Verified } from "../../images/productpage/verified.svg";
import { ReactComponent as Downbtn } from "../../images/productpage/downbtn.svg";
import { ReactComponent as Nopublicreview } from "../../images/productpage/nopublicreview.svg";
import StarRating from "react-star-ratings";
import Mystars from "../ratingstars/Mystars";
import RatingModal from "../modal/RatingModal";
import { getReviews } from "../../functions/product";
import { Pagination } from "antd";
import Model from "../../components/Model/Model";
import { toast } from "react-hot-toast";

export default function ProductReviews({
  product,
  productslug,
  onStarClick,
  onModalok,
  reviews,
  setReviews,
  avgRating,
  setAvgRating,
  reviewsCount,
  setReviewsCount,
  star,
  setComment,
  comment,
  setModalVisible,
  modalVisible,
  setProductIdforreview,
}) {
  const [loading, setLoading] = useState(false);
  const [starAccumulator, setStarAccumulator] = useState("");
  const [page, setPage] = useState(1);
  const [showModels, setShowModels] = useState({});
  const [commentLimit, setCommentLimit] = useState(800);

  useEffect(() => {
    loadAllReviews();
  }, [page, product]);

  const loadAllReviews = () => {
    setLoading(true);

    getReviews({ productslug, page }).then((res) => {
      setReviews(res.data.reviews);
      setReviewsCount(res.data.totalReviews);
      setAvgRating(res.data.avgRating);
      setStarAccumulator(res.data.starAccumulator);
      setLoading(false);
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

  // const commentExpand = (e) => {
  //   const reviewtxt = document.querySelector(".reviewtxt");
  //   reviewtxt.classList.toggle("active");
  //   e.currentTarget.classList.toggle("active");
  // };

  function commentExpand(e, review) {
    // Toggle class for reviewtxt
    const reviewtxt = e.currentTarget.previousElementSibling;

    // if (reviewtxt.classList.contains("active")) {
    //   reviewtxt.style.webkitLineClamp = "4";
    // } else {
    //   reviewtxt.style.webkitLineClamp = "initial";
    // }

    reviewtxt.classList.toggle("active");

    // Toggle class for readmorebtn
    const readmorebtn = e.currentTarget;
    readmorebtn.classList.toggle("active");
  }

  const handleModelToggle = (textId) => {
    setShowModels((prevShowModels) => ({
      ...prevShowModels,
      [textId]: !prevShowModels[textId],
    }));
  };

  return (
    <div class="prodowncont">
      <div class="prodownsub">
        <div class="headingcont">Verified Customer Feedback</div>
        <hr />

        {reviews && reviews.length > 0 ? (
          <>
            <div class="creviewup">
              <div class="starstatus">
                <div class="reviewcount">
                  Customer Reviews ({reviews && reviewsCount})
                </div>

                <div class="reviewbarcont">
                  {Object.entries(starAccumulator)
                    .reverse() // Display from 5 stars down to 1 star
                    .map(([rating, count], i) => {
                      return (
                        <div class="reviewbarsingle" key={i}>
                          <p class="starnum">{rating} Stars</p>
                          <div
                            style={{
                              backgroundImage: `linear-gradient(to right, #ff6600 ${
                                (count / reviewsCount) * 100
                              }%, #c7c7cd ${(count / reviewsCount) * 100}%)`,
                            }}
                            class="staravgbar"
                          ></div>
                          <div class="starpersent">
                            <span>
                              {((count / reviewsCount) * 100).toFixed(0)}
                            </span>
                            %
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div class="staravgcont">
                <div class="staravg">
                  {" "}
                  <span class="totalavg">{avgRating}</span>{" "}
                  <span class="outof">/5</span>{" "}
                </div>
                <Mystars
                  rating={avgRating}
                  containerclass={"reviewstarscont"}
                  StarFullclass={"avgstars"}
                  StarHalfclass={"avgstars avgstar-half"}
                  StarEmptyclass={"avgstars avgstar-empty"}
                ></Mystars>
                <div class="ratingcount"> {reviewsCount} Ratings</div>
              </div>
              <div class="postnewriew">
                <div class="postheading">Review this product</div>
                <div class="postsub">
                  Share your thoughts with other customers
                </div>
                <RatingModal
                  onModalok={onModalok}
                  setModalVisible={setModalVisible}
                  modalVisible={modalVisible}
                >
                  <StarRating
                    name={product._id}
                    numberOfStars={5}
                    rating={star}
                    changeRating={onStarClick}
                    isSelectable={true}
                    starRatedColor="#ff7800"
                  />
                  <textarea
                    id="comment"
                    className="commenttxtbox"
                    value={comment}
                    onChange={(e) => {
                      if (e.target.value.length > commentLimit) {
                        toast.error("Character limit exceeded.");
                        return;
                      }
                      setComment(e.target.value);
                      setProductIdforreview(product._id);
                    }}
                    rows="7"
                    maxlength={801} // Add character limit
                  />
                  {/* Display remaining character count */}
                  <p>{commentLimit - comment.length} characters remaining</p>
                </RatingModal>
                ,
                {/* <button class="postbtn">Write a customer review </button> */}
              </div>
            </div>

            <hr />

            <div class="creviewdown">
              <div class="productreviewhead">
                <div class="productreviewleft">Product Reviews</div>
                <div></div>
              </div>
              {reviews &&
                reviews.map((review, i) => {
                  return (
                    <div class="productreviewself" key={i}>
                      <div class="cnamecont">
                        <div class="cimg">
                          <Personsvg class="customersvg"></Personsvg>
                        </div>
                        <div class="cname">
                          <p>
                            {" "}
                            {`${
                              review.postedBy && review.posterName
                                ? review.posterName
                                : review.postedBy.name
                            }`}{" "}
                          </p>
                        </div>
                      </div>
                      <div class="creviewcont">
                        <div class="givenstars">
                          <div class="prostarscont">
                            <Mystars
                              rating={review.star}
                              containerclass={"prostarsspan"}
                              StarFullclass={"prostars"}
                              StarHalfclass={"prostars star-half"}
                              StarEmptyclass={"prostars star-empty"}
                            ></Mystars>
                            <span>{review.star.toFixed(1)}</span>
                          </div>
                        </div>
                        <div class="reviewposttime">
                          <span>Reviewed on {showDate(review.postedOn)}</span>
                        </div>

                        <div class="varifiedcont">
                          <Verified></Verified>
                          <div class="varifiedtxt">Verified Purchase </div>
                        </div>

                        <div class="reviewtxt">{review.comment}</div>

                        <button
                          class={`readmorebtn ${
                            review.comment.length <= 480 && "hidebtn"
                          }`}
                          onClick={(e) => commentExpand(e, review)}
                        >
                          <Downbtn className="downbtn"></Downbtn>
                          <span> Read more </span>
                        </button>
                        <div className="reviewimgcont">
                          {review.images &&
                            review.images.map((img, index) => (
                              <div>
                                <Model
                                  key={index}
                                  show={showModels[img.url]}
                                  closeModel={() => handleModelToggle(img.url)}
                                >
                                  <img className="" src={img.url} alt="" />
                                </Model>
                                <img
                                  key={index}
                                  src={img.url}
                                  onClick={() => handleModelToggle(img.url)}
                                  alt={`Review ${index + 1}`}
                                  className="review-image"
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

              <div class="productreviewbottom">
                <div class="previewpagination">
                  <Pagination
                    current={page}
                    total={reviewsCount}
                    pageSize={5}
                    onChange={(value) => setPage(value)}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div class="creviewempty">
            <Nopublicreview></Nopublicreview>
            <div class="emptyreviewtxt">
              Customers who have bought this product have not <br class="br" />{" "}
              yet posted comments
            </div>
            <div class="emptyreviewtxt">
              <RatingModal
                onModalok={onModalok}
                setModalVisible={setModalVisible}
                modalVisible={modalVisible}
              >
                <StarRating
                  name={product._id}
                  numberOfStars={5}
                  rating={star}
                  changeRating={onStarClick}
                  isSelectable={true}
                  starRatedColor="#ff7800"
                />
                <textarea
                  id="comment"
                  className="commenttxtbox"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    setProductIdforreview(product._id);
                  }}
                  cols="63"
                  rows="7"
                />
              </RatingModal>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
