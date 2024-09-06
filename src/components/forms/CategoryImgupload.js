import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "antd";
import Skeleton from "react-loading-skeleton";

const CategoryImgupload = ({
  image,
  setImage,
  setLoading,
  handleImageRemove,
  btnclasses,
  loading,
}) => {
  const { user } = useSelector((state) => ({ ...state }));

  const fileUploadAndResize = (e) => {
    // resize
    let files = e.target.files;
    if (files) {
      setLoading(true);
      Resizer.imageFileResizer(
        files[0],
        720,
        720,
        "WebP",
        50,
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
      {loading ? (
        <div className="imgattachcont">
          <Skeleton height={100} width={100} borderRadius={0.4} />
        </div>
      ) : (
        image && (
          <Badge
            count="X"
            key={image.public_id}
            onClick={() => handleImageRemove(image.public_id)}
            style={{ cursor: "pointer" }}
            className="imgattachcont"
          >
            <Avatar src={image.url} size={100} shape="square" />
          </Badge>
        )
      )}

      <div className="">
        <label className={`mybtn btnprimary ${btnclasses}`}>
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

export default CategoryImgupload;
