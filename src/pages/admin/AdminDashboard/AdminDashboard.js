import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getSalesdata } from "../../../functions/admin";
import classes from "./AdminDashboard.module.css";
import Chart from "../../../components/Chart/Chart";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const [Yeardata, setYeardata] = useState();
  const [YearIncome, setYearIncome] = useState(0);
  const [MonthIncome, setMonthIncome] = useState(0);
  const [DayIncome, setDayIncome] = useState(0);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    getSalesdata(user.token)
      .then((res) => {
        console.log(JSON.stringify(res.data, null, 4));
        if (res.data.totalIncom.length > 0) {
          setYeardata(res.data.totalIncom);
        }
        if (res.data.totalIncom.length > 0) {
          setYearIncome(res.data.yearIncom[0].totalIncom);
        }
        if (res.data.monthIncom.length > 0) {
          setMonthIncome(res.data.monthIncom[0].totalIncom);
        }
        if (res.data.dailyIncom.length > 0) {
          setDayIncome(res.data.dailyIncom[0].totalIncom);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Unauthrised");
      });
  }, []);

  return (
    <div>
      <h4>Admin Dashboard & States</h4>
      <div className={classes.Home}>
        <div className={classes.IncomDetailes}>
          <div>
            <p>Today's Revenue</p>
            <h2>
              {DayIncome.toFixed(2)}
              <span>$</span>{" "}
            </h2>
          </div>
          <div>
            <p>This Month</p>
            <h2>
              {MonthIncome.toFixed(2)}
              <span>$</span>
            </h2>
          </div>
          <div>
            <p>This Year</p>
            <h2>
              {YearIncome.toFixed(2)}
              <span>$</span>{" "}
            </h2>
          </div>
        </div>

        {Yeardata && <Chart data={Yeardata} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
