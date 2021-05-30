import axios from "axios";
import React, { useEffect, useState } from "react";

import { Bar } from "react-chartjs-2";
import Skeleton from "@material-ui/lab/Skeleton";

const collegeConfig = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "EMPLOYEE DISTRIBUTION AMONG COLLEGES",
      font: {
        size: 20,
      },
    },
  },
};
const CollegeChart = () => {
  const [collegeData, setCollegeData] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const collegeCount = [];

  let [cos, setCos] = useState(0);
  let [cafa, setCafa] = useState(0);
  let [cla, setCla] = useState(0);
  let [cit, setCit] = useState(0);
  let [coe, setCoe] = useState(0);
  let [cie, setCie] = useState(0);

  const college = () => {
    setIsFetching(true);
    axios
      .get("https://tup-payroll.herokuapp.com/api/employees")
      .then((respond) => {
        setIsFetching(false);
        // Sets the data for number of employees per college
        for (let dataObj of respond.data) {
          if (dataObj.college === "COS") {
            setCos((cos += 1));
          }
          if (dataObj.college === "CAFA") {
            setCafa((cafa += 1));
          }
          if (dataObj.college === "CLA") {
            setCla((cla += 1));
          }
          if (dataObj.college === "CIT") {
            setCit((cit += 1));
          }
          if (dataObj.college === "COE") {
            setCoe((coe += 1));
          }
          if (dataObj.college === "CIE") {
            setCie((cie += 1));
          }
        }

        collegeCount.push(parseInt(cos));
        collegeCount.push(parseInt(cafa));
        collegeCount.push(parseInt(cla));
        collegeCount.push(parseInt(cit));
        collegeCount.push(parseInt(coe));
        collegeCount.push(parseInt(cie));

        // console.log(collegeCount);

        setCollegeData({
          labels: ["COS", "CAFA", "CLA", "CIT", "COE", "CIE"],
          datasets: [
            {
              maxBarThickness: 50,
              data: collegeCount,
              backgroundColor: [
                "#FF4C4C",
                "#3DCC3D",
                "#4C4CFF",
                "#FFC04C",
                "#FFFF4C",
                "#CCCCCC",
              ],

              borderColor: [
                "#FF0000",
                "#008000",
                "#0000FF",
                "#FFA500",
                "#FFFF00",
                "#808080",
              ],
              borderWidth: 1,
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
    college();
  }, []);

  return (
    <div>
      {isFetching ? (
        <Skeleton />
      ) : (
        <Bar data={collegeData} options={collegeConfig} />
      )}
    </div>
  );
};

export default CollegeChart;
