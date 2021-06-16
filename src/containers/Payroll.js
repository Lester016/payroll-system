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
  let [filterFnc, setFilterFnc] = useState({
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

  const handlePayslip = (key, isPartTime) => {
    const pdf = new jsPDF("landscape");
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
    pdf.text("TUP MANILA", 140, 10);
    pdf.text("PAYROLL PAYMENT SLIP", 125, 15);
    pdf.text(`For the period of ${date}`, 130, 20);
    pdf.setFontSize(12);
    pdf.setFont("times", "normal");

    // BODY
    pdf.setFontSize(10);

    //RENDERS COLLEGES
    pdf.text("College", 10, 45);
    pdf.setFont("times", "normal");
    pdf.text(data[key].employee.college, 40, 45);

    // RENDERS EMPLOYEE ID
    pdf.text("Employee No.", 10, 50);
    pdf.setFont("times", "bold");
    pdf.text(data[key].employee.employeeId, 40, 50);
    pdf.setFont("times", "normal");

    // RENDERS POSITION
    pdf.text("Position: ", 145, 50);
    pdf.setFont("times", "bold");
    pdf.text(data[key].employee.position.title, 160, 50);
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
    pdf.text(`${data[key].employee.salary.toFixed(2)}`, 265, 65);

    // RENDERS GROSS PAY
    pdf.text("Gross Amount Due ", 10, 70);

    pdf.line(250, 66.5, 285, 66.5);
    pdf.setFont("times", "bold");
    pdf.text(`${data[key].grossAmount.toFixed(2)}`, 265, 70); //Int values needs to be renders as string in jsPDF
    pdf.setFont("times", "normal");
    pdf.line(250, 71, 285, 71);

    let yPos = 90;
    for (let x = 0; x < data[key].employee.deductions.length; x++) {
      yPos += 5;

      pdf.text(`${data[key].employee.deductions[x].title}`, 10, yPos);
      pdf.text(
        `${data[key].employee.deductions[x].amount.toFixed(2)}`,
        70,
        yPos
      );
    }

    //RENDER SALARY
    pdf.setFont("times", "bold");
    pdf.text("Salary: ", 10, 165);
    pdf.text(`1st Half: ${data[key].firstHalf.toFixed(2)}`, 50, 165);
    //1sthalf salary
    pdf.text(`2nd Half: ${data[key].secondHalf.toFixed(2)}`, 140, 165);
    //2ndhalf salary

    // RENDERS DEDUCTION
    pdf.setFont("times", "normal");
    pdf.text("Total Deductions ", 225, 160);
    pdf.setFont("times", "bold");
    pdf.text(`${data[key].totalDeductions.toFixed(2)}`, 265, 160);
    pdf.setFont("times", "normal");

    pdf.line(225, 161, 285, 161);

    // RENDERS NET PAY
    pdf.text("Net Amount ", 225, 165);
    pdf.setFont("times", "bold");
    pdf.text(`${data[key].regularNetAmount.toFixed(2)}`, 265, 165); //Int values needs to be renders as string in jsPDF
    pdf.setFont("times", "normal");

    // FOOTER
    pdf.setFontSize(12);

    pdf.text("Prepared by: ", 10, 180);
    pdf.text("Certified correct: ", 120, 180);

    pdf.setFont("times", "bold");
    pdf.text("CATALINA M. BAQUIRAN ", 40, 200);
    pdf.setFont("times", "normal");
    pdf.text("Administrative Officer IV ", 43, 205);

    pdf.setFont("times", "bold");
    pdf.text("ATTY. CHRISTOPHER M. MORTEL ", 150, 200);
    pdf.setFont("times", "normal");
    pdf.text("Head, HRMS ", 175, 205);

    // END OF PDF FILE
    pdf.save("payroll"); //Prints the pdf
  };

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

  // HANDLES
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    currentDate = date.getMonth() + 1 + "/" + date.getFullYear();
    // console.log(currentDate.length); //For debugging, checks if the currentDate is NaN if its length is equal to 7.

    setFilterFnc({
      fn: (items) => {
        if (currentDate.length === 7) {
          //If the currentDate is NaN, it's length === 7. So if it's NaN, just return the original items.
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
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Select month/year"
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
          filterFn={filterFnc}
          columns={regularColumnHeads}
          propertiesOrder={regularColumnHeads
            .slice(0, 7)
            .map((item) => item.id)}
          isPayroll={true}
          isLoading={isFetching}
          isOverload={false}
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
