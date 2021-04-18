import React from "react";

const Table = ({ lists, onDeleteRow, columns }) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((item, id) => (
            <th key={id}>{item}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.keys(lists).map((item) => (
          <tr key={item}>
            <td>{lists[item][Object.keys(lists[item])[1]]}</td>
            <td>{lists[item][Object.keys(lists[item])[0]]}</td>
            <td>
              <input
                type="button"
                value="Delete"
                onClick={() => onDeleteRow(item)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
