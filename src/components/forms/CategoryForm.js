import React from "react";

const CategoryForm = ({ handleSubmit, name, setName, svg, setSvg, image }) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label>Name</label>
      <input
        type="text"
        className="form-control"
        onChange={(e) => setName(e.target.value)}
        value={name}
        autoFocus
        required
      />
      <label>SVG Image</label>
      <input
        type="text"
        className="form-control"
        onChange={(e) => setSvg(e.target.value)}
        value={svg}
        required
      />
      <br />
      <button disabled={!image} className="btn btn-outline-primary">
        Save
      </button>
    </div>
  </form>
);

export default CategoryForm;
