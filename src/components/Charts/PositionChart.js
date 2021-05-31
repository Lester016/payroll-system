import axios from "axios";
import React, { useEffect, useState } from "react";

import { Doughnut } from "react-chartjs-2";
import Skeleton from "@material-ui/lab/Skeleton";

const positionConfig = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "TOP 4 POSITIONS",
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
const PositionChart = () => {
  const [positionData, setPositionData] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const positions = [];
  const pos = [];
  const quantity = [];
  let topPositions = [];

  const position = () => {
    setIsFetching(true);
    axios
      .get("https://tup-payroll.herokuapp.com/api/employees")
      .then((respond) => {
        setIsFetching(false);
        for (let dataObj of respond.data) {
          if (positions.some((el) => el.position === dataObj.position.title)) {
            //If the positions is already in the list
            const el = positions.findIndex(
              (x) => x.position === dataObj.position.title
            );
            positions[el].qty += 1;
          } else {
            //If the positions is not yet in the list
            positions.push({ position: dataObj.position.title, qty: 1 });
          }
        }
        positions //sets the position array from greatest to lowest to get the top 4
          .sort((a, b) => parseFloat(a.qty) - parseFloat(b.qty))
          .reverse();

        // Only get the top 4 positions if there are more than 4 positions
        if (positions.length > 4) {
          topPositions = positions.slice(0, 4);
          console.log("IF: ", topPositions);
        } else {
          // if there are 4 or less positions, return all of them
          topPositions = positions;
          console.log("ELSE: ", topPositions);
        }

        // sets up the pos(positions) array for labels and quantity array for corresponding qty of each position
        topPositions.map((x) => {
          pos.push(x.position);
          quantity.push(x.qty);
          return [pos, quantity];
        });

        setPositionData({
          labels: pos,
          datasets: [
            {
              data: quantity,
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
                "rgb(150, 26, 222)",
              ],
              hoverOffset: 4,
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
    position();
  }, []);

  return (
    <div>
      {isFetching ? (
        <Skeleton />
      ) : (
        <Doughnut data={positionData} options={positionConfig} />
      )}
    </div>
  );
};

export default PositionChart;
