import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getContactform, setReplied } from "../../../functions/contact";
import { toast } from "react-hot-toast";
import AdminsideNavcopy from "../../../components/nav/AdminsideNavcopy";
import Switch from "../../../components/Switch/Switch";
import "./ContactFormSingle.css";

export default function ContactFormSingle({ match }) {
  const [form, setForm] = useState("");
  const [isReplied, setIsReplied] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  const { id } = match.params;

  useEffect(() => {
    loadContactform();
  }, [id, isReplied]);

  const loadContactform = () =>
    getContactform(id, user.token)
      .then((res) => {
        // console.log(JSON.stringify(res.data, null, 4));
        setForm(res.data);
        if (res.data) {
          setIsReplied(res.data.isReplied);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.status === 401 && "Unauthrised");
      });

  const setformReplied = () => {
    setReplied(form._id, user.token)
      .then((res) => {
        // console.log(res.data);
        setIsReplied(res.data.isReplied);
        toast.success("Replied Status Updated");
      })
      .catch((error) => {
        toast.error(`Replied Status failed`);
        console.error(error);
      });
  };
  return (
    <div class="manageacmaincont">
      <div class="manageaccont">
        <AdminsideNavcopy currentActive="ContactForms" />
        <div class="navrightside">
          <div className="formhead">
            <p>Contact Form</p>
          </div>
          <div className="formsub">
            <p>
              {" "}
              <span className="cformheading"> Name </span> {form.fullname}{" "}
            </p>
            <p>
              {" "}
              <span className="cformheading"> Subject </span> {form.subject}{" "}
            </p>
            <p>
              {" "}
              <span className="cformheading"> Email </span> {form.email}{" "}
            </p>
            <p>
              {" "}
              <span className="cformheading"> Text Massage </span> {form.text}{" "}
            </p>
            <p>
              {" "}
              <span className="cformheading"> Image </span>{" "}
              {form.image ? (
                <img class="cformimg" src={form.image.url} alt={form.email} />
              ) : (
                "No attachment"
              )}{" "}
            </p>
            <span className="actionswitchcform">
              <Switch checked={isReplied} handlechange={setformReplied} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
