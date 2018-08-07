import React from "react";
import { render } from "react-dom";
import * as github from "./github";
import * as utils from "./utils";

// force pull

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./index.css";

// Import React Tooltip
import ReactTooltip from "react-tooltip";

// Import Tags Input
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

import DescriptionCell from "./components/DescriptionCell";

function getToken() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("token");
}

// function TopicLink({ topic }) {
//   return (
//     <a
//       className="topic-link"
//       href={`https://github.com/search?q=topic:${topic}+org:karnov&type=Repositories`}
//       target="_blank"
//     >
//       {topic}
//     </a>
//   );
// }

function ErrorIcon({ message }) {
  return (
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
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
    this.renderEditableTopics = this.renderEditableTopics.bind(this);
  }

  async componentDidMount() {
    const token = getToken();
    const data = await github.getRepos(token);
    this.setState({ data });
  }

  renderName(cellInfo) {
    return (
      <div className="name">
        {!utils.valid_name(cellInfo.value) && (
          <ErrorIcon message="Name can only include [a-z0-9.-] and should not start with &quot;kg&quot;!" />
        )}
        <a href={cellInfo.original.htmlUrl} target="_blank">
          {cellInfo.value}
        </a>
      </div>
    );
  }

  onCellChange = key => (cell, value) => {
    const data = [...this.state.data];

    data[cell.index][key] = value;

    // TODO: Send update to github
    this.setState({ data });
  };

  // renderTopics(cellInfo) {
  //   if (cellInfo.value && cellInfo.value.length > 0)
  //     return (
  //       <div>
  //         {!utils.valid_topics(cellInfo.value) && (
  //           <ErrorIcon message="Team topic is missing!" />
  //         )}
  //         {cellInfo.value.map((topic, i) => (
  //           <TopicLink topic={topic} key={i} />
  //         ))}
  //       </div>
  //     );
  //   else {
  //     return null;
  //   }
  // }

  renderEditableTopics(cellInfo) {
    return (
      <div className="topic">
        {!utils.valid_topics(cellInfo.value) && (
          <ErrorIcon message="Team topic is missing!" />
        )}
        <TagsInput
          value={cellInfo.value}
          onChange={tags => {
            const data = [...this.state.data];
            if (data[cellInfo.index]["topics"] !== tags) {
              data[cellInfo.index]["topics"] = tags;
              this.setState({ data });
              // update repo topics on github
              const token = getToken();
              const name = data[cellInfo.index]["name"];
              //github.updateRepoTopics(token, this.props.name, tags);
              console.log("topics updated on repo: " + name);
            }
          }}
        />
      </div>
    );
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <ReactTable
          data={data}
          columns={[
            {
              Header: <span className="title">Repo management</span>,
              columns: [
                {
                  Header: "Name",
                  accessor: "name",
                  Cell: this.renderName,
                  width: 200
                },
                {
                  Header: "Description",
                  accessor: "description",
                  Cell: DescriptionCell(this.onCellChange("description")),
                  minWidth: 400
                },
                {
                  Header: "Topics",
                  accessor: "topics",
                  Cell: this.renderEditableTopics,
                  minWidth: 200
                },
                {
                  Header: "Private",
                  id: "private",
                  accessor: d => (d.private ? "Yes" : "No"),
                  maxWitdh: 200
                }
              ]
            }
          ]}
          defaultSorted={[
            {
              id: "name",
              asc: true
            }
          ]}
          defaultPageSize={50}
          style={{
            height: `${window.innerHeight - 18}px`
          }}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
