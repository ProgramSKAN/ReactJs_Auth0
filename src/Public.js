import React, { Component } from "react";

export default class Public extends Component {
  state = {
    message: "",
  };

  componentDidMount() {
    //add proxy url in package.json, to proxy any calls to localhost:3000 over to localhost:3001 API.
    //this also CORS issues in development
    // https://create-react-app.dev/docs/proxying-api-requests-in-development/

    fetch("/public")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Network response not ok.");
      })
      .then((response) => this.setState({ message: response.message }))
      .catch((error) => this.setState({ message: error.message }));
  }

  render() {
    return <pre>{this.state.message}</pre>;
  }
}
