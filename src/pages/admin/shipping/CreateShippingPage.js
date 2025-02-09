import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
  getShippings,
  removeShipping,
  createShipping,
  getShippingJson,
  uploadShippingjson,
} from "../../../functions/shipping";
import { DeleteOutlined } from "@ant-design/icons";
import AdminNav from "../../../components/nav/AdminNav";

const CreateShippingPage = () => {
  const [weightstart, setweightstart] = useState("");
  const [weightend, setweightend] = useState("");
  const [charges, setCharges] = useState("");
  const [loading, setLoading] = useState("");
  const [shippings, setShippings] = useState([]);
  const [jsonfile, setJsonfile] = useState(null);

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

  //-------uploading downloading part---------
  const DownloadShippingJson = async () => {
    try {
      getShippingJson(user.token)
        .then((res) => {
          toast.success(`Json Downloaded`);
          const data = res.data;
          // Convert JSON data to a downloadable file
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "MMFB-Shippings-Manual.json";
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

      const response = await uploadShippingjson(jsonData, user.token); // Upload data
      toast.success(response.data.message);
      loadAllShippings();
    } catch (error) {
      if (error.name === "SyntaxError") {
        alert("The JSON file contains invalid syntax.");
      } else {
        alert("An error occurred while uploading the file.");
      }
      console.error("Error while uploading JSON file:", error);
    }
  };

  return (
    <div className="col-md-10">
      <div className="adminAllhead">
        {loading ? (
          <h4 className="text-danger">Loading...</h4>
        ) : (
          <h4>Shipping Charges</h4>
        )}
        <button
          className="mybtn btnsecond jsonbtns"
          onClick={DownloadShippingJson}
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
