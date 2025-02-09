import React, { useState, useEffect } from "react";
import {
  getOrders,
  getOrdersJson,
  uploadOrdersjson,
} from "../../../functions/admin";
import { useSelector } from "react-redux";
import Orders from "../../../components/order/Orders";
import "./OrderstoDispatch.css";
import { toast } from "react-hot-toast";

const OrderstoDispatch = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));
  const [jsonfile, setJsonfile] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () =>
    getOrders(user.token)
      .then((res) => {
        // console.log(JSON.stringify(res.data, null, 4));
        setOrders(res.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.status === 401 && "Unauthrised");
      });

  //-------uploading downloading part---------
  const DownloadCategoryJson = async () => {
    try {
      getOrdersJson(user.token)
        .then((res) => {
          toast.success(`Json Downloaded`);
          const data = res.data;
          // Convert JSON data to a downloadable file
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "MMFB-Orders-Manual.json";
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

      const response = await uploadOrdersjson(jsonData, user.token); // Upload data
      toast.success(response.data.message);
      loadOrders();
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
    <div>
      <div className="adminAllhead">
        <h4>Orders To Dispatch</h4>
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
      <Orders orders={orders} />
    </div>
  );
};

export default OrderstoDispatch;
