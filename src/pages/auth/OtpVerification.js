import React, { useState, useEffect } from "react";
import { auth, googleAuthProvider, facebookAuthProvider } from "../../firebase";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP } from "../../functions/auth";
import Spinner from "../../components/Spinner/Spinner";
import Smallspinner from "../../components/Spinner/Smallspinner";
import { ReactComponent as Logosvg } from "../../images/headersvgs/logosign.svg";
import { ReactComponent as Logotextblack } from "../../images/headersvgs/logotextblack.svg";
import "./Login.css";
import { useFormik } from "formik";
import { otpSchema } from "../../schemas";
import NoNetModal from "../../components/NoNetModal/NoNetModal";
import { ReactComponent as Googlesvg } from "../../images/login/google.svg";
import { ReactComponent as Facebooksvg } from "../../images/login/facebook.svg";

const OtpVerification = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [noNetModal, setNoNetModal] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

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
    otp: "",
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
    validationSchema: otpSchema,
    onSubmit: async (values, action) => {
      verifyOTP(values)
        .then((response) => {
          if (response.status === 200) {
            toast.success("OTP verified successfully!");

            // Redirect to Register Complete page
            history.push("/register/complete");
          }
        })
        .catch((error) => {
          // Log any errors caught during the request
          console.error("Error during OTP verification:", error);
          toast.error(error.response.data.err || "Invalid OTP");
        });

      // if (navigator.onLine) {
      // setLoading(true);
      // try {
      //   const response = await verifyOTP(values);
      //   if (response.status === 200) {
      //     toast.success("OTP verified successfully!");
      //     action.resetForm();
      //     setLoading(false);
      // rediect to register complete
      // navigate('/register-complete');
      // } else {
      //   console.log("response.data.error", response.data.error);
      //   toast.error(response.data.message || "Invalid OTP");
    },
    // } catch (error) {
    //   console.log("error", error);
    //   setLoading(false);
    // toast.error("No Internet Connection");
    // setNoNetModal(true);
    // }
    // },
  });

  useEffect(() => {
    // Retrieve email from local storage
    const storedEmail = window.localStorage.getItem("emailForRegistration");
    // Set the email value using setValues
    setValues((prevValues) => ({ ...prevValues, email: storedEmail }));
  }, []);

  return (
    <div className="container">
      <div className="row">
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
              <div class="guidetxt">Type your Email for Registration</div>
              <form onSubmit={handleSubmit} className="submitionform">
                <div class="logininputcont">
                  <div class="logininput registerinputcont">
                    <label for="otp">OTP</label>
                    <input
                      name="otp"
                      id="otp"
                      type="text"
                      value={values.otp}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your OTP"
                      autoComplete="off"
                      autoFocus
                    />
                    {errors.otp && touched.otp ? (
                      <p className="errorstate">{errors.otp}</p>
                    ) : null}
                  </div>
                </div>
                <div class="submitbtncont">
                  <button
                    type="submit"
                    class="submitbtn"
                    disabled={!values.otp || isSubmitting}
                  >
                    Verify OTP
                  </button>
                  <div className="navigatelink registernavlink">
                    Already have an account? <Link to={`/login`}>Login</Link>
                  </div>
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
                For further support, you may visit the Help Center or contact{" "}
                our customer service team.
              </div>
              <div class="loginfooterlogocont">
                <div class="loginfooterlogotxt">
                  <Logotextblack />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
