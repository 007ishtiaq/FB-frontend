import React, { useState, useRef, useEffect } from "react";
import { ReactComponent as Banksvg } from "../../../images/cart/payments/banktransfer.svg";
import { ReactComponent as Mastersvg } from "../../../images/cart/payments/master.svg";
import { ReactComponent as Visasvg } from "../../../images/cart/payments/visa.svg";
// import { ReactComponent as Infosvg } from "../../../images/info.svg";
import SlipImgUpload from "../SlipImgUpload";
// import StripePaymentForm from "./StripePaymentForm";
import { useSelector, useDispatch } from "react-redux";
import StripeCheckout from "../../../components/StripeCheckout";
import "./stripe.css";

export default function PaymentsForm({
  file,
  setFile,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  setClientSecret,
  handleCardChange,
  cardHolder,
  setCardHolder,
  error,
  succeeded,
  setNoNetModal,
}) {
  const [bft, setBft] = useState(true);
  const [cod, setCod] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bftActive, setBftActive] = useState(false);
  const [codActive, setCodActive] = useState(false);

  const fileInputRef = useRef(null);
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  // useEffect(() => {
  //   handleActiveClass();
  // }, [bft, wallet, easypesa, cod]);

  // const addActiveClassWithDelay = (setStateFunc) => {
  //   setTimeout(() => {
  //     setStateFunc(true);
  //     setLoading(false); // Assuming you want to set loading to false after the delay
  //   }, 100);
  // };

  useEffect(() => {
    handleActiveClass();
  }, [bft, cod]);

  const bftChecked = () => {
    setBft(true);
    setCod(false);
    setFile(null);
    dispatch({
      type: "BFT",
      payload: true,
    });
    dispatch({
      type: "Wallet",
      payload: false,
    });
    dispatch({
      type: "Easypesa",
      payload: false,
    });
    dispatch({
      type: "COD",
      payload: false,
    });
  };
  const codChecked = () => {
    setBft(false);
    setCod(true);
    setFile(null);

    dispatch({
      type: "BFT",
      payload: false,
    });
    dispatch({
      type: "Wallet",
      payload: false,
    });
    dispatch({
      type: "Easypesa",
      payload: false,
    });
    dispatch({
      type: "COD",
      payload: true,
    });
  };

  const handleActiveClass = () => {
    let activeClassTimeout;
    if (bft === true) {
      activeClassTimeout = setTimeout(() => {
        setBftActive(true);
      }, 100);
    } else {
      setBftActive(false);
    }
    if (cod === true) {
      activeClassTimeout = setTimeout(() => {
        setCodActive(true);
      }, 100);
    } else {
      setCodActive(false);
    }
    return activeClassTimeout;
  };

  return (
    <form className="paymentattachform">
      <div class="paymenntmaincont">
        <div class="shippingtitle">Payment</div>

        <div class="radio-buttons">
          <label class="custom-radio">
            <input
              id="bft"
              type="radio"
              name="radio"
              checked={bft}
              onChange={bftChecked}
            />
            <span class="radio-btn">
              <div class="hobbies-icon">
                <h3>Bank Transfer</h3>
                <div className="logosvgopt paymentsvgs banksvg">
                  <Banksvg></Banksvg>
                </div>
              </div>
            </span>
          </label>

          <label class="custom-radio">
            <input
              id="cod"
              type="radio"
              name="radio"
              checked={cod}
              onChange={codChecked}
            />
            <span class="radio-btn">
              <div class="hobbies-icon">
                <h3>Credit/Debit Card</h3>
                <div className="logosvgopt paymentsvgs cardsvg">
                  <Visasvg></Visasvg>
                  <Mastersvg></Mastersvg>
                </div>
              </div>
            </span>
          </label>
        </div>

        <div class="paymentdetailscont">
          {bft && (
            <div id="bftcont" className={`oltransfer ${bftActive && "active"}`}>
              <div class="pmtheading">Steps</div>
              <p className="pmtsubtag">
                {" "}
                Please make the payment using the account details provided below
                through your banking application. Once the transfer is complete,
                kindly upload the payment receipt in the attachment area below.{" "}
              </p>

              <div className="account-details">
                <div className="row">
                  <div className="label">Bank Name:</div>
                  <div className="value">Bangor Savings Bank</div>
                </div>
                <div className="row">
                  <div className="label">Account Type:</div>
                  <div className="value">Checking</div>
                </div>
                <div className="row">
                  <div className="label">Account Number:</div>
                  <div className="value">650517176437</div>
                </div>
                <div className="row">
                  <div className="label">Routing Number:</div>
                  <div className="value">011275484</div>
                </div>
              </div>

              <div class="attachmentcont">
                <div class="attachmenthead">
                  {" "}
                  Please attach payment receipt:{" "}
                </div>

                <SlipImgUpload
                  file={file}
                  setFile={setFile}
                  fileInputRef={fileInputRef}
                />
              </div>
            </div>
          )}

          {cod && (
            <div
              id="codcont"
              class="codpmtcont"
              className={codActive && "active"}
            >
              <div className="col-md-8 offset-md-2 Stripecontainer">
                <StripeCheckout
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

              {/* <p className="pmtsubtag">
                {" "}
                We're currently unable to process credit and debit card
                payments. Please consider using alternative payment methods.{" "}
              </p>
              <div class="codnotification">
                <div class="squreinfo">
                  <Infosvg />
                </div>
                <div class="infodivp">
                  {" "}
                  Due to unforeseen circumstances, we’re unable to accept credit
                  and debit card payments at this time. Thank you for your
                  patience as we work to restore this service.{" "}
                </div>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
