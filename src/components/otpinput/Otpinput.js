import React, { useState, useRef } from "react";
import "./Otpinput.css";

export default function Otpinput({ setValues }) {
  const [otpValues, setOtpValues] = useState({
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
    digit5: "",
    digit6: "",
  });

  const inputRefs = {
    digit1: useRef(null),
    digit2: useRef(null),
    digit3: useRef(null),
    digit4: useRef(null),
    digit5: useRef(null),
    digit6: useRef(null),
  };

  const handleChange = (e, nextRef, prevRef) => {
    const { name, value } = e.target;

    // Allow only digits
    if (value.length > 1 || isNaN(value)) return;

    // Update local state
    const newOtpValues = { ...otpValues, [name]: value };
    setOtpValues(newOtpValues);

    // Concatenate all the digits and update Formik's OTP field
    const otpString = Object.values(newOtpValues).join("");
    setValues((prevValues) => ({ ...prevValues, otp: otpString }));

    // Move to the next or previous input field
    if (value && nextRef) {
      nextRef.current.focus();
    } else if (e.nativeEvent.inputType === "deleteContentBackward" && prevRef) {
      prevRef.current.focus();
    }
  };

  return (
    <div className="otpcont">
      <form className="digit-group" autoComplete="off">
        <input
          type="text"
          className="otpdigit"
          name="digit1"
          maxLength={1}
          value={otpValues.digit1}
          onChange={(e) => handleChange(e, inputRefs.digit2, null)}
          ref={inputRefs.digit1}
        />
        <input
          type="text"
          className="otpdigit"
          name="digit2"
          maxLength={1}
          value={otpValues.digit2}
          onChange={(e) => handleChange(e, inputRefs.digit3, inputRefs.digit1)}
          ref={inputRefs.digit2}
        />
        <input
          type="text"
          className="otpdigit"
          name="digit3"
          maxLength={1}
          value={otpValues.digit3}
          onChange={(e) => handleChange(e, inputRefs.digit4, inputRefs.digit2)}
          ref={inputRefs.digit3}
        />
        <span className="splitter">–</span>
        <input
          type="text"
          className="otpdigit"
          name="digit4"
          maxLength={1}
          value={otpValues.digit4}
          onChange={(e) => handleChange(e, inputRefs.digit5, inputRefs.digit3)}
          ref={inputRefs.digit4}
        />
        <input
          type="text"
          className="otpdigit"
          name="digit5"
          maxLength={1}
          value={otpValues.digit5}
          onChange={(e) => handleChange(e, inputRefs.digit6, inputRefs.digit4)}
          ref={inputRefs.digit5}
        />
        <input
          type="text"
          className="otpdigit"
          name="digit6"
          maxLength={1}
          value={otpValues.digit6}
          onChange={(e) => handleChange(e, null, inputRefs.digit5)}
          ref={inputRefs.digit6}
        />
      </form>
    </div>
  );
}
