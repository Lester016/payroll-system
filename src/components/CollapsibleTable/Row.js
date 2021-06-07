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
  Input,
  Typography,
  Fab,
  Toolbar,
} from "@material-ui/core/";
import {
  Add as AddIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Done as DoneIcon,
  Cancel as CancelIcon,
} from "@material-ui/icons";

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

const Row = ({ row, onDeleteRow, onSubmit }) => {
  const classes = useRowStyles();
  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [inputValues, setInputValues] = useState({
    title: "",
    amount: 0,
  });

  // Get sum of deductions
  const getDeductionsAmount = (deductions) => {
    let sum = 0;
    deductions.map((deduction) => (sum += parseFloat(deduction.amount)));
    return sum;
  };

  const handleSubmit = () => {
    setIsAdding(false);
    onSubmit(inputValues, row._id, null, false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setInputValues({
      title: "",
      amount: 0,
    })
  };

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
                  onClick={() => setIsAdding(!isAdding)}
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
                  {isAdding && (
                    <TableRow>
                      <TableCell>
                        <IconButton aria-label="done" onClick={handleSubmit}>
                          <DoneIcon />
                        </IconButton>
                        <IconButton
                          aria-label="cancel"
                          onClick={handleCancel}
                        >
                          <CancelIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Input
                          value={inputValues.title}
                          name={"title"}
                          onChange={(e) =>
                            setInputValues({
                              ...inputValues,
                              title: e.target.value,
                            })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={inputValues.amount}
                          name={"amount"}
                          onChange={(e) =>
                            setInputValues({
                              ...inputValues,
                              amount: e.target.value,
                            })
                          }
                        />
                      </TableCell>
                    </TableRow>
                  )}
                  {row.deductions.length <= 0 && !isAdding ? (
                    <Typography>Empty</Typography>
                  ) : (
                    row.deductions.map((deduction) => (
                      <CollapsibleRow
                        key={deduction._id}
                        row={deduction}
                        employee_Id={row._id}
                        onDeleteRow={onDeleteRow}
                        onSubmit={onSubmit}
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
