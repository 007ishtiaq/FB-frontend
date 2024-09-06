import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createOrUpdateUser } from "../../functions/auth";
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
          const result = await auth.signInWithEmailLink(
            values.email,
            window.location.href
          );
          //   console.log("RESULT", result);
          if (result.user.emailVerified) {
            // remove user email fom local storage
            window.localStorage.removeItem("emailForRegistration");
            // get user id token
            let user = auth.currentUser;
            await user.updatePassword(values.password);
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
              })
              .catch();

            // redirect
            action.resetForm();
            history.push("/");
            setLoading(false);
          }
        } catch (error) {
          // console.log(error);
          setLoading(false);
          toast.error("No Internet Connection");
          setNoNetModal(true);
        }
      } else {
        setNoNetModal(true);
      }
    },
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
              <div class="guidetxt">Create your Password</div>
              <form onSubmit={handleSubmit} className="submitionform">
                <div class="logininputcont">
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
