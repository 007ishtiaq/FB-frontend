import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "antd";
import { StarOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom";

// on single Product page rating component below side
const RatingModal = ({
  children,
  onModalok,
  setModalVisible,
  modalVisible,
}) => {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  let history = useHistory();
  let { slug } = useParams();

  const handleModal = () => {
    if (navigator.onLine) {
      if (user && user.token) {
        setModalVisible(true);
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
        {user ? (
          <button class="postbtn">Write a customer review </button>
        ) : (
          <button class="postbtn">Login to Write a review </button>
        )}
      </div>
      <Modal
        title="Write a customer review"
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

export default RatingModal;
