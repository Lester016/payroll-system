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
      disableSorting: true,
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
      grossPay: 1000,
      netPay: 1650,
      deduction: 500,
    },
    employee2: {
      employeeID: "234",
      employeeName: "Mark Dela Fuente",
      position: "Professor",
      grossPay: 1100,
      netPay: 1120,
      deduction: 650,
    },
    employee3: {
      employeeID: "345",
      employeeName: "Juan Dela Cruz",
      position: "Admin",
      grossPay: 1200,
      netPay: 1050,
      deduction: 350,
    },
    employee4: {
      employeeID: "456",
      employeeName: "Mary Anne Santos",
      position: "Dean",
      grossPay: 1300,
      netPay: 1651,
      deduction: 486,
    },
    employee5: {
      employeeID: "567",
      employeeName: "Jude Mamamia",
      position: "Staff",
      grossPay: 1400,
      netPay: 1136,
      deduction: 320,
    },
    employee6: {
      employeeID: "678",
      employeeName: "James Lebron",
      position: "Profssor2",
      grossPay: 1500,
      netPay: 2100,
      deduction: 600,
    },
  };

  // HANDLES FOR PRINTABLES
  const handlePayslip = () => {};

  const handlePayroll = () => {
    const pdf = new jsPDF("a4");

    const data = dummy;

    // START OF PDF FILE
    // HEADER
    pdf.setFontSize(16);
    pdf.text("Technological University of the Philippines", 55, 10);
    pdf.setFontSize(12);
    pdf.text(
      "1410, Ayala Blvd., cor. San Marcelino St. ermita, Manila 1000",
      50,
      18
    );
    pdf.text("Contact: (+63)-253-01-3-001  Email: tup@tup.edu.ph", 60, 26);
    pdf.line(20, 33, 190, 33);

    // BODY
    pdf.setFontSize(10);

    // DATE
    pdf.text("Date: April 10, 2021 - May 10, 2021 ", 130, 40);

    // RENDERS EMPLOYEE ID
    pdf.text("Employee ID:", 25, 50);
    pdf.text(data.employee1.employeeID, 55, 50);

    // RENDERS EMPLOYEE NAME
    pdf.text("Employee Name:", 25, 60);
    pdf.text(data.employee1.employeeName, 55, 60);

    // RENDERS EMPLOYEE NETPAY
    pdf.text("Net Pay:", 25, 70);
    pdf.text(`P${data.employee1.netPay}.00`, 40, 70);

    // RENDERS TOTAL PAY
    pdf.setFontSize(20);
    pdf.text(`Total: P${data.employee1.netPay}.00`, 130, 80);

    // END OF PDF FILE
    pdf.save("payroll");
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
          printPayroll={handlePayroll} //Generate PDF functions
        />
      </Paper>
    </div>
  );
}

export default Payroll;
