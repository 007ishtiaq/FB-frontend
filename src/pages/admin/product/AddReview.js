import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
// import "./CategoryCreate.css";
import { useSelector } from "react-redux";
import { createAdminReview } from "../../../functions/admin";
import AdminReviewAddForm from "../../../components/forms/AdminReviewAddForm";
import CategoryImgupload from "../../../components/forms/CategoryImgupload";
import axios from "axios";

const AddReview = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [productId, setProductId] = useState("");
  const [posterName, setPosterName] = useState("");
  const [postedDate, setPostedDate] = useState("");
  const [star, setStar] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createAdminReview(
      { productId, posterName, postedDate, star, comment },
      user.token
    )
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setPosterName("");
        setStar("");
        setComment("");
        setImage("");
        toast.success(`Review Added Successfully`);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  const handleImageRemove = (public_id) => {
    setLoading(true);
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
    <div className="col">
      {loading ? (
        <h4 className="text-danger">Loading..</h4>
      ) : (
        <h4>Add A Review</h4>
      )}
      <div className="p-3">
        <CategoryImgupload
          image={image}
          setImage={setImage}
          setLoading={setLoading}
          handleImageRemove={handleImageRemove}
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
        image={image}
      />
    </div>
  );
};

export default AddReview;
