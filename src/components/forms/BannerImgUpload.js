import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "antd";

const BannerImgUpload = ({
  image,
  setImage,
  setLoading,
  handleImageRemove,
}) => {
  const { user } = useSelector((state) => ({ ...state }));

  const fileUploadAndResize = (e) => {
    // resize
    let files = e.target.files;
    if (files) {
      setLoading(true);
      Resizer.imageFileResizer(
        files[0],
        1152,
        1152,
        "WebP",
        100,
        0,
        (uri) => {
          // console.log(uri);
          axios
            .post(
              `${process.env.REACT_APP_API}/uploadimages`,
              { image: uri },
              {
                headers: {
                  authtoken: user ? user.token : "",
                },
              }
            )
            .then((res) => {
              setLoading(false);
              setImage(res.data);
            })
            .catch((err) => {
              setLoading(false);
              console.log("CLOUDINARY UPLOAD ERR", err);
            });
        },
        "base64"
      );
    }
  };

  return (
    <>
      <div className="row">
        {image && (
          <Badge
            count="X"
            key={image.public_id}
            onClick={() => handleImageRemove(image.public_id)}
            style={{ cursor: "pointer" }}
          >
            <Avatar
              src={image.url}
              size={100}
              shape="square"
              className="ml-3"
            />
          </Badge>
        )}
      </div>
      <div className="row">
        <label className="btn btn-primary btn-raised mt-3">
          Choose File
          <input
            type="file"
            hidden
            disabled={image}
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
};

export default BannerImgUpload;
