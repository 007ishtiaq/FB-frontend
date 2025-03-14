import React, { useEffect, useState } from "react";
import { trackEvent } from "../../utils/facebookPixel";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ProductCardOnCart from "../../components/cards/ProductCardOnCart";
import { userCart, emptyUserCart } from "../../functions/user";
import { ReactComponent as Emptycartsvg } from "../../images/cart/emptycart.svg";
import { ReactComponent as Deletesvg } from "../../images/cart/delete.svg";
import { ReactComponent as Returnsvg } from "../../images/cart/return.svg";
import { ReactComponent as Verifiedsvg } from "../../images/cart/verified.svg";
import { ReactComponent as Banksvg } from "../../images/cart/payments/banktransfer.svg";
import { ReactComponent as Mastersvg } from "../../images/cart/payments/master.svg";
import { ReactComponent as Visasvg } from "../../images/cart/payments/visa.svg";
import "./cart.css";
import {
  applyCoupon,
  removeCoupon,
  validateCoupon,
  getUserCart,
} from "../../functions/user";
import { toast } from "react-hot-toast";
import { Tooltip } from "antd";
import NoNetModal from "../../components/NoNetModal/NoNetModal";
import { Checkbox } from "antd";
import { auth } from "../../firebase"; // Import Firebase auth

