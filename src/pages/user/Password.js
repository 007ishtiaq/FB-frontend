import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import "../auth/Login.css";
import "./Passwordreset.css";
import Spinner from "../../components/Spinner/Spinner";
import Smallspinner from "../../components/Spinner/Smallspinner";
import { useFormik } from "formik";
import { resetpassSchema } from "../../schemas";
import { ReactComponent as Passwordlock } from "../../images/manageacUser/passwordlock.svg";
import NoNetModal from "../../components/NoNetModal/NoNetModal";

//user side password reset
const Password = () => {
  const [loading, setLoading] = useState(false);
  const [noNetModal, setNoNetModal] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleOnlineStatus = () => {
      if (navigator.onLine) {
        setNoNetModal(false);
      }
    };
    window.addEventListener("online", handleOnlineStatus);
    return () => {
      window.removeEventListener("online", handleOnlineStatus);
    };
  }, []);

  // ---------formik usage--------

  const initialValues = {
    password: "",
    confim_password: "",
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: resetpassSchema,
    onSubmit: async (values, action) => {
      if (navigator.onLine) {
        setLoading(true);
        await toast.promise(auth.currentUser.updatePassword(values.password), {
          loading: "Updating password...",
          success: () => {
            setLoading(false);
            action.resetForm();
            return "Password updated";
          },
          error: (err) => {
            setLoading(false);
            return err.message;
          },
        });
      } else {
        setNoNetModal(true);
      }
    },
  });

  return (
    <div className="col">
      <h4>Password Update</h4>
      <form onSubmit={handleSubmit} className="submitionform">
        <div class="logininputcont passinputcont">
          {loading ? (
            <div>
              <div className="bigspinner">
                <Spinner />
              </div>
              <div className="smallspinner">
                <Smallspinner />
              </div>
            </div>
          ) : (
            <div className="passlocksvg">
              <Passwordlock />
            </div>
          )}
          <div class="logininput">
            <label for="password">Your New Password</label>
            <input
              name="password"
              id="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter new password"
              autoFocus
            />
            {errors.password && touched.password ? (
              <p className="errorstate">{errors.password}</p>
            ) : null}
          </div>
          <div class="logininput">
            <label for="confim_password">Confirm Password</label>
            <input
              name="confim_password"
              id="confim_password"
              type="password"
              value={values.confim_password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm Password"
            />
            {errors.confim_password && touched.confim_password ? (
              <p className="errorstate">{errors.confim_password}</p>
            ) : null}
          </div>
        </div>

        <NoNetModal
          classDisplay={`${noNetModal && "open-popup"}`}
          setNoNetModal={setNoNetModal}
          handleRetry={handleSubmit}
        ></NoNetModal>

        <div class="submitbtncont passresetbtncont">
          <button
            type="submit"
            class="submitbtn passresetbtn"
            disabled={
              !values.password ||
              !values.confim_password ||
              values.password.length < 6 ||
              loading ||
              isSubmitting
            }
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Password;
