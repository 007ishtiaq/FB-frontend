import React, { useState } from "react";
import { Modal, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { StarOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom";

// user side reviews edit button
const RatingModalMyRating = ({
  children,
  onModalok,
  setModalVisible,
  modalVisible,
  data,
  productId,
  setProductIdforreview,
  setStar,
  setComment,
}) => {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  let history = useHistory();
  let { slug } = useParams();

  const handleModal = () => {
    if (navigator.onLine) {
      if (user && user.token) {
        setModalVisible(true);
        setStar(data.star);
        setComment(data.comment);
        setProductIdforreview(productId);
      } else {
        history.push({
          pathname: "/login",
          state: { from: `/product/${slug}` },
        });
      }
    } else {
      dispatch({
        type: "SET_NETMODAL_VISIBLE",
        payload: true,
      });
    }
  };

  return (
    <>
      <div onClick={handleModal}>
        {" "}
        <div className="revieweditbtn">Edit</div>{" "}
      </div>
      <Modal
        title="Edit your rating"
        className="shippingheading reviewmodal"
        centered
        visible={modalVisible}
        onOk={() => {
          onModalok();
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
      >
        {children}
      </Modal>
    </>
  );
};

export default RatingModalMyRating;