const Cart = ({ history }) => {
  const [coupon, setCoupon] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [couponType, setCouponType] = useState(null);
  const [discountPersent, setDiscountPersent] = useState(null);
  const [couponCondition, setCouponCondition] = useState(null);
  const [noNetModal, setNoNetModal] = useState(false);
  const [retryFunction, setRetryFunction] = useState("");
  const [termRead, setTermRead] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  const { cart, user } = useSelector((state) => ({ ...state }));
  const couponString = useSelector((state) => state.coupon);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const handleOnlineStatus = () => {
  //     if (navigator.onLine) {
  //       setNoNetModal(false);
  //     }
  //   };
  //   window.addEventListener("online", handleOnlineStatus);
  //   return () => {
  //     window.removeEventListener("online", handleOnlineStatus);
  //   };
  // }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCoupon(JSON.parse(localStorage.getItem("coupon")));
    }
  }, []);

  useEffect(() => {
    trackEvent("CartPageView", { page: "cart", cartValue: 120.5 });
  }, []);

  useEffect(() => {
    let LocalCouponString = "";
    if (typeof window !== "undefined") {
      LocalCouponString = JSON.parse(localStorage.getItem("coupon"));
    }

    if (user && user.token) {
      getUserCart(user.token).then((res) => {
        if (coupon === LocalCouponString) {
          if (coupon) {
            res.data.totalAfterDiscount && validateDiscountCoupon();
          }
        }
      });
    }
  }, [user, coupon]);

  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      if (nextValue.disprice !== null) {
        return currentValue + nextValue.count * nextValue.disprice;
      } else {
        return currentValue + nextValue.count * nextValue.price;
      }
    }, 0);
  };

  const getTotalShipping = () => {
    return cart.reduce((currentValue, nextValue) => {
      if (nextValue.disprice === 0) {
        return currentValue + nextValue.shippingcharges * nextValue.count;
      } else {
        return currentValue + nextValue.shippingcharges;
      }
    }, 0);
  };

  const emptyCart = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to empty the cart?"
    );

    if (userConfirmed) {
      if (typeof window !== "undefined") localStorage.removeItem("cart");

      removeDiscountCoupon();

      // empty redux cart
      dispatch({
        type: "ADD_TO_CART",
        payload: [],
      });

      // empty redux coupon
      dispatch({
        type: "COUPON_APPLIED",
        payload: { applied: false, coupon: {} },
      });

      // empty local storage coupon
      if (typeof window !== "undefined") {
        localStorage.setItem("coupon", JSON.stringify(""));
      }

      // empty cart from backend
      if (user && user.token) {
        emptyUserCart(user.token);
      }

      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  const saveOrderToDb = async () => {
    if (navigator.onLine) {
      if (user && user.token) {
        try {
          let token = user.token; // Use existing token

          // Attempt API call
          const res = await userCart(cart, newsletter, token);

          // If request is successful
          trackEvent("CheckoutButtonPressed", { page: "cart-button" });

          if (res.data.ok) history.push("/checkout");
        } catch (err) {
          // If token is expired (401 error), renew token and retry
          if (err.response?.status === 401) {
            try {
              const newToken = await auth.currentUser.getIdToken(true); // Refresh token

              // Update Redux store with new token
              dispatch({
                type: "LOGGED_IN_USER",
                payload: { ...user, token: newToken },
              });

              // Retry API call with new token
              const retryRes = await userCart(cart, newsletter, newToken);

              if (retryRes.data.ok) history.push("/checkout");
            } catch (tokenErr) {
              console.error("Token renewal failed", tokenErr);
              history.push({
                pathname: "/login",
                state: { from: `/cart` },
              });
            }
          } else {
            // Handle other errors
            toast.error(
              err.response?.data?.error ||
                "Something went wrong. Please try again."
            );
          }
        }
      } else {
        history.push({
          pathname: "/login",
          state: { from: `/cart` },
        });
      }
    } else {
      setNoNetModal(true);
      setRetryFunction("saveOrderToDb");
    }
  };

  const validateDiscountCoupon = async () => {
    try {
      if (!cart.length) {
        toast.error("Cart is empty");
        removeDiscountCoupon();
        return;
      }
      if (!navigator.onLine) {
        setNoNetModal(true);
        setRetryFunction("validateDiscountCoupon");
        return;
      }
      if (!user || !user.token) {
        history.push({
          pathname: "/login",
          state: { from: `/cart` },
        });
        return;
      }

      // First, save the order to the database
      await userCart(cart, newsletter, user.token)
        .then((res) => {
          if (res.data.ok) {
            // Validate the coupon
            validateCoupon(user.token, coupon)
              .then((res) => {
                if (res.data) {
                  setCouponType(res.data.type);
                  setDiscountPersent(res.data.discount);
                  setCouponCondition(res.data.condition);
                  setDiscountError("");

                  if (typeof window !== "undefined") {
                    localStorage.setItem("coupon", JSON.stringify(coupon));
                  }

                  // update redux coupon applied true/false
                  dispatch({
                    type: "COUPON_APPLIED",
                    payload: { applied: true, coupon },
                  });
                }
                // error
                if (res.data.err) {
                  setDiscountError(res.data.err);
                  setCouponType(null);
                  setDiscountPersent(null);
                  setCouponCondition(null);
                  // update redux coupon applied true/false
                  dispatch({
                    type: "COUPON_APPLIED",
                    payload: { applied: false, coupon: {} },
                  });
                }
              })
              .catch((err) => console.log("Coupon validation error", err));
          }
        })
        .catch((err) => {
          toast.error(
            err.response?.data?.error ||
              "Something went wrong. Please try again."
          );
        });
    } catch (error) {
      console.log("Coupon validation error", error);
    }
  };

  const applyDiscountCoupon = async () => {
    if (!cart.length) {
      toast.error("Cart is empty");
      removeDiscountCoupon();
      return;
    }
    if (navigator.onLine) {
      if (user && user.token) {
        await userCart(cart, newsletter, user.token)
          .then((res) => {})
          .catch((err) => {
            toast.error(
              err.response?.data?.error ||
                "Something went wrong. Please try again."
            );
          });
        await applyCoupon(user.token, coupon).then((res) => {
          if (res.data) {
            if (res.data.ok) history.push("/checkout");
            // update redux coupon applied true/false
            dispatch({
              type: "COUPON_APPLIED",
              payload: { applied: true, coupon },
            });
          }
          // error
          if (res.data.err) {
            setDiscountError(res.data.err);
            setCouponType(null);
            setDiscountPersent(null);
            setCouponCondition(null);
            // update redux coupon applied true/false

            dispatch({
              type: "COUPON_APPLIED",
              payload: { applied: false, coupon: {} },
            });
          }
        });
      } else {
        history.push({
          pathname: "/login",
          state: { from: `cart` },
        });
      }
    } else {
      setNoNetModal(true);
      setRetryFunction("applyDiscountCoupon");
    }
  };

  const removeDiscountCoupon = async () => {
    if (user && user.token) {
      await removeCoupon(user.token).then((res) => {
        setCouponType(null);
        setDiscountPersent(null);
        setCouponCondition(null);
        setCoupon("");
        setDiscountError("");
        if (typeof window !== "undefined") {
          localStorage.setItem("coupon", JSON.stringify(""));
        }
        dispatch({
          type: "COUPON_APPLIED",
          payload: { applied: false, coupon: {} },
        });
      });
    } else {
      setCouponType(null);
      setDiscountPersent(null);
      setCouponCondition(null);
      setCoupon("");
      setDiscountError("");
      if (typeof window !== "undefined") {
        localStorage.setItem("coupon", JSON.stringify(""));
      }
      dispatch({
        type: "COUPON_APPLIED",
        payload: { applied: false, coupon: {} },
      });
    }
  };

  const showApplyCoupon = () => (
    <>
      <input
        onChange={(e) => {
          setCoupon(e.target.value);
          setDiscountError("");
        }}
        value={coupon}
        type="text"
        placeholder="Have a Coupon?"
        className="couponinput"
      />
      <div className="couponbtns">
        <button
          onClick={validateDiscountCoupon}
          className="mybtn btnsecond couponbtn"
        >
          Apply
        </button>
        <button
          onClick={removeDiscountCoupon}
          className="mybtn btnsecond couponbtn"
        >
          Remove
        </button>
      </div>
    </>
  );

  const handleRetry = () => {
    if (retryFunction === "saveOrderToDb") return saveOrderToDb();
    if (retryFunction === "validateDiscountCoupon")
      return validateDiscountCoupon();
    if (retryFunction === "applyDiscountCoupon") return applyDiscountCoupon();
  };

  return (
    <>
      <div class="cartcont">
        <div class="cartleft">
          {cart.length > 0 ? (
            <>
              <div class="cartleftup">Shopping Cart ({cart.length})</div>
              <hr class="commonruller" />
              <div class="cartleftmiddle">
                {cart.map((p) => (
                  <ProductCardOnCart
                    key={p._id}
                    product={p}
                    removeDiscountCoupon={removeDiscountCoupon}
                    couponCondition={couponCondition}
                    getTotal={getTotal}
                  />
                ))}
              </div>
              <hr class="commonruller" />
              <div class="cartleftdown">
                <div class="subtotalcont">
                  Subtotal ({cart.length} items) :{" "}
                  <span> $ {getTotal().toFixed(2)}</span>
                </div>
                <div class="cartbtnscont">
                  <Link to="/">
                    <button>
                      <div className="cartactionbtncont">
                        <Returnsvg />
                      </div>
                      <span>Continue Shopping</span>
                    </button>
                  </Link>
                  <button onClick={emptyCart}>
                    <div className="cartactionbtncont">
                      <Deletesvg />
                    </div>
                    <span> Empty Cart </span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="emptcont">
              <div className="emptsvg">
                <Emptycartsvg></Emptycartsvg>
              </div>
              <div className="empttxt">
                <p>Your Shopping Cart is Empty</p>
              </div>
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
        </div>
        <div class="cartright">
          <div class="cartrightup">
            <div class="summarycont">Summary</div>

            <div class="summarysubcont">
              <div class="amtcont">
                <span> Subtotal </span>
                <span> $ {getTotal().toFixed(2)}</span>
              </div>

              <div class="amtcont">
                <span> Shipping fee </span>
                <span> $ {getTotalShipping().toFixed(2)}</span>
              </div>

              {discountPersent !== null && (
                <div class="amtcont">
                  <span>
                    {" "}
                    Discount applied{" "}
                    {couponType !== null && (
                      <div className="coupontypetxt">
                        {couponType === "Discount" && `${discountPersent}% Off`}
                        {couponType === "Cash" && `$${discountPersent} Off`}
                        {couponType === "Shipping" && `Zero Shipping`}
                      </div>
                    )}
                  </span>
                  {couponType === "Discount" && (
                    <span>
                      $ -{((getTotal() * discountPersent) / 100).toFixed(2)}{" "}
                    </span>
                  )}
                  {couponType === "Cash" && (
                    <span>$ -{discountPersent.toFixed(2)} </span>
                  )}
                  {couponType === "Shipping" && (
                    <span>$ -{getTotalShipping().toFixed(2)} </span>
                  )}
                </div>
              )}

              {cart.length > 0 && (
                <div class="couponcont">
                  {showApplyCoupon()}
                  {discountError && (
                    <p className="bg-danger p-2">{discountError}</p>
                  )}
                </div>
              )}
              <div class="totalamt amtcont">
                <span> Total </span>
                {discountPersent !== null ? (
                  <>
                    {couponType === "Discount" && (
                      <span>
                        ${" "}
                        {(
                          getTotal() -
                          (getTotal() * discountPersent) / 100 +
                          getTotalShipping()
                        ).toFixed(2)}{" "}
                      </span>
                    )}
                    {couponType === "Cash" && (
                      <span>
                        ${" "}
                        {(
                          getTotal() -
                          discountPersent +
                          getTotalShipping()
                        ).toFixed(2)}{" "}
                      </span>
                    )}
                    {couponType === "Shipping" && (
                      <span>
                        ${" "}
                        {(
                          getTotal() -
                          getTotalShipping() +
                          getTotalShipping()
                        ).toFixed(2)}{" "}
                      </span>
                    )}
                  </>
                ) : (
                  <span>
                    {" "}
                    $ {(getTotal() + getTotalShipping()).toFixed(2)}{" "}
                  </span>
                )}
              </div>

              {user ? (
                <button
                  onClick={
                    couponString.applied ? applyDiscountCoupon : saveOrderToDb
                  }
                  className="mybtn btnprimary checkoutbtn"
                  disabled={!cart.length || !termRead}
                >
                  <Tooltip
                    title={
                      !cart.length
                        ? "Cart is Empty"
                        : !termRead
                        ? "Please accept the terms and conditions"
                        : ""
                    }
                  >
                    Checkout
                  </Tooltip>
                </button>
              ) : (
                <Link
                  to={{
                    pathname: "/login",
                    state: { from: "cart" },
                  }}
                >
                  <button className="mybtn btnprimary checkoutbtn">
                    Login to Checkout
                  </button>
                </Link>
              )}
              <div className="declarationcheck termreadcont">
                <Checkbox
                  className="pb-2 pt-2 pl-0 pr-0"
                  onChange={(e) => setTermRead(e.target.checked)} // Toggle termRead based on checked state
                  checked={termRead}
                >
                  I accept the terms and conditions and I have read the privacy
                  policy.
                </Checkbox>
              </div>
              <div className="termreadcont">
                <Checkbox
                  className="pb-2 pt-2 pl-0 pr-0"
                  onChange={(e) => setNewsletter(e.target.checked)} // Toggle termRead based on checked state
                  checked={newsletter}
                >
                  Keep me up to date on news and exclusive offers.
                </Checkbox>
              </div>
            </div>
          </div>

          <div class="cartrightdown">
            <div class="pmtmethods">
              <span class="pmtmethodshead"> Payment Methods</span>
              <span class="pmtmethodsopt">
                <Visasvg></Visasvg>
                <Mastersvg></Mastersvg>
                <Banksvg></Banksvg>
              </span>
            </div>

            <hr />

            <div class="bprotection">
              <span class="pmtmethodshead"> Buyer Protection</span>
              <span class="bprotectionsub">
                <Verifiedsvg />
                <span class="pmtmethodssub">
                  Get full refund if the item is not as described or if is not
                  delivered
                </span>
              </span>
            </div>

            <NoNetModal
              classDisplay={`${noNetModal && "open-popup"}`}
              setNoNetModal={setNoNetModal}
              handleRetry={handleRetry}
            ></NoNetModal>

            <hr />
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
