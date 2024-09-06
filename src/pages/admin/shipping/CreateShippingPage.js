import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
  getShippings,
  removeShipping,
  createShipping,
} from "../../../functions/shipping";
import { DeleteOutlined } from "@ant-design/icons";
import AdminNav from "../../../components/nav/AdminNav";

const CreateShippingPage = () => {
  const [weightstart, setweightstart] = useState("");
  const [weightend, setweightend] = useState("");
  const [charges, setCharges] = useState("");
  const [loading, setLoading] = useState("");
  const [shippings, setShippings] = useState([]);

  // redux
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadAllShippings();
  }, []);

  const loadAllShippings = () =>
    getShippings().then((res) => setShippings(res.data));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // console.table(name, expiry, discount);
    createShipping({ weightstart, weightend, charges }, user.token)
      .then((res) => {
        setLoading(false);
        loadAllShippings(); // load all coupons
        setweightstart("");
        setweightend("");
        setCharges("");
        toast.success(
          `"${res.data.weightstart} - ${res.data.weightend}" is created`
        );
      })
      .catch((err) => console.log("create shipping err", err));
  };

  const handleRemove = (shippingId) => {
    if (window.confirm("Delete?")) {
      setLoading(true);
      removeShipping(shippingId, user.token)
        .then((res) => {
          loadAllShippings(); // load all coupons
          setLoading(false);
          toast.error(
            `Shiiping "${res.data.weightstart} - ${res.data.weightend}" deleted`
          );
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="col-md-10">
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <h4>Shipping Charges</h4>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="text-muted">Weight Start</label>
          <input
            type="number"
            className="form-control"
            onChange={(e) => setweightstart(e.target.value)}
            value={weightstart}
            autoFocus
            required
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Weight End</label>
          <input
            type="number"
            className="form-control"
            onChange={(e) => setweightend(e.target.value)}
            value={weightend}
            required
          />
        </div>

        <div className="form-group">
          <label className="text-muted">Charges</label>
          <input
            type="number"
            className="form-control"
            onChange={(e) => setCharges(e.target.value)}
            value={charges}
            required
          />
        </div>

        <button className="btn btn-outline-primary">Save</button>
      </form>

      <br />

      <h4>{shippings.length} Shippings</h4>

      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">Weight Start</th>
            <th scope="col">Weight End</th>
            <th scope="col">Charges</th>
            <th scope="col">Action</th>
          </tr>
        </thead>

        <tbody>
          {shippings.map((s) => (
            <tr key={s._id}>
              <td>{s.weightstart}</td>
              <td>{s.weightend}</td>
              <td>{s.charges}</td>
              <td>
                <DeleteOutlined
                  onClick={() => handleRemove(s._id)}
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

export default CreateShippingPage;
