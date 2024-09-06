import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import BannerImgUpload from "../../../components/forms/BannerImgUpload";
import { Link } from "react-router-dom";
import {
  createBanner,
  getBanners,
  removeBanner,
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

  return (
    <div className="col">
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <h4>Create Banner</h4>
      )}
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
