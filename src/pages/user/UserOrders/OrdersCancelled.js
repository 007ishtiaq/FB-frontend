import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../MyOrders.css";
import { Online } from "react-detect-offline";
import { getUserCancelledOrders } from "../../../functions/user";
import Orderslistuser from "../../../components/order/orderslistuser";
import { Pagination } from "antd";
import { ReactComponent as NoOrdersFoundsvg } from "../../../images/manageacUser/noorders.svg";
import { ReactComponent as Returnsvg } from "../../../images/cart/return.svg";
import { Link } from "react-router-dom";

// user side cancelled orders
export default function OrdersCancelled() {
  const [orders, setOrders] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [page, setPage] = useState(1);

  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (navigator.onLine) {
      loadAllOrders();
    } else {
      dispatch({
        type: "SET_NETMODAL_VISIBLE",
        payload: true,
      });
    }
  }, [user, page, navigator.onLine, Online]);

  const loadAllOrders = () => {
    if (user && user.token) {
      getUserCancelledOrders(user.token, page).then((res) => {
        setOrders(res.data.orders);
        setOrdersCount(res.data.totalOrders);
      });
    }
  };

  return orders && orders.length > 0 ? (
    <>
      <Orderslistuser orders={orders}></Orderslistuser>
      <div class="productreviewbottom">
        <div class="previewpagination">
          <Pagination
            current={page}
            total={(ordersCount / 5) * 10}
            onChange={(value) => setPage(value)}
          />
        </div>
      </div>
    </>
  ) : (
    <div className="emptywishcont">
      <div className="Emptyorderssvg">
        <NoOrdersFoundsvg />
      </div>
      <Online onChange={loadAllOrders} />
      <p className="empttxtup">No Orders Found!</p>
      <p className="empttxtsub">Explore more and shortlist some items</p>
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
  );
}
