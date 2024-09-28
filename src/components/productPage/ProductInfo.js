import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./ProductInfo.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
// import { useHistory } from "react-router-dom";
import { addToWishlist, getWishlist } from "../../functions/user";
import { saveUserAddress, getUserAddress } from "../../functions/user";
import { checkFlash } from "../../functions/product";
import ProductsSlider from "../productsSlidable/productSlider/ProductsSlider";
import Img from "../Image";
import { ReactComponent as Likesvg } from "../../images/productpage/like.svg";
import { ReactComponent as Likedsvg } from "../../images/productpage/liked.svg";
import { ReactComponent as Noimage } from "../../images/productpage/noimage.svg";
import StarRating from "react-star-ratings";
import ShippingModal from "../modal/ShippingModal";
import ShippingForm from "../../components/forms/ShippingForm";
import Mystars from "../ratingstars/Mystars";
import { useFormik } from "formik";
import { UserAddressAndContactSchema } from "../../schemas";
import Skeleton from "react-loading-skeleton";
import Countdown from "../countdown/Countdown";

export default function ProductInfo({ product, similarProduct }) {
  const {
    art,
    title,
    slug,
    images,
    description,
    disprice,
    shippingcharges,
    price,
    brand,
    color,
    category,
    attributes,
    quantity,
    sold,
    onSale,
  } = product;

  const [qty, setQty] = useState(1);
  const [isLiked, setisLiked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [saleTime, setSaleTime] = useState("");

  // redux
  const { user, wishlist } = useSelector((state) => ({ ...state }));

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    checkprodFlash();
  }, [title]);

  const checkprodFlash = () => {
    if (onSale === "Yes") {
      checkFlash(slug).then((res) => {
        // console.log("prod res", res);
        if (res.data !== "Not on Sale") {
          setSaleTime(res.data);
        }
      });
    }
  };

  useEffect(() => {
    console.log("wishlist", wishlist);
    if (wishlist.wishlist && product) {
      setisLiked(
        wishlist.wishlist.find((prod) => prod._id === product._id)
          ? true
          : false
      );
    }
  }, [wishlist, product, navigator.onLine]);

  const likedHandler = (e) => {
    e.preventDefault();
    if (user && user.token) {
      if (navigator.onLine) {
        addToWishlist(product._id, user.token)
          .then((res) => {
            if (res.data.ok) {
              getWishlist(user.token).then((res) => {
                dispatch({
                  type: "USER_WISHLIST",
                  payload: res.data.wishlist,
                });
              });
            }
          })
          .catch((err) => console.log("cart save err", err));
      } else {
        dispatch({
          type: "SET_NETMODAL_VISIBLE",
          payload: true,
        });
      }
    } else {
      history.push({
        pathname: "/login",
        state: { from: `product/${slug}` },
      });
    }
  };

  function CalcAvg() {
    if (product && product.ratings) {
      let ratingsArray = product.ratings;
      let total = [];
      let length = ratingsArray.length;

      ratingsArray.map((r) => total.push(r.star));
      let totalReduced = total.reduce((p, n) => p + n, 0);

      let highest = length * 5;

      let result = (totalReduced * 5) / highest;

      return result.toFixed(1);
    }
  }

  const handleAddToCart = () => {
    if (product.quantity < 1) {
      toast.error("Out of Stock");
      return;
    }

    // create cart array
    let cart = [];
    if (typeof window !== "undefined") {
      // if cart is in local storage GET it
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      if (cart.length) {
        let foundItem = cart.find((item) => {
          return item._id === product._id;
        });
        if (foundItem) {
          cart.map((prod, i) => {
            if (prod._id == product._id) {
              cart[i].count = qty;
              toast.success("Added to Cart");
            }
          });
        } else {
          cart.push({
            ...product,
            count: qty,
          });
          toast.success("Added to Cart");
        }
      } else {
        cart.push({
          ...product,
          count: qty,
        });
        toast.success("Added to Cart");
      }

      // remove duplicates
      let unique = _.uniqWith(cart, _.isEqual);
      // save to local storage
      // console.log('unique', unique)
      localStorage.setItem("cart", JSON.stringify(unique));

      // add to reeux state
      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });
    }
  };

  const handleBuynow = () => {
    if (product.quantity < 1) {
      toast.error("Out of Stock");
      return;
    }
    handleAddToCart();
    history.push("/cart");
  };

  // ---------formik usage--------

  const initialValues = {
    Name: "",
    Contact: "",
    Address: "",
    City: "",
    Province: "",
    Area: "",
    LandMark: "",
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: UserAddressAndContactSchema,
    onSubmit: async (values, action) => {
      if (navigator.onLine) {
        try {
          saveUserAddress(user.token, values)
            .then((res) => {
              if (res.data.ok) {
                toast.success("Address saved");
                setModalVisible(false);
              }
            })
            .catch((err) => console.log("cart save err", err));
        } catch (error) {
          console.error(error);
          setModalVisible(false);
          // Handle errors if necessary
        }
      } else {
        setModalVisible(false);
        dispatch({
          type: "SET_NETMODAL_VISIBLE",
          payload: true,
        });
      }
    },
  });

  useEffect(() => {
    if (user && user.token) {
      getUserAddress(user.token).then((a) => {
        setValues({ ...initialValues, ...a.data });
      });
    }
  }, [user]);

  const handlecancel = () => {
    if (user && user.token) {
      getUserAddress(user.token).then((a) => {
        setValues({ ...initialValues, ...a.data });
      });
    }
    setModalVisible(false);
  };

  return (
    <div className="productcontainer">
      <div className="leftproinfo">
        <div className="productcontleft">
          {images && images.length ? (
            <Carousel
              showArrows={true}
              autoPlay
              infiniteLoop
              className="mycarosel"
            >
              {images &&
                images.map((i) => <img src={i.url} key={i.public_id} />)}
            </Carousel>
          ) : (
            <div className="noimagecont">
              <Noimage></Noimage>
            </div>
          )}
        </div>

        <div className="productcontcenter">
          <div className="titlepart">
            <div className="productname namesize">
              {title ? title : <Skeleton count={2} />}
            </div>
            <a onClick={likedHandler} className="likeprobtn">
              {isLiked ? (
                <div className="likesvgs">
                  <Likedsvg />
                </div>
              ) : (
                <div className="likesvgs">
                  <Likesvg />
                </div>
              )}
            </a>
          </div>
          <div className="publicremarkcont">
            <div className="publicremark">
              {product && product.ratings && product.ratings.length > 0 ? (
                // showAverage(product)
                <div>
                  <Mystars
                    rating={CalcAvg()}
                    containerclass={"prostarsspan"}
                    StarFullclass={"prostars"}
                    StarHalfclass={"prostars star-half"}
                    StarEmptyclass={"prostars star-empty"}
                  ></Mystars>
                  <span class="prototalavg">{CalcAvg()}</span>
                </div>
              ) : (
                <div className="">
                  <Mystars
                    rating={0}
                    containerclass={"prostarsspan"}
                    StarFullclass={"prostars"}
                    StarHalfclass={"prostars star-half"}
                    StarEmptyclass={"prostars star-empty"}
                  ></Mystars>
                </div>
              )}
              <div className="">
                {title ? (
                  product && product.ratings && product.ratings.length > 0 ? (
                    <>
                      <span className="">{product.ratings.length} </span>
                      <span>Review(s)</span>
                    </>
                  ) : (
                    <div className="">0 Reviews</div>
                  )
                ) : (
                  <Skeleton width={80} count={1} />
                )}
              </div>
              <div className="orderscont">
                {product && product.sold && product.sold > 0 ? (
                  <>
                    <span> {product.sold}+ </span>
                    <span>Order(s)</span>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
            {title ? (
              <div className="artnum">
                <p> Article No: {art}</p>
              </div>
            ) : (
              <Skeleton width={65} height={18} count={1} />
            )}
          </div>
          <hr />
          {price ? (
            disprice !== null ? (
              <>
                <div className="centerpricingcont">
                  {saleTime ? (
                    // <Countdown saleTime={saleTime} />
                    <div class="flashtimercont">
                      <div class="flashtimerhead">
                        <div class="flashheadleft">Flash Sale</div>
                        <div class="flashheadright">
                          <Countdown
                            saleTime={saleTime}
                            checkprodFlash={checkprodFlash}
                          />
                        </div>
                      </div>
                      <div class="flashtimersub">
                        <div class="flashpricecont">
                          <div className="centerprice">
                            <span className="pricesmallpart">$ </span>
                            <span>
                              {disprice !== 0 ? (
                                <>
                                  <span className="pricesize">
                                    {Math.floor(disprice)}
                                  </span>

                                  <span className="pricesmallpart">
                                    .{disprice.toFixed(2).split(".")[1]}
                                  </span>
                                </>
                              ) : (
                                <span className="pricesize">FREE</span>
                              )}
                            </span>
                          </div>
                          <div class="normalprice">$ {price.toFixed(2)}</div>
                          <div class="dispersent">
                            <span>
                              -{(100 - (disprice / price) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div class="flashmetercont">
                          <div class="flashremain">{quantity} items left</div>
                          <div class="flashmeter">
                            <div
                              style={{
                                backgroundImage: `linear-gradient(to right, #b81a0a ${
                                  100 - (sold / (sold + quantity)) * 100
                                }%, #c7c7cd ${
                                  100 - (sold / (sold + quantity)) * 100
                                }%)`,
                              }}
                              class="meter"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="disred">
                        -{(100 - (disprice / price) * 100).toFixed(0)}%
                      </div>
                      <div className="centerprice">
                        <span className="pricesmallpart">$ </span>
                        <span className="pricesize">
                          {Math.floor(disprice)}
                        </span>

                        <span className="pricesmallpart">
                          .{disprice.toFixed(2).split(".")[1]}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                {!saleTime && (
                  <div className="listprice">
                    <span>List Price: </span>
                    <span className="crossedprice">$ {price.toFixed(2)}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="centerprice">
                <span className="pricesmallpart">$ </span>{" "}
                <span className="pricesize">{Math.floor(price)}</span>
                <span className="pricesmallpart">
                  .{price.toFixed(2).split(".")[1]}
                </span>
              </div>
            )
          ) : (
            <Skeleton width={200} count={4} />
          )}
          {similarProduct.length > 0 && (
            <div className="similer">
              <p>Available Colors</p>
              <ProductsSlider
                containerwidth={481}
                elementwidth={100}
                step={200}
              >
                {similarProduct.map((p, i) => (
                  <Img
                    className="similerImg"
                    key={i}
                    onClick={() => history.push(`/product/${p.slug}`)}
                    src={p.img.url}
                    alt={p.title}
                  />
                ))}
              </ProductsSlider>
            </div>
          )}
          <hr />
          <div className="desc_ul">
            {title ? (
              <ul>
                <li className="desc_li">
                  <div className="li_head">Brand</div>
                  <div className="li_sub">{brand}</div>
                </li>
                {category && (
                  <li className="desc_li">
                    <div className="li_head">Category</div>
                    <div className="li_sub">
                      <Link to={`/category/?category=${category.slug}`}>
                        {category.name}
                      </Link>
                    </div>
                  </li>
                )}
                {attributes.map((attribute) => (
                  <React.Fragment key={attribute._id}>
                    {attribute.subs && (
                      <li className="desc_li">
                        <div className="li_head">Section</div>
                        <div className="li_sub">
                          <Link
                            to={`/shop?${attribute.subs.name.replace(
                              /\s+/g,
                              ""
                            )}`}
                          >
                            {attribute.subs.name}
                          </Link>
                        </div>
                        {/* <div className="li_sub">
                          {attribute.subs2.map((s2) => (
                            <Link
                              key={s2._id}
                              to={`/shop?${s2.name.replace(/\s+/g, "")}`}
                            >
                              <span className="featurename">{s2.name}</span>
                            </Link>
                          ))}
                        </div> */}
                      </li>
                    )}
                  </React.Fragment>
                ))}

                <li className="desc_li">
                  <div className="li_head">Color</div>
                  <div className="li_sub">{color}</div>
                </li>
                {shippingcharges === 0 && (
                  <li className="desc_li">
                    <div className="li_head">Shipping</div>
                    <div className="li_sub">Free Shipping*</div>
                  </li>
                )}
              </ul>
            ) : (
              <Skeleton width={150} count={2} />
            )}
          </div>
        </div>
      </div>

      <div className="productcontright">
        {title ? (
          <div className="rightprice">
            <span className="pricesmallpart">$ </span>{" "}
            <span className="pricesize">
              {disprice !== null ? (
                disprice === 0 ? (
                  "FREE"
                ) : (
                  <>
                    {Math.floor(disprice)}
                    <span className="pricesmallpart">
                      .{disprice.toFixed(2).split(".")[1]}
                    </span>
                  </>
                )
              ) : (
                <>
                  {Math.floor(price)}
                  <span className="pricesmallpart">
                    .{price.toFixed(2).split(".")[1]}
                  </span>
                </>
              )}
            </span>
          </div>
        ) : (
          <div className="rightprice">
            <Skeleton width={100} height={18} count={1} />
          </div>
        )}

        <div className="infobelowleft">
          <div className="shippingaddresscont">
            <div className="shippingaddresstxt txtheading">
              <span> Delivery Address </span>
              <svg
                className="tooltipadrs"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                width="50px"
                height="50px"
              >
                <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z" />
              </svg>
            </div>
            <div className="shippingaddress">
              <div>
                <svg
                  className="adrsvg"
                  xmlns="http://www.w3.org/2000/svg"
                  shape-rendering="geometricPrecision"
                  text-rendering="geometricPrecision"
                  image-rendering="optimizeQuality"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  viewBox="0 0 512 406.05"
                >
                  <path d="M389.46 266.26c-14.01 15.36-30.32 29.12-48.63 40.24-2.26 1.66-5.31 1.86-7.82.25-27.05-17.21-49.78-37.88-67.64-60.35-24.65-30.92-40.16-65.19-45.47-98.21-5.41-33.47-.35-65.69 16.31-91.87 6.56-10.34 14.95-19.77 25.17-27.91C284.88 9.7 311.72-.2 338.48 0c25.75.2 51.18 9.8 73.15 29.87 7.72 7.01 14.2 15.05 19.51 23.77 17.92 29.51 21.78 67.14 13.91 105.27-7.77 37.68-27.06 75.96-55.59 107.28v.07zm-190.3-50.94c8.38 0 15.18 6.8 15.18 15.18 0 8.39-6.8 15.18-15.18 15.18H68.63l-33.9 130.01h442.32l-35.22-131.15c-2.16-8.09 2.65-16.4 10.73-18.56 8.09-2.16 16.4 2.64 18.56 10.73l40.12 149.41c.49 1.5.76 3.09.76 4.75 0 8.38-6.8 15.18-15.18 15.18H15.13V406c-1.25 0-2.52-.16-3.79-.48-8.09-2.1-12.95-10.36-10.85-18.45l41.5-159.16c1.23-7.15 7.46-12.59 14.96-12.59h142.21zM333.37 63c32.81 0 59.41 26.6 59.41 59.41 0 32.81-26.6 59.41-59.41 59.41-32.81 0-59.41-26.6-59.41-59.41 0-32.81 26.6-59.41 59.41-59.41z" />
                </svg>
                {title ? (
                  !user ? (
                    <span> Login to Add Shipping Address </span>
                  ) : values.Address ? (
                    <span>
                      {values.Address}, {values.Province}, {values.Area},{" "}
                      {values.LandMark}, {values.City}.
                    </span>
                  ) : (
                    <span>Add Shipping Address </span>
                  )
                ) : (
                  <Skeleton width={170} count={2} />
                )}
              </div>
              <ShippingModal
                onModalok={handleSubmit}
                onModalcancel={handlecancel}
                setModalVisible={setModalVisible}
                modalVisible={modalVisible}
                values={values}
                btnClasses={"mybtn btnsecond changebtnsize"}
              >
                <ShippingForm
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                />
              </ShippingModal>
            </div>
          </div>
          <div className="shippingchargescont">
            <div className="shippingcharges txtheading">
              <span> Shipping fee </span>{" "}
              {title ? (
                <span>
                  {shippingcharges === 0 ? (
                    <div className="freeitemcont">
                      <svg
                        className="deliverysvg"
                        xmlns="http://www.w3.org/2000/svg"
                        shape-rendering="geometricPrecision"
                        text-rendering="geometricPrecision"
                        image-rendering="optimizeQuality"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        viewBox="0 0 512 330.845"
                      >
                        <path d="M95.992 0c35.923 22.768 68.373 33.54 96.223 30.995 4.865 98.382-31.466 156.48-95.852 180.727C34.188 189.028-2.587 133.427.142 29.502 32.834 31.213 64.91 24.144 95.992 0zM76.731 103.923a73.156 73.156 0 016.88 6.658c6.723-10.822 13.89-20.757 21.461-29.895 21.401-25.849 11.702-20.867 41.389-20.867l-4.124 4.581c-12.676 14.086-16.952 21.417-27.343 36.429a425.653 425.653 0 00-27.95 46.499l-2.571 4.96-2.363-5.052c-4.359-9.359-9.581-17.95-15.808-25.625-6.228-7.676-11.667-12.684-20.112-18.479 3.87-12.702 22.288-6.201 30.541.791zm301.485 1.74l-35.138-.243V57.97a25.356 25.356 0 00-7.529-18.079 25.353 25.353 0 00-18.079-7.53H213.806c-.435 4.496-1.122 9.147-1.833 13.884H317.47c3.218 0 6.159 1.334 8.278 3.449 2.116 2.12 3.45 5.061 3.45 8.276v217.288H290.06a6.93 6.93 0 00-6.94 6.944 6.925 6.925 0 006.94 6.938h46.077a6.926 6.926 0 006.941-6.938v-7.885h28.044c3.177-72.232 106.9-82.195 117.451 0h22.782c5.868-70.433-28.909-97.805-81.803-103.996-3.805-16.53-11.062-31.874-19.26-47.037-9.747-18.025-12.016-17.297-32.076-17.621zM147.08 275.222a6.929 6.929 0 016.944 6.939 6.93 6.93 0 01-6.944 6.941H73.343c-7.022 0-13.413-3.06-18.082-7.882-4.623-4.821-7.527-11.411-7.527-18.392v-48.35a138.893 138.893 0 0013.881 7.815v40.535c0 3.334 1.375 6.51 3.609 8.824 2.119 2.197 4.98 3.606 8.077 3.606h73.779v-.036zm70.59-38.416c-25.963 0-47.019 21.059-47.019 47.019 0 25.961 21.056 47.02 47.019 47.02 25.961 0 47.017-21.059 47.017-47.02-.038-25.96-21.056-47.019-47.017-47.019zm0 28.942c-9.96 0-18.08 8.08-18.08 18.077 0 9.961 8.08 18.082 18.08 18.082 9.959 0 18.079-8.081 18.079-18.082-.042-9.997-8.12-18.077-18.079-18.077zm212.039-35.86c-25.959 0-47.016 21.059-47.016 47.018 0 25.96 21.057 47.021 47.016 47.021 25.963 0 47.02-21.061 47.02-47.021 0-25.959-21.057-47.018-47.02-47.018zm-18.077 47.018c0 9.961 8.076 18.079 18.077 18.079 10.001 0 18.079-8.077 18.079-18.079 0-9.999-8.078-18.076-18.079-18.076-9.978 0-18.077 8.095-18.077 18.076zm-30.038-151.174l-21.182-.392v45.06h44.866c-5.534-16.073-13.724-30.807-23.684-44.668zM96.049 14.47c30.429 19.287 59.636 30.128 83.227 27.971 4.118 83.335-28.373 134.27-82.908 154.808-52.671-19.224-85.542-68.035-83.23-156.073C43.7 42.778 71.71 33.379 96.049 14.47z" />
                      </svg>
                      <span>Free shipping</span>
                    </div>
                  ) : (
                    `$ ${shippingcharges.toFixed(2)}`
                  )}
                </span>
              ) : (
                <Skeleton width={50} count={1} />
              )}
            </div>
            <div className="deliverysubcont">
              <svg
                className="deliverysvg"
                xmlns="http://www.w3.org/2000/svg"
                shape-rendering="geometricPrecision"
                text-rendering="geometricPrecision"
                image-rendering="optimizeQuality"
                fill-rule="evenodd"
                clip-rule="evenodd"
                viewBox="0 0 512 330.845"
              >
                <path d="M95.992 0c35.923 22.768 68.373 33.54 96.223 30.995 4.865 98.382-31.466 156.48-95.852 180.727C34.188 189.028-2.587 133.427.142 29.502 32.834 31.213 64.91 24.144 95.992 0zM76.731 103.923a73.156 73.156 0 016.88 6.658c6.723-10.822 13.89-20.757 21.461-29.895 21.401-25.849 11.702-20.867 41.389-20.867l-4.124 4.581c-12.676 14.086-16.952 21.417-27.343 36.429a425.653 425.653 0 00-27.95 46.499l-2.571 4.96-2.363-5.052c-4.359-9.359-9.581-17.95-15.808-25.625-6.228-7.676-11.667-12.684-20.112-18.479 3.87-12.702 22.288-6.201 30.541.791zm301.485 1.74l-35.138-.243V57.97a25.356 25.356 0 00-7.529-18.079 25.353 25.353 0 00-18.079-7.53H213.806c-.435 4.496-1.122 9.147-1.833 13.884H317.47c3.218 0 6.159 1.334 8.278 3.449 2.116 2.12 3.45 5.061 3.45 8.276v217.288H290.06a6.93 6.93 0 00-6.94 6.944 6.925 6.925 0 006.94 6.938h46.077a6.926 6.926 0 006.941-6.938v-7.885h28.044c3.177-72.232 106.9-82.195 117.451 0h22.782c5.868-70.433-28.909-97.805-81.803-103.996-3.805-16.53-11.062-31.874-19.26-47.037-9.747-18.025-12.016-17.297-32.076-17.621zM147.08 275.222a6.929 6.929 0 016.944 6.939 6.93 6.93 0 01-6.944 6.941H73.343c-7.022 0-13.413-3.06-18.082-7.882-4.623-4.821-7.527-11.411-7.527-18.392v-48.35a138.893 138.893 0 0013.881 7.815v40.535c0 3.334 1.375 6.51 3.609 8.824 2.119 2.197 4.98 3.606 8.077 3.606h73.779v-.036zm70.59-38.416c-25.963 0-47.019 21.059-47.019 47.019 0 25.961 21.056 47.02 47.019 47.02 25.961 0 47.017-21.059 47.017-47.02-.038-25.96-21.056-47.019-47.017-47.019zm0 28.942c-9.96 0-18.08 8.08-18.08 18.077 0 9.961 8.08 18.082 18.08 18.082 9.959 0 18.079-8.081 18.079-18.082-.042-9.997-8.12-18.077-18.079-18.077zm212.039-35.86c-25.959 0-47.016 21.059-47.016 47.018 0 25.96 21.057 47.021 47.016 47.021 25.963 0 47.02-21.061 47.02-47.021 0-25.959-21.057-47.018-47.02-47.018zm-18.077 47.018c0 9.961 8.076 18.079 18.077 18.079 10.001 0 18.079-8.077 18.079-18.079 0-9.999-8.078-18.076-18.079-18.076-9.978 0-18.077 8.095-18.077 18.076zm-30.038-151.174l-21.182-.392v45.06h44.866c-5.534-16.073-13.724-30.807-23.684-44.668zM96.049 14.47c30.429 19.287 59.636 30.128 83.227 27.971 4.118 83.335-28.373 134.27-82.908 154.808-52.671-19.224-85.542-68.035-83.23-156.073C43.7 42.778 71.71 33.379 96.049 14.47z" />
              </svg>
              {title ? (
                <span className="estdays">10 - 15 Days</span>
              ) : (
                <Skeleton width={170} count={1} />
              )}
            </div>
          </div>
          {/* <div className="shippingpromo">
            Enjoy Free Shipping just order 3 or more items
          </div> */}
        </div>

        <div className="pricebtnscont">
          <div className="stockstatus">
            <div className="txtheading">Quantity:</div>
            {title ? (
              quantity > 0 ? (
                <div className="mybtn qtybtnsize">
                  <a
                    disabled={qty === 1}
                    className={qty === 1 && "qtymin"}
                    onClick={() => {
                      setQty(qty < 2 ? 1 : qty - 1);
                    }}
                  >
                    -
                  </a>
                  <span>{qty}</span>
                  <a
                    disabled={qty === quantity}
                    className={qty === quantity && "qtymax"}
                    onClick={() => {
                      setQty(qty > quantity - 1 ? quantity : qty + 1);
                    }}
                  >
                    +
                  </a>
                </div>
              ) : (
                <span className="notinstocktxt"> Not Available in Stock </span>
              )
            ) : (
              <Skeleton width={170} count={1} />
            )}
          </div>
          <div className="btnscont">
            <button
              onClick={handleAddToCart}
              className="mybtn btnprimary atcbtn"
            >
              Add To Card
            </button>
            <button
              onClick={handleBuynow}
              className="mybtn btnprimary buynowbtn"
            >
              Buy Now
            </button>
          </div>
        </div>

        <div className="infobelowright">
          <div className="badgescont">
            <div className="trustbadge">
              <div className="trustbadgehead">
                <svg
                  className="trustbadgesvg"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  width="48px"
                  height="48px"
                >
                  <path d="M 32 9 C 24.832 9 19 14.832 19 22 L 19 27.347656 C 16.670659 28.171862 15 30.388126 15 33 L 15 49 C 15 52.314 17.686 55 21 55 L 43 55 C 46.314 55 49 52.314 49 49 L 49 33 C 49 30.388126 47.329341 28.171862 45 27.347656 L 45 22 C 45 14.832 39.168 9 32 9 z M 32 13 C 36.963 13 41 17.038 41 22 L 41 27 L 23 27 L 23 22 C 23 17.038 27.037 13 32 13 z" />
                </svg>
                <span className="txtheading">Secure transection</span>
              </div>
              <div className="trustbadgesub">
                Sucure transection process with end to end encryption, varified
                by multiple layers of protect.
              </div>
            </div>
            <div className="returnscont">
              <div className="returnstxthead">
                <svg
                  className="returnssvg"
                  id="Layer_1"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 112.62 120.72"
                >
                  <title>circle arrow</title>
                  <path d="M11.64,100.12l-.4-.47-1.06,8.63a5.08,5.08,0,0,1-1.92,3.41A5.11,5.11,0,0,1,0,107L2.79,84.65v-.07a3.28,3.28,0,0,1,.08-.41h0A5.09,5.09,0,0,1,9,80.39q11.22,2.53,22.42,5.15a5,5,0,0,1,3.17,2.25,5.14,5.14,0,0,1,.64,3.84v0a5,5,0,0,1-2.25,3.16,5.08,5.08,0,0,1-3.83.65c-3.31-.75-6.62-1.52-9.92-2.28a40.71,40.71,0,0,0,2.84,3,50.09,50.09,0,0,0,26.23,13.49,48.67,48.67,0,0,0,14.71.34A47.35,47.35,0,0,0,77,106h0q2.52-1.19,4.83-2.54c1.56-.93,3.07-1.92,4.51-3a50.8,50.8,0,0,0,8.56-7.88,48.92,48.92,0,0,0,6.39-9.45l.56-1.1,10,2.69-.8,1.66a58.64,58.64,0,0,1-7.9,12.24,61.28,61.28,0,0,1-10.81,10.1c-1.68,1.23-3.46,2.4-5.32,3.5s-3.73,2.07-5.74,3a58,58,0,0,1-17,5,58.56,58.56,0,0,1-17.79-.39,60.21,60.21,0,0,1-31.58-16.26c-1.2-1.16-2.26-2.31-3.24-3.45ZM101,20.6l.4.47,1-8.63a5.11,5.11,0,1,1,10.14,1.26l-2.74,22.37,0,.07c0,.13,0,.27-.07.41h0a5.09,5.09,0,0,1-6.08,3.78c-7.47-1.69-15-3.4-22.42-5.15a5,5,0,0,1-3.16-2.25,5.1,5.1,0,0,1-.65-3.84v0a5,5,0,0,1,2.25-3.16,5.1,5.1,0,0,1,3.84-.65c3.31.75,6.61,1.52,9.92,2.28-.84-1-1.77-2-2.84-3.05a50.09,50.09,0,0,0-12.13-8.73A49.49,49.49,0,0,0,64.37,11a48.6,48.6,0,0,0-14.7-.34,47.26,47.26,0,0,0-14,4.1h0q-2.53,1.18-4.83,2.54c-1.57.93-3.07,1.92-4.52,3a50.34,50.34,0,0,0-8.55,7.88,48,48,0,0,0-6.39,9.45l-.57,1.1L.76,36l.8-1.66A58.9,58.9,0,0,1,9.46,22.1,61.63,61.63,0,0,1,20.27,12q2.54-1.85,5.32-3.5c1.81-1.06,3.73-2.07,5.74-3a58,58,0,0,1,17-5A58.56,58.56,0,0,1,66.16.89a59.77,59.77,0,0,1,17,5.74A60.4,60.4,0,0,1,97.75,17.15c1.19,1.16,2.26,2.31,3.24,3.45Z" />
                </svg>
                <div className="txtheading">Returns</div>
              </div>
              <div className="returnssub">
                Product is Eligible for Return, Refund or Replacement within 30
                days of receipt.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
