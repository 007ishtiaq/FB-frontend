import React, { useState, useEffect } from "react";
import { getOrders } from "../../../functions/admin";
import { useSelector } from "react-redux";
import Orders from "../../../components/order/Orders";
import "./OrderstoDispatch.css";
import { toast } from "react-hot-toast";

const OrderstoDispatch = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () =>
    getOrders(user.token)
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
      <h4>Orders To Dispatch</h4>
      <Orders orders={orders} />
    </div>
  );
};

export default OrderstoDispatch;
