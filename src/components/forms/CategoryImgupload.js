import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Badge } from "antd";
import Skeleton from "react-loading-skeleton";
import { auth } from "../../firebase"; // Import Firebase auth

const CategoryImgupload = ({
  image,
  setImage,
  setLoading,
  handleImageRemove,
  btnclasses,
  loading,
}) => {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const fileUploadAndResize = (e) => {
    let files = e.target.files;
    if (!files) return;

    setLoading(true);

    Resizer.imageFileResizer(
      files[0],
      720,
      720,
      "WebP",
      50,
      0,
      async (uri) => {
        let token = user.token; // Use current token

        // Function to upload image
        const uploadImage = async (currentToken) => {
          return axios.post(
            `${process.env.REACT_APP_API}/uploadimages`,
            { image: uri },
            {
              headers: { authtoken: currentToken },
            }
          );
        };

        try {
          const res = await uploadImage(token);
          setLoading(false);
          setImage(res.data);
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

              // Retry image upload with new token
              const res = await uploadImage(newToken);
              setImage(res.data);
            } catch (renewError) {
              console.log("Token renewal failed:", renewError);
              toast.error("Session expired. Please log in again.");
            }
          } else {
            console.log("CLOUDINARY UPLOAD ERR", err);
            toast.error("Image upload failed.");
          }
        }
      },
      "base64"
    );
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
