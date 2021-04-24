import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Skeleton from "@material-ui/lab/Skeleton";

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
  columns,
  propertiesOrder,
  isLoading,
}) => {
  const classes = useStyles();

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
      output = Object.keys(lists).map((item) => (
        <StyledTableRow key={item}>
          {propertiesOrder.map((column, id) => (
            <StyledTableCell key={id}>{lists[item][column]}</StyledTableCell>
          ))}
          <StyledTableCell>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              startIcon={<DeleteIcon />}
              onClick={() => onDeleteRow(item)}
            >
              Delete
            </Button>
          </StyledTableCell>
        </StyledTableRow>
      ));
    }
  } else {
    output = <h1>No data yet</h1>;
  }

  if (JSON.stringify(lists) === "{}") {
    output = <h1>No data yet</h1>;
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((item, id) => (
              <StyledTableCell key={id}>{item}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{isLoading ? loading : output}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default AppTable;
