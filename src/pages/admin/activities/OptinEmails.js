import React, { useState, useEffect } from "react";
import {
  getOptinEmails,
  getOptinsJson,
  uploadOptinsjson,
} from "../../../functions/optinEmail";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

export default function OptinEmails() {
  const [optinemails, setOptinemails] = useState([]);
  const [jsonfile, setJsonfile] = useState(null);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = () =>
    getOptinEmails(user.token).then((res) => {
      setOptinemails(res.data);
    });

  //-------uploading downloading part---------
  const DownloadOptinemailsJson = async () => {
    try {
      getOptinsJson(user.token)
        .then((res) => {
          toast.success(`Json Downloaded`);
          const data = res.data;
          // Convert JSON data to a downloadable file
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "MMFB-OptinEmails-Manual.json";
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

      const response = await uploadOptinsjson(jsonData, user.token); // Upload data
      toast.success(response.data.message);
      loadEmails();
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
    <>
      <div className="adminAllhead">
        <div>Opt-In Emails</div>

        <button
          className="mybtn btnsecond jsonbtns"
          onClick={DownloadOptinemailsJson}
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
      <div>
        <table className="TTtable">
          <thead>
            <tr>
              <th class="ordli">Email</th>
              <th class="ordli">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {optinemails.map((email) => (
              <tr key={email._id}>
                <td class="ordli">{email.email}</td>
                <td class="ordli">
                  {new Date(email.optedInAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
