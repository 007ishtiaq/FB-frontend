import React, { useState, useEffect } from "react";
import { Online } from "react-detect-offline";
import ManageMyAccount from "../ManageMyAccount";
import "../MyWishlist.css";
import { getWishlist, removeWishlist } from "../../../functions/user";
import { ReactComponent as Deletesvg } from "../../../images/cart/delete.svg";
import { ReactComponent as EmptyWishlistsvg } from "../../../images/manageacUser/emptywishlist.svg";
import { ReactComponent as Returnsvg } from "../../../images/cart/return.svg";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";
import { toast } from "react-hot-toast";
import "../../cart/cart.css";
import "./MyWishlist.css";

// user side wishlist preview page
export default function MyWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (navigator.onLine) {
      loadWishlist();
    } else {
      dispatch({
        type: "SET_NETMODAL_VISIBLE",
        payload: true,
      });
    }
  }, [user, navigator.onLine, Online]);

  const loadWishlist = () => {
    if (user && user.token) {
      getWishlist(user.token).then((res) => {
        setWishlist(res.data.wishlist);
        dispatch({
          type: "USER_WISHLIST",
          payload: res.data.wishlist,
        });
      });
    }
  };

  const handleRemove = (productId) => {
    if (navigator.onLine) {
      if (user && user.token) {
        removeWishlist(productId, user.token).then((res) => {
          loadWishlist();
        });
      }
    } else {
      dispatch({
        type: "SET_NETMODAL_VISIBLE",
        payload: true,
      });
    }
  };

  const handleAddToCart = (product) => {
    if (product.quantity < 1) {
      toast.error("Out of Stock");
      return;
    }
    // create cart array
    let cart = [];
    if (typeof window !== "undefined") {
      // if cart is in local storage GET it
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      if (cart.length) {
        let foundItem = cart.find((item) => {
          return item._id === product._id;
        });
        if (foundItem) {
          toast.success("Item Already in Cart");
        } else {
          cart.push({
            ...product,
            count: 1,
          });
          toast.success("Added to Cart");
        }
      } else {
        cart.push({
          ...product,
          count: 1,
        });
        toast.success("Added to Cart");
      }

      // remove duplicates
      let unique = _.uniqWith(cart, _.isEqual);
      // save to local storage
      // console.log('unique', unique)
      localStorage.setItem("cart", JSON.stringify(unique));

      // add to reeux state
      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });
    }
  };

  return (
    <>
      <div class="manageacmainhead manageacordershead">
        {wishlist.length > 0 && (
          <div class="manageacmainheading">My Wishlist</div>
        )}
      </div>

      <div class="manageacmainbody">
        <div class="mainbodybelow">
          <ul class="mywishlist">
            {wishlist.length < 1 && (
              <div className="emptywishcont">
                <div className="EmptyWishlistsvg">
                  <EmptyWishlistsvg />
                </div>
                <p className="empttxtup">Your Wishlist is Empty!</p>
                <p className="empttxtsub">
                  Explore more and shortlist some items
                </p>
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
            {wishlist &&
              wishlist.map((pro, i) => (
                <li class="wishlistli" key={i}>
                  <Link to={`/product/${pro.slug}`}>
                    <div class="imgcont">
                      <img src={pro.images[0].url} alt="" />
                    </div>
                  </Link>
                  <div class="wishlistptitlecont">
                    <Link to={`/product/${pro.slug}`}>
                      <p class="wishlistptitle">{pro.title}</p>
                      <p class="wishlistptitlesub">Color Family: {pro.color}</p>
                    </Link>
                    <div class="delpsvg">
                      <Deletesvg onClick={() => handleRemove(pro._id)} />
                    </div>
                  </div>
                  <div className="wishlistbinder">
                    <div class="wishlistpprice">
                      Rs. {pro.disprice ? pro.disprice : pro.price}.00
                    </div>
                    <div
                      class="wishlistcartbtn"
                      onClick={() => handleAddToCart(pro)}
                    >
                      Add to Cart
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
        <Online onChange={loadWishlist} />
      </div>
    </>
  );
}
