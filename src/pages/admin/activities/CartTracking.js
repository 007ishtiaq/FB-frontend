import React, { useState, useEffect } from "react";
import { getCartsData } from "../../../functions/admin";
import { useSelector } from "react-redux";
import "./CartTracking.css";
import { Link } from "react-router-dom";

export default function CartTracking() {
  const [cartsdata, setCartsdata] = useState([]);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = () =>
    getCartsData(user.token).then((res) => {
      setCartsdata(res.data);
    });

  return (
    <>
      <div>Abandent Checkouts</div>
      <div className="carts-list">
        {cartsdata.map((cart) => (
          <div className="cart-card" key={cart._id}>
            <h2>
              Order By: {cart.orderdBy.name}({cart.orderdBy.email})
            </h2>
            <div className="cart-info">
              <p>
                <strong>Total:</strong> ${cart.cartTotal.toFixed(2)}
              </p>
              <p>
                <strong>Shipping Fee:</strong> ${cart.shippingfee.toFixed(2)}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(cart.createdAt).toLocaleString()}
              </p>
            </div>
            <ul className="product-list">
              {cart.products.map((product) => (
                <li key={product._id} className="product-item">
                  <p>
                    <strong>Product :</strong>{" "}
                    <Link to={`/product/${product.product.slug}`}>
                      {product.product.title.substring(0, 40)}
                    </Link>
                  </p>
                  <p>
                    <strong>Price:</strong> ${product.price.toFixed(2)}
                  </p>
                  <br />
                  <p>
                    <strong>Count:</strong> {product.count}
                  </p>
                  <p>
                    <strong>Color:</strong> {product.color}
                  </p>
                  <p>
                    <strong>Size:</strong> {product.size}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
