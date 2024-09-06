import React, { useState } from "react";
import { Modal } from "antd";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const ItemActioninfoModel = ({
  children,
  // onModalok,
  setModalVisible,
  modalVisible,
  showActionInfo,
  currentinfo,
  prodId,
  setReturnForm,
}) => {
  const { user } = useSelector((state) => ({ ...state }));

  let history = useHistory();

  const handleModal = () => {
    if (user && user.token) {
      showActionInfo(prodId, currentinfo);
      setModalVisible();
    } else {
      history.push("/login");
    }
  };

  const initialValues = {
    RAnumber: "",
    quantity: "",
    reasonForReturn: "",
    otherReasonText: "",
    conditionOfProduct: "",
    preferredResolution: "",
    declaration: "",
    createdAt: "",
  };

  return (
    <>
      {currentinfo === "cancel" ? (
        <div className="cnlcircle" onClick={handleModal}></div>
      ) : (
        <div className="rtncircle" onClick={handleModal}></div>
      )}

      <Modal
        title="Submitted Action Details by Customer"
        className="shippingheading"
        centered
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
          setTimeout(() => {
            setReturnForm(initialValues);
          }, 500);
        }}
        onCancel={() => {
          setModalVisible(false);
          setTimeout(() => {
            setReturnForm(initialValues);
          }, 500);
        }}
      >
        {children}
      </Modal>
    </>
  );
};

export default ItemActioninfoModel;
