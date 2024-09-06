import React from "react";

const CategoryForm = ({
  handleSubmit,
  name,
  setName,
  identity,
  setIdentity,
  bannerNum,
  setBannerNum,
  link,
  setLink,
  image,
}) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label>Banner Identity</label>
      <input
        type="text"
        className="form-control"
        onChange={(e) => setIdentity(e.target.value)}
        value={identity}
        autoFocus
        required
      />
      <label>Banner Number</label>
      <input
        type="number"
        className="form-control"
        onChange={(e) => setBannerNum(e.target.value)}
        value={bannerNum}
        required
      />
      <label>Banner Name</label>
      <input
        type="text"
        className="form-control"
        onChange={(e) => setName(e.target.value)}
        value={name}
        required
      />
      <label>Banner Link</label>
      <input
        type="text"
        className="form-control"
        onChange={(e) => setLink(e.target.value)}
        value={link}
      />
      <br />
      <button disabled={!image} className="btn btn-outline-primary">
        Submit
      </button>
    </div>
  </form>
);

export default CategoryForm;
