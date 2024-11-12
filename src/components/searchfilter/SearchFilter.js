import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Slider, Checkbox, Radio } from "antd";
// import { getCategorySubs } from "../../functions/category";
// import { getSubsSub2 } from "../../functions/sub";
// import { getSubs } from "../../functions/sub";
import { getHighestPrice } from "../../functions/product";
import "../../pages/shop/searchstyle.css";
import { getCategories } from "../../functions/category";
import { ReactComponent as StarFull } from "../../images/searchpage/starfull.svg";
import { ReactComponent as StarEmpty } from "../../images/searchpage/starempty.svg";
import { ReactComponent as Clearsvg } from "../../images/clear.svg";

const { SubMenu, ItemGroup } = Menu;

export default function SearchFilter({
  handleCheck,
  category,
  text,
  Clearfilter,
  setCategory,
  fetchProducts,
  price,
  setPrice,
  star,
  setStar,
  shipping,
  setShipping,
  handleStarClick,
  handleShippingchange,
  setFiltername,
  subs,
  handleSub,
  selectedSub,
}) {
  const [categories, setCategories] = useState([]); // to show the available list of categories
  const [highestPrice, setHighestPrice] = useState(0); // Highest Price for price filter

  let dispatch = useDispatch();

  useEffect(() => {
    // loadAllProducts();
    // fetch categories
    getCategories().then((res) => setCategories(res.data));
    // fetch subcategories
    // getSubs().then((res) => setSubs(res.data));
    // fetch brands (as set state is saprate for each value so no need to use async)

    // fetch Highest available price
    getHighestPrice().then((res) => {
      setHighestPrice(res.data);
    });
  }, []);

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
    setCategory("");
    setPrice(value);
    setStar("");
    // setSub("");
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

  // 6. show products by sub category
  const showSubs = (subItem, selectedSub, handleSub) => (
    <div
      key={subItem._id}
      onClick={() => handleSub(subItem)}
      className={`m-1 badge ${
        selectedSub === subItem._id ? "badge-primary" : "badge-secondary"
      }`}
      style={{ cursor: "pointer" }}
    >
      {subItem.name}
    </div>
  );
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

  return (
    <div class="filtercont">
      <div
        onClick={Clearfilter}
        className={`clearfilter btn btnsecond ${
          (category ||
            star ||
            // sub ||
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
          key={25}
          title={<div class="filterheading">TAGS</div>}
        >
          {subs.map((subItem, index) => (
            <div
              style={{ marginTop: "0", display: "inline-block" }}
              className="pl-1 pr-1"
            >
              {showSubs(subItem, selectedSub, handleSub)}
            </div>
          ))}
        </SubMenu>

        <SubMenu
          class="filtercont"
          key="13"
          title={<div class="filterheading">PRICE RANGE</div>}
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
