import React, { useState, useEffect } from "react";
import { auth, googleAuthProvider, facebookAuthProvider } from "../../firebase";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createOrUpdateUser, SendOTP } from "../../functions/auth";
import Spinner from "../../components/Spinner/Spinner";
import Smallspinner from "../../components/Spinner/Smallspinner";
import { ReactComponent as Logosvg } from "../../images/headersvgs/logosign.svg";
import { ReactComponent as Logotextblack } from "../../images/headersvgs/logotextblack.svg";
import "./Login.css";
import { useFormik } from "formik";
import { registerSchema } from "../../schemas";
import NoNetModal from "../../components/NoNetModal/NoNetModal";
import { ReactComponent as Googlesvg } from "../../images/login/google.svg";
import { ReactComponent as Facebooksvg } from "../../images/login/facebook.svg";

const Register = ({ history }) => {
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

  const roleBasedRedirect = (res) => {
    // check if intended
    let intended = history.location.state;
    if (intended) {
      history.push(intended.from);
    } else {
      if (res.data.role === "admin") {
        history.push("/AdminPanel?page=AdminDashboard");
      } else {
        history.push("/");
      }
    }
  };

  const googleLogin = async () => {
    if (navigator.onLine) {
      setLoading(true);
      auth
        .signInWithPopup(googleAuthProvider)
        .then(async (result) => {
          const { user } = result;
          const idTokenResult = await user.getIdTokenResult();
          createOrUpdateUser(idTokenResult.token)
            .then((res) => {
              dispatch({
                type: "LOGGED_IN_USER",
                payload: {
                  name: res.data.name,
                  email: res.data.email,
                  token: idTokenResult.token,
                  role: res.data.role,
                  _id: res.data._id,
                },
              });
              setLoading(false);
              roleBasedRedirect(res);
            })
            .catch((err) => {
              setLoading(false);
              console.log(err);
            });
          // history.push("/");
        })
        .catch((error) => {
          // console.log(err);
          if (
            error.message ===
            "A network error (such as timeout, interrupted connection or unreachable host) has occurred."
          ) {
            toast.error("Network Connection Error");
            setNoNetModal(true);
          } else if (
            error.message ===
            "The password is invalid or the user does not have a password."
          ) {
            toast.error("Invalid Credentials Or Try other Login Methods.");
          } else if (
            error.message ===
            "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address."
          ) {
            toast.error(
              "Account exists with different login credentials, Try other Login Methods."
            );
          } else if (
            error.message ===
            "There is no user record corresponding to this identifier. The user may have been deleted."
          ) {
            toast.error("Account Not found, Please Create your account.");
          } else {
            toast.error(error.message);
          }
          setLoading(false);
          setNoNetModal(true);
        });
    } else {
      setNoNetModal(true);
    }
  };

  const facebookLogin = async () => {
    if (navigator.onLine) {
      setLoading(true);
      auth
        .signInWithPopup(facebookAuthProvider)
        .then(async (result) => {
          const { user } = result;
          const idTokenResult = await user.getIdTokenResult();
          createOrUpdateUser(idTokenResult.token)
            .then((res) => {
              dispatch({
                type: "LOGGED_IN_USER",
                payload: {
                  name: res.data.name,
                  email: res.data.email,
                  token: idTokenResult.token,
                  role: res.data.role,
                  _id: res.data._id,
                },
              });
              roleBasedRedirect(res);
            })
            .catch((err) => {
              setLoading(false);
              console.log(err);
            });
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          if (
            error.message ===
            "A network error (such as timeout, interrupted connection or unreachable host) has occurred."
          ) {
            toast.error("Network Connection Error");
            setNoNetModal(true);
          } else if (
            error.message ===
            "The password is invalid or the user does not have a password."
          ) {
            toast.error("Invalid Credentials Or Try other Login Methods.");
          } else if (
            error.message ===
            "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address."
          ) {
            toast.error(
              "Account exists with different login credentials, Try other Login Methods."
            );
          } else if (
            error.message ===
            "There is no user record corresponding to this identifier. The user may have been deleted."
          ) {
            toast.error("Account Not found, Please Create your account.");
          } else {
            toast.error(error.message);
          }

          setNoNetModal(true);
        });
    } else {
      setNoNetModal(true);
    }
  };

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
        try {
          const response = await SendOTP(values.email);
          if (response.status === 200) {
            toast.success(`OTP sent to your email please Check your email.`);
            window.localStorage.setItem("emailForRegistration", values.email);
            action.resetForm();
            setLoading(false);
            history.push("/otpVerification");
          } else {
            toast.error(response.data.error || "Error sending OTP");
          }
        } catch (error) {
          setLoading(false);
          toast.error(error.response.data.error || "Error sending OTP");
          // console.error("Error sending sign-in link:", error);
        }
      } else {
        setLoading(false);
        // toast.error("No Internet Connection");
        setNoNetModal(true);
      }
    },
  });

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
                    <label for="email">Email</label>
                    <input
                      name="email"
                      id="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your email"
                      autoComplete="off"
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
                    Send OTP
                  </button>
                  <div className="navigatelink registernavlink">
                    Already have an account? <Link to={`/login`}>Login</Link>
                  </div>

                  <div className="socialheading">
                    <p>Or Login using your social accounts</p>
                  </div>
                  <button
                    class="submitbtn googlebtn"
                    onClick={googleLogin}
                    type="button"
                    disabled={loading || isSubmitting}
                  >
                    <div class="googlesvg">
                      <Googlesvg />
                    </div>
                    <div class="otherlogintxt">Log in with Google</div>
                  </button>
                  <button
                    class="submitbtn fbbtn"
                    onClick={facebookLogin}
                    type="button"
                    disabled={loading || isSubmitting}
                  >
                    <div class="fbsvg">
                      <Facebooksvg />
                    </div>
                    <div class="otherlogintxt">Log in with Facebook</div>
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

export default Register;
