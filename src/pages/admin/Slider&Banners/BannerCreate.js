import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import BannerImgUpload from "../../../components/forms/BannerImgUpload";
import { Link } from "react-router-dom";
import {
  createBanner,
  getBanners,
  removeBanner,
  getBannersJson,
  uploadBannersjson,
} from "../../../functions/banner";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import BannerForm from "../../../components/forms/BannerForm";
import axios from "axios";
import _ from "lodash";
import Model from "../../../components/Model/Model";

const BannerCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [identity, setIdentity] = useState("");
  const [bannerNum, setBannerNum] = useState(0);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [showModels, setShowModels] = useState({});
  const [jsonfile, setJsonfile] = useState(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = () =>
    getBanners().then((b) => {
      setBanners(b.data);
    });

  const handleModelToggle = (bannerId) => {
    setShowModels((prevShowModels) => ({
      ...prevShowModels,
      [bannerId]: !prevShowModels[bannerId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    createBanner({ name, image, identity, link, bannerNum }, user.token)
      .then((res) => {
        // console.log(res)
        setIdentity("");
        setBannerNum(0);
        setName("");
        setImage("");
        setLink("");
        setLoading(false);
        toast.success(`"${res.data.name}" is created`);
        loadBanners();
      })
      .catch((err) => {
        // console.log(err);
        setLoading(false);
        toast.error(err.response.data.err);
      });
  };

  const handleRemove = async (slug, public_id) => {
    if (window.confirm("Delete?")) {
      setLoading(true);
      removeBanner(slug, user.token)
        .then((res) => {
          handleImageRemove(public_id);
          setLoading(false);
          toast.success(`${res.data.name} deleted`);
          loadBanners();
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.status === 400) {
            toast.error(err.response.data);
          }
        });
    }
  };

  const handleImageRemove = (public_id) => {
    setLoading(true);
    // console.log("remove image", public_id);
    axios
      .post(
        `${process.env.REACT_APP_API}/removeimage`,
        { public_id },
        {
          headers: {
            authtoken: user ? user.token : "",
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setImage("");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // -----sprate filterting by identity ti show data----

  const searched = (filter) => (b) => b.identity.toLowerCase().includes(filter);

  const Identities = () => {
    let onlyidentityall = [];
    let onlyidentityfiltered = [];

    for (let i = 0; i < banners.length; i++) {
      onlyidentityall.push(banners[i].identity);

      onlyidentityfiltered.indexOf(banners[i].identity) === -1 &&
        onlyidentityfiltered.push(banners[i].identity);
    }

    return onlyidentityfiltered.map((I) => (
      <>
        <div>
          <span>
            Identity : <strong>{I}</strong>
          </span>
        </div>
        <div>
          {banners.filter(searched(I.toLowerCase())).map((b, index) => (
            <div className="alert alert-secondary" key={b._id}>
              <span>{b.name}</span>
              <span> ----- {b.bannerNum}</span>
              <span> ----- {b.identity} </span>
              {b.link && <span> ----- {b.link} </span>}
              {b.image && (
                <span>
                  -----{" "}
                  <Model
                    key={b._id}
                    show={showModels[b._id]}
                    closeModel={() => handleModelToggle(b._id)}
                  >
                    <img className="" src={b.image.url} alt="" />
                  </Model>
                  <img
                    onClick={() => handleModelToggle(b._id)}
                    style={{ width: "25px", height: "25px", cursor: "pointer" }}
                    src={b.image.url}
                    alt=""
                  />
                </span>
              )}
              <span
                onClick={() => handleRemove(b.slug, b.image.public_id)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <Link to={`/admin/banner/${b.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined className="text-warning" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </>
    ));
  };

  //-------uploading downloading part---------
  const DownloadCategoryJson = async () => {
    try {
      getBannersJson(user.token)
        .then((res) => {
          toast.success(`Json Downloaded`);
          const data = res.data;
          // Convert JSON data to a downloadable file
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "MMFB-Banners-Manual.json";
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

      const response = await uploadBannersjson(jsonData, user.token); // Upload data
      toast.success(response.data.message);
      loadBanners();
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
          <h4 className="text-danger">Loading...</h4>
        ) : (
          <h4>Create Banner</h4>
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

      <div className="p-3">
        <BannerImgUpload
          image={image}
          setImage={setImage}
          setLoading={setLoading}
          handleImageRemove={handleImageRemove}
        />
      </div>
      <BannerForm
        handleSubmit={handleSubmit}
        name={name}
        setName={setName}
        identity={identity}
        setIdentity={setIdentity}
        bannerNum={bannerNum}
        setBannerNum={setBannerNum}
        link={link}
        setLink={setLink}
        image={image}
      />

      <div>{Identities()}</div>
    </div>
  );
};

export default BannerCreate;
