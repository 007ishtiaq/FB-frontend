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
  let categoryid = query.get("category");
  let subcategoryid = query.get("subcategory");

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
    const fetchData = async () => {
      if (text) {
        await fetchProducts({ query: text }); // Wait for this to complete
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        // Reset filters
        setCategory("");
        setPrice([0, 0]);
        setStar("");
        setShipping("");
        setSubs([]);
        setSelectedSub(null);
      } else if (subcategoryid && entry) {
        setEntry(false);
        setCategory(categoryid);
        setSelectedSub(subcategoryid);
        await fetchProducts({ sub: subcategoryid }); // Wait for this to complete
        const subRes = await getCategorySubs(categoryid); // Await the response
        setSubs(subRes.data);
      } else if (categoryid && entry) {
        setEntry(false);
        setCategory(categoryid);
        await fetchProducts({ category: categoryid }); // Wait for this to complete
        const subRes = await getCategorySubs(categoryid); // Await the response
        setSubs(subRes.data);
      } else {
        loadAllProducts();
      }
    };

    fetchData(); // Call the async function inside useEffect
  }, [page, categoryid, text]); // Dependency array remains the same

  useEffect(() => {
    setPage(1);
  }, [text]);

  const fetchProducts = (arg) => {
    setLoading(true);

    fetchProductsByFilter({ arg, page, perPage })
      .then((res) => {
        setProducts(res.data.products);
        setLoading(false);

        if (res.data.products.length > 0) {
          if (arg.category) {
            setFiltername(res.data.products[0].category.name);
          }
          if (arg.sub) {
            setFiltername(res.data.products[0].attributes[0].subs.name);
          }
        }
        setProductsCount(res.data.totalProducts);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);

        // Optionally, you can display an error message or clear the current products
        setProducts([]);
        setFiltername("");
        setProductsCount(0);
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

  // 1. load products based on categories
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
    setSelectedSub(null);

    try {
      const subRes = await getCategorySubs(e.target.value);
      setSubs(subRes.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // 2. load products based on sub category
  const handleSub = (subItem) => {
    // console.log(subItem);
    setCategory(subItem.parent);
    setSelectedSub(subItem._id);
    setFiltername(subItem.name);
    setSub(subItem);
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setStar("");
    setShipping("");
    fetchProducts({ sub: subItem });
  };

  // 3. load products based on price range
  useEffect(() => {
    if (price[0] > 1 || price[1] > 1) {
      fetchProducts({ price });
    }
  }, [price]);

  const handleSlider = (value) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setFiltername(`Price Range`);
    // reset
    setSelectedSub(null);
    setCategory("");
    setPrice(value);
    setStar("");
    setShipping("");
  };

  // 4. load products based on stars
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
    setSubs([]);
    setSelectedSub(null);
    setShipping("");
    fetchProducts({ stars: num });
  };

  // 5. load products based on shipping
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
    setSubs([]);
    setSelectedSub(null);
    setShipping(e.target.value);
    setFiltername(
      e.target.value === "Yes" ? "With Free Shipping" : "With Shipping"
    );
    fetchProducts({ shipping: e.target.value });
  };

  // All reset
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
    setSubs([]);
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
              Clearfilter={Clearfilter}
              loadAllProducts={loadAllProducts}
              price={price}
              star={star}
              shipping={shipping}
              handleStarClick={handleStarClick}
              handleShippingchange={handleShippingchange}
              subs={subs}
              handleSub={handleSub}
              selectedSub={selectedSub}
              handleSlider={handleSlider}
            />
          </div>
        ) : (
          <SideDrawer Open={mobileSideNav} close={close} Drawer="Filter">
            <SearchFilter
              handleCheck={handleCheck}
              category={category}
              text={text}
              Clearfilter={Clearfilter}
              loadAllProducts={loadAllProducts}
              price={price}
              star={star}
              shipping={shipping}
              handleStarClick={handleStarClick}
              handleShippingchange={handleShippingchange}
              subs={subs}
              handleSub={handleSub}
              selectedSub={selectedSub}
              handleSlider={handleSlider}
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
