import React, { useState, useEffect } from "react";
import UsersideNavCopy from "../../../components/nav/UsersideNavCopy";
import { useDispatch, useSelector } from "react-redux";
import { getOrder } from "../../../functions/user";
import "./ItemAction.css";
import { createCancellation, createReturn } from "../../../functions/user";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { productCancelSchema } from "../../../schemas";
import { ReactComponent as Nocancelsvg } from "../../../images/manageacUser/nocancel.svg";
import { ReactComponent as Returnsvg } from "../../../images/cart/return.svg";
import "../MyOrders.css";
import "../MyWishlist.css";
import "../../cart/cart.css";

export default function ItemAction({ match, history }) {
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

  // ---------formik usage for Cancel--------

  const initialValues = {
    quantity: qty,
    reason: "",
    comment: "",
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
    validationSchema: productCancelSchema,
    onSubmit: async (values, action) => {
      if (navigator.onLine) {
        createCancellation(id, itemid, values, user.token)
          .then((res) => {
            if (res.data.success) {
              RedirectToConfirmation("Cancellation", res.data.RequestNumber);
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
    getOrder(id, user.token)
      .then((res) => {
        setOrder(res.data);

        //return on product checking from order
        let foundprod = res.data.products.find(
          (prod) => prod._id.toString() === itemid
        );
        if (!foundprod) {
          toast.error("Order not found");
          history.push("/404");
        }

        setProd(
          res.data.products.find((prod) => prod._id.toString() === itemid)
        );
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
      })
      .catch((error) => {
        toast.error("Order not found");
        history.push("/404");
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
          <div class="manageacmainhead">Item On Cancellation</div>

          {order &&
          (order.orderStatus === "Not Processed" ||
            order.orderStatus === "Processing") ? (
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
                        {prod && prod.product && prod.product.art && (
                          <li className="desc_li">
                            <div className="li_head">Article No: </div>
                            <div className="li_sub">{prod.product.art}</div>
                          </li>
                        )}
                        {prod && prod.color && (
                          <li className="desc_li">
                            <div className="li_head">Color</div>
                            <div className="li_sub">{prod.color}</div>
                          </li>
                        )}
                        {prod && prod.size && (
                          <li className="desc_li">
                            <div className="li_head">Size</div>
                            <div className="li_sub">{prod.size}</div>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="formside actionform">
                <form method="post" onSubmit={handleSubmit}>
                  <div class="form-group">
                    <label for="quantity">Cancel Quantity</label>
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
                    <label for="wrongItem">Reason for Cancellation</label>
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
                    <label for="resolution">Preferred Resolution</label>
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
                        I confirm the product canellation.
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
              <p className="tagnocancel">Item Can not be Cancelled!</p>
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
