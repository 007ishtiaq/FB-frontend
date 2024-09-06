import React, { useState, useEffect } from "react";
import { getOptinEmails } from "../../../functions/optinEmail";
import { useSelector } from "react-redux";

export default function OptinEmails() {
  const [optinemails, setOptinemails] = useState([]);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = () =>
    getOptinEmails(user.token).then((res) => {
      setOptinemails(res.data);
    });

  return (
    <>
      <div>Opt-In Emails</div>
      <div>
        <table className="TTtable">
          <thead>
            <tr>
              <th class="ordli">Email</th>
              <th class="ordli">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {optinemails.map((email) => (
              <tr key={email._id}>
                <td class="ordli">{email.email}</td>
                <td class="ordli">{email.optedInAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
