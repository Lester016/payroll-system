import axios from "axios";
import React, { useEffect, useState } from "react";

import { Doughnut } from "react-chartjs-2";
import Skeleton from "@material-ui/lab/Skeleton";

const payrollConfig = {
  responsive: true,
  normalized: true,
  plugins: {
    title: {
      display: true,
      text: "PAYROLL BUDGET",
      font: {
        size: 20,
      },
    },
    legend: {
      labels: {
        boxHeight: 20,
        boxWidth: 25,
      },
      position: "bottom",
    },
  },
};
const PayrollChart = () => {
  let [tupMBudget, setTupMBudget] = useState(0);
  let [tupTBudget, setTupTBudget] = useState(0);
  let [tupCBudget, setTupCBudget] = useState(0);
  let [tupVBudget, setTupVBudget] = useState(0);

  const [payrollData, setPayrollData] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const campusPayroll = [];

  const payroll = () => {
    setIsFetching(true);
    axios
      .get("https://tup-payroll.herokuapp.com/api/employees")
      .then((respond) => {
        setIsFetching(false);
        // Sets the total amount for each campus payroll for each  employees
        for (let dataObj of respond.data) {
          if (dataObj.campus === "TUPM") {
            setTupMBudget((tupMBudget += dataObj.position.rate));
          }
          if (dataObj.campus === "TUPT") {
            setTupTBudget((tupTBudget += dataObj.position.rate));
          }
          if (dataObj.campus === "TUPC") {
            setTupCBudget((tupCBudget += dataObj.position.rate));
          }
          if (dataObj.campus === "TUPV") {
            setTupVBudget((tupVBudget += dataObj.position.rate));
          }
        }
        campusPayroll.push(parseInt(tupMBudget));
        campusPayroll.push(parseInt(tupTBudget));
        campusPayroll.push(parseInt(tupCBudget));
        campusPayroll.push(parseInt(tupVBudget));
        // console.log(campusPayroll);
        setPayrollData({
          labels: ["TUP-Manila", "TUP-Taguig", "TUP-Cavite", "TUP-Visayas"],
          datasets: [
            {
              data: campusPayroll,
              backgroundColor: ["red", "green", "orange", "blue"],
            },
          ],
        });
      })
      .catch((error) => {
        setIsFetching(false);
        console.log(error);
      });
  };

  useEffect(() => {
    payroll();
  }, []);
  return (
    <div>
      {isFetching ? (
        <Skeleton />
      ) : (
        <Doughnut data={payrollData} options={payrollConfig} />
      )}
    </div>
  );
};

export default PayrollChart;
