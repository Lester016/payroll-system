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
  Button,
} from "@material-ui/core/";
import {
  Add as AddIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Done as DoneIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
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

const Row = ({
  row,
  columns,
  collapsibleColumns,
  tab,
  onDeleteRow,
  onEditRow,
  onSubmit,
  onSubmitCollapsibleRow,
}) => {
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
    });
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
        {columns.map((item) => {
          if (item.id === "deductionAmount") {
            return <TableCell>{getDeductionsAmount(row.deductions)}</TableCell>;
          } else if (item.id === "name") {
            return <TableCell>{`${row.firstName} ${row.lastName}`}</TableCell>;
          } else if (item.id === "position") {
            return <TableCell>{row[item.id].title}</TableCell>
          } else if (item.id === "options") {
            return (
              <TableCell>
                <Button
                  className={classes.editButton}
                  size="small"
                  arial-label="edit"
                  variant="contained"
                  // color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    onEditRow(row.id);
                  }}
                >
                  EDIT
                </Button>
                <Button
                  className={classes.deleteButton}
                  size="small"
                  variant="outlined"
                  // color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    onDeleteRow(row.id);
                  }}
                >
                  DELETE
                </Button>
              </TableCell>
            );
          } else {
            return <TableCell>{row[item.id]}</TableCell>;
          }
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto">
            <Box margin={1}>
              <Toolbar>
                <Typography variant="h6" component="div" display="inline">
                  {tab === "positions" ? "Steps" : "Deductions"}
                </Typography>
                {tab === "deductions" && (
                  <Fab
                    size="small"
                    onClick={() => setIsAdding(!isAdding)}
                    color="primary"
                    className={classes.createbutton}
                    display="inline"
                  >
                    <AddIcon />
                  </Fab>
                )}
              </Toolbar>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    {collapsibleColumns.map((item) => (
                      <TableCell>{item.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isAdding && (
                    <TableRow>
                      <TableCell>
                        <IconButton aria-label="done" onClick={handleSubmit}>
                          <DoneIcon />
                        </IconButton>
                        <IconButton aria-label="cancel" onClick={handleCancel}>
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
                  {row[`${tab === "positions" ? "steps" : "deductions"}`]
                    .length <= 0 && !isAdding ? (
                    <Typography>Empty</Typography>
                  ) : (
                    row[`${tab === "positions" ? "steps" : "deductions"}`].map(
                      (item, idx) => (
                        <CollapsibleRow
                          key={item._id ? item._id : item.id}
                          idx={idx}
                          row={item}
                          tab={tab}
                          parentId={row._id ? row._id : row.id}
                          onDeleteRow={onDeleteRow}
                          onSubmit={onSubmit}
                          onSubmitCollapsibleRow={onSubmitCollapsibleRow}
                        />
                      )
                    )
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
