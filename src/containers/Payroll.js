import axios from "axios";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import jsPDF from "jspdf";
import { CSVLink } from "react-csv";
import { Button, Paper, Toolbar } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Table from "../components/Table";
import Select from "../components/Select";
import TransitionsModal from "../components/Modal";

const Payroll = ({ userToken }) => {
  let [csvObj, setcsvObj] = useState();
  const [payrollData, setPayrollData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  let [currentDate] = useState();
  const regulars = [];
  const overload = [];
  let [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const payroll = () => {
    setIsFetching(true);
    axios
      .get("https://tup-payroll.herokuapp.com/api/payroll")
      .then((respond) => {
        setPayrollData(respond.data);
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

  const addImport = () => {
    if (!csvObj) {
      console.log("Select file first.");
    } else {
      const formData = new FormData();

      formData.append("file", csvObj);
      setIsFetching(true);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
      };
      axios
        .post("https://tup-payroll.herokuapp.com/api/payroll", formData, config)
        .then((response) => {
          console.log(response);
          setPayrollData(response.data);
          setIsFetching(false);
        })
        .catch((error) => {
          setIsFetching(false);
          // console.log(error.response.data.message);
          setErrorMsg(error.response.data.message);
        });
    }
  };

  //Put the regular employee to regulars[]
  for (let x of payrollData) {
    if (x.employee !== null && x.employee !== undefined) {
      if (x.employee.isPartTime === false) {
        regulars.push(x);
      }
      if (x.monthOverload !== null && x.monthOverload !== undefined) {
        overload.push(x);
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
      label: "Rate",
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

  function handlePayslip(key, isPartTime) {
    const pdf = new jsPDF("a6");
    console.log(payrollData);

    let data;
    if (!isPartTime) {
      data = regulars;
    } else {
      data = payrollData;
    }

    let date = data[key].period;
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

    //RENDERS COLLEGES
    pdf.text("College", 10, 45);
    pdf.setFont("times", "normal");

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

    //RENDERS BASIC SALARY
    pdf.text("Basic Salary", 10, 65);
    pdf.setFont("times", "normal");

    // RENDERS GROSS PAY
    pdf.text("Gross Amount Due ", 10, 70);

    pdf.line(175, 66.5, 200, 66.5);
    pdf.setFont("times", "bold");
    pdf.text(`${data[key].grossAmount.toFixed(2)}`, 185, 70); //Int values needs to be renders as string in jsPDF
    pdf.setFont("times", "normal");
    pdf.line(175, 71, 200, 71);

    //RENDER DEDUCTIONS
    // data[key].employee.deductions.map((x) => {
    //   let yPos = 90;
    //   pdf.text(`${x.title}`, 10, yPos);
    //   pdf.setFont("times", "normal");
    //   pdf.text(`${x.amount}`, 40, yPos);
    //   pdf.setFont("times", "bold");

    //   yPos = yPos + 5;
    //   return;
    // })
    // for (let counter of data[key].employee.deductions.title){

    // }

    //RENDER SALARY
    pdf.text("Salary: ", 10, 208);
    pdf.text("1st Half", 30, 208);
    //1sthalf salary
    pdf.text("2nd Half", 80, 208);
    //2ndhalf salary

    // RENDERS DEDUCTION
    pdf.text("Total Deductions ", 140, 203);
    pdf.setFont("times", "bold");
    // pdf.text(`${data[key].overloadNetAmount}`, 185, 83); //Int values needs to be renders as string in jsPDF
    pdf.text(`${data[key].totalDeductions.toFixed(2)}`, 185, 203);
    pdf.setFont("times", "normal");

    pdf.line(140, 204, 200, 204);

    // RENDERS NET PAY
    pdf.text("Net Amount ", 140, 208);
    pdf.setFont("times", "bold");
    pdf.text(`${data[key].regularNetAmount.toFixed(2)}`, 185, 208); //Int values needs to be renders as string in jsPDF
    pdf.setFont("times", "normal");

    // FOOTER
    pdf.setFontSize(12);
    pdf.setFont("times", "bold");

    pdf.text("Prepared by: ", 10, 220);
    pdf.text("Certified correct: ", 100, 220);

    pdf.text("CATALINA M. BAQUIRAN ", 40, 245);
    pdf.text("Administrative Officer IV ", 43, 250);

    pdf.text("ATTY. CHRISTOPHER M. MORTEL ", 130, 245);
    pdf.text("Head, HRMS ", 155, 250);

    // END OF PDF FILE
    pdf.save("payroll"); //Prints the pdf
  }

  let csvData = overload.map((obj) => ({
    employeeId: '=""' + obj.employee.employeeId + '""',
    firstName: obj.employee.firstName,
    lastName: obj.employee.lastName,
    position: obj.employee.position.title,
    monthOverload: obj.monthOverload,
    rate: obj.employee.position.rate,
    amount: obj.amount,
    withTax: obj.withTax,
    netAmount: obj.overloadNetAmount,
  }));

  const handleOpen = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setErrorMsg();
    setcsvObj();
  };

  const handleFile = (e) => {
    csvObj = e.target.files[0];
    console.log(csvObj);
  };

  // console.log("Regulars: ", regulars);
  // console.log("Overload: ", overload);

  const monthValues = [
    { 1: "January" },
    { 2: "February" },
    { 3: "March" },
    { 4: "April" },
    { 5: "May" },
    { 6: "June" },
    { 7: "July" },
    { 8: "August" },
    { 9: "September" },
    { 10: "October" },
    { 11: "November" },
    { 12: "December" },
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
    currentDate = date.getMonth() + 1 + "/" + date.getFullYear();
    // console.log(currentDate);

    setFilterFn({
      fn: (items) => {
        if (currentDate === false) {
          return items;
        } else return items.filter((x) => x.period.includes(currentDate));
      },
    });
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
          lists={overload}
          filterFn={filterFn}
          columns={overloadColumnHeads}
          propertiesOrder={overloadColumnHeads
            .slice(0, 8)
            .map((item) => item.id)}
          isPayroll={true}
          isLoading={isFetching}
          isOverload={true}
          printPayslip={handlePayslip} //Generate PDF functions
        />
      </Paper>

      <h1>REGULARS</h1>
      <Paper>
        <Toolbar>
          {/* <Select
            name="month"
            label="Month"
            value=""
            onChange={handleMonthSelect}
            options={monthValues}
          /> */}
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Month Year Picker"
              views={["year", "month"]}
              format="MM/yyyy"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        </Toolbar>
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
          <form>
            <input
              type="file"
              name="file"
              onChange={(e) => handleFile(e)}
            ></input>
          </form>
          <h4 style={{ color: "red" }}>{errorMsg}</h4>
          <div>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={addImport}
            >
              Add
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
};

const mapStateToProps = (state) => {
  return {
    userToken: state.auth.token,
  };
};

export default connect(mapStateToProps)(Payroll);
