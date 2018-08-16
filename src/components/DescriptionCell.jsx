import React from "react";
import ErrorIcon from "./ErrorIcon";
import { valid_description } from "../utils";

const descriptionCell = onChange => row => {
  return (
    <div>
      {!valid_description(row.value) && (
        <ErrorIcon message="Description is missing" />
      )}
      <input
        className="description"
        type="text"
        defaultValue={row.value}
        onBlur={e => onChange(row, e.target.value)}
      />
    </div>
  );
};

export default descriptionCell;
