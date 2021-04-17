import axios from "axios";
import React, { useEffect, useState } from "react";
import { filter } from "lodash/collection";

function Position() {
  const [positions, setPositions] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [ratePerHour, setRatePerHour] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://tup-payroll-default-rtdb.firebaseio.com/positions.json")
      .then((response) => {
        setPositions(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const submitHandler = (e) => {
    setIsLoading(true);
    axios
      .post("https://tup-payroll-default-rtdb.firebaseio.com/positions.json", {
        title: jobTitle,
        rate: ratePerHour,
      })
      .then((response) => {
        setPositions({
          ...positions,
          [response.data.name]: {
            rate: ratePerHour,
            title: jobTitle,
          },
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
    e.preventDefault();
  };
  const deleteHandler = (key) => {
    setIsLoading(true);
    axios
      .delete(
        `https://tup-payroll-default-rtdb.firebaseio.com/positions/${key}.json`
      )
      .then((response) => {
        let newLists;
        newLists = filter(positions, function (o) {
          return o[response.data.name];
        });
        console.log(newLists);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  let positionsList = [];
  if (positions) {
    positionsList = Object.keys(positions).map((item) => (
      <div key={item}>
        <p style={{ display: "inline-block", padding: 15 }}>
          {positions[item].title}
        </p>
        <p style={{ display: "inline-block", padding: 15 }}>
          {positions[item].rate}
        </p>
        <input
          type="button"
          value="Delete"
          onClick={() => deleteHandler(item)}
        />
      </div>
    ));
  }

  return (
    <div>
      <h1>Positions Screen</h1>

      <input
        type="text"
        name="title"
        value={jobTitle}
        placeholder="Job Title"
        onChange={(e) => setJobTitle(e.target.value)}
      />
      <input
        type="number"
        name="rate"
        value={ratePerHour}
        placeholder="Rate Per Hour"
        onChange={(e) => setRatePerHour(e.target.value)}
      />
      <input type="submit" value="Add" onClick={submitHandler} />

      <div>{isLoading ? <h1>Loading..</h1> : positionsList}</div>
    </div>
  );
}

export default Position;
