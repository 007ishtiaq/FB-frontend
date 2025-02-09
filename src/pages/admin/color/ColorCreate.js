import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  createColor,
  getColors,
  removeColor,
  getColorsJson,
  uploadcolorsjson,
} from "../../../functions/color";
import { DeleteOutlined } from "@ant-design/icons";
import LocalSearch from "../../../components/forms/LocalSearch";
import { auth } from "../../../firebase"; // Import Firebase auth

const ColorCreate = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [Colors, setColors] = useState([]);
  const [jsonfile, setJsonfile] = useState(null);
  // step 1
  const [keyword, setKeyword] = useState("");

  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  useEffect(() => {
    loadColors();
  }, []);

  const loadColors = () => getColors().then((c) => setColors(c.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let token = user.token; // Use current token

    // Function to create color
    const createColorWithToken = async (currentToken) => {
      return createColor({ name }, currentToken);
    };

    try {
      const res = await createColorWithToken(token);
      setLoading(false);
      setName("");
      toast.success(`"${res.data.name}" is created`);
      loadColors();
    } catch (err) {
      setLoading(false);

      if (err.response && err.response.status === 401) {
        try {
          // Token expired, renew it
          const newToken = await auth.currentUser.getIdToken(true);

          // Update Redux store with new token
          dispatch({
            type: "LOGGED_IN_USER",
            payload: { ...user, token: newToken },
          });

          // Retry createColor with new token
          const res = await createColorWithToken(newToken);
          setName("");
          toast.success(`"${res.data.name}" is created`);
          loadColors();
        } catch (renewError) {
          console.log("Token renewal failed:", renewError);
          toast.error("Session expired. Please log in again.");
        }
      } else {
        console.log(err);
        if (err.response && err.response.status === 400) {
          toast.error(err.response.data);
        } else {
          toast.error("Something went wrong.");
        }
      }
    }
  };

  const handleRemove = async (slug) => {
    // let answer = window.confirm("Delete?");
    // console.log(answer, slug);
    if (window.confirm("Delete?")) {
      setLoading(true);
      removeColor(slug, user.token)
        .then((res) => {
          setLoading(false);
          toast.success(`${res.data.name} deleted`);
          loadColors();
        })
        .catch((err) => {
          if (err.response.status === 400) {
            setLoading(false);
            toast.error(err.response.data);
          }
        });
    }
  };

  // step 4
  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  //-------uploading downloading part---------
  const DownloadColorJson = async () => {
    try {
      getColorsJson(user.token)
        .then((res) => {
          toast.success(`Json Downloaded`);
          const data = res.data;
          // Convert JSON data to a downloadable file
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "MMFB-Colors-Manual.json";
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

      const response = await uploadcolorsjson(jsonData, user.token); // Upload data
      toast.success(response.data.message);
      loadColors();
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
    <div className="col">
      <div className="adminAllhead">
        {loading ? (
          <h4 className="text-danger">Loading..</h4>
        ) : (
          <h4>Create Color</h4>
        )}
        <button
          className="mybtn btnsecond jsonbtns"
          onClick={DownloadColorJson}
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
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
            value={name}
            autoFocus
            required
          />
          <button className="btn btn-outline-primary">Save</button>
        </div>
      </form>

      {/* step 2 and step 3 */}
      <LocalSearch keyword={keyword} setKeyword={setKeyword} />

      {/* step 5 */}
      {Colors.filter(searched(keyword)).map((c) => (
        <div className="alert alert-secondary" key={c._id}>
          {c.name}
          <span
            onClick={() => handleRemove(c.slug)}
            className="btn btn-sm float-right"
          >
            <DeleteOutlined className="text-danger" />
          </span>
        </div>
      ))}
    </div>
  );
};

export default ColorCreate;
