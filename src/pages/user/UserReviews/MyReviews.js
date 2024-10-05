import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Online } from "react-detect-offline";
import ManageMyAccount from "../ManageMyAccount";
import "../MyReviews.css";
import "../MyOrders.css";
import "../../../components/forms/shippingForm.css";
import { getRatedproducts, productStar } from "../../../functions/product";
import RatingModalMyRating from "../../../components/modal/RatingModalMyRating";
import { showAverage } from "../../../functions/rating";
import StarRating from "react-star-ratings";
import { toast } from "react-hot-toast";
import laptop from "../../../images/laptop.png";
import { ReactComponent as Nopublicreview } from "../../../images/productpage/nopublicreview.svg";
import { ReactComponent as Returnsvg } from "../../../images/cart/return.svg";
import { Link } from "react-router-dom";
import { Pagination } from "antd";
import Model from "../../../components/Model/Model";

// user side reviews preview page
export default function UserProfile() {
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [star, setStar] = useState(0);
  const [comment, setComment] = useState("");
  const [productIdforreview, setProductIdforreview] = useState("");
  const [page, setPage] = useState(1); // page number
  const [perPage, setPerpage] = useState(5); // per page Size
  const [reviewsCount, setReviewsCount] = useState(0);
  const [showModels, setShowModels] = useState({});

  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (navigator.onLine) {
      if (user && user.token) {
        loadUserRatedProducts();
      }
    } else {
      dispatch({
        type: "SET_NETMODAL_VISIBLE",
        payload: true,
      });
    }
  }, [user, Online, page]);

  const loadUserRatedProducts = () => {
    getRatedproducts({ page, perPage }, user.token).then((res) => {
      console.log(res.data);
      setProducts(res.data.ratedProductsWithRatings);
      setReviewsCount(res.data.totalReviews);
      setPage(res.data.currentPage);
    });
  };

  const onModalok = () => {
    if (navigator.onLine) {
      productStar(productIdforreview, { star, comment }, user.token).then(
        (res) => {
          toast.success("Thanks for your review. It will appear soon");
          setStar(0);
          setComment("");
          getRatedproducts(user.token).then((res) => {
            setProducts(res.data);
          });
        }
      );
    } else {
      dispatch({
        type: "SET_NETMODAL_VISIBLE",
        payload: true,
      });
    }
  };

  const onStarClick = (newRating) => {
    setStar(newRating);
  };

  const handlePageChange = (value) => {
    setPage(value);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll to top on page change
    });
  };

  const handleModelToggle = (textId) => {
    setShowModels((prevShowModels) => ({
      ...prevShowModels,
      [textId]: !prevShowModels[textId],
    }));
  };

  return (
    <>
      <div class="manageacmainhead manageacordershead">
        {products.length > 0 && (
          <div class="manageacmainheading">My Reviews</div>
        )}
      </div>

      <div class="manageacmainbody">
        <div class="mainbodybelow">
          <ul class="mywishlist">
            {products.length ? (
              products.map((pro, i) => (
                <li class="reviewlistli" key={i}>
                  <div class="reviewproductcont">
                    <div class="imgcont">
                      <img
                        src={
                          pro.product.images && pro.product.images.length
                            ? pro.product.images[0].url
                            : laptop
                        }
                        alt={pro.product.title}
                      />
                    </div>
                    <div class="myreviewptitlecont">
                      <p class="wishlistptitle">{pro.product.title}</p>
                      <p class="wishlistptitlesub">
                        Color Family: {pro.product.color}
                      </p>
                    </div>
                    <div class="mreviewstars">
                      {pro.product &&
                      pro.product.ratings &&
                      pro.product.ratings.length > 0 ? (
                        showAverage(pro.product)
                      ) : (
                        <div className="text-center pt-1 pb-3">
                          No rating yet
                        </div>
                      )}
                    </div>
                    <RatingModalMyRating
                      onModalok={onModalok}
                      setModalVisible={setModalVisible}
                      modalVisible={modalVisible}
                      data={pro.product.ratings[0]}
                      productId={pro.product._id}
                      setProductIdforreview={setProductIdforreview}
                      setStar={setStar}
                      setComment={setComment}
                    >
                      <StarRating
                        name={pro.product._id}
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
                        onChange={(e) => setComment(e.target.value)}
                        rows="7"
                      />
                    </RatingModalMyRating>
                  </div>
                  <div class="myreview">
                    <div class="mreviewhead">Review :</div>
                    <div class="mreviewsub">
                      {pro.product.ratings[0].comment}
                    </div>
                    <div className="reviewimgcont">
                      {pro.product.ratings[0].images &&
                        pro.product.ratings[0].images.map((img, index) => (
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
                </li>
              ))
            ) : (
              <div className="emptywishcont">
                <div className="Emptyreviewsvg">
                  <Nopublicreview />
                </div>
                <p className="empttxtup">No Reviews Found!</p>
                <div className="cartbtnscont">
                  <Link to="/">
                    <button>
                      <div>
                        <Returnsvg />
                      </div>
                      <span>Continue Shopping</span>
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </ul>
          <div class="previewpagination reviewpagination">
            <Pagination
              current={page}
              total={reviewsCount}
              pageSize={perPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
        <Online onChange={loadUserRatedProducts} />
      </div>
    </>
  );
}
