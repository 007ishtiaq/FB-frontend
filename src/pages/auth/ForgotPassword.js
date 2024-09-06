import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import "./Login.css";
import Spinner from "../../components/Spinner/Spinner";
import Smallspinner from "../../components/Spinner/Smallspinner";
import { ReactComponent as Logosvg } from "../../images/headersvgs/logosign.svg";
import { ReactComponent as Logotextblack } from "../../images/headersvgs/logotextblack.svg";
import { useFormik } from "formik";
import { registerSchema } from "../../schemas";
import NoNetModal from "../../components/NoNetModal/NoNetModal";

const ForgotPassword = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [noNetModal, setNoNetModal] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

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

  useEffect(() => {
    if (user && user.token) history.push("/");
  }, [user, history]);

  // ---------formik usage--------

  const initialValues = {
    email: "",
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
    validationSchema: registerSchema,
    onSubmit: async (values, action) => {
      if (navigator.onLine) {
        setLoading(true);
        const config = {
          url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT,
          handleCodeInApp: true,
        };

        await auth
          .sendPasswordResetEmail(values.email, config)
          .then(() => {
            action.resetForm();
            setLoading(false);
            toast.success("Check your email for password reset link");
          })
          .catch((error) => {
            setLoading(false);
            toast.error("No Internet Connection");
            setNoNetModal(true);
            // console.log("ERROR IN FORGOT PASSWORD", error);
          });
      } else {
        setNoNetModal(true);
      }
    },
  });

  return (
    <div class="loginmain">
      <div class="logincont">
        <div class="loginheadside">
          <div className="topsign">
            {loading ? (
              <div className="spinnerwraper">
                <div className="bigspinner">
                  <Spinner />
                </div>
                <div className="smallspinner loginside">
                  <Smallspinner />
                </div>
              </div>
            ) : (
              <div class="loginlogo">
                <Logosvg />
              </div>
            )}
          </div>
          <div class="welcometxt">Welcome to Appliance Bazar</div>
          <div class="guidetxt">Type your Email to Recover Password</div>

          <form onSubmit={handleSubmit} className="submitionform">
            <div class="logininputcont">
              <div class="logininput">
                <label for="email">Your Email</label>
                <input
                  name="email"
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your email"
                  autoComplete="off"
                  autoFocus
                />
                {errors.email && touched.email ? (
                  <p className="errorstate">{errors.email}</p>
                ) : null}
              </div>
            </div>

            <div class="submitbtncont">
              <button
                type="submit"
                class="submitbtn"
                disabled={!values.email || isSubmitting}
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        <NoNetModal
          classDisplay={`${noNetModal && "open-popup"}`}
          setNoNetModal={setNoNetModal}
          handleRetry={handleSubmit}
        ></NoNetModal>

        <div class="loginfooter">
          <div class="loginfootertxt">
            For further support, you may visit the Help Center or contact our
            customer service team.
          </div>
          <div class="loginfooterlogocont">
            <div class="loginfooterlogotxt">
              <Logotextblack />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
