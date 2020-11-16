import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./Settings.css";
import { Auth } from "aws-amplify";

export default function Settings() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }
  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);

    history.push("/login");
  }

  return (
    <div className="Settings">
      <LinkContainer to="/settings/email">
        <LoaderButton block bsSize="large">
          Change Email
        </LoaderButton>
      </LinkContainer>
      <LinkContainer to="/settings/password">
        <LoaderButton block bsSize="large">
          Change Password
        </LoaderButton>
      </LinkContainer>
      <LoaderButton block bsSize="large" onClick={handleLogout}>
          Logout
        </LoaderButton>
      <hr />
    </div>
  );
}