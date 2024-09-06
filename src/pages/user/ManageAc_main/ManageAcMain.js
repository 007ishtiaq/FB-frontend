import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import ManageMyAccount from "../ManageMyAccount";
import { useSelector } from "react-redux";
import {
  getUserProfile,
  getUserAddress,
  getUserOrders,
} from "../../../functions/user";
import { subscribeNewsletter, checkNewsSub } from "../../../functions/user";
import { Online } from "react-detect-offline";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import laptop from "../../../images/laptop.png";
import NewsletterModal from "../../../components/modal/NewsletterModal";
import { ReactComponent as NoOrdersFoundsvg } from "../../../images/manageacUser/noorders.svg";
import Skeleton from "react-loading-skeleton";

export default function ManageAcMain() {
  const [profile, setProfile] = useState("");
  const [address, setAddress] = useState("");
  const [orders, setOrders] = useState([]);
  const [newsmodalVisible, setNewsModalVisible] = useState(false);
  const [newsSubscribed, setNewsSubscribed] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  let history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user && user.token) {
      if (navigator.onLine) {
        getUserOrders(user.token, 1).then((res) => {
          setOrders(res.data.orders.slice(0, 3));
        });
      } else {
        dispatch({
          type: "SET_NETMODAL_VISIBLE",
          payload: true,
        });
      }
    }
  }, [user, navigator.onLine]);

  useEffect(() => {
    if (navigator.onLine) {
      loadUserProfile();
    } else {
      dispatch({
        type: "SET_NETMODAL_VISIBLE",
        payload: true,
      });
    }
  }, [user, Online]);

  const loadUserProfile = () => {
    if (user && user.token) {
      getUserProfile(user.token).then((a) => {
        setProfile(a.data);
      });
    }
  };

  useEffect(() => {
    if (user && user.token) {
      if (navigator.onLine) {
        getUserAddress(user.token).then((a) => setAddress(a.data));
      } else {
        dispatch({
          type: "SET_NETMODAL_VISIBLE",
          payload: true,
        });
      }
    }
  }, [user, navigator.onLine]);

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

  useEffect(() => {
    if (user && user.token) {
      checkNewsSub(user.token).then((res) => {
        if (res.data.ok) {
          setNewsSubscribed(true);
        }
      });
    }
  }, [user]);

  const handleSubSubmit = () => {
    if (navigator.onLine) {
      if (user && user.token) {
        subscribeNewsletter(user.token)
          .then((res) => {
            if (res.data.message === "Email subscribed successfully") {
              toast.success("Newslestter subscribed successfully");
              setNewsSubscribed(true);
            } else if (res.data.message === "Email unsubscribed successfully") {
              toast.success("Newslestter unsubscribed successfully");
              setNewsSubscribed(false);
            }
          })
          .catch((err) => console.log("newsletter sub err", err));
      } else {
        history.push({
          pathname: "/login",
          state: { from: `/userprofile` },
        });
      }
    } else {
      setNewsModalVisible(false);
      dispatch({
        type: "SET_NETMODAL_VISIBLE",
        payload: true,
      });
    }
  };

  const handleSubcancel = () => {
    setNewsModalVisible(false);
  };
  return (
    <>
      <div class="manageacmainhead">Manage My Account</div>
      <div class="manageacmainbody">
        <div class="mainbodytop">
          <div class="previewprofile">
            <div class="previewprofilehead">
              Personal Profile |{" "}
              <Link to="/ManageMyAc?page=userProfile" className="editbtn">
                Edit
              </Link>
            </div>
            <div class="previewprofilesub">
              <div class="previewprofiledata">
                {profile ? profile.Name : <Skeleton count={2} />}
              </div>
              <div class="previewprofiledata">{profile && profile.Email}</div>
              <NewsletterModal
                onSubModalok={handleSubSubmit}
                onSubModalcancel={handleSubcancel}
                setNewsModalVisible={setNewsModalVisible}
                newsmodalVisible={newsmodalVisible}
                btnClasses={"nobtnstyle newsletterbtn"}
                newsSubscribed={newsSubscribed}
              >
                <div className="lettersubcont">
                  <p>
                    I have read and understood{" "}
                    <Link className="nobtnstyle" to="/PrivacyPolicy">
                      {" "}
                      Privacy Policy{" "}
                    </Link>
                  </p>
                </div>
              </NewsletterModal>
            </div>
          </div>
          <div class="previewaddress">
            <div class="previewadrhead">
              Shipping Address |{" "}
              <Link to="/ManageMyAc?page=userAddress" className="editbtn">
                Edit
              </Link>
            </div>
            <div class="previewadrsub">
              {address ? (
                address.Address ? (
                  <div class="previewprofiledata">
                    {address.Address}, {address.City}, {address.Province},{" "}
                    {address.Area}, {address.LandMark}.
                  </div>
                ) : (
                  <div className="noadrtext">Add your Shipping Address</div>
                )
              ) : (
                <Skeleton count={3} />
              )}
            </div>
          </div>
        </div>
        <Online onChange={loadUserProfile} />
        <div class="mainbodybelow">
          <div class="previewordershead">
            <p>Recent Orders</p>
            <Link to="/ManageMyAc?page=userOrders">
              <button className="mybtn btnsecond">All Orders</button>
            </Link>
          </div>
          <div class="ordersheading">
            <ul class="ordersul">
              <li class="ordersli">Order Number</li>
              <li class="ordersli litohide">Placed On</li>
              <li class="ordersli">Items</li>
              <li class="ordersli">Total</li>
              <li class="ordersli">Details</li>
            </ul>
          </div>
          <div class="orderssub">
            {orders.length > 0 ? (
              orders.reverse().map((order, i) => (
                <ul class="ordersubul" key={i}>
                  <li class="orderssubli">{order.OrderId}</li>
                  <li class="orderssubli litohide">
                    {" "}
                    {showDate(order.createdAt)}
                  </li>
                  <li class="orderssubli">
                    <img
                      className="smallimgpreview"
                      src={
                        order.products[0].product.images[0]
                          ? order.products[0].product.images[0].url
                          : laptop
                      }
                      alt=""
                    />
                    {order.products[1] && (
                      <img
                        className="smallimgpreview"
                        src={
                          order.products[1].product.images[0]
                            ? order.products[1].product.images[0].url
                            : laptop
                        }
                        alt=""
                      />
                    )}
                    {order.products[2] && (
                      <img
                        className="smallimgpreview"
                        src={
                          order.products[2].product.images[0]
                            ? order.products[2].product.images[0].url
                            : laptop
                        }
                        alt=""
                      />
                    )}
                  </li>
                  <li class="orderssubli">
                    Rs {order.paymentIntent.amount}.00
                  </li>
                  <li class="orderssubli">
                    <Link to={`/order/${order._id}`}>
                      <span className="vieworderbtn">View Details</span>
                    </Link>
                  </li>
                </ul>
              ))
            ) : (
              <div className="noorderscont">
                <div className="noordersvgcont">
                  <NoOrdersFoundsvg />
                </div>
                <p>No Orders Found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
