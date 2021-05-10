import React, { useEffect, useState } from "react";


import Table from "../components/Table";




function Payroll() {
  const [payroll, setPayroll] = useState({});
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
      id: "Printables",
      label: "Printables",
      disableSorting: true,
    },
  ];


  const dummy = {
    employee1:{
      employeeID: '1',
      employeeName: 'Nikko',
      position: 'Janitor',
      grossPay: 1000, 
      netPay: 1650,
      deduction: 500
    },
    employee2:{
      employeeID: '2',
      employeeName: 'Mark',
      position: 'Professor',
      grossPay: 1100, 
      netPay: 1120,
      deduction: 650
    },
    employee3:{
      employeeID: '3',
      employeeName: 'Juan',
      position: 'Admin',
      grossPay: 1200, 
      netPay: 1050,
      deduction: 350
    },
    employee4:{
      employeeID: '4',
      employeeName: 'Mary Anne',
      position: 'Dean',
      grossPay: 1300, 
      netPay: 1651,
      deduction: 486
    },
    employee5:{
      employeeID: '5',
      employeeName: 'Jude',
      position: 'Staff',
      grossPay: 1400, 
      netPay: 1136,
      deduction: 320
    },
    employee6:{
      employeeID: '6',
      employeeName: 'James',
      position: 'Profssor2',
      grossPay: 1500, 
      netPay: 2100,
      deduction: 600
    }
  }

  return (
    <div>
      <Table
        lists={dummy}
        filterFn={filterFn}
        columns={columnHeads}
        propertiesOrder={columnHeads.slice(0, 6).map((item) => item.id)}
        isPayroll={true}
        // printPayslip = {handlePayslip} //Generate PDF functions
        // printPayroll = {handlePayroll} //Generate PDF functions
      />
    </div>
  )
}

export default Payroll;
