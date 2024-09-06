import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Orderslistuser({ orders }) {
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
    <>
      <div class="manageacmainhead manageacordershead">
        <div class="manageacmainheading">My Orders</div>
      </div>
      <div class="manageacmainbody">
        <div class="mainbodybelow">
          {orders.length > 0 &&
            orders.map((order, i) => (
              <div class="myorder" key={i}>
                <div class="ordernumhead">
                  <div class="ordernumcont">
                    <div class="ordernum">Order Number # {order.OrderId}</div>
                    <div class="orderdate">
                      Places On: {showDate(order.createdAt)}
                    </div>
                  </div>
                  <Link
                    to={`/order/${order._id}`}
                    class="vieworder vieworderbtn"
                  >
                    More Details
                  </Link>
                </div>
                <div class="ordersub">
                  <div class="orderlistcont">
                    <div class="orderlist">
                      <div class="orderlistul">
                        {order.products.map((pro, i) => (
                          <div class="orderlistli" key={i}>
                            <div class="imgcont">
                              <img src={pro.product.images[0].url} alt="" />
                            </div>
                            <p class="titlepera">{pro.product.title}</p>
                            <div class="qtybought">Qty: {pro.count}</div>
                            <div
                              className={`orderstate ${orderStatusColor(
                                order
                              )}`}
                            >
                              {order.orderStatus}
                            </div>
                            {/* <div class="orderdeliverdate">
                              {showDate(
                                order.deliveredAt
                                  ? order.deliveredAt
                                  : order.updatedAt
                              )}
                            </div> */}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
