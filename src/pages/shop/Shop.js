import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./searchstyle.css";
import "../../components/ProductCards/ProductCardsAll.css";
import _ from "lodash";
import FlashsaleProductCard from "../../components/ProductCards/FlashsaleProductCard";
import SearchFilter from "../../components/searchfilter/SearchFilter";
import SideDrawer from "../../components/SideDrawer/SideDrawer";
import NoItemFound from "../../components/cards/NoItemFound/NoItemFound";
import { Pagination } from "antd";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import {
  getProductsByPage,
  fetchProductsByFilter,
} from "../../functions/product";
import { ReactComponent as Crosssvg } from "../../images/admin/cross.svg";
import CatenameSkull from "../../components/Skeletons/CatenameSkull";
import Searchloader from "../../components/searchloader/Searchloader";
import { getCategorySubs } from "../../functions/category";
import { getSubsSub2 } from "../../functions/sub";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contwidth, setContwidth] = useState(0);
  const [page, setPage] = useState(1); // page number
  const [perPage, setPerpage] = useState(2); // per page Size
  const [productsCount, setProductsCount] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 700); // Determine if screen width is greater than 700px
  const [category, setCategory] = useState("");
  const [filtername, setFiltername] = useState("");
  const [entry, setEntry] = useState(true);
  const [price, setPrice] = useState([0, 0]); // price range search
  const [star, setStar] = useState("");
  const [shipping, setShipping] = useState("");
  const [subs, setSubs] = useState([]);
  const [sub, setSub] = useState("");
  const [selectedSub, setSelectedSub] = useState(null);

  const { mobileSideNav } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  let { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();
  let categoryslug = query.get("category");

  useEffect(() => {
    const proarea = document.querySelector(".productsarea");
    const contwidth = proarea.clientWidth;
    setContwidth(contwidth);
    // Handle screen resizing
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 700);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (text) {
      fetchProducts({ query: text });
      //reset
      setCategory("");
      setPrice([0, 0]);
      setStar("");
      // setSub("");
      setShipping("");
    } else if (categoryslug && entry) {
      setCategory(categoryslug);
      fetchProducts({ category: categoryslug });
      setEntry(false);
      //reset
      // setCategory("");
    } else {
      loadAllProducts();
    }
  }, [page, categoryslug, text]);

  useEffect(() => {
    setPage(1);
  }, [text]);

  const fetchProducts = (arg) => {
    setLoading(true);
    fetchProductsByFilter({ arg, page, perPage }).then((res) => {
      setProducts(res.data.products);
      setLoading(false);
      if (res.data.products.length > 0) {
        if (arg.category) {
          setFiltername(res.data.products[0].category.name);
        }
      }
      // console.log(arg);

      setProductsCount(res.data.totalProducts);
    });
  };

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await getProductsByPage({ page, perPage });
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setProducts(data.products);
      setProductsCount(data.totalProducts);
    } catch (err) {
      console.error(err);
      // toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    // setFilterDrawervisible(false);
    dispatch({
      type: "SET_SIDENAV_VISIBLE",
      payload: false,
    });
  };

  const handleSub = (subItem) => {
    // console.log("sub2Item", sub2Item);
    setSelectedSub(subItem._id);
    setSub(subItem);
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    // setCategory("");
    setStar("");
    setShipping("");
    fetchProducts({ sub: subItem });
  };

  // handle check for categories
  const handleCheck = async (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setStar("");
    setSub("");
    setShipping("");
    setCategory(e.target.value);
    fetchProducts({ category: e.target.value });

    try {
      const subRes = await getCategorySubs(e.target.value);
      // const subsWithSub2 = await Promise.all(
      //   subRes.data.map(async (sub) => {
      //     const sub2Res = await getSubsSub2(sub._id);
      //     return { ...sub, sub2: sub2Res.data };
      //   })
      // );
      // console.log(subRes.data);

      setSubs(subRes.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleStarClick = (num) => {
    // console.log(num);
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    dispatch({
      type: "SET_SIDENAV_VISIBLE",
      payload: false,
    });
    setFiltername(`Rating ${num} Stars & Above`);
    setCategory("");
    setPrice([0, 0]);
    setStar(num);
    // setSub("");
    setShipping("");
    fetchProducts({ stars: num });
  };

  const handleShippingchange = (e) => {
    // setSub("");
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    dispatch({
      type: "SET_SIDENAV_VISIBLE",
      payload: false,
    });
    setCategory("");
    setPrice([0, 0]);
    setStar("");
    setShipping(e.target.value);
    setFiltername(
      e.target.value === "Yes" ? "With Free Shipping" : "With Shipping"
    );
    fetchProducts({ shipping: e.target.value });
  };

  const Clearfilter = () => {
    if (text) {
      dispatch({
        type: "SEARCH_QUERY",
        payload: { text: "" },
      });
      setPage(1);
      setEntry(false);
    } else {
      setPage(1);
      loadAllProducts();
      setEntry(false);
    }
    // reset
    setSelectedSub(null);
    setCategory("");
    setPrice([0, 0]);
    setStar("");
    setShipping("");
  };

  // Calculate start and end of the current page range
  const start = (page - 1) * perPage + 1;
  const end = Math.min(start + perPage - 1, productsCount);

  return (
    <>
      <div className="searchcontainer">
        {isDesktop ? (
          <div className="searchfilterleft">
            <SearchFilter
              handleCheck={handleCheck}
              category={category}
              text={text}
              // handleBrand={handleBrand}
              Clearfilter={Clearfilter}
              setCategory={setCategory}
              fetchProducts={fetchProducts}
              loadAllProducts={loadAllProducts}
              price={price}
              setPrice={setPrice}
              star={star}
              setStar={setStar}
              shipping={shipping}
              setShipping={setShipping}
              handleStarClick={handleStarClick}
              handleShippingchange={handleShippingchange}
              setFiltername={setFiltername}
              subs={subs}
              handleSub={handleSub}
              selectedSub={selectedSub}
            />
          </div>
        ) : (
          <SideDrawer Open={mobileSideNav} close={close} Drawer="Filter">
            <SearchFilter
              handleCheck={handleCheck}
              category={category}
              text={text}
              // handleBrand={handleBrand}
              Clearfilter={Clearfilter}
              setCategory={setCategory}
              fetchProducts={fetchProducts}
              loadAllProducts={loadAllProducts}
              price={price}
              setPrice={setPrice}
              star={star}
              setStar={setStar}
              shipping={shipping}
              setShipping={setShipping}
              handleStarClick={handleStarClick}
              handleShippingchange={handleShippingchange}
              setFiltername={setFiltername}
              subs={subs}
              handleSub={handleSub}
              selectedSub={selectedSub}
            />
          </SideDrawer>
        )}

        <div className="filterproright">
          <div className="filterproup">
            <div className="rightsideheadercont">
              <div className="headingname">
                <div className="foundpros">
                  {!category && productsCount > 0 ? (
                    <p>
                      {start}-{end} of over {productsCount} results
                    </p>
                  ) : !filtername ? (
                    <CatenameSkull />
                  ) : (
                    <div className="cateselect" onClick={Clearfilter}>
                      Results: {filtername}{" "}
                      <span>
                        <Crosssvg />
                      </span>{" "}
                    </div>
                  )}
                </div>
                {/* <div className="foundpros">
                {productsCount} {productsCount > 1 ? "Products" : "Product"}{" "}
                found
              </div> */}
              </div>
              <div className="headingright">
                <span>Sort By: </span>
                <span className="sortoptions">Popularity</span>
              </div>
            </div>
            <div className="contentcont">
              <div className="productsarea">
                {loading ? (
                  <Searchloader />
                ) : products.length < 1 ? (
                  <NoItemFound />
                ) : (
                  products.map((prod) => (
                    <FlashsaleProductCard
                      key={prod._id}
                      product={prod}
                      contWidth={contwidth}
                      WidthIdea={"Seachpagewidth"}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="productreviewbottom searchpagi">
            <div className="previewpagination">
              <Pagination
                current={page}
                total={productsCount}
                pageSize={perPage}
                onChange={(value) => setPage(value)}
                showSizeChanger={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
