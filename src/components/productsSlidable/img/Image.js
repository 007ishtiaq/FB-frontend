import React from "react";

const Img = (props) => {
  const { src, alt, ...actions } = props;
  return (
    <span className={props.stockstatus}>
      <span className={`stockouttext ${props.stockstatus && "active"}`}>
        Out Of Stock
      </span>
      <img {...actions} src={`${src}`} alt={alt} />
    </span>
  );
};

export default Img;
