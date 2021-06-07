import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, TableCell, TableRow, Input } from "@material-ui/core/";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Cancel as CancelIcon,
} from "@material-ui/icons";

const CollapsibleRow = ({ row, employee_Id, onDeleteRow, onSubmit }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [inputValues, setInputValues] = useState({
    title: row.title,
    amount: row.amount,
  });

  const handleIsEditing = () => {
    setIsEditMode(!isEditMode);
    setInputValues({
      title: row.title,
      amount: row.amount,
    })
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setInputValues({...inputValues, [name]: value});
  }

  const handleSubmit = () => {
    setIsEditMode(false);
    onSubmit(inputValues, employee_Id, row._id, true)
  }

  const handleDummy = () => {};

  return (
    <React.Fragment>
      <TableRow key={row.title}>
        <TableCell>
          {isEditMode ? (
            <>
              <IconButton aria-label="done" onClick={handleSubmit}>
                <DoneIcon />
              </IconButton>
              <IconButton
                aria-label="cancel"
                onClick={handleIsEditing}
              >
                <CancelIcon />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton aria-label="edit" onClick={handleIsEditing}>
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
              value={inputValues.title}
              name={"title"}
              onChange={handleChange}
            />
          ) : (
            row.title
          )}
        </TableCell>
        <TableCell>
          {isEditMode ? (
            <Input
              value={inputValues.amount}
              name={"amount"}
              onChange={handleChange}
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
