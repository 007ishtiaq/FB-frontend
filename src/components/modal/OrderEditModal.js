import React, { useState } from "react";
import { Modal } from "antd";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const OrderEditModal = ({
  children,
  onModalok,
  setModalVisible,
  modalVisible,
  dataSet,
  prodId,
  productId,
  btnClasses,
}) => {
  const { user } = useSelector((state) => ({ ...state }));

  let history = useHistory();

  const handleModal = () => {
    if (user && user.token) {
      dataSet(prodId);
      setModalVisible();
    } else {
      history.push("/login");
    }
  };

  return (
    <>
      <button onClick={handleModal} className={btnClasses}>
        Edit
      </button>

      <Modal
        title="Edit Order"
        className="shippingheading"
        centered
        visible={modalVisible}
        onOk={() => {
          onModalok(prodId, productId);
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
      >
        {children}
      </Modal>
    </>
  );
};

export default OrderEditModal;
