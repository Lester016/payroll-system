import axios from "axios";
import React, { useEffect, useState } from "react";

import Table from "../components/Table";

const Position = () => {
  const [positions, setPositions] = useState({});
  const [jobTitle, setJobTitle] = useState("");
  const [ratePerHour, setRatePerHour] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setIsFetching(true);
    axios
      .get("https://tup-payroll-default-rtdb.firebaseio.com/positions.json")
      .then((response) => {
        setPositions(response.data);
        setIsFetching(false);
      })
      .catch((error) => {
        console.log(error);
        setIsFetching(false);
      });
  }, []);

  const submitHandler = (e) => {
    setIsLoading(true);
    axios
      .post("https://tup-payroll-default-rtdb.firebaseio.com/positions.json", {
        title: jobTitle,
        rate: parseFloat(ratePerHour),
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
      .then(() => {
        let filteredPositions = { ...positions };
        delete filteredPositions[key];
        setPositions(filteredPositions);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

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

      <div>
        <Table
          lists={positions}
          onDeleteRow={deleteHandler}
          columns={["Position Title", "Rate Per Hour", "Options"]}
          propertiesOrder={["title", "rate"]}
          isLoading={isFetching}
        />
      </div>
    </div>
  );
};

export default Position;
