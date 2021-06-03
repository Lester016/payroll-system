import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TablePagination from "@material-ui/core/TablePagination";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import { Edit as EditIcon, Delete as Deleteicon } from "@material-ui/icons";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  button: {
    color: "#bf1d38",
    "&:hover": {
      color: "#a6172f",
    },
    borderRadius: 15,
    marginRight: 5,
  },
});

const CollapsibleTable = ({
  lists,
  onDeleteRow,
  onEditRow,
  filterFn,
  columns,
  propertiesOrder,
  isLoading,
}) => {
  const classes = useRowStyles();

  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

  /* START OF SORTING AND SEARCHING METHODS */
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function descendingComparator(a, b, orderBy) {
    if (orderBy === "name") {
      orderBy = "firstName";
    }
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const listsAfterPagingAndSorting = (output) => {
    return stableSort(filterFn.fn(output), getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );
  };

  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
  };
  /* END OF SORTING AND SEARCHING METHODS */

  const Row = ({ row }) => {
    const [open, setOpen] = useState(false);

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
          <TableCell>{0}</TableCell>
          <TableCell>{row.position.title}</TableCell>
          <TableCell>{row.campus}</TableCell>
          <TableCell>{row.college}</TableCell>
          <TableCell>{row.department}</TableCell>
          <TableCell>
            <Button
              className={classes.button}
              size="small"
              arial-label="edit"
              variant="outlined"
              // color="primary"
              startIcon={<EditIcon />}
              onClick={() => onEditRow(row._id)}
            >
              EDIT
            </Button>
            <Button
              className={classes.button}
              size="small"
              variant="outlined"
              // color="secondary"
              startIcon={<Deleteicon />}
              onClick={() => onDeleteRow(row._id)}
            >
              DELETE
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Deductions
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Deduction</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.deductions.length <= 0 ? (
                      <Typography>Empty</Typography>
                    ) : (
                      row.deductions.map((deduction) => (
                        <TableRow key={deduction.id}>
                          <TableCell component="th" scope="row">
                            {deduction.title}
                          </TableCell>
                          <TableCell>{deduction.amount}</TableCell>
                        </TableRow>
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

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            {columns.map((item) => (
              <TableCell key={item.label}>
                {item.disableSorting ? (
                  item.label
                ) : (
                  <TableSortLabel
                    active={orderBy === item.id}
                    direction={orderBy === item.id ? order : "asc"}
                    onClick={() => {
                      handleSortRequest(item.id);
                    }}
                  >
                    {item.label}
                  </TableSortLabel>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {listsAfterPagingAndSorting(lists).map((employee) => (
            <Row key={employee.id} row={employee} />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        page={page}
        rowsPerPageOptions={pages}
        rowsPerPage={rowsPerPage}
        count={lists ? Object.keys(lists).length : 0}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default CollapsibleTable;
