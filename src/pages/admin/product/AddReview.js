import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
// import "./CategoryCreate.css";
import { useSelector } from "react-redux";
import {
  createAdminReview,
  getAdminReviews,
  deleteReview,
  deleteReviewImages,
  getReviewsJson,
  uploadReviewsjson,
} from "../../../functions/admin";
import AdminReviewAddForm from "../../../components/forms/AdminReviewAddForm";
import FileUpload from "../../../components/forms/FileUpload";
import "./AddReview.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AddReview = () => {
  let query = useQuery();
  const { user } = useSelector((state) => ({ ...state }));

  const [values, setValues] = useState({ images: [] });
  const [productId, setProductId] = useState("");
  const [posterName, setPosterName] = useState("");
  const [postedDate, setPostedDate] = useState("");
  const [star, setStar] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [productReviews, setProductReviews] = useState([]);
  const [jsonfile, setJsonfile] = useState(null);

  // Set productId from URL params
  useEffect(() => {
    if (query) {
      setProductId(query.get("productID"));
      loadAdminReviews();
    }
  }, [query.get("productID")]);

  const loadAdminReviews = () => {
    setLoading(true);
    getAdminReviews(query.get("productID"), user.token)
      .then((res) => {
        setProductReviews(res.data);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createAdminReview(
      {
        productId,
        posterName,
        postedDate,
        star,
        comment,
        images: values.images,
      },
      user.token
    )
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setPosterName("");
        setStar("");
        setComment("");
        setValues({ images: [] });
        toast.success(`Review Added Successfully`);
        loadAdminReviews();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  function showDate(postedOn) {
    const date = new Date(postedOn);
    const options = {
      // weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formattedDate = date.toLocaleDateString("en-US", options);

    return formattedDate;
  }

  const handleRemove = (reviewId, imagesArray) => {
    if (window.confirm("Delete?")) {
      if (imagesArray && imagesArray.length > 0) {
        // Extract all public_ids from the images array
        const publicIds = imagesArray.map((image) => image.public_id);
        deleteReviewImages(publicIds, user.token)
          .then(() => {
            // After images are deleted, proceed to delete the review
            deleteReview(reviewId, user.token)
              .then(() => {
                loadAdminReviews(); // Reload reviews
                toast.success(`Review and associated images are deleted`);
              })
              .catch((err) => {
                if (err.response?.status === 400)
                  toast.error(err.response.data);
                console.log(err);
              });
          })
          .catch(() => {
            toast.error("Failed to delete images");
          });
      } else {
        // If no images, directly delete the review
        deleteReview(reviewId, user.token)
          .then(() => {
            loadAdminReviews(); // Reload reviews
            toast.success(`Review deleted`);
          })
          .catch((err) => {
            if (err.response?.status === 400) toast.error(err.response.data);
            console.log(err);
          });
      }
    }
  };

  //-------uploading downloading part---------
  const DownloadReviewJson = async () => {
    try {
      getReviewsJson(user.token)
        .then((res) => {
          toast.success(`Json Downloaded`);
          const data = res.data;
          // Convert JSON data to a downloadable file
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "MMFB-Reviews-Manual.json";
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

      const response = await uploadReviewsjson(jsonData, user.token); // Upload data
      toast.success(response.data.message);
      loadAdminReviews();
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
          <h4>Add A Review</h4>
        )}
        <button
          className="mybtn btnsecond jsonbtns"
          onClick={DownloadReviewJson}
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
        <FileUpload
          values={values}
          setValues={setValues}
          setLoading={setLoading}
        />
      </div>
      <AdminReviewAddForm
        handleSubmit={handleSubmit}
        productId={productId}
        setProductId={setProductId}
        posterName={posterName}
        setPosterName={setPosterName}
        postedDate={postedDate}
        setPostedDate={setPostedDate}
        star={star}
        setStar={setStar}
        comment={comment}
        setComment={setComment}
      />
      <div>
        {productReviews &&
          productReviews.map((review, index) => (
            <div key={index} className="adminreviewcont">
              <span>{review.posterName}------</span>

              <span>{showDate(review.postedOn)}------</span>
              <span>
                <img
                  src={review.product.image.url}
                  alt=""
                  className="reviewimgbox"
                />
                ------
              </span>
              <span>{review.product.title.substring(0, 55)}</span>
              <br />
              <span>{review.star}</span>
              <span>-----{review.comment.substring(0, 85)}</span>
              <span>
                -----
                {review.images.length ? (
                  <img
                    src={review.images[0].url}
                    alt=""
                    className="reviewimgbox"
                  />
                ) : (
                  <span>no Img</span>
                )}
              </span>
              <span
                className="reviewdelbtn"
                onClick={() => handleRemove(review._id, review.images)}
              >
                Delete
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AddReview;
