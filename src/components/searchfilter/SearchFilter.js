import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Slider, Checkbox, Radio } from "antd";
// import { getCategorySubs } from "../../functions/category";
// import { getSubsSub2 } from "../../functions/sub";
// import { getSubs } from "../../functions/sub";
import {
  getProductsByPage,
  fetchProductsByFilter,
  getHighestPrice,
} from "../../functions/product";
import "../../pages/shop/searchstyle.css";
import { getCategories } from "../../functions/category";
import { getBrands } from "../../functions/brands";
import { getColors } from "../../functions/color";
import { ReactComponent as StarFull } from "../../images/searchpage/starfull.svg";
import { ReactComponent as StarEmpty } from "../../images/searchpage/starempty.svg";
import { ReactComponent as Clearsvg } from "../../images/clear.svg";

const { SubMenu, ItemGroup } = Menu;

export default function SearchFilter({
  setProducts,
  page,
  setPage,
  setProductsCount,
}) {
  const [price, setPrice] = useState([0, 0]); // price range search
  const [categories, setCategories] = useState([]); // to show the available list of categories
  const [category, setCategory] = useState(""); // selected categories to search
  const [star, setStar] = useState("");
  // const [subs, setSubs] = useState([]);
  // const [sub, setSub] = useState("");
  const [brands, setBrands] = useState([]); // to show the available list of brands
  const [brand, setBrand] = useState("");
  const [colors, setColors] = useState([]); // to show the available list of colors
  const [color, setColor] = useState("");
  const [shipping, setShipping] = useState("");
  const [highestPrice, setHighestPrice] = useState(0); // Highest Price for price filter
  const [selectedSub2, setSelectedSub2] = useState(null);

  let dispatch = useDispatch();
  let { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  useEffect(() => {
    // loadAllProducts();
    // fetch categories
    getCategories().then((res) => setCategories(res.data));
    // fetch subcategories
    // getSubs().then((res) => setSubs(res.data));
    // fetch brands (as set state is saprate for each value so no need to use async)
    getBrands().then((b) => {
      setBrands(b.data.map((item) => item.name));
    });
    // fetch colors (as set state is saprate for each value so no need to use async)
    getColors().then((c) => {
      setColors(c.data.map((item) => item.name));
    });
    // fetch Highest available price
    getHighestPrice().then((res) => {
      setHighestPrice(res.data);
    });
  }, []);

  const fetchProducts = (arg) => {
    fetchProductsByFilter({ arg, page }).then((res) => {
      setProducts(res.data.products);
      setProductsCount(res.data.totalProducts);
    });
  };

  const loadAllProducts = async () => {
    try {
      // setLoading(true);
      const { data } = await getProductsByPage(page);
      setProducts(data.products);
      setProductsCount(data.totalProducts);
    } catch (err) {
      console.error(err);
      // toast.error("Failed to load products");
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (text) {
      fetchProducts({ query: text });
      //reset
      setCategory("");
      setPrice([0, 0]);
      setStar("");
      // setSub("");
      setBrand("");
      setColor("");
      setShipping("");
    } else {
      loadAllProducts();
    }
  }, [page, text]);

  useEffect(() => {
    setPage(1);
  }, [text]);

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

    // reset
    setCategory("");
    setPrice(value);
    setStar("");
    // setSub("");
    setBrand("");
    setColor("");
    setShipping("");
    // setTimeout(() => {
    //   setOk(!ok);
    // }, 300);
  };

  // 4. load products based on category
  // show categories in a list of checkbox
  const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Radio
          value={c._id}
          name="category"
          checked={c._id === category}
          onChange={handleCheck}
          className="pb-1 pl-4 pr-4"
        >
          {c.name}
        </Radio>
        <br />
      </div>
    ));

  // handle check for categories
  const handleCheck = async (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setStar("");
    // setSub("");
    setBrand("");
    setColor("");
    setShipping("");

    setCategory(e.target.value);
    fetchProducts({ category: e.target.value });

    //   try {
    //     const subRes = await getCategorySubs(e.target.value);
    //     // const subsWithSub2 = await Promise.all(
    //     //   subRes.data.map(async (sub) => {
    //     //     const sub2Res = await getSubsSub2(sub._id);
    //     //     return { ...sub, sub2: sub2Res.data };
    //     //   })
    //     // );
    //     // setSubs(subsWithSub2);
    //   } catch (error) {
    //     console.error("Error fetching subcategories:", error);
    //   }
  };

  // 7. show products based on brand name
  const showBrands = () =>
    brands.map((b) => (
      <Radio
        key={b}
        value={b}
        name={b}
        checked={b === brand}
        onChange={handleBrand}
        className="pb-1 pl-4 pr-4"
      >
        {b}
      </Radio>
    ));

  const handleBrand = (e) => {
    // setSub("");
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategory("");
    setStar("");
    setColor("");
    setBrand(e.target.value);
    setShipping("");
    fetchProducts({ brand: e.target.value });
  };

  // 5. show products by star rating
  const showStars = () => (
    <div class="filtersub">
      <ul class="cateul">
        <li onClick={() => handleStarClick(5)}>
          <label htmlFor="star5">
            <Radio id="star5" type="radio" checked={star === 5} />
            <div class="filterstars">
              <StarFull></StarFull>
              <StarFull></StarFull>
              <StarFull></StarFull>
              <StarFull></StarFull>
              <StarFull></StarFull>
            </div>
            <span>& Above</span>
          </label>
        </li>
        <li onClick={() => handleStarClick(4)}>
          <label htmlFor="star4">
            <Radio id="star4" type="radio" checked={star === 4} />
            <div class="filterstars">
              <StarFull></StarFull>
              <StarFull></StarFull>
              <StarFull></StarFull>
              <StarFull></StarFull>
              <StarEmpty></StarEmpty>
            </div>
            <span>& Above</span>
          </label>
        </li>
        <li onClick={() => handleStarClick(3)}>
          <label htmlFor="star3">
            <Radio id="star3" type="radio" checked={star === 3} />
            <div class="filterstars">
              <StarFull></StarFull>
              <StarFull></StarFull>
              <StarFull></StarFull>
              <StarEmpty></StarEmpty>
              <StarEmpty></StarEmpty>
            </div>
            <span>& Above</span>
          </label>
        </li>
        <li onClick={() => handleStarClick(2)}>
          <label htmlFor="star2">
            <Radio id="star2" type="radio" checked={star === 2} />
            <div class="filterstars">
              <StarFull></StarFull>
              <StarFull></StarFull>
              <StarEmpty></StarEmpty>
              <StarEmpty></StarEmpty>
              <StarEmpty></StarEmpty>
            </div>
            <span>& Above</span>
          </label>
        </li>
        <li onClick={() => handleStarClick(1)}>
          <label htmlFor="star1">
            <Radio id="star1" type="radio" checked={star === 1} />
            <div class="filterstars">
              <StarFull></StarFull>
              <StarEmpty></StarEmpty>
              <StarEmpty></StarEmpty>
              <StarEmpty></StarEmpty>
              <StarEmpty></StarEmpty>
            </div>
            <span>& Above</span>
          </label>
        </li>
      </ul>
    </div>
  );

  const handleStarClick = (num) => {
    // console.log(num);
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategory("");
    setStar(num);
    // setSub("");
    setBrand("");
    setColor("");
    setShipping("");
    fetchProducts({ stars: num });
  };

  // 6. show products by sub category
  // const showSubs = (sub2, selectedSub2, handleSub) =>
  //   sub2.map((sub2Item) => (
  //     // <div
  //     //   key={sub2Item._id}
  //     //   onClick={() => handleSub(sub2Item._id)}
  //     //   className="p-1 m-1 badge badge-secondary"
  //     //   style={{ cursor: "pointer" }}
  //     // >
  //     //   {sub2Item.name}
  //     // </div>
  //     <div
  //       key={sub2Item._id}
  //       onClick={() => handleSub(sub2Item)}
  //       className={`p-1 m-1 badge ${
  //         selectedSub2 === sub2Item._id ? "badge-primary" : "badge-secondary"
  //       }`}
  //       style={{ cursor: "pointer" }}
  //     >
  //       {sub2Item.name}
  //     </div>
  //   ));

  // const handleSub = (sub2Item) => {
  //   setSelectedSub2(sub2Item._id);
  //   setSub(sub2Item);
  //   dispatch({
  //     type: "SEARCH_QUERY",
  //     payload: { text: "" },
  //   });
  //   setPrice([0, 0]);
  //   // setCategory("");
  //   setStar("");
  //   setBrand("");
  //   setColor("");
  //   setShipping("");
  //   fetchProducts({ sub: sub2Item });
  // };

  // 8. show products based on color
  const showColors = () =>
    colors.map((c) => (
      <Radio
        key={c}
        value={c}
        name={c}
        checked={c === color}
        onChange={handleColor}
        className="pb-1 pl-4 pr-4"
      >
        {c}
      </Radio>
    ));

  const handleColor = (e) => {
    // setSub("");
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategory("");
    setStar("");
    setBrand("");
    setColor(e.target.value);
    setShipping("");
    fetchProducts({ color: e.target.value });
  };

  // 9. show products based on shipping yes/no  // working pending
  const showShipping = () => (
    <>
      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingchange}
        value="Yes"
        checked={shipping === "Yes"}
      >
        Yes
      </Checkbox>

      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingchange}
        value="No"
        checked={shipping === "No"}
      >
        No
      </Checkbox>
    </>
  );

  const Clearfilter = () => {
    if (text) {
      dispatch({
        type: "SEARCH_QUERY",
        payload: { text: "" },
      });
      setPage(1);
    } else {
      setPage(1);
      loadAllProducts();
    }
    // reset
    setSelectedSub2(null);
    setCategory("");
    setPrice([0, 0]);
    setStar("");
    // setSub("");
    setBrand("");
    setColor("");
    setShipping("");
    // setTimeout(() => {
    //   setOk(!ok);
    // }, 300);
  };

  const handleShippingchange = (e) => {
    // setSub("");
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategory("");
    setStar("");
    setBrand("");
    setColor("");
    setShipping(e.target.value);
    fetchProducts({ shipping: e.target.value });
  };

  return (
    <div class="filtercont">
      <div
        onClick={Clearfilter}
        className={`clearfilter btn btnsecond ${
          (category ||
            brand ||
            star ||
            // sub ||
            color ||
            shipping ||
            text ||
            price[0] !== 0 ||
            price[1] !== 0) &&
          "filteractive"
        }`}
      >
        <div className="clearsvgcont">
          <Clearsvg></Clearsvg>
        </div>
        <p>Clear All Filters</p>
      </div>
      <Menu
        defaultOpenKeys={[
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
        ]}
        mode="inline"
      >
        <SubMenu
          class="filtercont"
          key="11"
          title={<div class="filterheading">CATEGORY</div>}
        >
          <div style={{ maringTop: "10px" }}>{showCategories()}</div>
        </SubMenu>
        {/* {subs.map((s, index) => (
          <SubMenu
            class="filtercont"
            key={index + 25}
            title={<div class="filterheading">{s.name}</div>}
          >
            <div style={{ marginTop: "-10px" }} className="pl-4 pr-4">
              {showSubs(s.sub2, selectedSub2, handleSub)}
            </div>
          </SubMenu>
        ))} */}

        {/* <SubMenu
          class="filtercont"
          key="15"
          title={<div class="filterheading">{!subs === null && "TAGS"}</div>}
        >
          <div style={{ marginTop: "-10px" }} className="pl-4 pr-4">
            {showSubs(subs)}
          </div>
        </SubMenu> */}
        <SubMenu
          class="filtercont"
          key="12"
          title={<div class="filterheading">BRAND</div>}
        >
          <div style={{ maringTop: "-10px" }}>{showBrands()}</div>
        </SubMenu>
        <SubMenu
          class="filtercont"
          key="13"
          title={<div class="filterheading">PRICE</div>}
        >
          <div>
            <Slider
              className="ml-4 mr-4"
              tipFormatter={(v) => `$${v}`}
              range
              value={price}
              onChange={handleSlider}
              max={highestPrice}
            />
          </div>
        </SubMenu>
        <SubMenu
          class="filtercont"
          key="14"
          title={<div class="filterheading">PRODUCT RATING</div>}
        >
          <div style={{ maringTop: "-10px" }}>{showStars()}</div>
        </SubMenu>
        <SubMenu
          class="filtercont"
          key="16"
          title={<div class="filterheading">COLOR FAMILY</div>}
        >
          <div style={{ maringTop: "-10px" }} className="pr-5">
            {showColors()}
          </div>
        </SubMenu>
        <SubMenu
          class="filtercont"
          key="17"
          title={<div class="filterheading">FREE SHIPPING</div>}
        >
          <div style={{ maringTop: "-10px" }} className="pr-5">
            {showShipping()}
          </div>
        </SubMenu>
      </Menu>
    </div>
  );
}
