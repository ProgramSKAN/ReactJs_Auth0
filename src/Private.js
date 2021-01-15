import React, { Component } from "react";

export default class Private extends Component {
  state = {
    message: "",
  };

  componentDidMount() {
    fetch("/private", {
      headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` },
    })
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
