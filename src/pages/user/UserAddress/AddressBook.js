import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Online } from "react-detect-offline";
import ManageMyAccount from "../ManageMyAccount";
import "../UserProfile.css";
import "./AddressBook.css";
import "../../../components/forms/shippingForm.css";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
// import { Link } from "react-router-dom";
import { saveUserAddress, getUserAddress } from "../../../functions/user";
import { toast } from "react-hot-toast";
import ShippingModal from "../../../components/modal/ShippingModal";
import ShippingFormAddressbook from "../../../components/forms/ShippingFormAddressbook";
import { ReactComponent as Downbtnsvg } from "../../../images/manageacUser/downbtn.svg";
import { useFormik } from "formik";
import { UserAddressSchema } from "../../../schemas";

export default function AddressBook() {
  const [modalVisible, setModalVisible] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  let history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (navigator.onLine) {
      loadUserAddress();
    } else {
      dispatch({
        type: "SET_NETMODAL_VISIBLE",
        payload: true,
      });
    }
  }, [user, Online]);

  const loadUserAddress = () => {
    if (user && user.token) {
      getUserAddress(user.token).then((a) => {
        setValues({ ...initialValues, ...a.data });
      });
    }
  };

  const handleModal = () => {
    if (user && user.token) {
      setModalVisible(true);
    } else {
      history.push({
        pathname: "/login",
        state: { from: `/userprofile` },
      });
    }
  };

  // ---------formik usage--------

  const initialValues = {
    Address: "",
    City: "",
    Province: "",
    Area: "",
    LandMark: "",
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: UserAddressSchema,
    onSubmit: async (values, action) => {
      if (navigator.onLine) {
        try {
          saveUserAddress(user.token, values)
            .then((res) => {
              if (res.data.ok) {
                toast.success("Address saved");
                setModalVisible(false);
              }
            })
            .catch((err) => console.log("cart save err", err));
        } catch (error) {
          console.error(error);
          setModalVisible(false);
          // Handle errors if necessary
        }
      } else {
        setModalVisible(false);
        dispatch({
          type: "SET_NETMODAL_VISIBLE",
          payload: true,
        });
      }
    },
  });

  const handlecancel = () => {
    if (user && user.token) {
      getUserAddress(user.token).then((a) => {
        setValues({ ...initialValues, ...a.data });
      });
    }
    setModalVisible(false);
  };

  return (
    <>
      <div class="manageacmainhead">Shipping Address</div>
      <div class="manageacmainbody adrbooksub">
        {values.Address ? (
          <div class="mainbodytop addressinfotop">
            <div class="profileinfo Addressinfo">
              <div class="profileinfohead">
                Address |{" "}
                <span onClick={handleModal} className="editbtn">
                  Edit
                </span>
              </div>
              <div class="profileinfosub">{values.Address}</div>
            </div>
            <div class="profileinfo">
              <div class="profileinfohead">
                City |{" "}
                <span onClick={handleModal} className="editbtn">
                  Edit
                </span>
              </div>
              <div class="profileinfosub">{values.City}</div>
            </div>
            <div class="profileinfo">
              <div class="profileinfohead">
                Province |{" "}
                <span onClick={handleModal} className="editbtn">
                  Edit
                </span>
              </div>
              <div class="profileinfosub">{values.Province}</div>
            </div>
            <div class="profileinfo">
              <div class="profileinfohead">
                Area |{" "}
                <span onClick={handleModal} className="editbtn">
                  Edit
                </span>
              </div>
              <div class="profileinfosub">{values.Area}</div>
            </div>
            <div class="profileinfo">
              <div class="profileinfohead">
                LandMark |{" "}
                <span onClick={handleModal} className="editbtn">
                  Edit
                </span>
              </div>
              <div class="profileinfosub">{values.LandMark}</div>
            </div>
          </div>
        ) : (
          <div className="emptyaddressline">
            <div className="Downbtnsvgcont">
              <Downbtnsvg></Downbtnsvg>
            </div>
            <p className="noadrtext">
              {" "}
              To add Shipping Address Click below button{" "}
            </p>
          </div>
        )}
        <Online onChange={loadUserAddress} />

        <div class="mainbodybelow">
          <div class="profilebuttonscont">
            <div class="btnscont profilebuttons">
              <ShippingModal
                onModalok={handleSubmit}
                onModalcancel={handlecancel}
                setModalVisible={setModalVisible}
                modalVisible={modalVisible}
                values={values}
                btnClasses={
                  "mybtn btnprimary buynowbtn profileeditbtn adrbookpagemodal"
                }
              >
                <ShippingFormAddressbook
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                />
              </ShippingModal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
