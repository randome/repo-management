import React from "react";
import { render } from "react-dom";
import * as github from "./github";
import * as utils from "./utils";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./index.css";

// Import React Tooltip
import ReactTooltip from "react-tooltip";

// Import Tags Input
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

function getToken() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("token");
}

function TopicLink({ topic }) {
  return (
    <a
      className="topic-link"
      href={`https://github.com/search?q=topic:${topic}+org:karnov&type=Repositories`}
      target="_blank"
    >
      {topic}
    </a>
  );
}

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

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tags: this.props.tags };
  }

  handleChange(tags) {
    this.setState({ tags });
    // update repo tags on github
    const token = getToken();
    // github.updateRepoTopics(token, this.props.name, tags);
    console.log("topics updated");
  }

  render() {
    return <TagsInput value={this.state.tags} onChange={::this.handleChange} />;
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
    this.renderEditableDescription = this.renderEditableDescription.bind(this);
  }

  async componentDidMount() {
    const token = getToken();
    const data = await github.getRepos(token);
    // console.log(data);
    this.setState({ data });
  }

  renderName(cellInfo) {
    return (
      <div>
        {!utils.valid_name(cellInfo.value) && (
          <ErrorIcon message="Name can only include [a-z0-9.-] and should not start with &quot;kg&quot;!" />
        )}
        <a href={cellInfo.original.htmlUrl} target="_blank">
          {cellInfo.value}
        </a>
      </div>
    );
  }

  // renderDescription(cellInfo) {
  //   return (
  //     <div>
  //       {!utils.valid_description(cellInfo.value) && (
  //         <ErrorIcon message="Description is missing!" />
  //       )}
  //       {cellInfo.value}
  //     </div>
  //   );
  // }

  renderEditableDescription(cellInfo) {
    return (
      <div>
        {!utils.valid_description(cellInfo.value) && (
          <ErrorIcon message="Description is missing!" />
        )}
        <span
          className="react-tagsinput"
          style={{
            display: "inline-block",
            width: "100%"
          }}
          contentEditable
          suppressContentEditableWarning
          onBlur={e => {
            const data = [...this.state.data];
            const description = e.target.innerHTML;
            if (data[cellInfo.index]["description"] !== description) {
              data[cellInfo.index]["description"] = description;
              this.setState({ data });
              // update repo description on github
              const token = getToken();
              const name = data[cellInfo.index]["name"];
              // github.updateRepoDescription(token, name, description);
              console.log("description updated");
            }
          }}
          dangerouslySetInnerHTML={{
            __html: this.state.data[cellInfo.index][cellInfo.column.id]
          }}
        />
      </div>
    );
  }

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
    return <Example tags={cellInfo.value} />;
  }

  renderEditableTopics2(cellInfo) {
    // handleChange(tags) {
    //   this.setState({ tags });
    //   // update repo tags on github
    //   const token = getToken();
    //   // github.updateRepoTopics(token, this.props.name, tags);
    //   console.log("topics updated");
    // }

    return (
      <div>
        {!utils.valid_topics(cellInfo.value) && (
          <ErrorIcon message="Team topic is missing!" />
        )}
        <TagsInput value={this.state.tags} onChange={::this.handleChange} />;
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
                  Cell: this.renderEditableDescription,
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
