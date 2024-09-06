import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { getBanner, updateBanner } from "../../../functions/banner";
import BannerImgUpload from "../../../components/forms/BannerImgUpload";
import BannerForm from "../../../components/forms/BannerForm";
import axios from "axios";
import AdminsideNavcopy from "../../../components/nav/AdminsideNavcopy";

const BannerUpdate = ({ history, match }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [identity, setIdentity] = useState("");
  const [bannerNum, setBannerNum] = useState(0);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBanner();
  }, []);

  const loadBanner = () =>
    getBanner(match.params.slug).then((b) => {
      console.log("banner scpose", b);
      setIdentity(b.data.banner.identity);
      setBannerNum(b.data.banner.bannerNum);
      setName(b.data.banner.name);
      setImage(b.data.banner.image);
      setLink(b.data.banner.link);
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    updateBanner(
      match.params.slug,
      { name, image, link, identity, bannerNum },
      user.token
    )
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setIdentity("");
        setBannerNum(0);
        setName("");
        setImage("");
        setLink("");
        toast.success(`"${res.data.name}" is updated`);
        history.push("/AdminPanel?page=BannerCreate");
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
        <AdminsideNavcopy currentActive="BannerCreate" />
        <div class="navrightside">
          <div className="col">
            {loading ? (
              <h4 className="text-danger">Loading..</h4>
            ) : (
              <h4>Update Banner</h4>
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

            <hr />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerUpdate;
