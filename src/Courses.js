import React, { Component } from "react";

export default class Courses extends Component {
  state = {
    courses: [],
  };

  componentDidMount() {
    fetch("/courses", {
      headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Network response not ok.");
      })
      .then((response) => this.setState({ courses: response.courses }))
      .catch((error) => this.setState({ message: error.message }));

    fetch("/admin", {
      headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Network response not ok.");
      })
      .then((response) => console.log(response))
      .catch((error) => this.setState({ message: error.message }));
  }

  render() {
    const isCourses = this.state.courses.length > 0;
    return (
      <div>
        {isCourses && (
          <ui>
            {this.state.courses.map((course) => {
              return <li key={course.id}>{course.title}</li>;
            })}
          </ui>
        )}
      </div>
    );
  }
}
