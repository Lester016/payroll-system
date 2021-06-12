import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
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

  const romanize = (num) => {
    if (isNaN(num)) return NaN;
    var digits = String(+num).split(""),
      key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM","","X","XX","XXX","XL","L","LX","LXX","LXXX","XC","","I","II","III","IV","V","VI","VII","VIII","IX",],
      roman = "",
      i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
  };

  const handleIsEditing = () => {
    setIsEditMode(!isEditMode);
    setInputValues({
      title: row.title,
      amount: tab === "positions" ? row : row.amount,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleSubmit = () => {
    setIsEditMode(false);
    if (tab === "deductions") {onSubmit(inputValues, parentId, row._id, true);}
    else if (tab === "positions") {onSubmitCollapsibleRow(parentId, idx, inputValues.amount)}
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
              `Step ${romanize(idx + 1)}`
            )
          ) : tab === "positions" ? (
            `Step ${romanize(idx + 1)}`
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
          ) : tab === "positions" ? (
            row
          ) : (
            row.amount
          )}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default CollapsibleRow;
