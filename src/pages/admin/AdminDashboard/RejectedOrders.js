import React, { useState, useEffect } from "react";
import { getRejectedOrders } from "../../../functions/admin";
import { useSelector } from "react-redux";
import OrdersReturnd from "../../../components/order/OrdersReturnd";
import "./OrderstoDispatch.css";
import { toast } from "react-hot-toast";

const RejectedOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () =>
    getRejectedOrders(user.token)
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
      <h4>Canccelled Orders</h4>
      <OrdersReturnd orders={orders} />
    </div>
  );
};

export default RejectedOrders;
