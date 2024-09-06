import React, { useState, useEffect } from "react";
import ManageMyAccount from "../ManageMyAccount";
import { Online } from "react-detect-offline";
import { useDispatch } from "react-redux";
import "../UserProfile.css";
import { subscribeNewsletter, checkNewsSub } from "../../../functions/user";
import ProfileEditForm from "../../../components/forms/ProfileEditForm";
import ProfileEditModal from "../../../components/modal/ProfileEditModal";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// import { Link } from "react-router-dom";
import { saveUserProfile, getUserProfile } from "../../../functions/user";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { UserProfileSchema } from "../../../schemas";
import NewsletterModal from "../../../components/modal/NewsletterModal";
import Skeleton from "react-loading-skeleton";

export default function UserProfile() {
  const [modalVisible, setModalVisible] = useState(false);
  const [newsmodalVisible, setNewsModalVisible] = useState(false);
  const [newsSubscribed, setNewsSubscribed] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  let history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (navigator.onLine) {
      loadUserProfile();
    } else {
      dispatch({
        type: "SET_NETMODAL_VISIBLE",
        payload: true,
      });
    }
  }, [user, navigator.onLine]);

  const loadUserProfile = () => {
    if (user && user.token) {
      getUserProfile(user.token).then((a) => {
        setValues({ ...initialValues, ...a.data });
      });
    }
  };

  useEffect(() => {
    if (user && user.token) {
      checkNewsSub(user.token).then((res) => {
        if (res.data.ok) {
          setNewsSubscribed(true);
        }
      });
    }
  }, [user, navigator.onLine]);

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
    Name: "",
    Contact: "",
    DOB: "",
    Email: "",
    Gender: "",
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
    validationSchema: UserProfileSchema,
    onSubmit: async (values, action) => {
      if (navigator.onLine) {
        try {
          const res = await saveUserProfile(user.token, values);
          if (res) {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res,
                email: user.email,
                token: user.token,
                role: user.role,
                _id: user._id,
              },
            });
            toast.success("Profile saved");
            setModalVisible(false);
          }
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
      getUserProfile(user.token).then((a) => {
        setValues({ ...initialValues, ...a.data });
      });
    }
    setModalVisible(false);
  };
  const handleSubSubmit = () => {
    if (navigator.onLine) {
      if (user && user.token) {
        subscribeNewsletter(user.token)
          .then((res) => {
            if (res.data.message === "Email subscribed successfully") {
              toast.success("Newslestter subscribed successfully");
              setNewsSubscribed(true);
            } else if (res.data.message === "Email unsubscribed successfully") {
              toast.success("Newslestter unsubscribed successfully");
              setNewsSubscribed(false);
            }
          })
          .catch((err) => console.log("newsletter sub err", err));
      } else {
        history.push({
          pathname: "/login",
          state: { from: `/userprofile` },
        });
      }
    } else {
      setNewsModalVisible(false);
      dispatch({
        type: "SET_NETMODAL_VISIBLE",
        payload: true,
      });
    }
  };
  const handleSubcancel = () => {
    setNewsModalVisible(false);
  };

  return (
    <>
      <div class="manageacmainhead">My Profile</div>
      <div class="manageacmainbody">
        <div class="mainbodytop profileinfotop">
          <div class="profileinfo">
            <div class="profileinfohead">
              Full Name |{" "}
              <span onClick={handleModal} className="editbtn">
                Edit
              </span>
            </div>
            <div class="profileinfosub">
              {values.Email ? values.Name : <Skeleton />}
            </div>
          </div>

          <div class="profileinfo">
            <div class="profileinfohead">
              Contact Number |{" "}
              <span onClick={handleModal} className="editbtn">
                Edit
              </span>
            </div>
            <div class="profileinfosub">
              {values.Email ? values.Contact : <Skeleton />}
            </div>
          </div>
          <div class="profileinfo emailinfo">
            <div class="profileinfohead">Email Address </div>
            <div class="profileinfosub">
              {values.Email ? values.Email : <Skeleton />}
            </div>
          </div>
          <div class="profileinfo">
            <div class="profileinfohead">
              BirthDay |{" "}
              <span onClick={handleModal} className="editbtn">
                Edit
              </span>
            </div>
            <div class="profileinfosub">
              {values.Email ? values.DOB : <Skeleton />}
            </div>
          </div>
          <div class="profileinfo">
            <div class="profileinfohead">
              Gender |{" "}
              <span onClick={handleModal} className="editbtn">
                Edit
              </span>
            </div>
            <div class="profileinfosub">
              {values.Email ? values.Gender : <Skeleton />}
            </div>
          </div>
        </div>
        <div class="mainbodybelow">
          <div class="subnewsletter">
            <div class="previewprofiledata">
              <NewsletterModal
                onSubModalok={handleSubSubmit}
                onSubModalcancel={handleSubcancel}
                setNewsModalVisible={setNewsModalVisible}
                newsmodalVisible={newsmodalVisible}
                btnClasses={"nobtnstyle newsletterbtn"}
                newsSubscribed={newsSubscribed}
              >
                <div className="lettersubcont">
                  <p>
                    I have read and understood{" "}
                    <Link className="nobtnstyle" to="/PrivacyPolicy">
                      <p>Privacy Policy</p>
                    </Link>
                  </p>
                </div>
              </NewsletterModal>
            </div>
          </div>
          <Online onChange={loadUserProfile} />

          <div class="profilebuttonscont">
            <div class="btnscont profilebuttons">
              <ProfileEditModal
                onModalok={handleSubmit}
                onModalcancel={handlecancel}
                setModalVisible={setModalVisible}
                modalVisible={modalVisible}
                handleModal={handleModal}
              >
                <ProfileEditForm
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                />
              </ProfileEditModal>
              <Link to="/ManageMyAc?page=passwordReset">
                <button class="mybtn btnprimary buynowbtn profileeditbtn">
                  Change Password
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
