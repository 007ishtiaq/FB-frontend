import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./contactus.css";
import Contactimg from "../../images/contactUs/contactimg.jpg";
import { ReactComponent as Callsvg } from "../../images/contactUs/calloutlined.svg";
import { ReactComponent as Mailsvg } from "../../images/contactUs/mail.svg";
import { ReactComponent as Locationsvg } from "../../images/contactUs/location.svg";
import { ReactComponent as Facebooksvg } from "../../images/contactUs/Facebookoutlined.svg";
import ContactAttachment from "../../components/forms/ContactAttachment";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { submitContact } from "../../functions/contact";
import { getRelatedStaticText } from "../../functions/staticText";
import { useFormik } from "formik";
import { ContactUsSchema } from "../../schemas";
import { LoadingOutlined } from "@ant-design/icons";

export default function ContactUs() {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const [staticTexts, setStaticTexts] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    getRelatedStaticText("contactpageinfo").then((t) => setStaticTexts(t.data));
  }, []);

  const htmlToRender = (htmlString) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };

  // ---------formik usage--------

  const initialValues = {
    fullname: "",
    subject: "",
    email: "",
    text: "",
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
    validationSchema: ContactUsSchema,
    onSubmit: async (values, action) => {
      if (navigator.onLine) {
        setLoading(true);
        submitContact({ contactForm: values, image })
          .then((res) => {
            setLoading(false);
            action.resetForm();
            setImage("");
            // Reset the value of the file input
            const fileInput = document.getElementById("contact-attachment");
            if (fileInput) {
              fileInput.value = "";
            }
            toast.success(`Form Submitted Successfully`);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            if (err.response.status === 400) toast.error(err.response.data);
          });
      } else {
        dispatch({
          type: "SET_NETMODAL_VISIBLE",
          payload: true,
        });
      }
    },
  });

  return (
    <main>
      <div class="contactmaincont">
        <div class="contacttopcont">
          <div class="contactheadcont">
            <p>Need Help ?</p>
          </div>
          <div class="contactsubcont">
            <div class="contectcont">
              <div class="contectcontleft">
                <div class="contectformcont">
                  <div>
                    <div class="ctaformheadline">
                      <p>
                        For any kind of questions, queries or suggestions feel
                        free to contact, we will be sure to get back to you as
                        soon as possible, We'd love to hear from you.
                      </p>
                    </div>
                    <form onSubmit={handleSubmit} class="ctaformfields">
                      <div>
                        <label for="full-name">Full Name:</label>
                        <input
                          id="full-name"
                          type="text"
                          placeholder=""
                          name="fullname"
                          value={values.fullname}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                        {errors.fullname && touched.fullname ? (
                          <p className="errorstate">{errors.fullname}</p>
                        ) : null}
                      </div>
                      <div>
                        <label for="subject">Subject:</label>
                        <input
                          id="subject"
                          type="text"
                          name="subject"
                          value={values.subject}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder=""
                          autoComplete="off"
                        />
                        {errors.subject && touched.subject ? (
                          <p className="errorstate">{errors.subject}</p>
                        ) : null}
                      </div>
                      <div>
                        <label for="email">Email address:</label>
                        <input
                          name="email"
                          id="email"
                          type="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder=""
                          autoComplete="off"
                        />
                        {errors.email && touched.email ? (
                          <p className="errorstate">{errors.email}</p>
                        ) : null}
                      </div>
                      <div>
                        <label for="textmassage">Your Message:</label>
                        <textarea
                          id="textmassage"
                          type="text"
                          placeholder=""
                          cols="30"
                          rows="7"
                          name="text"
                          value={values.text}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        ></textarea>
                        {errors.text && touched.text ? (
                          <p className="errorstate">{errors.text}</p>
                        ) : null}

                        <ContactAttachment
                          image={image}
                          setImage={setImage}
                          btnclasses={"btnattach"}
                        />
                        <div class="ctabtncont">
                          <button type="submit" class="mybtn btnprimary">
                            <span className="contactbtntxt">
                              {loading ? (
                                <div className="contactbtnload">
                                  <LoadingOutlined />
                                </div>
                              ) : (
                                "Submit"
                              )}
                            </span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div class="contectcontright">
                <div class="contectinfocont">
                  <div class="contectinfoabove">
                    <img src={Contactimg} alt="" />
                  </div>
                  <div className="contectinfohead">
                    <h4>Our Contact Information</h4>
                    <p>
                      Fill the form or contact us via other channels listed
                      below
                    </p>
                  </div>
                  <div class="contectinfobelow">
                    <div class="contectinfosub">
                      <div class="infosubline">
                        <span>
                          <Callsvg></Callsvg>
                        </span>
                        <p>
                          {staticTexts &&
                            staticTexts.length > 0 &&
                            staticTexts[0].info1}
                        </p>
                      </div>
                      <div class="infosubline">
                        <span>
                          <Mailsvg></Mailsvg>
                        </span>
                        <p>
                          {staticTexts &&
                            staticTexts.length > 0 &&
                            staticTexts[1].info1}
                        </p>
                      </div>
                      <div class="infosubline">
                        <span>
                          <Locationsvg></Locationsvg>
                        </span>
                        <p>
                          {staticTexts &&
                            staticTexts.length > 0 &&
                            staticTexts[2].info1}
                        </p>
                      </div>
                      <div class="infosubline">
                        <span>
                          <Facebooksvg></Facebooksvg>
                        </span>
                        <p>
                          {staticTexts &&
                            staticTexts.length > 0 &&
                            staticTexts[3].info1}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="contactbelowcont">
          <div class="qnasectiontagline">
            <p>Frequently Asked Qestions</p>
          </div>
          <div class="contactqnacont">
            <div class="contactqnahead">
              {staticTexts && staticTexts.length > 0 && staticTexts[4].info1}
            </div>
            <div class="contactqnasub">
              {htmlToRender(
                staticTexts && staticTexts.length > 0 && staticTexts[4].info2
              )}
            </div>
          </div>
          <div class="contactqnacont">
            <div class="contactqnahead">
              {staticTexts && staticTexts.length > 0 && staticTexts[5].info1}
            </div>
            <div class="contactqnasub">
              {htmlToRender(
                staticTexts && staticTexts.length > 0 && staticTexts[5].info2
              )}
            </div>
          </div>
          <div class="contactqnacont">
            <div class="contactqnahead">
              {staticTexts && staticTexts.length > 0 && staticTexts[6].info1}
            </div>
            <div class="contactqnasub">
              {htmlToRender(
                staticTexts && staticTexts.length > 0 && staticTexts[6].info2
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
