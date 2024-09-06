import React, { useState, useRef, useEffect } from "react";
import { ReactComponent as Banksvg } from "../../../images/cart/payments/banktransfer.svg";
import { ReactComponent as CODsvg } from "../../../images/cart/payments/cod.svg";
import { ReactComponent as Easypaisasvg } from "../../../images/cart/payments/easypaisa.svg";
import { ReactComponent as Walletsvg } from "../../../images/cart/payments/wallet.svg";
import { ReactComponent as Infosvg } from "../../../images/info.svg";
import SlipImgUpload from "../SlipImgUpload";

import { useSelector, useDispatch } from "react-redux";

export default function PaymentsForm({ file, setFile }) {
  const [bft, setBft] = useState(true);
  const [wallet, setWallet] = useState(false);
  const [easypesa, setEasypesa] = useState(false);
  const [cod, setCod] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bftActive, setBftActive] = useState(false);
  const [walletActive, setWalletActive] = useState(false);
  const [easypesaActive, setEasypesaActive] = useState(false);
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
  }, [bft, wallet, easypesa, cod]);

  const bftChecked = () => {
    setBft(true);
    setWallet(false);
    setEasypesa(false);
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
  const walletChecked = () => {
    setBft(false);
    setWallet(true);
    setEasypesa(false);
    setCod(false);
    setFile(null);

    dispatch({
      type: "BFT",
      payload: false,
    });
    dispatch({
      type: "Wallet",
      payload: true,
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
  const easypesaChecked = () => {
    setBft(false);
    setWallet(false);
    setEasypesa(true);
    setCod(false);
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
      payload: true,
    });
    dispatch({
      type: "COD",
      payload: false,
    });
  };
  const codChecked = () => {
    setBft(false);
    setWallet(false);
    setEasypesa(false);
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
    if (wallet === true) {
      activeClassTimeout = setTimeout(() => {
        setWalletActive(true);
      }, 100);
    } else {
      setWalletActive(false);
    }
    if (easypesa === true) {
      activeClassTimeout = setTimeout(() => {
        setEasypesaActive(true);
      }, 100);
    } else {
      setEasypesaActive(false);
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
                <div className="logosvgopt paymentsvgs">
                  <Banksvg></Banksvg>
                </div>
              </div>
            </span>
          </label>

          <label class="custom-radio">
            <input
              id="jazzcash"
              type="radio"
              name="radio"
              checked={wallet}
              onChange={walletChecked}
            />
            <span class="radio-btn">
              <div class="hobbies-icon">
                <h3>JazzCash Wallet</h3>
                <div className="logosvgopt paymentsvgs">
                  <Walletsvg></Walletsvg>
                </div>
              </div>
            </span>
          </label>

          <label class="custom-radio">
            <input
              id="easypaisa"
              type="radio"
              name="radio"
              checked={easypesa}
              onChange={easypesaChecked}
            />
            <span class="radio-btn">
              <div class="hobbies-icon">
                <h3>Easypesa Wallet</h3>
                <div className="logosvgopt paymentsvgs">
                  <Easypaisasvg></Easypaisasvg>
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
                <h3>Cash On Delivery</h3>
                <div className="logosvgopt paymentsvgs">
                  <CODsvg></CODsvg>
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
                Make the payment to below given account number from your bank
                application & Please attach payment receipt to below mentioned
                attachment area.{" "}
              </p>
              <div class="acdetails">
                <div class="colheads">
                  <div class="acheading">Bank name:</div>
                  <div class="acheading"> Account holder name: </div>
                  <div class="acheading">Account number:</div>
                </div>

                <div class="colmain">
                  <div class="acdetails"> United Bank Limited </div>
                  <div class="acdetails"> Ishtiaq Ahmad </div>
                  <div class="acdetails"> 1755252821046 </div>
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
          {wallet && (
            <div
              id="jazzcashcont"
              class="oltransfer"
              className={walletActive && "active"}
            >
              <div class="pmtheading">Steps</div>
              <p className="pmtsubtag">
                {" "}
                Make the payment to below given account number from your bank
                application & Please attach payment receipt to below mentioned
                attachment area.{" "}
              </p>
              <div class="acdetails">
                <div class="colheads">
                  <div class="acheading">Bank name:</div>
                  <div class="acheading"> Account holder name: </div>
                  <div class="acheading">Account number:</div>
                </div>

                <div class="colmain">
                  <div class="acdetails"> JazzCash account</div>
                  <div class="acdetails"> Ishtiaq Ahmad </div>
                  <div class="acdetails"> 1755252821046 </div>
                </div>
              </div>

              <div class="attachmentcont">
                <div class="attachmenthead">
                  {" "}
                  Please attach payment receipt:{" "}
                </div>

                {loading && "Loading ..."}
                <SlipImgUpload
                  file={file}
                  setFile={setFile}
                  fileInputRef={fileInputRef}
                />
              </div>
            </div>
          )}
          {easypesa && (
            <div
              id="easypesacont"
              class="oltransfer"
              className={easypesaActive && "active"}
            >
              <div class="pmtheading">Steps</div>
              <p className="pmtsubtag">
                {" "}
                Make the payment to below given account number from your bank
                application & Please attach payment receipt to below mentioned
                attachment area.{" "}
              </p>
              <div class="acdetails">
                <div class="colheads">
                  <div class="acheading">Bank name:</div>
                  <div class="acheading"> Account holder name: </div>
                  <div class="acheading">Account number:</div>
                </div>

                <div class="colmain">
                  <div class="acdetails"> Easypesa account </div>
                  <div class="acdetails"> Ishtiaq Ahmad </div>
                  <div class="acdetails"> 1755252821046 </div>
                </div>
              </div>

              <div class="attachmentcont">
                <div class="attachmenthead">
                  {" "}
                  Please attach payment receipt:{" "}
                </div>

                {loading && "Loading ..."}
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
              <p className="pmtsubtag">
                {" "}
                You can pay in cash to our courier when you receive the goods at
                your doorstep.{" "}
              </p>
              <div class="codnotification">
                <div class="squreinfo">
                  <Infosvg />
                </div>
                <div class="infodivp">
                  {" "}
                  Cash Payment Fee of Rs. 10 applies only to Cash on Delivery
                  payment method. There is no extra fee if you use other payment
                  method then cash on delivery.{" "}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
