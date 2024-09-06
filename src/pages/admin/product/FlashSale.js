import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AllFlashsales from "../../../components/countdown/AllFlashsales";
import { getFlashInfo } from "../../../functions/admin";
import "./FlashSale.css";

export default function FlashSale() {
  const [products, setProducts] = useState([]);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    getFlashInfo(user.token).then((p) => {
      setProducts(p.data);
    });
  }, []);

  return (
    <div>
      <p>Flash Sales : </p>
      {products.length >= 1 ? (
        <AllFlashsales products={products} />
      ) : (
        <p>No products on Sale</p>
      )}
    </div>
  );
}
