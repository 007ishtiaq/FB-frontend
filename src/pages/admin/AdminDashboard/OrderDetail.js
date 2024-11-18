import React, { useState, useEffect } from "react";
import { ReactComponent as Ticksvg } from "../../../images/admin/tickcheck.svg";
import { ReactComponent as Crosssvg } from "../../../images/admin/cross.svg";
import OrderBookimg from "../../../images/admin/book.png";
import "./OrderDetail.css";
import "../../../pages/user/SingleOrder.css";
import AdminsideNavcopy from "../../../components/nav/AdminsideNavcopy";
import {
  changeStatus,
  changeAccept,
  OrderUpdate,
  removeOrderItem,
  deleteOrder,
  setCashback,
  setPaid,
  setbackDeliver,
  sendInvoiceToEmail,
} from "../../../functions/admin";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { getOrder } from "../../../functions/user";
import { getActionInfo } from "../../../functions/admin";
import OrderEditModal from "../../../components/modal/OrderEditModal";
import OrderEditForm from "../../../components/forms/OrderEditForm";
import ItemActioninfoModel from "../../../components/modal/ItemActioninfoModel";
import Model from "../../../components/Model/Model";
import ItemActionDetails from "../../../components/itemActionDetails/ItemActionDetails";
import Switch from "../../../components/Switch/Switch";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "../../../components/order/Invoice";

