import React, { useEffect, useState } from "react";
import { trackEvent } from "../../utils/facebookPixel";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  getUserAddress,
  createCashOrderForUser,
  createOrderForUser,
} from "../../functions/user";
import "../cart/cart.css";
import "./checkout.css";
import "../../components/forms/shippingForm.css";
import "./pmtradiostyle.css";
import ShippingModal from "../../components/modal/ShippingModal";
import { ReactComponent as Verifiedsvg } from "../../images/cart/verified.svg";
import PaymentsForm from "../../components/forms/paymentsForm/PaymentsForm";
import { useFormik } from "formik";
import { UserAddressAndContactSchema } from "../../schemas";
import ShippingForm from "../../components/forms/ShippingForm";
import { Tooltip } from "antd";
import NoNetModal from "../../components/NoNetModal/NoNetModal";
import Resizer from "react-image-file-resizer";
import { LoadingOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { auth } from "../../firebase"; // Import Firebase auth

const Checkout = ({ history }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [shippingfee, setShippingfee] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discounted, setDiscounted] = useState(0);
  const [couponType, setCouponType] = useState(null);
  const [discountPersent, setDiscountPersent] = useState(null);
  const [noNetModal, setNoNetModal] = useState(false);
  const [termRead, setTermRead] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  // for stripe
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [isCardValid, setIsCardValid] = useState(false);

  const [image, setImage] = useState("");
  const [imageuploaded, setImageuploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uri, setUri] = useState("");
  const [file, setFile] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  const dispatch = useDispatch();
  const { user, BFT, Wallet, Easypesa, COD } = useSelector((state) => ({
    ...state,
  }));
  const couponTrueOrFalse = useSelector((state) => state.coupon);

  useEffect(() => {
    const handleOnlineStatus = () => {
      if (navigator.onLine) {
        setNoNetModal(false);
      }
    };
    window.addEventListener("online", handleOnlineStatus);
    return () => {
      window.removeEventListener("online", handleOnlineStatus);
    };
  }, [navigator.onLine]);

  useEffect(() => {
    trackEvent("CheckoutPageView", { page: "checkout" });
  }, []);

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      setShippingfee(res.data.shippingfee);
      setTotal(res.data.cartTotal);
      setDiscounted(res.data.discounted);
      setDiscountPersent(res.data.dispercent);
      setCouponType(res.data.discountType);
      setTotalAfterDiscount(res.data.totalAfterDiscount);
      setIsSubscribed(res.data.isSubscribed);

      if (res.data.cartTotal === 0 && res.data.shippingfee === 0) {
        history.push("/404");
      }
    });
  }, []);

  // ---------formik usage--------

  const initialValues = {
    Name: "",
    Contact: "",
    Address: "",
    City: "",
    Province: "",
    Area: "",
    LandMark: "",
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: UserAddressAndContactSchema,
    onSubmit: async (values, action) => {
      if (navigator.onLine) {
        try {
          let token = user.token; // Use existing token

          // Attempt API call
          const res = await saveUserAddress(token, values);

          if (res.data.ok) {
            toast.success("Address saved");
            setModalVisible(false);
          }
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
              const retryRes = await saveUserAddress(newToken, values);

              if (retryRes.data.ok) {
                toast.success("Address saved");
                setModalVisible(false);
              }
            } catch (tokenErr) {
              console.error("Token renewal failed", tokenErr);
              history.push("/login");
            }
          } else {
            console.error("Address save error", err);
          }
        }
      }
    },
  });

  useEffect(() => {
    if (user && user.token) {
      getUserAddress(user.token).then((a) => {
        setValues({ ...initialValues, ...a.data });
      });
    }
  }, [user]);

  const handlecancel = () => {
    if (user && user.token) {
      getUserAddress(user.token).then((a) => {
        setValues({ ...initialValues, ...a.data });
      });
    }
    setModalVisible(false);
  };

  const payStripeCreateCashOrder = async (e) => {
    if (!navigator.onLine) {
      setNoNetModal(true);
      return;
    }

    e.preventDefault();
    setProcessing(true);
    setLoading(true);

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.");
      setProcessing(false);
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);

    try {
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardHolder,
          },
        },
      });

      if (payload.error) {
        setError(`Payment failed: ${payload.error.message}`);
        setProcessing(false);
        setLoading(false);
        return;
      }

      setError(null);
      setProcessing(false);
      setLoading(false);
      setSucceeded(true);

      let token = user.token; // Use existing token

      // Function to create order with token
      const createOrder = async (currentToken) => {
        return createCashOrderForUser(
          currentToken,
          COD,
          couponTrueOrFalse,
          values,
          payload.paymentIntent.id,
          newsletter
        );
      };

      try {
        let res = await createOrder(token);

        // If token expired, renew it and retry
        if (res.data.error && res.data.error.includes("expired")) {
          const newToken = await auth.currentUser.getIdToken(true); // Refresh token

          // Update Redux store with new token
          dispatch({
            type: "LOGGED_IN_USER",
            payload: { ...user, token: newToken },
          });

          // Retry API call with new token
          res = await createOrder(newToken);
        }

        if (res.data.error) {
          toast.error(`${res.data.error}`);
          return;
        }

        // Empty cart, reset states, and redirect
        if (res.data.orderId) {
          if (typeof window !== "undefined") localStorage.removeItem("cart");

          dispatch({ type: "ADD_TO_CART", payload: [] });
          dispatch({
            type: "COUPON_APPLIED",
            payload: { applied: false, coupon: {} },
          });
          dispatch({ type: "COD", payload: false });
          dispatch({ type: "BFT", payload: true });
          dispatch({ type: "Wallet", payload: false });
          dispatch({ type: "Easypesa", payload: false });

          if (typeof window !== "undefined") {
            localStorage.setItem("coupon", JSON.stringify(""));
          }

          // Empty cart from backend
          await emptyUserCart(token);

          setTimeout(() => {
            history.push(`/OrderPlaced/${res.data.orderId}`);
          }, 800);
        }
      } catch (err) {
        console.log("cart save err", err);
      }
    } catch (err) {
      setError("Payment processing failed. Please try again.");
      setProcessing(false);
      setLoading(false);
    }
  };

  const handleCardChange = (event) => {
    setDisabled(event.empty);
    setIsCardValid(event.complete);
    setError(event.error ? event.error.message : "");
  };

  const createOrder = async () => {
    try {
      if (!navigator.onLine) {
        setNoNetModal(true);
        return;
      }

      setLoading(true);

      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        setLoading(false);
        toast.error("Selected Image is Invalid.");
        return;
      }

      const uri = await new Promise((resolve, reject) => {
        Resizer.imageFileResizer(
          file,
          720,
          720,
          "JPEG",
          100,
          0,
          (uri) => resolve(uri),
          "base64",
          (error) => reject(error)
        );
      });

      if (!uri) {
        setLoading(false);
        toast.error("Something went wrong!");
        return;
      }

      let token = user.token; // Use existing token

      // Function to upload image
      const uploadImage = async (currentToken) => {
        return axios.post(
          `${process.env.REACT_APP_API}/slipupload`,
          { image: uri },
          {
            headers: {
              authtoken: currentToken,
            },
          }
        );
      };

      // Upload the resized image
      let uploadResponse;
      try {
        uploadResponse = await uploadImage(token);
      } catch (uploadError) {
        if (uploadError.response && uploadError.response.status === 401) {
          // Token expired, renew it
          const newToken = await auth.currentUser.getIdToken(true);

          // Update Redux store with new token
          dispatch({
            type: "LOGGED_IN_USER",
            payload: { ...user, token: newToken },
          });

          // Retry upload with new token
          uploadResponse = await uploadImage(newToken);
          token = newToken; // Update local token reference
        } else {
          setLoading(false);
          setNoNetModal(true);
          toast.error("Something went wrong!");
          return;
        }
      }

      const image = uploadResponse.data;
      setImage(image);
      setImageuploaded(true);

      // Function to create order with token
      const createOrderWithToken = async (currentToken) => {
        return createOrderForUser(
          currentToken,
          image,
          BFT,
          Wallet,
          Easypesa,
          couponTrueOrFalse,
          values,
          newsletter
        );
      };

      // Proceed to create the order
      let orderResponse;
      try {
        orderResponse = await createOrderWithToken(token);
      } catch (orderError) {
        if (orderError.response && orderError.response.status === 401) {
          // Token expired, renew it
          const newToken = await auth.currentUser.getIdToken(true);

          // Update Redux store with new token
          dispatch({
            type: "LOGGED_IN_USER",
            payload: { ...user, token: newToken },
          });

          // Retry order creation with new token
          orderResponse = await createOrderWithToken(newToken);
          token = newToken;
        } else {
          setLoading(false);
          toast.error("Order creation failed. Please try again.");
          return;
        }
      }

      if (orderResponse.data.error) {
        setLoading(false);
        toast.error(orderResponse.data.error);
        return;
      }

      setLoading(false);
      const orderId = orderResponse.data.orderId;

      // Function to empty cart
      const clearCart = async (currentToken) => {
        return emptyUserCart(currentToken);
      };

      try {
        await clearCart(token);
      } catch (cartError) {
        if (cartError.response && cartError.response.status === 401) {
          // Token expired, renew it
          const newToken = await auth.currentUser.getIdToken(true);

          // Update Redux store with new token
          dispatch({
            type: "LOGGED_IN_USER",
            payload: { ...user, token: newToken },
          });

          // Retry emptying cart with new token
          await clearCart(newToken);
        }
      }

      // Clear cart, coupon, etc.
      if (typeof window !== "undefined") localStorage.removeItem("cart");
      dispatch({ type: "ADD_TO_CART", payload: [] });
      dispatch({
        type: "COUPON_APPLIED",
        payload: { applied: false, coupon: {} },
      });
      if (typeof window !== "undefined")
        localStorage.setItem("coupon", JSON.stringify(""));
      dispatch({ type: "COD", payload: false });
      dispatch({ type: "BFT", payload: true });
      dispatch({ type: "Wallet", payload: false });
      dispatch({ type: "Easypesa", payload: false });

      // Redirect
      setTimeout(() => {
        history.push(`/OrderPlaced/${orderId}`);
      }, 800);
    } catch (error) {
      setLoading(false);
      setNoNetModal(true);
      console.log("Error:", error);
    }
  };

  const tooltiphandlerCOD = () => {
    if (total + shippingfee === 0) {
      return "Cart is Empty";
    }
    if (!values.Contact) {
      return "Contact Details missing*";
    }
    if (!values.Address) {
      return "Shipping address missing*";
    }
    if (!isCardValid) {
      return "Card information is incomplete or invalid*";
    }
    if (!cardHolder) {
      return "Card Holder name missing*";
    }
    if (!termRead) {
      return "Please accept the terms and conditions";
    } else {
      return "";
    }
  };
  const tooltiphandler = () => {
    if (total + shippingfee === 0) {
      return "Cart is Empty";
    }
    if (!values.Contact) {
      return "Contact Details missing*";
    }
    if (!values.Address) {
      return "Shipping address missing*";
    }
    if (!file) {
      return "Attachment is missing";
    }
    if (!termRead) {
      return "Please accept the terms and conditions";
    } else {
      return "";
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <>
      <div class="paymentcont">
        <div class="paymentleft">
          <div class="shippingreviewcont">
            <div className="adrhead">
              <div class="shippingtitle">Shipping Address</div>
              <ShippingModal
                onModalok={handleSubmit}
                onModalcancel={handlecancel}
                setModalVisible={setModalVisible}
                modalVisible={modalVisible}
                values={values}
                btnClasses={"mybtn btnsecond changebtnsize checkoutpagemodal"}
              >
                <ShippingForm
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                />
              </ShippingModal>
            </div>
            <div class="shippingsubcont">
              <div class="shippingcol">
                <div className="shippingcolleft">
                  {values.Name && <div class="shippingheads">Deliver to:</div>}
                  {values.Contact && <div class="shippingheads">Contact:</div>}
                  {values.Address && <div class="shippingheads">Email at:</div>}

                  {values.Address && (
                    <div class="shippingheads">Shipping at:</div>
                  )}
                </div>
                <div className="shippingcolright">
                  {values.Name && (
                    <div class="shippingsubdetails">{values.Name}</div>
                  )}
                  {values.Contact && (
                    <div class="shippingsubdetails">{values.Contact}</div>
                  )}
                  {values.Address && (
                    <div class="shippingsubdetails">{user.email}</div>
                  )}
                  {values.Address && (
                    <div class="shippingsubdetails">
                      {values.Address}, {values.Province}, {values.Area},{" "}
                      {values.LandMark}, {values.City}.
                    </div>
                  )}
                </div>
              </div>
              {!values.Address && (
                <div class="shippingmissing">
                  Shipping details missing, Please provide Shipping details to
                  process.*
                </div>
              )}
            </div>
          </div>
          <div>
            <PaymentsForm
              file={file}
              setFile={setFile}
              CardNumberElement={CardNumberElement}
              CardExpiryElement={CardExpiryElement}
              CardCvcElement={CardCvcElement}
              setClientSecret={setClientSecret}
              handleCardChange={handleCardChange}
              cardHolder={cardHolder}
              setCardHolder={setCardHolder}
              error={error}
              succeeded={succeeded}
              setNoNetModal={setNoNetModal}
            />
          </div>
        </div>

        <div class="cartright checkoutright">
          <div class="cartrightup">
            <div class="summarycont">Summary</div>

            <div class="summarysubcont">
              <div class="amtcont">
                <span> Subtotal </span>
                <span> $ {total.toFixed(2)} </span>
              </div>
              <div class="amtcont">
                <span> Shipping fee </span>
                <span> $ {shippingfee.toFixed(2)} </span>
              </div>
              {discounted > 0 && (
                <div class="amtcont">
                  <span>
                    {" "}
                    Discount applied{" "}
                    {couponType !== null && (
                      <div className="coupontypetxt">
                        {couponType === "Discount" && `${discountPersent}% Off`}
                        {couponType === "Cash" && `$ ${discountPersent} Off`}
                        {couponType === "Shipping" && `Zero Shipping`}
                      </div>
                    )}
                  </span>
                  <span>$ -{discounted.toFixed(2)}</span>
                </div>
              )}
              <div class="totalamt amtcont">
                <span> Total </span>
                {totalAfterDiscount > 0 ? (
                  <span>$ {totalAfterDiscount.toFixed(2)}</span>
                ) : (
                  <span> $ {(total + shippingfee).toFixed(2)} </span>
                )}
              </div>
              {COD ? (
                <button
                  className="mybtn btnprimary checkoutbtn"
                  disabled={
                    processing ||
                    disabled ||
                    succeeded ||
                    // isCardValid ||
                    // !values.Contact ||
                    // !values.Address ||
                    // total + shippingfee === 0 ||
                    !termRead
                  }
                  onClick={payStripeCreateCashOrder}
                >
                  <Tooltip title={tooltiphandlerCOD()}>
                    {loading ? (
                      <div className="btnloadcont">
                        <LoadingOutlined />
                      </div>
                    ) : (
                      "Proceed to Pay"
                    )}
                  </Tooltip>
                </button>
              ) : (
                <button
                  className="mybtn btnprimary checkoutbtn"
                  disabled={
                    !values.Contact ||
                    !values.Address ||
                    !file ||
                    total + shippingfee === 0 ||
                    !termRead
                  }
                  onClick={createOrder}
                >
                  <Tooltip title={tooltiphandler()}>
                    {loading ? (
                      <div className="btnloadcont">
                        <LoadingOutlined />
                      </div>
                    ) : (
                      "Place Order"
                    )}
                  </Tooltip>
                </button>
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
              {!isSubscribed && (
                <div className="termreadcont">
                  <Checkbox
                    className="pb-2 pt-2 pl-0 pr-0"
                    onChange={(e) => setNewsletter(e.target.checked)} // Toggle termRead based on checked state
                    checked={newsletter}
                  >
                    Keep me up to date on news and exclusive offers.
                  </Checkbox>
                </div>
              )}
            </div>
          </div>

          <div class="cartrightdown">
            <hr />

            <NoNetModal
              classDisplay={`${noNetModal && "open-popup"}`}
              setNoNetModal={setNoNetModal}
              handleRetry={handleRetry}
            ></NoNetModal>

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

            <hr />
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
