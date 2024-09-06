import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./Transectiontable.css";
import { getEntries, makeEntry, deleteEntry } from "../../../functions/admin";
import { toast } from "react-hot-toast";
import { ReactComponent as Crosssvg } from "../../../images/admin/cross.svg";

export default function Transectiontable() {
  const initialState = {
    Particulars: "",
    Debit: "",
    Credit: "",
  };
  const [newentry, setNewentry] = useState(initialState);

  const [entries, setEntries] = useState([]);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () =>
    getEntries(user.token).then((res) => {
      setEntries(res.data);
    });

  function showDate(orderDate) {
    const date = new Date(orderDate);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  }

  // new entry making system
  const handleChange = (e) => {
    setNewentry({ ...newentry, [e.target.name]: e.target.value });
  };

  const makeNewEntry = () => {
    makeEntry(newentry, user.token)
      .then((res) => {
        if (res.data.success) {
          toast.success("Entry added successfully");
          loadEntries();
          setNewentry(initialState);
        }
        if (res.data.error) {
          toast.error(res.data.error);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };
  const removeEntry = (id) => {
    deleteEntry(id, user.token)
      .then((res) => {
        if (res.data.success) {
          toast.success("Entry Removed successfully");
          loadEntries();

          console.log(res.data.deleted);
        }
        if (res.data.error) {
          toast.error(res.data.error);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };

  return (
    <>
      <div className="entrycont">
        <input
          placeholder="Particulars"
          type="text"
          name="Particulars"
          value={newentry.Particulars}
          onChange={handleChange}
        />
        <input
          placeholder="Debit ($)"
          type="number"
          name="Debit"
          value={newentry.Debit}
          onChange={handleChange}
        />
        <input
          placeholder="Credit ($)"
          type="number"
          name="Credit"
          value={newentry.Credit}
          onChange={handleChange}
        />
        <button onClick={makeNewEntry} className="mybtn btnprimary entrybtn">
          Submit
        </button>
      </div>
      <table className="TTtable">
        <thead>
          <tr>
            <th>Date</th>
            <th>Particulars</th>
            <th>Debit ($)</th>
            <th>Credit ($)</th>
            <th>Balance ($)</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>
                {showDate(entry.date)}
                {entry.editable && (
                  <div className="entrydelsvg">
                    <Crosssvg onClick={() => removeEntry(entry._id)} />
                  </div>
                )}
              </td>
              <td>{entry.particulars}</td>
              <td>{entry.debit === 0 ? "0" : entry.debit}</td>
              <td>{entry.credit ? entry.credit : ""}</td>
              <td>{entry.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
