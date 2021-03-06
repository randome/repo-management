import React from "react";

// Import React Tooltip
import ReactTooltip from "react-tooltip";

const ErrorIcon = ({ message }) => (
  <span>
    <img
      className="error-icon"
      src="https://uploads.codesandbox.io/uploads/user/6ffe47f4-119d-4313-bb06-b61839c0d576/W4Bf-Red-Alert.svg"
      width="16"
      height="13"
      alt={message}
      data-tip={message}
    />
    <ReactTooltip type="error" />
  </span>
);

export default ErrorIcon;

// function ErrorIcon({ message }) {
//   return (
//     <span>
//       <img
//         className="error-icon"
//         src="https://uploads.codesandbox.io/uploads/user/6ffe47f4-119d-4313-bb06-b61839c0d576/W4Bf-Red-Alert.svg"
//         width="16"
//         height="13"
//         alt={message}
//         data-tip={message}
//       />
//       <ReactTooltip type="error" />
//     </span>
//   );
// }
