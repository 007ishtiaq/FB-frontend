import React, { useState, useEffect } from "react";
import { getreturnedOrders } from "../../../functions/admin";
import { useSelector } from "react-redux";
import "./OrderstoDispatch.css";
import OrdersReturnd from "../../../components/order/OrdersReturnd";
import { toast } from "react-hot-toast";

// admin side returned orders
const ReturnedOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () =>
    getreturnedOrders(user.token)
      .then((res) => {
        // console.log(JSON.stringify(res.data, null, 4));
        setOrders(res.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.status === 401 && "Unauthrised");
      });

  return (
    <div>
      <h4>Returned Orders</h4>
      <OrdersReturnd orders={orders}></OrdersReturnd>
    </div>
  );
};

export default ReturnedOrders;
