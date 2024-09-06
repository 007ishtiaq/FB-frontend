import React, { useState, useEffect } from "react";
import UsersideNavCopy from "../../../components/nav/UsersideNavCopy";
import { useDispatch, useSelector } from "react-redux";
import { getOrder } from "../../../functions/user";
import "./ItemAction.css";
import { createCancellation, createReturn } from "../../../functions/user";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { productReturnSchema } from "../../../schemas";
import { ReactComponent as Nocancelsvg } from "../../../images/manageacUser/nocancel.svg";
import { ReactComponent as Returnsvg } from "../../../images/cart/return.svg";
import "../MyOrders.css";
import "../MyWishlist.css";
import "../../cart/cart.css";

export default function ItemReturn({ match, history }) {
  const [order, setOrder] = useState("");
  const [prod, setProd] = useState("");
  const [qty, setQty] = useState(0);
  const [totalqty, settotalQty] = useState(0);

  const { user } = useSelector((state) => ({ ...state }));
  const { id, itemid } = match.params;
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const RedirectToConfirmation = (requestType, requestNum) => {
    if (user && user.token) {
      history.push({
        pathname: `/Request/${requestType}/RequestNum/${requestNum}`,
      });
    } else {
      history.push({
        pathname: "/login",
        state: { from: `/order/${id}` },
      });
    }
  };

  // ---------formik usage--------

  const initialValues = {
    quantity: qty,
    reason: "",
    comment: "",
    condition: "",
    resolution: "",
    declaration: false,
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
    validationSchema: productReturnSchema,
    onSubmit: async (values, action) => {
      if (navigator.onLine) {
        createReturn(id, itemid, values, user.token)
          .then((res) => {
            if (res.data.success) {
              RedirectToConfirmation("Return", res.data.RequestNumber);
              action.resetForm();
            }
            if (res.data.error) {
              toast.error(res.data.error);
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error(err.message);
          });
      } else {
        dispatch({
          type: "SET_NETMODAL_VISIBLE",
          payload: true,
        });
      }
    },
  });

  useEffect(() => {
    getOrder(id, user.token).then((res) => {
      setOrder(res.data);
      setProd(res.data.products.find((prod) => prod._id.toString() === itemid));
      settotalQty(
        res.data.products.find((prod) => prod._id.toString() === itemid).count
      );
      setQty(
        res.data.products.find((prod) => prod._id.toString() === itemid).count
      );
      setValues((prevValues) => ({
        ...prevValues,
        quantity: res.data.products.find(
          (prod) => prod._id.toString() === itemid
        ).count,
      }));
    });
  }, [id]);

  const handleQuantityChangedec = async (e) => {
    setQty(qty < 2 ? 1 : qty - 1);
    setValues((prevValues) => ({
      ...prevValues,
      quantity: qty < 2 ? 1 : qty - 1,
    }));
  };

  const handleQuantityChangeinc = async (e) => {
    setQty(qty > totalqty - 1 ? totalqty : qty + 1);
    setValues((prevValues) => ({
      ...prevValues,
      quantity: qty > totalqty - 1 ? totalqty : qty + 1,
    }));
  };

  return (
    <div class="manageacmaincont">
      <div class="manageaccont">
        <UsersideNavCopy />
        <div class="navrightside">
          <div class="manageacmainhead">Item On Return</div>
          {order &&
          (order.orderStatus === "Dispatched" ||
            order.orderStatus === "Delivered") ? (
            <div className="infocont">
              <div className="productinfoside">
                <div className="productinfobinder1">
                  <div className="titlecont">{prod && prod.product.title}</div>
                  <div class="prodimgcont">
                    <img src={prod && prod.product.images[0].url} alt="" />
                  </div>
                </div>
                <div className="productinfobinder2">
                  <div class="prodqtydetail">
                    <div>
                      <span className="qtydetial">Purchased Quantity :</span>
                      <span className="qtydetialcount">{totalqty}</span>{" "}
                    </div>
                  </div>
                  <div className="otherdetailscont">
                    <div className="desc_ul">
                      <ul>
                        <li className="desc_li">
                          <div className="li_head">Brand</div>
                          <div className="li_sub">
                            {prod && prod.product.brand}
                          </div>
                        </li>
                        {prod && prod.product.category && (
                          <li className="desc_li">
                            <div className="li_head">Section</div>
                            <div className="li_sub">
                              <Link
                                to={`/category/${
                                  prod && prod.product.category.slug
                                }`}
                              >
                                {prod && prod.product.category.name}
                              </Link>
                            </div>
                          </li>
                        )}
                        {prod && prod.product.subs && (
                          <li className="desc_li">
                            <div className="li_head">Category</div>
                            <div className="li_sub">
                              <Link
                                to={`/sub/${prod && prod.product.subs.slug}`}
                              >
                                {prod && prod.product.subs.name}
                              </Link>
                            </div>
                          </li>
                        )}

                        {prod &&
                          prod.product.subs2 &&
                          prod &&
                          prod.product.subs2.length > 0 && (
                            <li className="desc_li">
                              <div className="li_head">Tags</div>
                              <div className="li_sub">
                                {prod &&
                                  prod.product.subs2.map((s2) => (
                                    <Link key={s2._id} to={`/sub2/${s2.slug}`}>
                                      {s2.name}
                                    </Link>
                                  ))}
                              </div>
                            </li>
                          )}

                        <li className="desc_li">
                          <div className="li_head">Color</div>
                          <div className="li_sub">
                            {prod.color && prod.color}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="formside actionform">
                <form method="post" onSubmit={handleSubmit}>
                  <div class="form-group">
                    <label for="quantity">Return Quantity</label>
                    {totalqty > 0 ? (
                      <div className="qtybtnsize">
                        <a
                          disabled={qty === 1}
                          className={qty === 1 && "qtymin"}
                          onClick={handleQuantityChangedec}
                        >
                          -
                        </a>
                        <span>{qty}</span>
                        <a
                          disabled={qty === totalqty}
                          className={qty === totalqty && "qtymax"}
                          onClick={handleQuantityChangeinc}
                        >
                          +
                        </a>
                      </div>
                    ) : (
                      <div className="qtybtnsize">
                        <a disabled className="qtymin">
                          -
                        </a>
                        <span>{0}</span>
                        <a disabled className="qtymax">
                          +
                        </a>
                      </div>
                    )}
                  </div>

                  <div class="form-group">
                    <label for="wrongItem">Reason for Return</label>
                    <select
                      id="wrongItem"
                      name="reason"
                      value={values.reason}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Please Select</option>
                      <option value="Wrong Item">Wrong Item</option>
                      <option value="Damaged/Faulty">Damaged/Faulty</option>
                      <option value="Not as Described">Not as Described</option>
                      <option value="Changed Mind">Changed Mind</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.reason && touched.reason ? (
                      <p className="errorstate">{errors.reason}</p>
                    ) : null}
                  </div>

                  <div class="form-group">
                    <label for="comments">Additional Comments or Notes</label>
                    <textarea
                      id="comments"
                      name="comment"
                      value={values.comment}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></textarea>
                    {errors.comment && touched.comment ? (
                      <p className="errorstate">{errors.comment}</p>
                    ) : null}
                  </div>

                  <div class="form-group">
                    <label for="condition">Condition of the Product</label>
                    <select
                      id="condition"
                      name="condition"
                      value={values.condition}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="Unused">Unused</option>
                      <option value="Unopened">Unopened</option>
                      <option value="Opened (but not used)">
                        Opened (but not used)
                      </option>
                      <option value="Used">Used</option>
                    </select>
                    {errors.condition && touched.condition ? (
                      <p className="errorstate">{errors.condition}</p>
                    ) : null}
                  </div>

                  <div class="form-group">
                    <label for="resolution">
                      Preferred Resolution of Cashback
                    </label>
                    <select
                      id="resolution"
                      name="resolution"
                      value={values.resolution}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Please Select</option>
                      <option value="Refund">Refund</option>
                      <option value="Exchange">Exchange</option>
                      <option value="Store Credit">Store Credit</option>
                      <option value="Repair">Repair</option>
                    </select>
                    {errors.resolution && touched.resolution ? (
                      <p className="errorstate">{errors.resolution}</p>
                    ) : null}
                  </div>

                  <div class="form-group declarationcont">
                    <div className="declarationcheck">
                      <label className="declarationtag">
                        <input
                          type="checkbox"
                          id="declaration"
                          name="declaration"
                          checked={values.declaration === true}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        I confirm the product return.
                      </label>
                    </div>
                    {errors.declaration && touched.declaration ? (
                      <p className="errorstate">{errors.declaration}</p>
                    ) : null}
                  </div>

                  <div class="form-group">
                    <button type="submit" className="mybtn btnprimary">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="nocancelcont">
              <div className="nocancelsvg">
                <Nocancelsvg />
              </div>
              <p className="tagnocancel">Item Can not be Returned!</p>
              <p className="">
                For any kind of questions or queries please{" "}
                <Link to="/ContactUs" className="contactlink">
                  Contact Us
                </Link>
              </p>
              <div className="cartbtnscont">
                <Link to="/">
                  <button>
                    <div>
                      <Returnsvg />
                    </div>
                    <span>Continue Shopping</span>
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
