import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableSortLabel,
  TablePagination,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core/";

import Row from "./Row";

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
  onSubmit,
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
          {listsAfterPagingAndSorting(lists).map((employee, idx) => (
            <Row
              key={employee._id}
              row={employee}
              onDeleteRow={onDeleteRow}
              onSubmit={onSubmit}
            />
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
