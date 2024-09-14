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
import Otpinput from "../../components/otpinput/Otpinput";
import { SendOTP } from "../../functions/auth";

const OtpVerification = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [noNetModal, setNoNetModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.token) history.push("/");
  }, [user, history]);

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
      if (navigator.onLine) {
        setLoading(true);

        verifyOTP(values)
          .then((response) => {
            if (response.status === 200) {
              toast.success("OTP verified successfully!");
              action.resetForm();
              setLoading(false);
              history.push("/register/complete");
            }
          })
          .catch((error) => {
            setLoading(false);
            toast.error(error.response.data.err || "Invalid OTP");
            // console.error("Error during OTP verification:", error);
          });
      } else {
        setLoading(false);
        // toast.error("No Internet Connection");
        setNoNetModal(true);
      }
    },
  });

  useEffect(() => {
    if (!window.localStorage.getItem("emailForRegistration")) history.push("/");
    // Retrieve email from local storage
    const storedEmail = window.localStorage.getItem("emailForRegistration");
    setUserEmail(window.localStorage.getItem("emailForRegistration"));
    // Set the email value using setValues
    setValues((prevValues) => ({ ...prevValues, email: storedEmail }));
  }, []);

  useEffect(() => {
    if (user && user.token) history.push("/");
  }, [user, history]);

  const resendOtp = async () => {
    if (navigator.onLine) {
      setLoading(true);
      try {
        const response = await SendOTP(values.email);
        if (response.status === 200) {
          toast.success(`OTP successfully resent to your email`);
          setLoading(false);
        } else {
          toast.error(response.data.error || "Error sending OTP");
        }
      } catch (error) {
        setLoading(false);
        toast.error(error.response.data.error || "Error sending OTP");
      }
    } else {
      setLoading(false);
      setNoNetModal(true);
    }
  };

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
              <div class="guidetxt">Enter OTP Sent to {userEmail}</div>
              <form onSubmit={handleSubmit} className="submitionform">
                <Otpinput setValues={setValues} />
                <div className="retrycont">
                  Don't get the code?{" "}
                  <button
                    className="mybtn btnsecond resendbtn"
                    onClick={resendOtp}
                    type="button"
                  >
                    Resend
                  </button>
                </div>
                <div class="submitbtncont">
                  <button
                    type="submit"
                    class="submitbtn"
                    disabled={values.otp.length !== 6 || isSubmitting}
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
