import axios from "axios";
import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";

// COMPONENTS
import Table from "../components/Table";

// MATERIAL UI
import { Paper } from "@material-ui/core/";

import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// jsPDF Package
import jsPDF from "jspdf";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}));

function Payroll() {
  const classes = useStyles();
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState([]);
  const [pslip, setPslip] = useState(true);
  const [filterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const partTimers = [];
  const regulars = [];

  const payroll = () => {
    setIsFetching(true);
    axios
      .get("https://tup-payroll.herokuapp.com/api/payroll")
      .then((respond) => {
        setData(respond.data);
        setIsFetching(false);
      })
      .catch((error) => {
        setIsFetching(false);
        console.log(error);
      });
  };

  useEffect(() => {
    payroll();
  }, []);

  for (let x of data) {
    if (x.employee !== null) {
      if (x.employee.isPartTime) {
        partTimers.push(x);
      } else {
        regulars.push(x);
      }
    }
  }

  const overloadColumnHeads = [
    {
      id: "id",
      label: "Employee ID",
      disableSorting: true,
    },
    {
      id: "employeeName",
      label: "Name",
    },
    {
      id: "positions",
      label: "Position",
    },
    {
      id: "monthOverload",
      label: "No. of Hours",
    },
    {
      id: "rates",
      label: "rate",
    },
    {
      id: "amount",
      label: "Amount",
    },
    {
      id: "withTax",
      label: "w/Tax",
    },
    {
      id: "overloadNetAmount",
      label: "Net Amount",
    },
    {
      id: "printables",
      label: "Printables",
      disableSorting: true,
    },
  ];

  const regularColumnHeads = [
    {
      id: "id",
      label: "Employee ID",
      disableSorting: true,
    },
    {
      id: "employeeName",
      label: "Name",
    },
    {
      id: "positions",
      label: "Position",
    },
    {
      id: "grossAmount",
      label: "Gross Amount",
    },
    {
      id: "withholdingTax",
      label: "With Holding Tax",
    },
    {
      id: "totalDeductions",
      label: "Total Deduction/s",
    },
    {
      id: "regularNetAmount",
      label: "Net Amount",
    },
    {
      id: "printables",
      label: "Printables",
      disableSorting: true,
    },
  ];

  function handlePayslip(key, bool) {
    const pdf = new jsPDF("a6");
    // const data = partTimers;

    let data;
    if (bool) {
      data = partTimers;
    } else {
      data = regulars;
    }

    let date = "JANUARY 1-31, 2021";

    // START OF PDF FILE
    // HEADER
    pdf.setFont("times", "bold");
    pdf.setFontSize(12);
    pdf.text("TUP MANILA", 90, 10);
    pdf.text("PAYROLL PAYMENT SLIP", 75, 15);
    pdf.text(`For the period of ${date}`, 70, 20);
    pdf.setFontSize(12);
    pdf.setFont("times", "normal");

    // BODY
    pdf.setFontSize(10);

    // RENDERS EMPLOYEE ID
    pdf.text("Employee No.", 10, 50);
    pdf.setFont("times", "bold");
    pdf.text(data[key].employee.employeeId, 40, 50);
    pdf.setFont("times", "normal");

    // RENDERS POSITION
    pdf.text("Position: ", 100, 50);
    pdf.setFont("times", "bold");
    pdf.text(data[key].employee.position.title, 115, 50);
    pdf.setFont("times", "normal");

    // RENDERS EMPLOYEE NAME
    pdf.text("Employee Name:", 10, 55);
    pdf.setFont("times", "bold");
    pdf.text(
      `${data[key].employee.firstName} ${data[key].employee.lastName}`,
      40,
      55
    );
    pdf.setFont("times", "normal");

    // RENDERS GROSS PAY
    pdf.text("Gross Amount Due ", 10, 70);

    pdf.line(175, 65, 200, 65);
    pdf.setFont("times", "bold");
    pdf.text(`${data[key].monthOverload}`, 185, 70); //Int values needs to be renders as string in jsPDF
    pdf.setFont("times", "normal");
    pdf.line(175, 73, 200, 73);

    // RENDERS DEDUCTION
    pdf.text("Total Deduction ", 140, 83);
    pdf.setFont("times", "bold");
    pdf.text(`${data[key].overloadNetAmount}`, 185, 83); //Int values needs to be renders as string in jsPDF
    pdf.setFont("times", "normal");

    pdf.line(140, 85, 200, 85);

    // RENDERS NET PAY
    pdf.text("Net Amount ", 140, 90);
    pdf.setFont("times", "bold");
    pdf.text(`${data[key].amount}`, 185, 90); //Int values needs to be renders as string in jsPDF
    pdf.setFont("times", "normal");

    // FOOTER
    pdf.setFontSize(12);
    pdf.setFont("times", "bold");

    pdf.text("Prepared by: ", 10, 105);
    pdf.text("Certified correct: ", 100, 105);

    pdf.text("CATALINA M. BAQUIRAN ", 40, 125);
    pdf.text("Administrative Officer IV ", 43, 130);

    pdf.text("ATTY. CHRISTOPHER M. MORTEL ", 130, 125);
    pdf.text("Head, HRMS ", 155, 130);

    // END OF PDF FILE
    pdf.save("payroll"); //Prints the pdf
  }

  let csvData = partTimers.map((obj) => ({
    employeeId: '=""' + obj.employee.employeeId + '""',
    firstName: obj.employee.firstName,
    lastName: obj.employee.lastName,
    position: obj.employee.position.title,
    isPartTime: obj.employee.isPartTime ? "1" : "0",
    campus: obj.employee.campus,
    college: obj.employee.college,
    department: obj.employee.department,
    gender: obj.employee.gender,
    email: obj.employee.email,
    contactInfo: '=""' + obj.employee.contactInfo + '""',
    address: obj.employee.address,
    birthDate: obj.employee.birthDate,
    salary: obj.employee.salary,
    tax: obj.employee.tax,
    monthOverload: obj.monthOverload,
    rate: obj.employee.position.title,
    amount: obj.amount,
    withTax: obj.withTax,
    netAmount: obj.overloadNetAmount,
  }));

  return (
    <div style={{ textAlign: "center" }}>
      <input
        accept="application/pdf,application/vnd.ms-excel,application/csv"
        className={classes.input}
        id="contained-button-file"
        type="file"
      />
      <label htmlFor="contained-button-file">
        <Button size="large" variant="outlined" component="span">
          Generate Payroll
        </Button>
      </label>
      <Button>
        <CSVLink
          data={csvData}
          filename={"overload.csv"}
          className="btn btn-primary"
          target="_blank"
        >
          Export Overload CSV
        </CSVLink>
      </Button>

      <h1>OVERLOAD</h1>
      <Paper>
        <Table
          lists={partTimers}
          filterFn={filterFn}
          columns={overloadColumnHeads}
          propertiesOrder={overloadColumnHeads
            .slice(0, 8)
            .map((item) => item.id)}
          isPayroll={true}
          isLoading={isFetching}
          printPayslip={handlePayslip} //Generate PDF functions
        />
      </Paper>

      <h1>REGULARS</h1>
      <Paper>
        <Table
          lists={regulars}
          filterFn={filterFn}
          columns={regularColumnHeads}
          propertiesOrder={regularColumnHeads
            .slice(0, 7)
            .map((item) => item.id)}
          isPayroll={true}
          isLoading={isFetching}
          printPayslip={handlePayslip} //Generate PDF functions
        />
      </Paper>
    </div>
  );
}

export default Payroll;
