import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import firebase from "firebase/app"; // Import only the core Firebase module
import "firebase/auth"; // Import the Firebase Authentication module
import { NavLink } from "react-router-dom";
import { Link, useLocation, useHistory } from "react-router-dom";
import classes from "./NavItemes.module.css";
import "./NavItemes.css";
import {
  LogoutOutlined,
  UserOutlined,
  ProfileOutlined,
  EnvironmentOutlined,
  LockOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
  UndoOutlined,
  CloseOutlined,
  StarOutlined,
  HeartOutlined,
  AppstoreOutlined,
  CrownOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { getCategories } from "../../functions/category";
import { getBrands } from "../../functions/brands";
import { ReactComponent as Leftsvg } from "../../images/homepage/rightbtn.svg";
import { Menu } from "antd";

const { SubMenu } = Menu;

//small size left drawer - chilren component insider data
const NavItemes = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [openKeys, setOpenKeys] = useState(["1"]);

  const history = useHistory();
  const location = useLocation(); // Get the current location
  let dispatch = useDispatch();

  useEffect(() => {
    getCategories().then((c) => {
      setCategories(c.data);
    });
  }, []);

  useEffect(() => {
    getBrands().then((b) => setBrands(b.data));
  }, []);

  const htmlToRender = (htmlString) => {
    return (
      <div
        className="snavsvg"
        dangerouslySetInnerHTML={{ __html: htmlString }}
      />
    );
  };

  // Get the whole path including query parameters
  const currentPath = location.pathname + location.search;

  const handleMenuClick = (e) => {
    history.push(e.key);
  };

  const handleSubMenuOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    dispatch({
      type: "CLEAR_WISHLIST",
      payload: null,
    });
    history.push("/login");
  };

  return (
    <>
      {/* ant design manu */}
      <div className="sidenavcont">
        <Menu
          mode="inline"
          defaultSelectedKeys={[currentPath]}
          openKeys={openKeys}
          onOpenChange={handleSubMenuOpenChange}
          onClick={handleMenuClick}
        >
          <SubMenu
            key="1"
            title={
              <span>
                <SolutionOutlined /> Manage Account
              </span>
            }
            class="manageacheading clsremove Manageac"
          >
            <Menu.Item key="/ManageMyAc?page=Manageac">
              {" "}
              <UserOutlined />
              My Account
            </Menu.Item>
            <Menu.Item key="/ManageMyAc?page=userProfile">
              {" "}
              <ProfileOutlined /> My Profile
            </Menu.Item>
            <Menu.Item key="/ManageMyAc?page=userAddress">
              <EnvironmentOutlined /> Address Book
            </Menu.Item>
            <Menu.Item key="/ManageMyAc?page=passwordReset">
              <LockOutlined /> Password Reset
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="2"
            title={
              <span>
                <ShoppingCartOutlined /> My Orders
              </span>
            }
          >
            <Menu.Item key="/ManageMyAc?page=userOrders">
              <OrderedListOutlined /> All Orders
            </Menu.Item>
            <Menu.Item key="/ManageMyAc?page=userReturns">
              <UndoOutlined /> My Returns
            </Menu.Item>
            <Menu.Item key="/ManageMyAc?page=userCancellations">
              <CloseOutlined /> My Cancellations
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="/ManageMyAc?page=userReviews">
            <StarOutlined /> My Reviews
          </Menu.Item>
          <Menu.Item key="/ManageMyAc?page=userWishlist" className="snavcont">
            <HeartOutlined /> My Wishlist
          </Menu.Item>
          {/* category working */}
          <SubMenu
            key="3"
            title={
              <span>
                <AppstoreOutlined /> Browse Categories
              </span>
            }
          >
            {categories.map((c) => (
              <Menu.Item key={`/category/?category=${c.slug}`}>
                <div className="liitemcont">
                  {c.svg ? htmlToRender(c.svg) : "-"}
                  <p className="liitemname">{c.name}</p>
                </div>
              </Menu.Item>
            ))}
          </SubMenu>
          {/* Brand working */}
          <SubMenu
            key="4"
            title={
              <span>
                <CrownOutlined /> Popular Brands
              </span>
            }
            className="snavcont"
          >
            {brands.map((b) => (
              <Menu.Item key={`/brand/?brand=${b.slug}`}>
                <div className="liitemcont">
                  {b.svg ? htmlToRender(b.svg) : "-"}
                  <p className="liitemname">{b.name}</p>
                </div>
              </Menu.Item>
            ))}
          </SubMenu>
        </Menu>
      </div>
      <div className="snavlistcont">
        <ul className={classes.NavItemes}>
          <li>
            <NavLink to="/HelpCenter" exact activeClassName={classes.active}>
              <p> Need Help ?</p>{" "}
              <QuestionCircleOutlined className={classes.Icon} />{" "}
            </NavLink>
          </li>
          <li>
            <NavLink to="/ContactUs" exact activeClassName={classes.active}>
              <p> Contact Us</p> <PhoneOutlined className={classes.Icon} />{" "}
            </NavLink>
          </li>
          <li>
            <NavLink to="" activeClassName={classes.active} onClick={logout}>
              <p> Logout</p> <LogoutOutlined className={classes.Icon} />{" "}
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default NavItemes;
