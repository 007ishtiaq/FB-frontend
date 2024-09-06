import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
  getCoupons,
  removeCoupon,
  createCoupon,
} from "../../../functions/coupon";
import { DeleteOutlined } from "@ant-design/icons";

const CreateCouponPage = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [condition, setCondition] = useState("");
  const [expiry, setExpiry] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState("");
  const [coupons, setCoupons] = useState([]);

  // redux
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadAllCoupons();
  }, []);

  const loadAllCoupons = () => getCoupons().then((res) => setCoupons(res.data));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // console.table(name, expiry, discount);
    createCoupon({ name, type, condition, expiry, discount }, user.token)
      .then((res) => {
        setLoading(false);
        loadAllCoupons(); // load all coupons
        setName("");
        setDiscount("");
        setExpiry("");
        toast.success(`"${res.data.name}" is created`);
      })
      .catch((err) => {
        setLoading(false);
        console.log("create coupon err", err);
        toast.error(`coupon create failed`);
      });
  };

  const handleRemove = (couponId) => {
    if (window.confirm("Delete?")) {
      setLoading(true);
      removeCoupon(couponId, user.token)
        .then((res) => {
          loadAllCoupons(); // load all coupons
          setLoading(false);
          toast.error(`Coupon "${res.data.name}" deleted`);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="col-md-12">
      {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Coupon</h4>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="text-muted">Coupon Code</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
            value={name}
            autoFocus
            required
          />
        </div>

        <div className="form-group">
          <label>Coupon type</label>
          <select
            name="type"
            className="form-control"
            onChange={(e) => setType(e.target.value)}
            value={type}
          >
            <option>Please select</option>
            <option value="Discount">Discount %</option>
            <option value="Cash">Cash Off</option>
            <option value="Shipping">Free Shipping</option>
          </select>
        </div>

        <div className="form-group">
          <label className="text-muted">
            Coupon Condition (Flat , Min cart value) [empty for flat or ~]
          </label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setCondition(e.target.value)}
            value={condition}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">Coupon Value (%, Rs, 0) [0 or ~]</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            required
          />
        </div>

        <div className="form-group">
          <label className="text-muted">Expiry [13 sep 2024]</label>
          <br />
          <div className="form-group">
            <label>Set Expiry Time</label>
            <input
              type="text"
              name="expiry"
              className="form-control"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-outline-primary">Save</button>
      </form>

      <br />

      <h4>{coupons.length} Coupons</h4>

      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">Coupon Code</th>
            <th scope="col">Coupon Type</th>
            <th scope="col">Condition (Min , Flat)</th>
            <th scope="col">Coupon Value (%, Rs)</th>
            <th scope="col">Expiry</th>
            <th scope="col">Action</th>
          </tr>
        </thead>

        <tbody>
          {coupons.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.type}</td>
              <td>
                {!c.condition && "Flat -"} {c.condition && `Min ${c.condition}`}{" "}
              </td>
              <td>
                {c.type === "Cash" && "Rs. "}
                {c.discount}
                {c.type === "Discount" && " %"}
                {c.type === "Shipping" && " Shipping"}
              </td>
              <td>{new Date(c.expiry).toLocaleDateString()}</td>
              <td>
                <DeleteOutlined
                  onClick={() => handleRemove(c._id)}
                  className="text-danger pointer"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreateCouponPage;
