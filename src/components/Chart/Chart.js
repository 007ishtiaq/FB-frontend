import React from "react";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  ResponsiveContainer,
} from "recharts";
import classes from "./Chart.module.css";
import "./Chart.css";

const Chart = ({ data }) => {
  const chartdata =
    data &&
    data.map((el) => {
      return {
        name: `Month ${el._id}`,
        Income: el.totalIncom,
      };
    });

  return (
    <div className={classes.Chart}>
      <h2>Income report for this year</h2>

      <ResponsiveContainer className={classes.Rchart} width="100%" height={500}>
        <BarChart width={500} height={300} data={chartdata}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis dx={-50} />
          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              backgroundColor: "#444",
              borderRadius: 5,
              color: "#ccc",
            }}
          />
          <Bar
            dataKey="Income"
            fill="#8884d8"
            barSize={25}
            colorInterpolation={"red"}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
