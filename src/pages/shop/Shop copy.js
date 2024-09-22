import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./searchstyle.css";
import "../../components/ProductCards/ProductCardsAll.css";
import _ from "lodash";
import FlashsaleProductCard from "../../components/ProductCards/FlashsaleProductCard";
import { ReactComponent as Filtersvg } from "../../images/filter.svg";
import SearchFilter from "../../components/searchfilter/SearchFilter";
import SideDrawer from "../../components/SideDrawer/SideDrawer";
import NoItemFound from "../../components/cards/NoItemFound/NoItemFound";
import { Pagination } from "antd";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contwidth, setContwidth] = useState(0);
  const [FilterDrawervisible, setFilterDrawervisible] = useState(false);
  const [page, setPage] = useState(1);
  const [productsCount, setProductsCount] = useState(0);

  let dispatch = useDispatch();

  useEffect(() => {
    const proarea = document.querySelector(".productsarea");
    const contwidth = proarea.clientWidth;
    setContwidth(contwidth);
  }, []);

  const toggle = () => {
    setFilterDrawervisible(!FilterDrawervisible);
  };
  const close = () => {
    setFilterDrawervisible(false);
  };

  return (
    <>
      <div class="searchcontainer">
        <div class="searchfilterleft">
          <SearchFilter
            products={products}
            setProducts={setProducts}
            page={page}
            setProductsCount={setProductsCount}
          />
        </div>

        <div className="smallfilterbtncont">
          <div onClick={toggle} className="smallfilterbtncont btn btnsecond">
            <div className="filtersvgcont">
              <Filtersvg />
            </div>
            <p>
              Filter Based on <span>Category</span> | <span>Brand</span> |{" "}
              <span> Color </span>
            </p>
          </div>
          <SideDrawer Open={FilterDrawervisible} close={close} Drawer="Filter">
            <SearchFilter
              products={products}
              setProducts={setProducts}
              page={page}
              setProductsCount={setProductsCount}
            />
          </SideDrawer>
        </div>

        <div class="filterproright">
          <div class="rightsideheadercont">
            <div class="headingname">
              <div class="foundpros">
                {products.length} {products.length > 1 ? "Products" : "Product"}{" "}
                found
              </div>
            </div>
            <div class="headingright">
              <span>Sort By: {JSON.stringify(page)}</span>
              <span class="sortoptions">Popularity</span>
            </div>
          </div>

          <div class="contentcont">
            <div class="productsarea">
              {loading && <h4 className="text-danger">Loading...</h4>}

              {products.length < 1 && <NoItemFound />}

              {products &&
                products.map((prod) => (
                  <FlashsaleProductCard
                    key={prod._id}
                    product={prod}
                    contWidth={contwidth}
                    WidthIdea={"Seachpagewidth"}
                  />
                ))}
            </div>
          </div>

          <div class="productreviewbottom searchpagi">
            <div class="previewpagination">
              <Pagination
                current={page}
                total={productsCount}
                pageSize={2} // Since you're showing 2 products per page
                onChange={(value) => setPage(value)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
