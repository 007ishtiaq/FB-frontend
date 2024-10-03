import React from "react";

const AdminReviewAddForm = ({
  handleSubmit,
  productId,
  setProductId,
  posterName,
  setPosterName,
  postedDate,
  setPostedDate,
  star,
  setStar,
  comment,
  setComment,
}) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label>Product ID</label>
      <input
        type="text"
        className="form-control"
        onChange={(e) => setProductId(e.target.value)}
        value={productId}
        required
      />
      <label>User Name</label>
      <input
        type="text"
        className="form-control"
        onChange={(e) => setPosterName(e.target.value)}
        autoFocus
        value={posterName}
        required
      />
      <label>Posted Date (Exp: 13 sep 2024) [Default is Today Date]</label>
      <input
        type="text"
        className="form-control"
        onChange={(e) => setPostedDate(e.target.value)}
        value={postedDate}
        required
      />
      <label>Stars [0 - 5]</label>
      <input
        type="number"
        className="form-control"
        onChange={(e) => setStar(e.target.value)}
        value={star}
        required
      />
      <label>Comment</label>
      <textarea
        type="text"
        className="form-control"
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        rows="7"
        required
      />
      <br />
      <button
        disabled={!productId || !star || !comment}
        className="btn btn-outline-primary"
      >
        Save
      </button>
    </div>
  </form>
);

export default AdminReviewAddForm;
