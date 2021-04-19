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
  button: {
    margin: theme.spacing(1),
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const AppTable = ({ lists, onDeleteRow, columns }) => {
  const classes = useStyles();

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
        <TableBody>
          {Object.keys(lists).map((item) => (
            <StyledTableRow key={item}>
              <StyledTableCell>
                {lists[item][Object.keys(lists[item])[1]]}
              </StyledTableCell>
              <StyledTableCell>
                {lists[item][Object.keys(lists[item])[0]]}
              </StyledTableCell>
              <StyledTableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  startIcon={<DeleteIcon />}
                  onClick={() => onDeleteRow(item)}
                >
                  Delete
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AppTable;
