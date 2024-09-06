import React from "react";
import { Modal } from "antd";

const ShippingModal = ({
  children,
  onModalok,
  onModalcancel,
  setModalVisible,
  modalVisible,
  handleModal,
}) => {
  return (
    <>
      <button
        onClick={handleModal}
        className="mybtn btnprimary atcbtn profileeditbtn"
      >
        Edit Profile
      </button>

      <Modal
        title="Edit Profile"
        className="shippingheading"
        centered
        visible={modalVisible}
        onOk={() => {
          onModalok();
        }}
        onCancel={() => {
          onModalcancel();
        }}
      >
        {children}
      </Modal>
    </>
  );
};

export default ShippingModal;
