import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Crosssvg } from "../../images/admin/cross.svg";
import { ReactComponent as Ticksvg } from "../../images/admin/tickcheck.svg";
// const moment = require("moment");
const moment = require("moment-timezone");

export default function OrdersReturnd({ orders }) {
  const [orderIdFilter, setOrderIdFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [orderdByFilter, setOrderdByFilter] = useState("");

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
  function showMoment(orderDate) {
    const createdAt = moment(orderDate).tz("Asia/Karachi"); // Assuming your timezone is Asia/Karachi
    const now = moment().tz("Asia/Karachi");
    const duration = moment.duration(now.diff(createdAt));

    const hoursAgo = Math.floor(duration.asHours());
    const minutesAgo = Math.floor(duration.asMinutes() % 60);

    let result = "";

    if (hoursAgo > 0) {
      result += `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"}`;
    }

    if (minutesAgo > 0) {
      result += ` ${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"}`;
    }

    result += " ago";

    return result;

    // for long details return
    // const hoursAgo = Math.floor(duration.asHours());
    // const minutesAgo = Math.floor(duration.asMinutes() % 60);
    // let result = "";
    // if (hoursAgo > 0) {
    //   result += `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"}`;
    // }
    // if (minutesAgo > 0) {
    //   result += ` ${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"}`;
    // }
    // result += " ago";
  }

  const sortedOrders = orders.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  console.log("sorted orders", sortedOrders);
  const filteredOrders = sortedOrders.filter(
    (order) =>
      (!orderIdFilter || order.OrderId == orderIdFilter) &&
      (!dateFilter || order.createdAt.includes(dateFilter)) &&
      (!orderdByFilter || order.orderdBy.email.includes(orderdByFilter))
  );

  const groupedOrders = {};

  sortedOrders.forEach((order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    if (!groupedOrders[date]) {
      groupedOrders[date] = [];
    }
    groupedOrders[date].push(order);
  });

  const orderStatusColor = (order) => {
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

  return (
    <div>
      <div className="filtermaincont">
        <div className="filtercont">
          <input
            type="text"
            value={orderIdFilter}
            onChange={(e) => setOrderIdFilter(e.target.value)}
            placeholder="Enter Order ID"
          />
          <button
            className="mybtn btnprimary"
            onClick={() => setOrderIdFilter("")}
          >
            Reset ID
          </button>
        </div>
        <div className="filtercont">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <button
            className="mybtn btnprimary"
            onClick={() => setDateFilter("")}
          >
            Reset Date
          </button>
        </div>
        <div className="filtercont">
          <input
            type="text"
            value={orderdByFilter}
            onChange={(e) => setOrderdByFilter(e.target.value)}
            placeholder="Enter User Email"
          />
          <button
            className="mybtn btnprimary"
            onClick={() => setOrderdByFilter("")}
          >
            Reset Email
          </button>
        </div>
      </div>
      {/* -------------------above are filter ----------------- */}

      {!orderIdFilter && !dateFilter && !orderdByFilter ? (
        <div>
          {Object.entries(groupedOrders).map(([date, orders]) => (
            <div key={date} className="ordrcontmain">
              <div className="datecont">
                <p>{showDate(date)}</p>
              </div>
              <div class="Ordersmaincont">
                <table>
                  <thead>
                    <tr>
                      <th class="ordli">Order ID</th>
                      <th class="ordli">Customer Name</th>
                      <th class="ordli">Order Place On</th>
                      <th class="ordli">Mode or payment</th>
                      <th class="ordli">Total Value</th>
                      <th class="ordli">Payment</th>
                      <th class="ordli">CashBack</th>
                      <th class="ordli">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td class="ordli">{order.OrderId}</td>
                        <td class="ordli">{order.shippingto.Name}</td>
                        <td class="ordli">{showMoment(date)}</td>
                        <td class="ordli">{order.paymentStatus}</td>
                        <td class="ordli">
                          Rs. {order.paymentIntent.amount}.00
                        </td>
                        <td class="ordli">
                          {order.isPaid ? (
                            <div className="stateticksvg">
                              <Ticksvg />
                            </div>
                          ) : (
                            <div className="statecrossvg">
                              <Crosssvg />
                            </div>
                          )}
                        </td>
                        <td class="ordli">
                          {order.isCashBack ? (
                            <div className="stateticksvg">
                              <Ticksvg />
                            </div>
                          ) : (
                            <div className="statecrossvg">
                              <Crosssvg />
                            </div>
                          )}
                        </td>
                        <td className="ordli">
                          <Link to={`/admin/order/${order._id}`}>
                            <div
                              className={`adminorderstate ${orderStatusColor(
                                order
                              )}`}
                            >
                              {order.orderStatus}
                            </div>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div class="Ordersmaincont">
            <table>
              <thead>
                <tr>
                  <th class="ordli">Order ID</th>
                  <th class="ordli">Customer Name</th>
                  <th class="ordli">Order Place On</th>
                  <th class="ordli">Shipping Address</th>
                  <th class="ordli">Mode or payment</th>
                  <th class="ordli">Total Value</th>
                  <th class="ordli">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td class="ordli">{order.OrderId}</td>
                    <td class="ordli">{order.shippingto.Name}</td>
                    <td class="ordli">2 mints ago, Sep 25, 2023</td>
                    <td class="ordli">
                      {order.shippingto.Address}
                      {order.shippingto.City}
                    </td>
                    <td class="ordli">{order.paymentStatus}</td>
                    <td class="ordli">Rs. {order.paymentIntent.amount}.00</td>
                    <td className="ordli">
                      <Link to={`/admin/order/${order._id}`}>
                        <div
                          className={`adminorderstate ${orderStatusColor(
                            order
                          )}`}
                        >
                          {order.orderStatus}
                        </div>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
