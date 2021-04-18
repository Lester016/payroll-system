import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "../components/Table";

function Deductions() {
  const [deductions, setDeductions] = useState([]);
  const [deductionTitle, setDeductionTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://tup-payroll-default-rtdb.firebaseio.com/deductions.json")
      .then((response) => {
        setDeductions(response.data);
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
      .post("https://tup-payroll-default-rtdb.firebaseio.com/deductions.json", {
        title: deductionTitle,
        amount: amount,
      })
      .then((response) => {
        setDeductions({
          ...deductions,
          [response.data.name]: {
            title: deductionTitle,
            amount: amount,
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
        `https://tup-payroll-default-rtdb.firebaseio.com/deductions/${key}.json`
      )
      .then(() => {
        let filteredPositions = { ...deductions };
        delete filteredPositions[key];
        setDeductions(filteredPositions);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  let deductionsList = [];
  if (deductions) {
    deductionsList = (
      <Table
        lists={deductions}
        onDeleteRow={deleteHandler}
        columns={["Description", "Amount", "Options"]}
      />
    );
  }

  return (
    <div>
      <h1>Deductions Screen</h1>

      <input
        type="text"
        name="title"
        value={deductionTitle}
        placeholder="Description"
        onChange={(e) => setDeductionTitle(e.target.value)}
      />
      <input
        type="number"
        name="amount"
        value={amount}
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />
      <input type="submit" value="Add" onClick={submitHandler} />

      <div>
        {isLoading ? (
          <h1>Loading..</h1>
        ) : deductions === null ? (
          <p>No Data</p>
        ) : (
          deductionsList
        )}
      </div>
    </div>
  );
}

export default Deductions;
