import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "antd";
import "./SlipImgUpload.css";
import toast from "react-hot-toast";
import { ReloadOutlined } from "@ant-design/icons";

const SlipImgUpload = ({ file, setFile, fileInputRef }) => {
  const { user } = useSelector((state) => ({ ...state }));
  // const [file, setFile] = useState(null);

  useEffect(() => {
    if (file) {
      updateThumbnail(file);
    }
  }, [file]);

  const handleFileChange = (e) => {
    if (e.target.files.length) {
      const selectedFile = e.target.files[0];
      updateThumbnail(e.target.files[0]);
      setFile(selectedFile);

      // Reset file input value to allow selecting the same file again
      e.target.value = null;

      // Manually trigger onChange event
      const newEvent = new Event("change", { bubbles: true });
      fileInputRef.current.dispatchEvent(newEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    document.getElementById("drop-zone").classList.add("drop-zone--over");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById("drop-zone").classList.remove("drop-zone--over");
  };

  const handleDragEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById("drop-zone").classList.remove("drop-zone--over");
  };

  const handleDrop = (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
      updateThumbnail(e.dataTransfer.files[0]);
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      document.getElementById("drop-zone").classList.remove("drop-zone--over");
    }
  };

  const updateThumbnail = (file) => {
    console.log("updating thumb", file);
    const thumbnailElement = document.getElementById("drop-zone--thumb");

    if (!thumbnailElement) return;

    thumbnailElement.dataset.label = file.name;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
      };
    } else {
      thumbnailElement.style.backgroundImage = null;
    }
  };

  // const handleRetryUpload = (e) => {
  //   e.preventDefault();
  //   if (uri) {
  //     axios
  //       .post(
  //         `${process.env.REACT_APP_API}/slipupload`,
  //         { image: uri },
  //         {
  //           headers: {
  //             authtoken: user ? user.token : "",
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         setLoading(false);
  //         setImage(res.data);
  //       })
  //       .catch((err) => {
  //         setLoading(false);
  //         console.log("CLOUDINARY UPLOAD ERR", err);
  //       });
  //   }
  // };

  const cancelUpload = () => {
    setFile(null);
    // resetFileInput();
    // console.log(fileInputRef.current.value);
    // updateThumbnail(file);
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.value = ""; // Reset the value of the file input
    }
  };

  return (
    <>
      <div className="dragndropCont">
        <div
          Id="drop-zone"
          className="drop-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input").click()}
        >
          {/* code 1 */}
          {/* {file && (
            <img
              className="drop-zone--thumb"
              src={URL.createObjectURL(file)}
              alt="Preview"
            />
          )} */}

          {/* code 2 */}
          {file && (
            <div id="drop-zone--thumb" className="drop-zone--thumb"></div>
          )}

          {!file && (
            <span className="drop-zone--prompt">
              Drop file here or click to upload
            </span>
          )}

          <input
            id="file-input"
            type="file"
            name="myFile"
            className="drop-zone--input"
            accept="images/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            hidden
          />
        </div>
        {file && (
          <Badge
            count="X"
            key={file}
            onClick={() => cancelUpload()}
            className="cancelupload"
            style={{
              position: "absolute",
              top: -163,
              left: 130,
              cursor: "pointer",
              zIndex: 1001,
            }}
          />
        )}
      </div>
    </>
  );
};

export default SlipImgUpload;
