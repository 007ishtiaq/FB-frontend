import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";
import { StarOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom";
import { ReactComponent as Editsvg } from "../../images/productpage/edit.svg";
import { ReactComponent as AddAdrsvg } from "../../images/productpage/addaddress.svg";
import "./ShippingModal.css";

const ShippingModal = ({
  children,
  onModalok,
  onModalcancel,
  setModalVisible,
  modalVisible,
  values,
  btnClasses,
  identity,
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
          state: { from: `product/${slug}` },
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
      <button onClick={handleModal} className={btnClasses}>
        {!values.Address ? (
          <div className="adrchangesvg">
            <div>
              <div className="btnsvg prodsidesvg">
                <AddAdrsvg />
              </div>
              <p className="btntext textadd">Add</p>
            </div>
          </div>
        ) : (
          <div className="adrchangesvg">
            {
              <div>
                <div className="btnsvg prodsidesvg">
                  <Editsvg />
                </div>
                <div className="btntext textchange">Change</div>
              </div>
            }
          </div>
        )}
      </button>

      <Modal
        title="Shipping Address"
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
