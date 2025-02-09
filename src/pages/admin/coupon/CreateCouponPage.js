import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
  getCoupons,
  removeCoupon,
  createCoupon,
  getCouponsJson,
  uploadCouponsjson,
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
  const [jsonfile, setJsonfile] = useState(null);

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

  //-------uploading downloading part---------
  const DownloadCategoryJson = async () => {
    try {
      getCouponsJson(user.token)
        .then((res) => {
          toast.success(`Json Downloaded`);
          const data = res.data;
          // Convert JSON data to a downloadable file
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "MMFB-Coupons-Manual.json";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error("Error fetching schema data:", error);
        });
    } catch (error) {
      console.error("Error fetching schema data:", error);
    }
  };

  const handleFileChange = (e) => {
    setJsonfile(e.target.files[0]);
  };

  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  const handleUpload = async () => {
    if (!jsonfile) {
      toast.error("Please select a file!");
      return;
    }
    try {
      const fileContent = await readFileAsync(jsonfile); // Read file asynchronously
      const jsonData = JSON.parse(fileContent); // Parse JSON
      console.log("Parsed JSON Data:", jsonData);

      // Validate data
      if (!jsonData || (Array.isArray(jsonData) && jsonData.length === 0)) {
        toast.error("The JSON file is empty or invalid.");
        return;
      }

      const response = await uploadCouponsjson(jsonData, user.token); // Upload data
      toast.success(response.data.message);
      loadAllCoupons();
    } catch (error) {
      if (error.name === "SyntaxError") {
        alert("The JSON file contains invalid syntax.");
      } else {
        alert("An error occurred while uploading the file.");
      }
      console.error("Error while uploading JSON file:", error);
    }
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
      <div className="adminAllhead">
        {loading ? (
          <h4 className="text-danger">Loading...</h4>
        ) : (
          <h4>Coupon</h4>
        )}
        <button
          className="mybtn btnsecond jsonbtns"
          onClick={DownloadCategoryJson}
        >
          Download Json
        </button>
        <div className="uploadjson">
          <input
            type="file"
            accept=".json"
            className="jsonuploadinput"
            onChange={handleFileChange}
          />
          <button className="mybtn btnsecond jsonbtns" onClick={handleUpload}>
            Upload JSON
          </button>
        </div>
      </div>

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
            Coupon Condition (Flat , Min cart value) [empty for flat or 0 to ~]
          </label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setCondition(e.target.value)}
            value={condition}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">
            Coupon Value (%, Rs, 0) [0 or 1 to ~]
          </label>
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
