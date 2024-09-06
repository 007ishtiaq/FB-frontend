import React, { useState } from "react";
import { auth } from "../../../firebase";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import "../../auth/Login.css";
import Spinner from "../../../components/Spinner/Spinner";
import { useFormik } from "formik";
import { resetpassSchema } from "../../../schemas";

const Password = () => {
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

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
      if (user && user.role === "admin") {
        setLoading(true);

        await auth.currentUser
          .updatePassword(values.password)
          .then(() => {
            setLoading(false);
            action.resetForm();
            toast.success("Password updated");
          })
          .catch((err) => {
            setLoading(false);
            toast.error(err.message);
          });
      }
    },
  });

  return (
    <div className="col">
      {loading ? <Spinner /> : <h4>Password Update</h4>}
      <form onSubmit={handleSubmit}>
        <div class="logininputcont">
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
              <p>{errors.password}</p>
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
              <p>{errors.confim_password}</p>
            ) : null}
          </div>
        </div>

        <div class="submitbtncont">
          <button
            type="submit"
            class="submitbtn"
            disabled={
              !values.password ||
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