export default function OrderDetail({ match, history }) {
  const [order, setOrder] = useState("");
  //for deposit slip modal
  const [showModel, setshowModel] = useState(false);
  //for User Item Action model cancels
  const [cancelInfomodalVisibilities, setCancelInfomodalVisibilities] =
    useState([]);
  //for User Item Action model return
  const [actionInfomodalVisibilities, setActionInfoModalVisibilities] =
    useState([]);
  //for admin Item Edit modals
  const [modalVisibilities, setModalVisibilities] = useState([]);
  //order is cashbacked
  const [isCashbacked, setIsCashbacked] = useState(false);
  //order is paid for All payments
  const [isPaid, setIsPaid] = useState(false);
  //order is Back delivered for returns
  const [isbackDeliver, setIsbackDeliver] = useState(false);
  const [showModels, setShowModels] = useState({});

  const initialState = {
    ItemName: "",
    Color: "",
    Shipping: 0,
    Price: "",
    Quantity: "",
    totalqty: "",
  };
  const [form, setForm] = useState(initialState);

  const initialValues = {
    RequestNumber: "",
    quantity: "",
    reasonForReturn: "",
    otherReasonText: "",
    conditionOfProduct: "",
    preferredResolution: "",
    declaration: "",
    createdAt: "",
  };
  const [returnForm, setReturnForm] = useState(initialValues);

  const { user } = useSelector((state) => ({ ...state }));

  const { id } = match.params;

  useEffect(() => {
    loadOrder();
  }, [id, isCashbacked, isPaid, isbackDeliver]);

  const loadOrder = (orderID = id) =>
    getOrder(orderID, user.token)
      .then((res) => {
        // console.log("orderID", orderID);
        console.log(JSON.stringify(res.data, null, 4));
        setOrder(res.data);
        if (res.data) {
          setIsCashbacked(res.data.isCashBack);
          setIsPaid(res.data.isPaid);
          setIsbackDeliver(res.data.isDelivered);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.status === 401 && "Unauthrised");
      });

  const handleModelToggle = (productId) => {
    setShowModels((prevShowModels) => ({
      ...prevShowModels,
      [productId]: !prevShowModels[productId],
    }));
  };

  // Function to toggle the visibility of a specific product edit modal
  const toggleModalVisibility = (index) => {
    const updatedVisibilities = [...modalVisibilities];
    updatedVisibilities[index] = !updatedVisibilities[index];
    setModalVisibilities(updatedVisibilities);
  };
  // Function to toggle the visibility of a Action info return modal
  const toggleactionInfoModalVisibility = (index) => {
    const updatedVisibilities = [...actionInfomodalVisibilities];
    updatedVisibilities[index] = !updatedVisibilities[index];
    setActionInfoModalVisibilities(updatedVisibilities);
  };
  // Function to toggle the visibility of a Action info cancel modal
  const togglecancelInfoModalVisibility = (index) => {
    const updatedVisibilities = [...cancelInfomodalVisibilities];
    updatedVisibilities[index] = !updatedVisibilities[index];
    setCancelInfomodalVisibilities(updatedVisibilities);
  };

  const dataSet = (prodId) => {
    const Item = order.products.find((prod) => prod._id === prodId);
    // console.log(order);
    // console.log(prodId);
    // console.log(Item);
    setForm({
      ...form,
      ItemName: Item.product.title,
      Color: Item.color,
      Shipping: Item.product.shippingcharges,
      Price: Item.price,
      Quantity: Item.count,
      totalqty: Item.product.quantity,
    });
  };

  const handleStatusChange = (orderId, orderStatus) => {
    const userConfirmed = window.confirm(`Change status as "${orderStatus}" ?`);

    if (userConfirmed) {
      changeStatus(orderId, orderStatus, user.token)
        .then((res) => {
          if (res.data.success) {
            toast.success(`Status updated as "${res.data.order.orderStatus}"`);
            loadOrder();
            // console.log("res.data of a status order", res.data);
            // loadOrder(res.data.order._id ? res.data.order._id : id);
          }
          if (res.data.error) {
            toast.error(res.data.error);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.message);
        });
    }
  };

  const changeAcceptstatus = (orderId, orderAccept) => {
    changeAccept(orderId, orderAccept, user.token).then((res) => {
      if (res.data.orderAccept === "Yes") {
        toast.success("Order Accepted");
      }
      loadOrder();
    });
  };

  function showDate(orderDate) {
    const date = new Date(orderDate);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formattedDate = date.toLocaleDateString("en-US", options);

    return formattedDate;
  }

  const getTotal = () => {
    return order.products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const showActionInfo = (prodId, currentinfo) => {
    getActionInfo(prodId, currentinfo, user.token)
      .then((res) => {
        setReturnForm({
          ...returnForm,
          RequestNumber: res.data.RequestNumber,
          quantity: res.data.quantity,
          reasonForReturn: res.data.reasonForReturn,
          otherReasonText: res.data.otherReasonText,
          conditionOfProduct: res.data.conditionOfProduct,
          preferredResolution: res.data.preferredResolution,
          declaration: res.data.declaration,
          createdAt: res.data.createdAt,
        });
      })
      .catch((error) => {
        toast.error(`Order Action Info not fetched`);
        console.error(error);
      });
  };

  const onModalok = (prodId, productId) => {
    OrderUpdate(id, prodId, productId, form, user.token)
      .then((res) => {
        if (res.data.success) {
          toast.success("Order Updated");
          loadOrder();
        }
        if (res.data.error) {
          toast.error(res.data.error);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };

  const removeItem = (prodId) => {
    const userConfirmed = window.confirm(`Sure you want Remove Item ?`);

    if (userConfirmed) {
      removeOrderItem(id, prodId, user.token)
        .then((res) => {
          if (res.data.success) {
            toast.success(`Item Removed`);
            loadOrder();
            setModalVisibilities([]);
          }
          if (res.data.error) {
            toast.error(res.data.error);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error(`Edit not Allowed, Somthing Went worng`);
        });
    }
  };

  const removeOrder = () => {
    const userConfirmed = window.confirm(`Sure you want Remove Item ?`);

    if (userConfirmed) {
      deleteOrder(id, user.token)
        .then((res) => {
          if (res.data.success) {
            toast.success(res.data.message);
            history.push("/AdminPanel?page=OrderstoDispatch");
          }
          if (res.data.error) {
            toast.error(res.data.error);
          }
        })
        .catch((error) => {
          // console.log(error);
          toast.error("Something Went Wrong");
        });
    }
  };

  const sendInvoice = () => {
    sendInvoiceToEmail(id, user.token)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
        }
        if (res.data.error) {
          toast.error(res.data.error);
        }
      })
      .catch((error) => {
        // console.log(error);
        toast.error("Something Went Wrong, Email failed");
      });
  };

  const classToggle = () => {
    if (order.orderAccept === "Under") {
      return "";
    }
    if (order.orderAccept === "Yes") {
      return "accepted";
    }
    if (order.orderAccept === "No") {
      return "rejected";
    }
  };

  const setOrderCashback = () => {
    setCashback(order._id, user.token)
      .then((res) => {
        if (res.data.success) {
          setIsCashbacked(res.data.isCashBack);
          toast.success("Status updated");
        }
        if (res.data.error) {
          toast.error(res.data.error);
        }
      })
      .catch((error) => {
        // console.log(error);
        toast.error(`Order Cashback failed`);
      });
  };
  const setOrderPaid = () => {
    setPaid(order._id, user.token)
      .then((res) => {
        setIsPaid(res.data.isPaid);
        toast.success("Order Status Updated");
      })
      .catch((error) => {
        toast.error(`Order COD Paid failed`);
        console.error(error);
      });
  };
  const setOrderbackDeliver = () => {
    setbackDeliver(order._id, user.token)
      .then((res) => {
        setIsbackDeliver(res.data.isDelivered);
        toast.success("Order Status Updated");
      })
      .catch((error) => {
        toast.error(`Order Back Deliver failed`);
        console.error(error);
      });
  };

  const Navigatorhandler = () => {
    if ((order.orderStatus === "Delivered") & (order.isPaid === true)) {
      return "CompletedOrders";
    }
    if (order.orderStatus === "Cancelled") {
      return "RejectedOrders";
    }
    if (order.orderStatus === "Returned") {
      return "ReturnedOrders";
    } else {
      return "OrderstoDispatch";
    }
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

  return (
    <div class="manageacmaincont">
      <div class="manageaccont">
        <AdminsideNavcopy currentActive={Navigatorhandler()} />
        <div class="navrightside">
          <div class="ordcont">
            <div class="ordintro">
              <img src={OrderBookimg} alt="" />
              <p>Order Details</p>
            </div>
            {order && (
              <div class="ordinfo">
                <div class="cutomerinfocont">
                  <div class="ordinfohead">
                    <p>Customer Information</p>
                  </div>
                  <div class="ordinfosub">
                    <ul>
                      <li>
                        <span>Name:</span> {order.shippingto.Name}
                      </li>
                      <li>
                        <span>Address:</span> {order.shippingto.Address},{" "}
                        {order.shippingto.Province}, {order.shippingto.Area},{" "}
                        {order.shippingto.LandMark}, {order.shippingto.City}.{" "}
                        {/* <div style={{ display: "inline-block" }}>
                          <OrderEditModal
                            onModalok={onModalok}
                            setModalVisible={setModalVisibleAdress}
                            modalVisible={modalVisibleAdress}
                            address={address}
                            btnClasses={"mybtn btnsecond ordeditbtn"}
                          >
                            <ShippingFormAddressbook
                              address={address}
                              setAddress={setAddress}
                            />
                          </OrderEditModal>
                        </div> */}
                      </li>
                      <li>
                        <span>City:</span> {order.shippingto.City}
                      </li>
                      <li>
                        <span>Contact:</span> {order.shippingto.Contact}
                      </li>
                      <li>
                        <span>Email:</span> {order.email}
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="ordinfocont">
                  <div class="ordinfohead">
                    <p>Order Information</p>
                  </div>
                  <div class="ordinfosub">
                    <ul>
                      <li>
                        <span>Order ID:</span> {order.OrderId}
                      </li>
                      {order.CloneId && (
                        <li>
                          <span>Order Clone:</span>
                          <div className="pticksvg">
                            <Ticksvg />
                          </div>
                        </li>
                      )}
                      <li>
                        <span>Place On:</span> {showDate(order.createdAt)}
                      </li>
                      <li>
                        <span>Edited On:</span> {showDate(order.updatedAt)}
                      </li>
                      <li>
                        <span>Mode of Payment:</span> {order.paymentStatus}{" "}
                        {order.PaymentSlip && (
                          <>
                            <Model
                              show={showModel}
                              closeModel={() => setshowModel(false)}
                            >
                              <img
                                className="slipImg"
                                src={order.PaymentSlip.url}
                                alt=""
                              />
                            </Model>
                            <button
                              onClick={() => setshowModel(true)}
                              className="mybtn btnsecond paymentslip"
                            >
                              Deposite Slip
                            </button>
                          </>
                        )}
                      </li>
                      <li className="actionli">
                        <span>Payment status:</span>
                        {order.isPaid ? (
                          <div className="pticksvg">
                            <Ticksvg />
                          </div>
                        ) : (
                          <div className="pcrosssvg">
                            <Crosssvg />
                          </div>
                        )}
                        <span className="actionswitch1">
                          <Switch
                            checked={isPaid}
                            handlechange={setOrderPaid}
                          />
                        </span>
                      </li>
                      {order.paidAt && (
                        <li>
                          <span>Payment Varified At:</span>{" "}
                          {new Date(order.paidAt).toLocaleString()}
                          {/* {new Date(
                            "2023-11-13T20:19:46.695+00:00"
                          ).toLocaleString()} */}
                        </li>
                      )}

                      {order.orderStatus === "Returned" ? (
                        <li className="actionli">
                          <span>Items Back Delivered</span>
                          {order.isDelivered ? (
                            <div className="pticksvg">
                              <Ticksvg />
                            </div>
                          ) : (
                            <div className="pcrosssvg">
                              <Crosssvg />
                            </div>
                          )}
                          <span className="actionswitch2">
                            <Switch
                              checked={isbackDeliver}
                              handlechange={setOrderbackDeliver}
                            />
                          </span>
                        </li>
                      ) : (
                        <li>
                          <span>Deliver status:</span>
                          {order.isDelivered ? (
                            <div className="pticksvg">
                              <Ticksvg />
                            </div>
                          ) : (
                            <div className="pcrosssvg">
                              <Crosssvg />
                            </div>
                          )}
                        </li>
                      )}

                      {order.deliveredAt && (
                        <li>
                          <span>Delivered Date:</span>{" "}
                          {showDate(order.deliveredAt)}
                        </li>
                      )}
                      {(order.orderStatus === "Returned" ||
                        order.orderStatus === "Cancelled") && (
                        <li className="actionli">
                          <span>CashBack status:</span>
                          {order.isCashBack ? (
                            <div className="pticksvg">
                              <Ticksvg />
                            </div>
                          ) : (
                            <div className="pcrosssvg">
                              <Crosssvg />
                            </div>
                          )}
                          <span className="actionswitch3">
                            <Switch
                              checked={isCashbacked}
                              handlechange={setOrderCashback}
                            />
                          </span>
                        </li>
                      )}
                      {order.orderStatus === "Returned" &&
                        order.CashBackedAt && (
                          <li>
                            <span>CashBackedAt Date:</span>{" "}
                            {showDate(order.CashBackedAt)}
                          </li>
                        )}
                    </ul>
                  </div>
                </div>

                <div class="Ordersmaincont">
                  <table>
                    <thead>
                      <tr>
                        <th class="ordli">Action</th>
                        <th class="ordli">Item</th>
                        <th class="ordli">Color</th>
                        <th class="ordli">Price</th>
                        <th class="ordli">shipping</th>
                        <th class="ordli">Quantity</th>
                        <th class="ordli">Total Shipping</th>
                        <th class="ordli">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map((p, i) => (
                        <tr key={i}>
                          <td class="ordli">
                            <OrderEditModal
                              onModalok={onModalok}
                              setModalVisible={toggleModalVisibility.bind(
                                null,
                                i
                              )}
                              modalVisible={modalVisibilities[i]}
                              dataSet={dataSet}
                              prodId={p._id}
                              productId={p.product._id}
                              btnClasses={"mybtn btnsecond ordeditbtn"}
                            >
                              <OrderEditForm
                                form={form}
                                setForm={setForm}
                                removeItem={() => removeItem(p._id)}
                              />
                            </OrderEditModal>
                          </td>
                          <td class="ordli">
                            {/* {JSON.stringify(p.product.images[0].url)} */}
                            <span>
                              <Model
                                key={p._id}
                                show={showModels[p._id]}
                                closeModel={() => handleModelToggle(p._id)}
                              >
                                <img
                                  className=""
                                  src={p.product.images[0].url}
                                  alt=""
                                />
                              </Model>
                            </span>
                            <span
                              onClick={() => handleModelToggle(p._id)}
                              className="prodimgbtn"
                            >
                              {p.product.art} - {p._id}
                              <br />
                              {p.product.title.substring(0, 35)}
                            </span>
                            {/* {p.isCancelled && <div className="cnlcircle"></div>} */}
                            {p.isCancelled && (
                              <ItemActioninfoModel
                                // onModalok={onModalok}
                                setModalVisible={togglecancelInfoModalVisibility.bind(
                                  null,
                                  i
                                )}
                                modalVisible={cancelInfomodalVisibilities[i]}
                                showActionInfo={showActionInfo}
                                currentinfo="cancel"
                                prodId={p._id}
                                setReturnForm={setReturnForm}
                              >
                                <ItemActionDetails returnForm={returnForm} />
                              </ItemActioninfoModel>
                            )}
                            {p.isReturned && (
                              <ItemActioninfoModel
                                // onModalok={onModalok}
                                setModalVisible={toggleactionInfoModalVisibility.bind(
                                  null,
                                  i
                                )}
                                modalVisible={actionInfomodalVisibilities[i]}
                                showActionInfo={showActionInfo}
                                currentinfo="return"
                                prodId={p._id}
                                setReturnForm={setReturnForm}
                              >
                                <ItemActionDetails returnForm={returnForm} />
                              </ItemActioninfoModel>
                            )}
                          </td>
                          <td class="ordli">{p.color}</td>
                          <td class="ordli">$ {p.price.toFixed(2)}</td>
                          <td class="ordli">
                            $ {p.product.shippingcharges.toFixed(2)}
                          </td>
                          <td class="ordli">{p.count}</td>
                          <td class="ordli">
                            {(p.price >= 1
                              ? p.product.shippingcharges
                              : p.product.shippingcharges * p.count
                            ).toFixed(2)}
                          </td>
                          <td class="ordli">
                            $ {(p.price * p.count).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div class="ordinfosub ordercalc">
                  <ul>
                    <li>
                      <span>Products Value:</span> $ {getTotal().toFixed(2)}
                    </li>
                    <li>
                      <span>Delivery Charges: </span>${" "}
                      {order.shippingfee.toFixed(2)}
                    </li>
                    {order && order.paymentIntent.discounted && (
                      <li>
                        <span>
                          Discounted:{" "}
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
                        </span>{" "}
                        | $ -{order.paymentIntent.discounted.toFixed(2)}
                      </li>
                    )}
                    <li>
                      <span>
                        Total {order.isPaid ? "Paid" : "Payable"}:{" "}
                        {order.paymentIntent.currency}{" "}
                        {order.paymentIntent.amount.toFixed(2)}
                      </span>
                    </li>
                  </ul>
                </div>
                <div class="ordactioncont">
                  {(order.orderAccept === "Yes" ||
                    order.orderAccept === "No") && (
                    <div class="ordstatusmap">
                      <p>Status</p>
                      <div class="orderstatusbarcontadmin">
                        {order.orderStatus !== "Cancelled" &&
                        order.orderStatus !== "Returned" ? (
                          <div class="statusbar">
                            <div class="circle circleone active">
                              <span className={`infotool infotool1 active`}>
                                Not Processed
                              </span>
                            </div>
                            <div
                              className={`line lineone ${activeLevel1()}`}
                            ></div>
                            <div
                              className={`circle circletwo ${activeLevel1()}`}
                            >
                              <span
                                className={`infotool infotool2 ${activeLevel1()}`}
                              >
                                Processing
                              </span>
                            </div>
                            <div
                              className={`line linetwo ${activeLevel2()}`}
                            ></div>
                            <div
                              className={`circle circlethree ${activeLevel2()}`}
                            >
                              <span
                                className={`infotool infotool3 ${activeLevel2()}`}
                              >
                                Dispatched
                              </span>
                            </div>
                            <div
                              className={`line linethree ${activeLevel3()}`}
                            ></div>
                            <div
                              className={`circle circlefour ${activeLevel3()}`}
                            >
                              <span
                                className={`infotool infotool4 ${activeLevel3()}`}
                              >
                                Delivered
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div class="statusbar">
                            <div class="circle circleone active">
                              <span className={`infotool infotool1 active`}>
                                Not Processed
                              </span>
                            </div>
                            <div className={`line lineone active`}></div>
                            <div className={`circle circletwo active`}>
                              <span className={`infotool infotool2 active`}>
                                Processing
                              </span>
                            </div>
                            <div className={`line linetwo active`}></div>
                            <div className={`circle circlethree yellow`}>
                              <span className={`infotool infotool3 yellow`}>
                                {order.orderStatus}
                              </span>
                            </div>
                            <div className={`line linethree`}></div>
                            <div className={`circle circlefour`}>
                              <span className={`infotool infotool4`}>
                                Delivered
                              </span>
                            </div>
                          </div>
                        )}

                        <select
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="form-control adminordstatusbtn"
                          defaultValue={order.orderStatus}
                          name="status"
                        >
                          <option value="Not Processed">Not Processed</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Returned">Returned</option>
                        </select>
                        {(order.orderAccept === "Yes" ||
                          order.orderAccept === "No") && (
                          <div className={`acceptstatus ${classToggle()}`}>
                            {order.orderAccept === "Yes" && <div>Accepted</div>}
                            {order.orderAccept === "No" && <div>Rejected</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {order.orderAccept === "Under" && (
                    <div class="ordaction">
                      <button
                        class="acceptbtn"
                        onClick={() => {
                          changeAcceptstatus(order._id, "Yes");
                          loadOrder();
                        }}
                      >
                        <div>
                          <Ticksvg />
                        </div>
                        <p>Accept</p>
                      </button>
                      <button
                        class="declbtn"
                        onClick={(e) => {
                          changeAcceptstatus(order._id, "No");
                          handleStatusChange(order._id, "Cancelled");
                          loadOrder();
                        }}
                      >
                        <div>
                          <Crosssvg />
                        </div>
                        <p>Decline</p>
                      </button>
                    </div>
                  )}
                  <div class="ordpdfcont">
                    <button
                      class="mybtn btnprimary"
                      onClick={() => {
                        sendInvoice();
                      }}
                    >
                      Send Invoice via Email
                    </button>

                    <span>
                      <PDFDownloadLink
                        document={<Invoice order={order} email={user.email} />}
                        fileName={`Order Invoice "ID:${order.OrderId}".pdf`}
                        className="mybtn btnprimary"
                      >
                        Download Invoice
                      </PDFDownloadLink>
                    </span>

                    <button
                      class="mybtn btnprimary delorder"
                      onClick={() => {
                        removeOrder();
                      }}
                    >
                      Delete Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
