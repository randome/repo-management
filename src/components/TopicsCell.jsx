import React from "react";
import ErrorIcon from "./ErrorIcon";
import { valid_topics } from "../utils";

// Import Tags Input
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

const TopicsCell = onChange => row => {
  return (
    <div className="topics">
      {!valid_topics(row.value) && (
        <ErrorIcon message="Team topic is missing!" />
      )}
      <TagsInput value={row.value} onChange={tags => onChange(row, tags)} />
    </div>
  );
};

export default TopicsCell;
