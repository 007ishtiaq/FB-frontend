import React from "react";
import "./shippingForm.css";

export default function ProfileEditForm(props) {
  const { values, errors, touched, handleBlur, handleChange } = props;

  return (
    <div class="shippingsubcont">
      <form className="form">
        <div class="formheads">Personal Information</div>

        <div class="formsubcont">
          <div class="singleinput">
            <label for="full-name">Full Name:</label>
            <input
              placeholder="Contact Name*"
              name="Name"
              id="full-name"
              type="text"
              value={values.Name}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
            {errors.Name && touched.Name ? (
              <p class="errorstate">{errors.Name}</p>
            ) : null}
          </div>

          <div class="singleinput">
            <label for="contactno">Contact Details:</label>
            <input
              type="text"
              placeholder="Contact Number*"
              name="Contact"
              id="contactno"
              value={values.Contact}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
            {errors.Contact && touched.Contact ? (
              <p class="errorstate">{errors.Contact}</p>
            ) : null}
          </div>
          <div class="singleinput">
            <label for="DOB">Date of Birth:</label>
            <input
              placeholder="Date Of Birth*"
              name="DOB"
              id="DOB"
              type="date"
              value={values.DOB}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />
            {errors.DOB && touched.DOB ? (
              <p class="errorstate">{errors.DOB}</p>
            ) : null}
          </div>
          <div class="singleinput">
            <label for="Gender">Gender</label>
            <select
              id="Gender"
              name="Gender"
              value={values.Gender}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Please select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.Gender && touched.Gender ? (
              <p className="errorstate">{errors.Gender}</p>
            ) : null}
          </div>
          <div></div>
        </div>
      </form>
    </div>
  );
}
