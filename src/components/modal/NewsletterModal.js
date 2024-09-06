import React, { useState } from "react";
import { Modal } from "antd";
import { useSelector } from "react-redux";
import { StarOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom";

const NewsletterModal = ({
  children,
  onSubModalok,
  onSubModalcancel,
  setNewsModalVisible,
  newsmodalVisible,
  btnClasses,
  newsSubscribed,
}) => {
  const { user } = useSelector((state) => ({ ...state }));

  let history = useHistory();
  let { slug } = useParams();

  const handleModal = () => {
    if (user && user.token) {
      setNewsModalVisible(true);
    } else {
      history.push({
        pathname: "/login",
      });
    }
  };

  return (
    <>
      <button onClick={handleModal} className={btnClasses}>
        <p> Subsribe to our Newsletter</p>
      </button>

      <Modal
        title="Newsletter Subscription"
        className="shippingheading subcribemodal"
        centered
        visible={newsmodalVisible}
        onOk={() => {
          onSubModalok();
        }}
        onCancel={() => {
          onSubModalcancel();
        }}
        okText={newsSubscribed ? "Unsubscribe" : "Subscribe"}
      >
        {children}
      </Modal>
    </>
  );
};

export default NewsletterModal;
