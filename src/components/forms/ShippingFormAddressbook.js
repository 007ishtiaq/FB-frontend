import React, { useEffect } from "react";
import "./shippingForm.css";

export default function ShippingFormAddressbook(props) {
  const { values, errors, touched, handleBlur, handleChange } = props;

  return (
    <div class="shippingsubcont">
      <form className="form shippingform">
        <div class="formsubcont formsubcont2">
          <div class="singleinput inputfullwidth">
            <label for="Address">Shipping Address:</label>
            <input
              name="Address"
              id="Address"
              type="text"
              placeholder="Complete Address*"
              value={values.Address}
              onBlur={handleBlur}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.Address && touched.Address ? (
              <p class="errorstate">{errors.Address}</p>
            ) : null}
          </div>

          <div class="singleinput">
            <label for="City">City:</label>
            <input
              name="City"
              id="City"
              type="text"
              placeholder="City*"
              value={values.City}
              onBlur={handleBlur}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.City && touched.City ? (
              <p class="errorstate">{errors.City}</p>
            ) : null}
          </div>

          <div class="singleinput">
            <label for="Province">Province:</label>
            <input
              type="text"
              placeholder="Province*"
              name="Province"
              id="Province"
              value={values.Province}
              onBlur={handleBlur}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.Province && touched.Province ? (
              <p class="errorstate">{errors.Province}</p>
            ) : null}
          </div>

          <div class="singleinput">
            <label for="Area">Area:</label>
            <input
              type="text"
              placeholder="Area / Block (optional)"
              name="Area"
              id="Area"
              value={values.Area}
              onBlur={handleBlur}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div class="singleinput">
            <label for="LandMark">LandMark:</label>
            <input
              type="text"
              placeholder="Land Mark (optional)"
              name="LandMark"
              id="LandMark"
              value={values.LandMark}
              onBlur={handleBlur}
              onChange={handleChange}
              autoComplete="off"
            ></input>
          </div>
        </div>
      </form>
    </div>
  );
}
