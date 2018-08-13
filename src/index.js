import React from "react";
import { render } from "react-dom";
import * as github from "./github";
import * as utils from "./utils";

import "./index.css";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

import ErrorIcon from "./components/ErrorIcon";
import DescriptionCell from "./components/DescriptionCell";
import TopicsCell from "./components/TopicsCell";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
  }

  async componentDidMount() {
    const token = utils.getToken();
    const data = await github.getRepos(token);
    this.setState({ data });
  }

  renderName(cell) {
    return (
      <div className="name">
        {!utils.valid_name(cell.value) && (
          <ErrorIcon message="Name can only include [a-z0-9.-] and should not start with &quot;kg&quot;!" />
        )}
        <a href={cell.original.htmlUrl} target="_blank">
          {cell.value}
        </a>
      </div>
    );
  }

  onCellChange = key => (cell, value) => {
    const data = [...this.state.data];

    if (data[cell.index][key] !== value) {
      data[cell.index][key] = value;
      this.setState({ data });
      // TODO: Send update to github
      const repo_name = data[cell.index]["name"];
      github.update(utils.getToken(), repo_name, key, value);
    }
  };

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
                  Cell: TopicsCell(this.onCellChange("topics")),
                  minWidth: 200
                },
                {
                  Header: "Private",
                  id: "private",
                  accessor: d => (d.private ? "Yes" : "No"),
                  maxWitdh: 200
                }
                // TODO: add "last commit" column
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
