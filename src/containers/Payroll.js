import React, { useState } from "react";

// COMPONENTS
import Table from "../components/Table";

// MATERIAL UI
import { Paper } from "@material-ui/core/";

// jsPDF Package
import jsPDF from "jspdf";

function Payroll() {
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const columnHeads = [
    {
      id: "employeeID",
      label: "Employee ID",
      disableSorting: true,
    },
    {
      id: "employeeName",
      label: "Name",
    },
    {
      id: "position",
      label: "Position",
      disableSorting: true,
    },
    {
      id: "grossPay",
      label: "Gross Pay",
    },
    {
      id: "netPay",
      label: "Net Pay",
    },
    {
      id: "deduction",
      label: "Deduction",
    },
    {
      id: "printables",
      label: "Printables",
      disableSorting: true,
    },
  ];

  const dummy = {
    employee1: {
      employeeID: "123",
      employeeName: "Nikko Cruz",
      position: "Janitor",
      grossPay: 15000,
      netPay: 13050,
      deduction: 500,
    },
    employee2: {
      employeeID: "234",
      employeeName: "Mark Dela Fuente",
      position: "Professor",
      grossPay: 10100,
      netPay: 9120,
      deduction: 650,
    },
    employee3: {
      employeeID: "345",
      employeeName: "Juan Dela Cruz",
      position: "Admin",
      grossPay: 15200,
      netPay: 13550,
      deduction: 350,
    },
    employee4: {
      employeeID: "456",
      employeeName: "Mary Anne Santos",
      position: "Dean",
      grossPay: 16300,
      netPay: 15500,
      deduction: 486,
    },
    employee5: {
      employeeID: "567",
      employeeName: "Jude Mamamia",
      position: "Staff",
      grossPay: 14000,
      netPay: 13136,
      deduction: 320,
    },
    employee6: {
      employeeID: "678",
      employeeName: "James Lebron",
      position: "Profssor2",
      grossPay: 13500,
      netPay: 12100,
      deduction: 600,
    },
  };

  // HANDLES FOR PRINTABLES
  const handlePayslip = () => {
    const pdf = new jsPDF("a6");

    const data = dummy;

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
    pdf.text(data.employee1.employeeID, 40, 50);
    pdf.setFont("times", "normal");

    // RENDERS POSITION
    pdf.text("Position: ", 100, 50);
    pdf.setFont("times", "bold");
    pdf.text(data.employee1.position, 115, 50);
    pdf.setFont("times", "normal");

    // RENDERS EMPLOYEE NAME
    pdf.text("Employee Name:", 10, 55);
    pdf.setFont("times", "bold");
    pdf.text(data.employee1.employeeName, 40, 55);
    pdf.setFont("times", "normal");

    // RENDERS GROSS PAY
    pdf.text("Gross Amount Due ", 10, 70);

    pdf.line(175, 65, 200, 65);
    pdf.setFont("times", "bold");
    pdf.text(`${data.employee1.grossPay}`, 185, 70); //Int values needs to be renders as string in jsPDF
    pdf.setFont("times", "normal");
    pdf.line(175, 73, 200, 73);

    // RENDERS DEDUCTION
    pdf.text("Total Deduction ", 140, 83);
    pdf.setFont("times", "bold");
    pdf.text(`${data.employee1.deduction}`, 185, 83); //Int values needs to be renders as string in jsPDF
    pdf.setFont("times", "normal");

    pdf.line(140, 85, 200, 85);

    // RENDERS NET PAY
    pdf.text("Net Amount ", 140, 90);
    pdf.setFont("times", "bold");
    pdf.text(`${data.employee1.netPay}`, 185, 90); //Int values needs to be renders as string in jsPDF
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
  };

  return (
    <div>
      <Paper>
        <Table
          lists={dummy}
          filterFn={filterFn}
          columns={columnHeads}
          propertiesOrder={columnHeads.slice(0, 6).map((item) => item.id)}
          isPayroll={true}
          printPayslip={handlePayslip} //Generate PDF functions
        />
      </Paper>
    </div>
  );
}

export default Payroll;
