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

// user side reviews preview page
export default function UserProfile() {
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [star, setStar] = useState(0);
  const [comment, setComment] = useState("");
  const [productIdforreview, setProductIdforreview] = useState("");

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
  }, [user, Online]);

  const loadUserRatedProducts = () => {
    getRatedproducts(user.token).then((res) => {
      setProducts(res.data);
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
                          pro.images && pro.images.length
                            ? pro.images[0].url
                            : laptop
                        }
                        alt={pro.title}
                      />
                    </div>
                    <div class="myreviewptitlecont">
                      <p class="wishlistptitle">{pro.title}</p>
                      <p class="wishlistptitlesub">Color Family: {pro.color}</p>
                    </div>
                    <div class="mreviewstars">
                      {pro && pro.ratings && pro.ratings.length > 0 ? (
                        showAverage(pro)
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
                      data={pro.ratings[0]}
                      productId={pro._id}
                      setProductIdforreview={setProductIdforreview}
                      setStar={setStar}
                      setComment={setComment}
                    >
                      <StarRating
                        name={pro._id}
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
                    <div class="mreviewsub">{pro.ratings[0].comment}</div>
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
        </div>
        <Online onChange={loadUserRatedProducts} />
      </div>
    </>
  );
}
