import React, { useState } from "react";

// Material UI
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Table from "@material-ui/core/Table";
import Button from "@material-ui/core/Button";
import Skeleton from "@material-ui/lab/Skeleton";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
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

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const AppTable = ({
  lists,
  onDeleteRow,
  onEditRow,
  columns,
  propertiesOrder,
  isLoading,
}) => {
  const classes = useStyles();

  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);

  const loading = [];

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const listsAfterPaging = (output) => {
    return output.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  const reversedObjectToArray = () => {
    const result = [];

    for (let key in lists) {
      result.push(Object.assign({ id: key }, lists[key]));
    }
    result.reverse();

    /*
    const result = Object.entries(lists).map((e) => ({ [e[0]]: e[1] }));
    result.reverse();
    */

    return result;
  };

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
      output = listsAfterPaging(output).map((item) => (
        <StyledTableRow key={item.id}>
          {propertiesOrder.map((column, id) => (
            <StyledTableCell key={id}>{item[column]}</StyledTableCell>
          ))}
          <StyledTableCell>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => onEditRow(item.id)}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              startIcon={<DeleteIcon />}
              onClick={() => onDeleteRow(item.id)}
            >
              Delete
            </Button>
          </StyledTableCell>
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
              <StyledTableCell key={id}>{item}</StyledTableCell>
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
        count={lists && Object.keys(lists).length}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default AppTable;
