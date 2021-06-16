import React, { useState } from "react";
import NumberFormat from "react-number-format";
import { IconButton, TableCell, TableRow, Input } from "@material-ui/core/";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Cancel as CancelIcon,
} from "@material-ui/icons";

const CollapsibleRow = ({
  row,
  idx,
  tab,
  parentId,
  onDeleteRow,
  onSubmit,
  onSubmitCollapsibleRow,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [inputValues, setInputValues] = useState({
    title: row.title,
    amount: tab === "positions" ? row : row.amount,
  });

  const handleIsEditing = () => {
    setIsEditMode(!isEditMode);
    setInputValues({
      title: row.title,
      amount: tab === "positions" ? row : row.amount,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleSubmit = () => {
    setIsEditMode(false);
    if (tab === "deductions") {
      onSubmit(inputValues, parentId, row._id, true);
    } else if (tab === "positions") {
      onSubmitCollapsibleRow(parentId, idx, inputValues.amount);
    }
  };

  return (
    <React.Fragment>
      <TableRow key={row.title}>
        <TableCell>
          {isEditMode ? (
            <>
              <IconButton aria-label="done" onClick={handleSubmit}>
                <DoneIcon />
              </IconButton>
              <IconButton aria-label="cancel" onClick={handleIsEditing}>
                <CancelIcon />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton aria-label="edit" onClick={handleIsEditing}>
                <EditIcon />
              </IconButton>
              {tab !== "positions" && (
                <IconButton
                  aria-label="delete"
                  onClick={() => onDeleteRow(parentId, row._id)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </>
          )}
        </TableCell>
        <TableCell component="th" scope="row">
          {isEditMode ? (
            tab !== "positions" ? (
              <Input
                value={inputValues.title}
                name={"title"}
                onChange={handleChange}
              />
            ) : (
              `Step ${idx + 1}`
            )
          ) : tab === "positions" ? (
            `Step ${idx + 1}`
          ) : (
            row.title
          )}
        </TableCell>
        <TableCell>
          {isEditMode ? (
            <NumberFormat
              value={inputValues.amount}
              name={"amount"}
              displayType={"input"}
              thousandSeparator={true}
              prefix="₱"
              isNumericString="true"
              customInput={Input}
              onValueChange={(values) => {
                const { value } = values;
                setInputValues({ ...inputValues, amount: value });
              }}
            />
          ) : tab === "positions" ? (
            <NumberFormat
              value={row}
              displayType={"text"}
              thousandSeparator={true}
              prefix="₱"
            />
          ) : (
            <NumberFormat
              value={row.amount}
              displayType={"text"}
              thousandSeparator={true}
              prefix="₱"
            />
          )}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default CollapsibleRow;
