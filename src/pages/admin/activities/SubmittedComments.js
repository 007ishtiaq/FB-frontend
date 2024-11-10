import React, { useState, useEffect } from "react";
import {
  getAllRatings,
  setRead,
  deleteComment,
} from "../../../functions/rating";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Model from "../../../components/Model/Model";
import { toast } from "react-hot-toast";

export default function SubmittedComments() {
  const [allRatings, setAllRatings] = useState([]);
  const [showModels, setShowModels] = useState([]);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = () =>
    getAllRatings(user.token).then((res) => {
      console.log(res.data);
      setAllRatings(res.data);
      setShowModels(Array(res.data.length).fill(false));
    });

  const handleModelToggle = (index) => {
    const newShowModels = [...showModels];
    newShowModels[index] = !newShowModels[index];
    setShowModels(newShowModels);
  };

  const setcommentRead = (productId, ratingId) => {
    setRead(productId, ratingId, user.token)
      .then((res) => {
        loadRatings();
        toast.success(`Read Status updated`);
      })
      .catch((error) => {
        toast.error(`Read Status failed`);
        console.error(error);
      });
  };

  const deleteUserComment = (productId, ratingId) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to Delete Comment?"
    );

    if (userConfirmed) {
      deleteComment(productId, ratingId, user.token)
        .then((res) => {
          toast.success(`Comment Removed`);
          loadRatings();
        })
        .catch((error) => {
          toast.error(`Comment Removed failed`);
          console.error(error);
        });
    }
  };
  return (
    <>
      <div>Submitted Comments</div>
      <div>
        <table className="TTtable">
          <thead>
            <tr>
              <th class="ordli">Submitted At</th>
              <th class="ordli">Submitted By</th>
              <th class="ordli">Email</th>
              <th class="ordli">Rating</th>
              <th class="ordli">Comment</th>
              <th class="ordli">Product</th>
              <th class="ordli">Read</th>
              <th class="ordli">Action</th>
            </tr>
          </thead>
          {/* {JSON.stringify(allRatings)} */}
          <tbody>
            {allRatings.map((rating, index) => (
              <tr key={rating._id}>
                <td class="ordli">
                  {new Date(rating.postedOn).toLocaleString()}
                </td>
                <td class="ordli">{rating.postedBy.name}</td>
                <td class="ordli">{rating.postedBy.email}</td>
                <td class="ordli">{rating.star}</td>
                <td class="ordli">
                  <>
                    <Model
                      show={showModels[index]}
                      closeModel={() => handleModelToggle(index)}
                    >
                      <p>{rating.comment}</p>
                    </Model>
                    <p
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={() => handleModelToggle(index)}
                    >
                      {rating.comment.substring(0, 20)}
                    </p>
                  </>
                </td>
                <td class="ordli">
                  <Link to={`/product/${rating.product.slug}`}>
                    <div style={{ color: "blue", cursor: "pointer" }}>
                      {rating.product.title.substring(0, 20)}
                    </div>
                  </Link>
                </td>
                <td class="ordli">
                  <div
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => setcommentRead(rating.productId, rating._id)}
                  >
                    {rating.isRead ? "Read" : "Not Read"}
                  </div>
                </td>
                <td class="ordli">
                  <div
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() =>
                      deleteUserComment(rating.productId, rating._id)
                    }
                  >
                    Delete
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
