import axios from "axios";
import React, { useState, useEffect, createRef } from "react";
import { CSVLink } from "react-csv";

// COMPONENTS
import Table from "../components/Table";
import TransitionsModal from "../components/Modal";

// MATERIAL UI
import { Paper } from "@material-ui/core/";

import { Button } from "@material-ui/core";


// jsPDF Package
import jsPDF from "jspdf";

import { CSVReader } from "react-papaparse";

function Payroll() {
  const [csvObj, setcsvObj] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleOpen = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const buttonRef = createRef();

  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const handleOnFileLoad = (data) => {
    console.log("Parsed Data: ", data);
    setcsvObj(data); //set the csvObj to the parsed data(array of obj) when file is selected.
  };
  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data) => {
    setcsvObj([]); //set the csvObj to empty array if the file is removed.
  };

  const handleRemoveFile = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  // Only allow print if there is selected file. Additional: This only prints the first employee object.
  const printImport = () => {
    // console.log(csvObj[1].data[1]);
    if (csvObj.length === 0) {
      console.log("Select file first.");
    } else {
      // INSERT THE PDF LAYOUT HERE
      const pdf = new jsPDF("a6");
      pdf.setFont("times", "bold");
      pdf.setFontSize(12);

      pdf.setFont("times", "normal");

      console.log(csvObj[1].data[1]); //for test only
      console.log(csvObj[1].data[2]); //for test only

      pdf.text("Employee Name:", 10, 55);
      pdf.setFont("times", "bold");
      pdf.text(`${csvObj[1].data[1]} ${csvObj[1].data[2]}`, 40, 55);

      pdf.save("payroll"); //Prints the pdf
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Button
        size="large"
        variant="outlined"
        component="span"
        onClick={handleOpen}
      >
        Generate Payroll
      </Button>

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
      <TransitionsModal
        handleClose={handleClose}
        isModalOpen={isModalOpen}
        title="/ Select File"
      >
        <center>
          <CSVReader
            ref={buttonRef}
            onFileLoad={handleOnFileLoad}
            onError={handleOnError}
            noClick
            noDrag
            onRemoveFile={handleOnRemoveFile}
          >
            {({ file }) => (
              <>
                <div
                  style={{
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "#ccc",
                    height: 45,
                    lineHeight: 2.5,
                    marginTop: 5,
                    marginBottom: 5,
                    paddingLeft: 13,
                    paddingTop: 3,
                    width: "60%",
                  }}
                >
                  {file && file.name}
                </div>
                <div>
                  <Button
                    size="large"
                    variant="outlined"
                    component="span"
                    type="button"
                    onClick={handleOpenDialog}
                    style={{
                      borderRadius: 0,
                      marginLeft: 0,
                      marginRight: 0,
                      width: "40%",
                      paddingLeft: 0,
                      paddingRight: 0,
                    }}
                  >
                    Browse
                  </Button>

                  <Button
                    size="large"
                    variant="outlined"
                    component="span"
                    style={{
                      borderRadius: 0,
                      marginLeft: 0,
                      marginRight: 0,
                      paddingLeft: 20,
                      paddingRight: 20,
                    }}
                    onClick={handleRemoveFile}
                  >
                    Remove
                  </Button>
                </div>
              </>
            )}
          </CSVReader>

          <div>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={printImport}
            >
              Print
            </Button>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </center>
      </TransitionsModal>
    </div>
  );
}

export default Payroll;
