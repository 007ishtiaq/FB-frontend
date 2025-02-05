import React, { useState, useEffect, useRef } from "react";
import "../ProductCards/ProductCardsAll.css";
import { getProductsByPage } from "../../functions/product";
import FlashsaleProductCard from "../ProductCards/FlashsaleProductCard";
import ProductCardSkull from "../Skeletons/ProductCardSkull";
import { toast } from "react-hot-toast";
import { Pagination } from "antd";
import { Link } from "react-router-dom";

export default function CommonProductsCont({ WidthIdea }) {
  const [products, setProducts] = useState([]);
  const [contwidth, setContwidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // page number
  const [perPage, setPerpage] = useState(30); // per page Size
  const [productsCount, setProductsCount] = useState(0);

  // Create a ref to the component
  const componentRef = useRef(null);

  useEffect(() => {
    const proarea = document.querySelector(".productsarea");
    const contwidth = proarea.clientWidth;
    setContwidth(contwidth);

    loadAllProducts();
  }, [page]);

  const loadAllProducts = async () => {
    try {
      const { data } = await getProductsByPage({ page, perPage });
      setProducts(data.products);
      setProductsCount(data.totalProducts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={componentRef} class="cardcontainer">
      <div class="insidecont">
        <div class="mainhead colorhead">
          <div class="colorheading">Featured Products</div>
          <Link to={`/shop`}>
            <div class="colormoredark">SEE MORE</div>
          </Link>
        </div>
        <div className="contentcont">
          <div className="productsarea">
            {loading ? (
              <ProductCardSkull clone={6} contWidth={contwidth} />
            ) : (
              products &&
              products.map((prod) => (
                <FlashsaleProductCard
                  key={prod._id}
                  product={prod}
                  contWidth={contwidth}
                  WidthIdea={WidthIdea}
                />
              ))
            )}
          </div>
          <div className="productreviewbottom searchpagi">
            <div className="previewpagination">
              <Pagination
                current={page}
                total={productsCount}
                pageSize={perPage}
                onChange={(value) => {
                  setPage(value);
                  componentRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                showSizeChanger={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
