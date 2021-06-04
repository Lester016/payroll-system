import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  KeyboardArrowDownIcon,
  KeyboardArrowUpIcon,
  Fab,
  Toolbar,
} from "@material-ui/core/";
import { Add as AddIcon } from "@material-ui/icons";

import CollapsibleRow from "./CollapsibleRow";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  createbutton: {
    marginLeft: "10px",
    backgroundColor: "#bf1d38",
    "&:hover": {
      backgroundColor: "#a6172f",
    },
  },
});

const Row = ({ row, onDeleteRow }) => {
  const classes = useRowStyles();
  const [open, setOpen] = useState(false);

  // Get sum of deductions
  const getDeductionsAmount = (deductions) => {
    let sum = 0;
    deductions.map((deduction) => (sum += deduction.amount));
    return sum;
  };

  const handleDummy = () => {};

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.employeeId}
        </TableCell>
        <TableCell>{`${row.firstName} ${row.lastName}`}</TableCell>
        <TableCell>{getDeductionsAmount(row.deductions)}</TableCell>
        <TableCell>{row.position.title}</TableCell>
        <TableCell>{row.campus}</TableCell>
        <TableCell>{row.college}</TableCell>
        <TableCell>{row.department}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto">
            <Box margin={1}>
              <Toolbar>
                <Typography variant="h6" component="div" display="inline">
                  Deductions
                </Typography>
                <Fab
                  size="small"
                  onClick={handleDummy}
                  color="primary"
                  className={classes.createbutton}
                  display="inline"
                >
                  <AddIcon />
                </Fab>
              </Toolbar>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Deduction</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.deductions.length <= 0 ? (
                    <Typography>Empty</Typography>
                  ) : (
                    row.deductions.map((deduction) => (
                      <CollapsibleRow
                        key={deduction._id}
                        row={deduction}
                        employee_Id={row._id}
                        onDeleteRow={onDeleteRow}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default Row;
