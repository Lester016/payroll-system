import React, { useState } from "react";
import NumberFormat from "react-number-format";

// Material UI
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Table,
  Button,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { Edit, Delete, Print } from "@material-ui/icons";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.text.secondary,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  editButton: {
    backgroundColor: "#bf1d38",
    "&:hover": {
      backgroundColor: "#a6172f",
    },
    color: "#fff",
    borderRadius: 15,
    marginRight: 5,
  },
  deleteButton: {
    color: "#bf1d38",
    "&:hover": {
      color: "#a6172f",
    },
    borderRadius: 15,
    marginRight: 5,
  },
}));

const AppTable = ({
  lists,
  onDeleteRow,
  onEditRow,
  filterFn,
  columns,
  propertiesOrder,
  isLoading,
  isPayroll = false,
  isOverload = false,
  printPayslip,
}) => {
  const classes = useStyles();
  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

  // Convert object to array then reverse to get latest input
  const reversedObjectToArray = () => {
    const result = [];

    for (let key in lists) {
      result.push(Object.assign({ id: key }, lists[key]));
    }

    return result.reverse();
  };

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
    console.log("cellId: ", cellId);
    console.log("isAsc?  ", isAsc);
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
  };

  const loading = [];
  for (let index = 0; index < 6; index++) {
    loading.push(
      <StyledTableRow key={index}>
        {propertiesOrder.map((_, id) => (
          <StyledTableCell key={id}>
            <Skeleton variant="text" animation="wave" width={150} height={20} />
          </StyledTableCell>
        ))}
        <StyledTableCell>
          <Skeleton variant="text" animation="wave" width={100} height={40} />
        </StyledTableCell>
      </StyledTableRow>
    );
  }

  let output;
  if (lists) {
    if (Object.keys(lists).length !== 0) {
      output = reversedObjectToArray();
      output = listsAfterPagingAndSorting(output).map((item) => (
        <StyledTableRow key={item.id}>
          {propertiesOrder.map((column, id) =>
            column === "amount" ||
            column === "rate" ||
            column === "grossAmount" ||
            column === "withholdingTax" ||
            column === "totalDeductions" ||
            column === "regularNetAmount" ||
            column === "withTax" ||
            column === "overloadNetAmount" ? (
              <StyledTableCell key={id}>
                <NumberFormat
                  value={item[column]}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </StyledTableCell>
            ) : column === "position" ? (
              <StyledTableCell key={id}>{item[column].title}</StyledTableCell>
            ) : column === "rates" ? (
              <StyledTableCell key={id}>
                <NumberFormat
                  value={`${item["employee"].position.rate.toFixed(2)}`}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </StyledTableCell>
            ) : column === "positions" ? (
              <StyledTableCell
                key={id}
              >{`${item["employee"].position.title}`}</StyledTableCell>
            ) : column === "id" ? (
              <StyledTableCell key={id}>
                {item.employee.employeeId}
              </StyledTableCell>
            ) : column === "employeeName" ? (
              <StyledTableCell
                key={id}
              >{`${item.employee.firstName} ${item.employee.lastName}`}</StyledTableCell>
            ) : column === "name" ? (
              <StyledTableCell
                key={id}
              >{`${item["firstName"]} ${item["lastName"]}`}</StyledTableCell>
            ) : (
              <StyledTableCell key={id}>{item[column]}</StyledTableCell>
            )
          )}
          {!isOverload ? (
            <StyledTableCell>
              {!isPayroll ? (
                <div>
                  <Button
                    className={classes.editButton}
                    size="small"
                    arial-label="edit"
                    variant="contained"
                    // color="primary"
                    startIcon={<Edit />}
                    onClick={() => onEditRow(item._id ? item._id : item.id)}
                  >
                    EDIT
                  </Button>
                  <Button
                    className={classes.deleteButton}
                    size="small"
                    variant="outlined"
                    // color="secondary"
                    startIcon={<Delete />}
                    onClick={() => onDeleteRow(item._id ? item._id : item.id)}
                  >
                    DELETE
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<Print />}
                    onClick={() =>
                      printPayslip(item.id, item.employee.isPartTime)
                    }
                  >
                    Payslip
                  </Button>
                </div>
              )}
            </StyledTableCell>
          ) : (
            ""
          )}
        </StyledTableRow>
      ));
    }
  }

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((item, id) => (
              <StyledTableCell key={id}>
                {item.disableSorting ? (
                  item.label
                ) : (
                  <TableSortLabel
                    active={orderBy === item.id}
                    direction={orderBy === item.id ? order : "asc"}
                    onClick={() => {
                      handleSortRequest(item.id);
                      console.log("This: ", item.id);
                    }}
                  >
                    {item.label}
                  </TableSortLabel>
                )}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{isLoading ? loading : output}</TableBody>
        {lists === null && <h1>No data yet</h1>}
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

export default AppTable;
