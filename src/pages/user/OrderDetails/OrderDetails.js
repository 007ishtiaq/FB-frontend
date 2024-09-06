import React, { useState, useEffect } from "react";
import "../SingleOrder.css";
import "../MyOrders.css";
import "../ManageMyAcccount.css";
import { getOrder } from "../../../functions/user";
import { useSelector } from "react-redux";
import UsersideNavCopy from "../../../components/nav/UsersideNavCopy";
import { Tooltip } from "antd";
import { useHistory } from "react-router-dom";
import Model from "../../../components/Model/Model";
import NoNetModal from "../../../components/NoNetModal/NoNetModal";
import { toast } from "react-hot-toast";

const moment = require("moment");

export default function OrderDetails({ match }) {
  // const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState("");
  const [showModels, setShowModels] = useState({});
  const [noNetModal, setNoNetModal] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));
  const { id } = match.params;

  let history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const handleRetry = () => {
    //
  };

  useEffect(() => {
    if (navigator.onLine) {
      loadOrderDetails();
    } else {
      setNoNetModal(true);
    }
  }, [navigator.onLine, id]);

  const loadOrderDetails = () => {
    if (user && user.token) {
      getOrder(id, user.token)
        .then((res) => {
          setOrder(res.data);
        })
        .catch((error) => {
          toast.error("Order not found");
          history.push("/404");
          // console.error("Error fetching order:", error);
        });
    }
  };

  const handleModelToggle = (productId) => {
    setShowModels((prevShowModels) => ({
      ...prevShowModels,
      [productId]: !prevShowModels[productId],
    }));
  };

  const getSubTotal = () => {
    return (
      order.products &&
      order.products.reduce((currentValue, nextValue) => {
        return currentValue + nextValue.count * nextValue.price;
      }, 0)
    );
  };

  const activeLevel1 = () => {
    if (order.orderStatus === "Not Processed") {
      return "";
    }
    if (order.orderStatus === "Processing") {
      return "active";
    }
    if (order.orderStatus === "Dispatched") {
      return "active";
    }
    if (order.orderStatus === "Delivered") {
      return "active";
    }
  };
  const activeLevel2 = () => {
    if (order.orderStatus === "Not Processed") {
      return "";
    }
    if (order.orderStatus === "Processing") {
      return "";
    }
    if (order.orderStatus === "Dispatched") {
      return "active";
    }
    if (order.orderStatus === "Delivered") {
      return "active";
    }
  };
  const activeLevel3 = () => {
    if (order.orderStatus === "Not Processed") {
      return "";
    }
    if (order.orderStatus === "Processing") {
      return "";
    }
    if (order.orderStatus === "Dispatched") {
      return "";
    }
    if (order.orderStatus === "Delivered") {
      return "active";
    }
  };
  const orderStatusColor = () => {
    if (order.orderStatus === "Not Processed") {
      return "gray";
    }
    if (order.orderStatus === "Processing") {
      return "blue";
    }
    if (order.orderStatus === "Dispatched") {
      return "blue";
    }
    if (order.orderStatus === "Cancelled") {
      return "Yellow";
    }
    if (order.orderStatus === "Delivered") {
      return "green";
    }
    if (order.orderStatus === "Returned") {
      return "Yellow";
    }
  };

  const ItemCancel = (itemId) => {
    if (navigator.onLine) {
      if (user && user.token) {
        history.push({ pathname: `/order/${id}/itemCancel/${itemId}` });
      } else {
        history.push({
          pathname: "/login",
          state: { from: `/order/${id}` },
        });
      }
    } else {
      setNoNetModal(true);
    }
  };
  const ItemReturn = (itemId) => {
    if (navigator.onLine) {
      if (user && user.token) {
        history.push({ pathname: `/order/${id}/itemReturn/${itemId}` });
      } else {
        history.push({
          pathname: "/login",
          state: { from: `/order/${id}` },
        });
      }
    } else {
      setNoNetModal(true);
    }
  };

  return (
    <div class="manageacmaincont">
      <div class="manageaccont">
        <UsersideNavCopy />
        <div class="navrightside singleitemrightside">
          <div class="manageacmainhead">Order Details</div>
          <div class="manageacmainbody">
            <div class="mainbodybelow">
              <div class="myorder">
                <div class="ordernumhead">
                  <div class="ordernumcont">
                    <div class="ordernum">Order Number # {order.OrderId}</div>
                    <div class="orderdate">
                      Placed On: {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div class="ordersub">
                  <div class="orderstatusbarcont">
                    {order.orderStatus !== "Cancelled" &&
                    order.orderStatus !== "Returned" ? (
                      <div class="statusbar">
                        <div class="circle circleone active"></div>
                        <div className={`line lineone ${activeLevel1()}`}></div>
                        <div
                          className={`circle circletwo ${activeLevel1()}`}
                        ></div>
                        <div className={`line linetwo ${activeLevel2()}`}></div>
                        <div
                          className={`circle circlethree ${activeLevel2()}`}
                        ></div>
                        <div
                          className={`line linethree ${activeLevel3()}`}
                        ></div>
                        <div
                          className={`circle circlefour ${activeLevel3()}`}
                        ></div>
                      </div>
                    ) : (
                      <div class="statusbar">
                        <div className="circle circleone active"></div>
                        <div className={`line lineone active`}></div>
                        <div className={`circle circletwo active`}></div>
                        <div className={`line linetwo active`}></div>
                        <div className={`circle circlethree yellow`}></div>
                        <div className={`line linethree`}></div>
                        <div className={`circle circlefour`}></div>
                      </div>
                    )}

                    <div class="statustitlescont">
                      <div class="statustitle statustitle1">
                        Payment Confirmation
                      </div>
                      <div className="statustitle statustitle2">Processing</div>
                      <div class="statustitle statustitle3">
                        {order.orderStatus === "Cancelled"
                          ? "Cancelled"
                          : order.orderStatus === "Returned"
                          ? "Returned"
                          : "Dispatched"}
                      </div>
                      <div class="statustitle statustitle4">Delivered</div>
                    </div>
                  </div>
                  <div class="orderlistcont">
                    <div class="singleorderlist">
                      <div class="orderlistul">
                        {order &&
                          order.products.map((pro, i) => (
                            <div class="orderlistli singleitemli" key={i}>
                              <div class="imgcont">
                                <span>
                                  <Model
                                    key={pro._id}
                                    show={showModels[pro._id]}
                                    closeModel={() =>
                                      handleModelToggle(pro._id)
                                    }
                                  >
                                    <img
                                      className=""
                                      src={pro.product.images[0].url}
                                      alt=""
                                    />
                                  </Model>
                                </span>
                                <img
                                  src={pro.product.images[0].url}
                                  alt=""
                                  className="prodimgbox"
                                  onClick={() => handleModelToggle(pro._id)}
                                />
                              </div>
                              <p
                                class={`titlepera singleprotitle ${
                                  (order.orderStatus === "Cancelled") |
                                    (order.orderStatus === "Returned") &&
                                  "makeitfull"
                                } `}
                              >
                                {pro.product.title}
                              </p>
                              <div className="singleitembindertwo">
                                <div className="singleitembinder">
                                  <div class="qtybought">Qty: {pro.count}</div>
                                  <div class="singleitemprice">
                                    Price: {pro.price}
                                  </div>
                                </div>
                                <div
                                  className={`orderstate sigleitemstate ${orderStatusColor()}`}
                                >
                                  {order.orderStatus}
                                </div>
                              </div>
                              {/* <div class="orderdeliverdate">
                                {showDate(
                                  order.deliveredAt
                                    ? order.deliveredAt
                                    : order.updatedAt
                                )}
                              </div> */}
                              <div
                                class={`orderactioncont singleactionbtn ${
                                  (order.orderStatus === "Cancelled") |
                                    (order.orderStatus === "Returned") &&
                                  "makewidth0"
                                } `}
                              >
                                {(order.orderStatus === "Not Processed" ||
                                  order.orderStatus === "Processing") &&
                                  (pro.isCancelled ? (
                                    <Tooltip
                                      title={
                                        "Item is on 'Cancellation' process!"
                                      }
                                    >
                                      <button className="mybtn btnprimary singlecanbtn disablebtn">
                                        On Cancellation
                                      </button>
                                    </Tooltip>
                                  ) : (
                                    <button
                                      onClick={() => ItemCancel(pro._id)}
                                      className="mybtn btnprimary singlecanbtn"
                                    >
                                      Cancel Item
                                    </button>
                                  ))}
                                {order.orderStatus === "Dispatched" && (
                                  <Tooltip
                                    title={
                                      "Once you receive product, you can return it!"
                                    }
                                  >
                                    <button className="mybtn btnprimary singlecanbtn disablebtn">
                                      Return Item
                                    </button>
                                  </Tooltip>
                                )}
                                {order.orderStatus === "Delivered" &&
                                  (pro.isReturned ? (
                                    <Tooltip
                                      title={"Items under returning process."}
                                    >
                                      <button className="mybtn btnprimary disablebtn">
                                        On Return
                                      </button>
                                    </Tooltip>
                                  ) : moment(order.deliveredAt).isBefore(
                                      moment().subtract(15, "days")
                                    ) ? (
                                    <Tooltip
                                      title={
                                        "Order is not eligible for return. It must be delivered within the last 15 days."
                                      }
                                    >
                                      <button className="mybtn btnprimary disablebtn">
                                        Return Item
                                      </button>
                                    </Tooltip>
                                  ) : (
                                    <button
                                      onClick={() => ItemReturn(pro._id)}
                                      className="mybtn btnprimary"
                                    >
                                      Return Item
                                    </button>
                                  ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mainbodytop">
                <div class="previewaddress">
                  <div class="previewadrhead">
                    {order.orderStatus !== "Delivered"
                      ? "Shipping to:"
                      : "Shipped at:"}
                  </div>
                  <div class="previewadrsub">
                    <div class="previewprofiledata">
                      {order.shippingto &&
                        `${order.shippingto.Address}, ${order.shippingto.City}, ${order.shippingto.Province}, ${order.shippingto.Area}, ${order.shippingto.LandMark}.`}
                    </div>
                  </div>
                </div>
                <div class="previewprofile">
                  <div class="previewprofilehead">Summary</div>
                  <div class="previewprofilesub">
                    <div class="orderdetailsummary">
                      <span> Subtotal </span>
                      <span>
                        $ {getSubTotal()}
                        .00
                      </span>
                    </div>
                    <div class="orderdetailsummary">
                      <span> Shipping fee </span>
                      <span>
                        {" "}
                        $ {order.shippingfee}
                        .00{" "}
                      </span>
                    </div>
                    {order && order.paymentIntent.discounted && (
                      <div class="orderdetailsummary">
                        <span>
                          {" "}
                          Discount{" "}
                          {order.paymentIntent.discountType !== null && (
                            <div className="coupontypetxt">
                              {order.paymentIntent.discountType ===
                                "Discount" &&
                                `${order.paymentIntent.dispercent}% Off`}
                              {order.paymentIntent.discountType === "Cash" &&
                                `$ ${order.paymentIntent.dispercent} Off`}
                              {order.paymentIntent.discountType ===
                                "Shipping" && `Zero Shipping`}
                            </div>
                          )}
                        </span>
                        <span> $ -{order.paymentIntent.discounted}.00 </span>
                      </div>
                    )}
                    <hr />
                    <div class="orderdetailsummary totalamount">
                      <span> Total Payment: </span>{" "}
                      <span>
                        {" "}
                        $ {order && order.paymentIntent.amount}
                        .00
                      </span>
                    </div>
                    <div class="paidmode">Paid By: {order.paymentStatus}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <NoNetModal
            classDisplay={`${noNetModal && "open-popup"}`}
            setNoNetModal={setNoNetModal}
            handleRetry={handleRetry}
          ></NoNetModal>
        </div>
      </div>
    </div>
  );
}
