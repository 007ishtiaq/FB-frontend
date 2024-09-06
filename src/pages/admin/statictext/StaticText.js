import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import BannerImgUpload from "../../../components/forms/BannerImgUpload";
import { Link } from "react-router-dom";
import {
  createStaticText,
  getStaticTexts,
  removeStaticText,
} from "../../../functions/staticText";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import StatictextForm from "../../../components/forms/StatictextForm";
import axios from "axios";
import _ from "lodash";
import Model from "../../../components/Model/Model";

export default function StaticText() {
  const { user } = useSelector((state) => ({ ...state }));

  const [identity, setIdentity] = useState("");
  const [serialNum, setSerialNum] = useState(0);
  const [info1, setInfo1] = useState("");
  const [info2, setInfo2] = useState("");
  const [info3, setInfo3] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [staticTexts, setStaticTexts] = useState([]);
  const [showModels, setShowModels] = useState({});

  useEffect(() => {
    loadstaticTexts();
  }, []);

  const loadstaticTexts = () =>
    getStaticTexts().then((t) => {
      setStaticTexts(t.data);
    });

  const handleModelToggle = (textId) => {
    setShowModels((prevShowModels) => ({
      ...prevShowModels,
      [textId]: !prevShowModels[textId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    createStaticText(
      { identity, serialNum, info1, info2, info3, image },
      user.token
    )
      .then((res) => {
        // console.log(res)
        setIdentity("");
        setSerialNum(0);
        setInfo1("");
        setInfo2("");
        setInfo3("");
        setImage("");
        setLoading(false);
        toast.success(`"${res.data.info1}" is created`);
        loadstaticTexts();
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
      removeStaticText(slug, user.token)
        .then((res) => {
          if (public_id) {
            handleImageRemove(public_id);
          }
          setLoading(false);
          toast.success(`${res.data.info1} deleted`);
          loadstaticTexts();
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
        setLoading(false);
        console.log(err);
      });
  };

  // -----sprate filterting by identity ti show data----

  const searched = (filter) => (t) => t.identity.toLowerCase().includes(filter);

  const Identities = () => {
    let onlyidentityall = [];
    let onlyidentityfiltered = [];

    for (let i = 0; i < staticTexts.length; i++) {
      onlyidentityall.push(staticTexts[i].identity);

      onlyidentityfiltered.indexOf(staticTexts[i].identity) === -1 &&
        onlyidentityfiltered.push(staticTexts[i].identity);
    }

    return onlyidentityfiltered.map((I) => (
      <>
        <div>
          <span>
            Identity : <strong>{I}</strong>
          </span>
        </div>
        <div>
          {staticTexts.filter(searched(I.toLowerCase())).map((t, index) => (
            <div className="alert alert-secondary" key={t._id}>
              <span> {t.identity} </span>
              <span> ----- {t.serialNum}</span>
              <span> ----- {t.info1.substring(0, 20)}</span>
              <span> ----- {t.info2.substring(0, 20)}</span>
              <span> ----- {t.info3.substring(0, 20)}</span>
              {t.image && (
                <span>
                  -----{" "}
                  <Model
                    key={t._id}
                    show={showModels[t._id]}
                    closeModel={() => handleModelToggle(t._id)}
                  >
                    <img className="" src={t.image.url} alt="" />
                  </Model>
                  <img
                    onClick={() => handleModelToggle(t._id)}
                    style={{ width: "25px", height: "25px", cursor: "pointer" }}
                    src={t.image.url}
                    alt=""
                  />
                </span>
              )}
              <span
                onClick={() =>
                  handleRemove(t.slug, t.image && t.image.public_id)
                }
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <Link to={`/admin/statictext/${t.slug}`}>
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
        <h4>Create Static Text</h4>
      )}
      <div className="p-3">
        <BannerImgUpload
          image={image}
          setImage={setImage}
          setLoading={setLoading}
          handleImageRemove={handleImageRemove}
        />
      </div>
      <StatictextForm
        handleSubmit={handleSubmit}
        info1={info1}
        info2={info2}
        info3={info3}
        setInfo1={setInfo1}
        setInfo2={setInfo2}
        setInfo3={setInfo3}
        identity={identity}
        setIdentity={setIdentity}
        serialNum={serialNum}
        setSerialNum={setSerialNum}
      />

      <div>{Identities()}</div>
    </div>
  );
}
