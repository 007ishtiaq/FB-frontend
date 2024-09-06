import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { getStaticText, updateStaticText } from "../../../functions/staticText";
import BannerImgUpload from "../../../components/forms/BannerImgUpload";
import StatictextForm from "../../../components/forms/StatictextForm";
import AdminsideNavcopy from "../../../components/nav/AdminsideNavcopy";

const StaticTextupdate = ({ history, match }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [identity, setIdentity] = useState("");
  const [serialNum, setSerialNum] = useState(0);
  const [info1, setInfo1] = useState("");
  const [info2, setInfo2] = useState("");
  const [info3, setInfo3] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadstaticText();
  }, []);

  const loadstaticText = () =>
    getStaticText(match.params.slug).then((res) => {
      setIdentity(res.data.identity);
      setSerialNum(res.data.serialNum);
      setInfo1(res.data.info1);
      setInfo2(res.data.info2);
      setInfo3(res.data.info3);
      setImage(res.data.image);
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    updateStaticText(
      match.params.slug,
      { identity, serialNum, info1, info2, info3, image },
      user.token
    )
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setIdentity("");
        setSerialNum(0);
        setInfo1("");
        setInfo2("");
        setInfo3("");
        setImage("");
        toast.success(`"${res.data.info1}" is updated`);
        history.push("/AdminPanel?page=StaticText");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(err.response.data.err);
      });
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

  return (
    <div class="manageacmaincont">
      <div class="manageaccont">
        <AdminsideNavcopy currentActive="StaticText" />
        <div class="navrightside">
          <div className="col">
            {loading ? (
              <h4 className="text-danger">Loading..</h4>
            ) : (
              <h4>Update Static Text</h4>
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

            <hr />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticTextupdate;
