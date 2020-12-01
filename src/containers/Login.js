import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./Login.css";
import { Link } from "react-router-dom";
// store what user enters in the form
export default function Login() {
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });
//checks if fields are empty
  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }
//call back function
  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
//login/password form validation, forgot passwrod link and signup link
  return (
    <div className="Login">
      <div className="formHeader">
        <h1>Log In or Sign Up</h1>
        </div>
      <form onSubmit={handleSubmit}>
      
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <Button
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
        >
          Login
        </Button>
        <Button
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
        >
         <Link to="/signup" className="btn">
            Signup
          </Link>
        </Button>
        <Link to="/login/reset">Forgot password?</Link>
        </form>
    </div>
  );
}