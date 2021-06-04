import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, TableCell, TableRow, Input } from "@material-ui/core/";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Cancel as CancelIcon,
} from "@material-ui/icons";

const CollapsibleRow = ({ row, employee_Id, onDeleteRow }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const handleDummy = () => {};

  return (
    <React.Fragment>
      <TableRow key={row.title}>
        <TableCell>
          {isEditMode ? (
            <>
              <IconButton aria-label="done" onClick={handleDummy}>
                <DoneIcon />
              </IconButton>
              <IconButton
                aria-label="cancel"
                onClick={() => setIsEditMode(false)}
              >
                <CancelIcon />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton aria-label="edit" onClick={() => setIsEditMode(true)}>
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={() => onDeleteRow(employee_Id, row._id)}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </TableCell>
        <TableCell component="th" scope="row">
          {isEditMode ? (
            <Input
              value={row.title}
              name={row.title}
              onChange={"(e) => onChange(e, row)"}
            />
          ) : (
            row.title
          )}
        </TableCell>
        <TableCell>
          {isEditMode ? (
            <Input
              value={row.amount}
              name={row.amount}
              onChange={"(e) => onChange(e, row)"}
            />
          ) : (
            row.amount
          )}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default CollapsibleRow;
