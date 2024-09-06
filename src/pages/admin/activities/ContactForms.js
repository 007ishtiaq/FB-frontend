import React, { useState, useEffect } from "react";
import { getContactforms } from "../../../functions/contact";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ContactForms() {
  const [contactforms, setContactforms] = useState([]);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () =>
    getContactforms(user.token).then((res) => {
      setContactforms(res.data);
    });

  return (
    <>
      <div>Contact Forms</div>
      <div>
        <table className="TTtable">
          <thead>
            <tr>
              <th class="ordli">Submitted At</th>
              <th class="ordli">Full Name</th>
              <th class="ordli">Subject</th>
              <th class="ordli">Email</th>
              <th class="ordli">Text Massage</th>
              <th class="ordli">Attachment</th>
              <th class="ordli">Replied</th>
            </tr>
          </thead>
          <tbody>
            {contactforms.map((contact) => (
              <tr key={contact._id}>
                <td class="ordli">
                  {new Date(contact.createdAt).toLocaleString()}
                </td>
                <td class="ordli">{contact.fullname}</td>
                <td class="ordli">{contact.subject}</td>
                <td class="ordli">{contact.email}</td>
                <td class="ordli">{contact.text}</td>
                <td class="ordli">{contact.image ? "Yes" : "No"}</td>
                <td class="ordli">
                  <Link to={`/admin/contact/${contact._id}`}>
                    <div>{contact.isReplied ? "Yes" : "No"}</div>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
