import React, { Component } from "react";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      error: null,
    };
  }

  componentDidMount() {
    this.loadUserProfile();
  }

  loadUserProfile = () => {
    this.props.auth.getProfile((profile, error) => {
      console.log(profile);
      this.setState({ profile, error });
    });
  };

  render() {
    const { profile } = this.state;
    if (!profile) return null;
    return (
      <>
        <h1>Profile</h1>
        <p>{profile?.nickname}</p>
        <img
          style={{ maxWidth: 50, maxHeight: 50 }}
          src={profile?.picture}
          alt="profile pic"
        />
        <pre>{JSON.stringify(this.state.profile, null, 2)}</pre>
      </>
    );
  }
}
