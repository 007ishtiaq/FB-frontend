import React from "react";

const StatictextForm = ({
  handleSubmit,
  info1,
  info2,
  info3,
  setInfo1,
  setInfo2,
  setInfo3,
  identity,
  setIdentity,
  serialNum,
  setSerialNum,
}) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label>Identity</label>
      <input
        type="text"
        className="form-control"
        onChange={(e) => setIdentity(e.target.value)}
        value={identity}
        autoFocus
        required
      />
      <label>Serial Number</label>
      <input
        type="number"
        className="form-control"
        onChange={(e) => setSerialNum(e.target.value)}
        value={serialNum}
        required
      />
      <label>Info 1</label>
      <input
        type="text"
        className="form-control"
        onChange={(e) => setInfo1(e.target.value)}
        value={info1}
        required
      />
      <label>Info 2</label>
      <input
        type="text"
        className="form-control"
        onChange={(e) => setInfo2(e.target.value)}
        value={info2}
      />
      <label>Info 3</label>
      <input
        type="text"
        className="form-control"
        onChange={(e) => setInfo3(e.target.value)}
        value={info3}
      />
      <br />
      <button className="btn btn-outline-primary">Submit</button>
    </div>
  </form>
);

export default StatictextForm;
