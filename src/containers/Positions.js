import axios from "axios";
import React, { useEffect, useState } from "react";

function Position() {
  const [positions, setPositions] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [ratePerHour, setRatePerHour] = useState(0);

  useEffect(() => {
    let isMounted = true;
    axios
      .get("https://tup-payroll-default-rtdb.firebaseio.com/positions.json")
      .then((response) => {
        if (isMounted) setPositions(response.data);
      })
      .catch((error) => console.log(error));

    return () => {
      isMounted = false;
    };
  }, [positions]);

  const submitHandler = (e) => {
    axios
      .post("https://tup-payroll-default-rtdb.firebaseio.com/positions.json", {
        title: jobTitle,
        rate: ratePerHour,
      })
      .then((response) => setPositions(response.data))
      .catch((error) => console.log(error));
    e.preventDefault();
  };

  const deleteHandler = (key) => {
    axios
      .delete(
        `https://tup-payroll-default-rtdb.firebaseio.com/positions/${key}.json`
      )
      .then((response) => setPositions(response.data))
      .catch((error) => console.log(error));
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
        {positions &&
          Object.keys(positions).map((item) => (
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
          ))}
      </div>
    </div>
  );
}

export default Position;
