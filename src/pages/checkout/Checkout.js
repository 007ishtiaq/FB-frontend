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
  }, []);

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
          saveUserAddress(user.token, values)
            .then((res) => {
              if (res.data.ok) {
                toast.success("Address saved");
                setModalVisible(false);
              }
            })
            .catch((err) => console.log("cart save err", err));
        } catch (error) {
          console.error(error);
          setModalVisible(false);
          // Handle errors if necessary
        }
      } else {
        setModalVisible(false);
        setNoNetModal(true);
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
    if (navigator.onLine) {
      e.preventDefault();
      setProcessing(true);

      if (!stripe || !elements) {
        setError("Stripe has not loaded yet. Please try again.");
        setProcessing(false);
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
        } else {
          setError(null);
          setProcessing(false);
          setSucceeded(true);
        }
      } catch (err) {
        setError("Payment processing failed. Please try again.");
        setProcessing(false);
      }

      // createCashOrderForUser(user.token, COD, couponTrueOrFalse, values)
      //   .then((res) => {
      //     trackEvent("Purchase", {
      //       value: 50.0, // The total purchase amount
      //       currency: "USD", // Currency in ISO 4217 format
      //     });
      //     // console.log("USER CASH ORDER CREATED RES ", res);
      //     if (res.data.error) {
      //       toast.error(`${res.data.error}`);
      //     }
      //     // empty cart form redux, local Storage, reset coupon, reset COD, redirect
      //     if (res.data.orderId) {
      //       // empty local storage
      //       if (typeof window !== "undefined") localStorage.removeItem("cart");
      //       // empty redux cart
      //       dispatch({
      //         type: "ADD_TO_CART",
      //         payload: [],
      //       });
      //       // empty redux coupon
      //       dispatch({
      //         type: "COUPON_APPLIED",
      //         payload: { applied: false, coupon: {} },
      //       });
      //       // empty local storage coupon
      //       if (typeof window !== "undefined") {
      //         localStorage.setItem("coupon", JSON.stringify(""));
      //       }
      //       // empty redux COD
      //       dispatch({
      //         type: "COD",
      //         payload: false,
      //       });
      //       // empty redux BFT
      //       dispatch({
      //         type: "BFT",
      //         payload: true,
      //       });
      //       // empty redux Wallet
      //       dispatch({
      //         type: "Wallet",
      //         payload: false,
      //       });
      //       // empty redux Easypesa
      //       dispatch({
      //         type: "Easypesa",
      //         payload: false,
      //       });
      //       // empty cart from backend
      //       emptyUserCart(user.token);
      //       // redirect
      //       setTimeout(() => {
      //         history.push(`/OrderPlaced/${res.data.orderId}`);
      //       }, 800);
      //     }
      //   })
      //   .catch((err) => console.log("cart save err", err));
    } else {
      setNoNetModal(true);
    }
  };

  const handleCardChange = (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const createOrder = async () => {
    try {
      if (navigator.onLine) {
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
          toast.error("Somthing went wrong!");
          return;
        }

        // Upload the resized image
        let uploadResponse;
        try {
          uploadResponse = await axios.post(
            `${process.env.REACT_APP_API}/slipupload`,
            { image: uri },
            {
              headers: {
                authtoken: user ? user.token : "",
              },
            }
          );
        } catch (uploadError) {
          setLoading(false);
          setNoNetModal(true);
          toast.error("Somthing went wrong!");
          return;
        }

        const image = uploadResponse.data;
        setImage(image);
        setImageuploaded(true);

        // Proceed to create the order if image uploaded successfully
        const orderResponse = await createOrderForUser(
          user.token,
          image,
          BFT,
          Wallet,
          Easypesa,
          couponTrueOrFalse,
          values,
          newsletter
        );

        if (orderResponse.data.error) {
          setLoading(false);
          toast.error(orderResponse.data.error);
          return;
        }

        setLoading(false);
        const orderId = orderResponse.data.orderId;

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

        // Empty cart from backend
        await emptyUserCart(user.token);

        // Redirect
        setTimeout(() => {
          history.push(`/OrderPlaced/${orderId}`);
        }, 800);
      } else {
        setNoNetModal(true);
      }
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
    //
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
                  className="checkoutbtn"
                  disabled={processing || disabled || succeeded}
                  onClick={payStripeCreateCashOrder}
                >
                  <Tooltip title={tooltiphandlerCOD()}>
                    {loading ? "Loading svg here" : "Proceed to Pay"}
                  </Tooltip>
                </button>
              ) : (
                <button
                  className="checkoutbtn"
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
