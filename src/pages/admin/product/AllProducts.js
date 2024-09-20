import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { getProductsByCount } from "../../../functions/product";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import { removeProduct } from "../../../functions/product";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import FlashsaleProductCard from "../../../components/ProductCards/FlashsaleProductCard";
import "../../../components/ProductCards/ProductCardsAll.css";
import "./AllProducts.css";
import {
  fetchProductsByFilter,
  getProductsByPage,
} from "../../../functions/product";
import { Pagination } from "antd";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [page, setPage] = useState(1);
  const [productsCount, setProductsCount] = useState(0);

  // redux
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ query: text });

      if (!text) {
        loadAllProducts();
      }
    }, 300);

    return () => clearTimeout(delayed);
  }, [page, text]);

  const loadAllProducts = () => {
    setLoading(true);
    getProductsByPage(page)
      .then((p) => {
        setProducts(p.data.products);
        setProductsCount(p.data.totalProducts);
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

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data);
    });
  };

  const handleChange = (e) => {
    e.preventDefault();
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchProducts({ query: text });
  };

  return (
    <div className="col">
      <div className="adminAllhead">
        {loading ? (
          <h4 className="text-danger">Loading...</h4>
        ) : (
          <h4>All Products</h4>
        )}
        <form onSubmit={handleSubmit}>
          <input
            id="search-admin"
            name="search-admin"
            onChange={handleChange}
            class="searchadmin"
            type="search"
            value={text}
          />
          {/* <button type="submit">submit</button> */}
        </form>
      </div>

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
      <div class="productreviewbottom searchpagi">
        <div class="previewpagination">
          <Pagination
            current={page}
            total={(productsCount / 2) * 10}
            onChange={(value) => setPage(value)}
          />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
