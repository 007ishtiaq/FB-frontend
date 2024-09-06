import React, { useState, useEffect } from "react";
import { auth, googleAuthProvider, facebookAuthProvider } from "../../firebase";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createOrUpdateUser } from "../../functions/auth";
import Spinner from "../../components/Spinner/Spinner";
import Smallspinner from "../../components/Spinner/Smallspinner";
import { ReactComponent as Logotextblack } from "../../images/headersvgs/logotextblack.svg";
import { ReactComponent as Logosvg } from "../../images/headersvgs/logosign.svg";
import { ReactComponent as Googlesvg } from "../../images/login/google.svg";
import { ReactComponent as Facebooksvg } from "../../images/login/facebook.svg";
import "./Login.css";
import { useFormik } from "formik";
import { loginSchema } from "../../schemas";
import NoNetModal from "../../components/NoNetModal/NoNetModal";

const Login = ({ history }) => {
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
    let intended = history.location.state;
    console.log("intended is", intended);
    if (intended) {
      return;
    } else {
      if (user && user.token) history.push("/");
    }
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
          // console.log(error);
          setLoading(false);
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
            setNoNetModal(true);
          }
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
          // console.log(error);
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
            setNoNetModal(true);
          }
        });
    } else {
      setNoNetModal(true);
    }
  };

  // ---------formik usage--------

  const initialValues = {
    email: "ishtiaqahmad427427@gmail.com",
    password: "123456",
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
    validationSchema: loginSchema,
    onSubmit: async (values, action) => {
      if (navigator.onLine) {
        setLoading(true);
        try {
          const result = await auth.signInWithEmailAndPassword(
            values.email,
            values.password
          );
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
              action.resetForm();
            })
            .catch((err) => console.log(err));

          // history.push("/");
        } catch (error) {
          // console.log(error);
          setLoading(false);
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
            setNoNetModal(true);
          }
        }
      } else {
        setNoNetModal(true);
      }
    },
  });
  //below code not for 6 auth pages
  // dispatch({
  //   type: "SET_NETMODAL_VISIBLE",
  //   payload: true,
  // });

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
              <div class="guidetxt">Type your Email & Password to Login</div>
              <form onSubmit={handleSubmit} className="submitionform">
                <div class="logininputcont">
                  <div class="logininput">
                    <label for="email">Email</label>
                    <input
                      name="email"
                      id="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your email"
                      autoFocus
                      autoComplete="off"
                    />
                    {errors.email && touched.email ? (
                      <p className="errorstate">{errors.email}</p>
                    ) : null}
                  </div>
                  <div class="logininput">
                    <label for="password">Password</label>
                    <input
                      name="password"
                      id="password"
                      type="password"
                      autoComplete="off"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your password"
                    />
                    {errors.password && touched.password ? (
                      <p className="errorstate">{errors.password}</p>
                    ) : null}
                  </div>
                  <Link
                    to="/forgot/password"
                    className="forgotlink text-danger"
                  >
                    Forgot Password
                  </Link>
                </div>

                <div class="submitbtncont">
                  <button
                    class="submitbtn"
                    type="submit"
                    disabled={
                      !values.email ||
                      values.password.length < 6 ||
                      loading ||
                      isSubmitting
                    }
                  >
                    Continue
                  </button>
                  <div className="navigatelink">
                    New customer?{" "}
                    <Link to={`/register`}>Create your account</Link>
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
                For further support, you may visit the Help Center or contact
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

export default Login;
