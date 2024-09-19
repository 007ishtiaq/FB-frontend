import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { getProductsByCount } from "../../../functions/product";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import { removeProduct } from "../../../functions/product";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import FlashsaleProductCard from "../../../components/ProductCards/FlashsaleProductCard";
import "../../../components/ProductCards/ProductCardsAll.css";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  // redux
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(100)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleRemove = (slug) => {
    // let answer = window.confirm("Delete?");
    if (window.confirm("Delete?")) {
      // console.log("send delete request", slug);
      removeProduct(slug, user.token)
        .then((res) => {
          loadAllProducts();
          toast.error(`${res.data.title} is deleted`);
        })
        .catch((err) => {
          if (err.response.status === 400) toast.error(err.response.data);
          console.log(err);
        });
    }
  };

  return (
    <div className="col">
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <h4>All Products (This will load 100 products Only)</h4>
      )}
      <div className="row">
        {products.map((prod) => (
          <div key={prod._id} className="col-md-3 pb-3">
            <AdminProductCard
              key={prod._id}
              product={prod}
              contWidth={1200}
              FlashSalesCont={true}
              handleRemove={handleRemove}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
