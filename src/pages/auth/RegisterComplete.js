import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createOrUpdateUser, infoOTP } from "../../functions/auth";
import Spinner from "../../components/Spinner/Spinner";
import Smallspinner from "../../components/Spinner/Smallspinner";
import { ReactComponent as Logosvg } from "../../images/headersvgs/logosign.svg";
import { ReactComponent as Logotextblack } from "../../images/headersvgs/logotextblack.svg";
import "./Login.css";
import { useFormik } from "formik";
import { registercompleteSchema } from "../../schemas";
import NoNetModal from "../../components/NoNetModal/NoNetModal";

const RegisterComplete = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [noNetModal, setNoNetModal] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));
  let dispatch = useDispatch();

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

  let initialValues = {
    name: "",
    email: "",
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
    setValues,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: registercompleteSchema,
    onSubmit: async (values, action) => {
      if (navigator.onLine) {
        setLoading(true);
        try {
          const { name, email, password } = values;

          // Get OTP information before proceeding
          const otpResponse = await infoOTP(email);

          // console.log("otpResponse", otpResponse.data.otpRecord.isVerified);

          // Check if OTP is verified
          if (otpResponse.data.otpRecord.isVerified) {
            // Proceed with user registration if OTP is verified
            const result = await auth.createUserWithEmailAndPassword(
              email,
              password
            );

            if (result) {
              // Remove user email from local storage
              window.localStorage.removeItem("emailForRegistration");

              // Get user ID token
              let user = auth.currentUser;
              const idTokenResult = await user.getIdTokenResult();

              createOrUpdateUser(idTokenResult.token)
                .then((res) => {
                  dispatch({
                    type: "LOGGED_IN_USER",
                    payload: {
                      name: name,
                      email: res.data.email,
                      token: idTokenResult.token,
                      role: res.data.role,
                      _id: res.data._id,
                    },
                  });
                })
                .catch((error) => {
                  console.error("Error updating user in mongodb:", error);
                });

              // Reset form and redirect
              action.resetForm();
              history.push("/");
              setLoading(false);
            }
          } else {
            // OTP verification failed
            setLoading(false);
            toast.error("OTP verification failed. Please try again.");
          }
        } catch (error) {
          setLoading(false);
          console.error("Error completing registration:", error);
          if (
            error.message ===
            "The email address is already in use by another account."
          ) {
            toast.error("User Already Registered");
          } else {
            toast.error("Error completing registration.");
          }
        }
      } else {
        setNoNetModal(true);
      }
    },
  });

  useEffect(() => {
    if (!window.localStorage.getItem("emailForRegistration")) history.push("/");
    // Retrieve email from local storage
    const storedEmail = window.localStorage.getItem("emailForRegistration");
    // Set the email value using setValues
    setValues((prevValues) => ({ ...prevValues, email: storedEmail }));
  }, []);

  useEffect(() => {
    if (user && user.token) history.push("/");
  }, [user, history]);

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
              <div class="guidetxt">Create your Password</div>
              <form onSubmit={handleSubmit} className="submitionform">
                <div class="logininputcont">
                  <div class="logininput">
                    <label for="email">Name</label>
                    <input
                      name="name"
                      id="name"
                      type="text"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your Name"
                      autoComplete="off"
                    />
                    {errors.name && touched.name ? (
                      <p className="errorstate">{errors.name}</p>
                    ) : null}
                  </div>
                  <div class="logininput">
                    <label for="email">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={values.email}
                      disabled
                    />
                  </div>
                  <div class="logininput">
                    <label for="Password">Password</label>
                    <input
                      name="password"
                      id="password"
                      type="password"
                      autoComplete="off"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your New password"
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

                <div class="submitbtncont">
                  <button
                    class="submitbtn"
                    type="submit"
                    disabled={
                      values.password.length < 6 ||
                      !values.name ||
                      !values.email ||
                      !values.confim_password ||
                      isSubmitting
                    }
                  >
                    Complete Registration
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
                <div class="loginfooterlogosvg">
                  <Logosvg />
                </div>
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

export default RegisterComplete;
