import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import {
  Button,
  HelpBlock,
  FormGroup,
  Glyphicon,
  FormControl,
  ControlLabel,
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./ResetPassword.css";
// store what user enters in the form
export default function ResetPassword() {
  const [fields, handleFieldChange] = useFormFields({
    code: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [codeSent, setCodeSent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  //checks if fields are empty
  function validateCodeForm() {
    return fields.email.length > 0;
  }
  //checks if fields are empty
  function validateResetForm() {
    return (
      fields.code.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }
  //call back function
  async function handleSendCodeClick(event) {
    event.preventDefault();

    setIsSendingCode(true);

    try {
      await Auth.forgotPassword(fields.email);
      setCodeSent(true);
    } catch (error) {
      onError(error);
      setIsSendingCode(false);
    }
  }
  //call back function
  async function handleConfirmClick(event) {
    event.preventDefault();

    setIsConfirming(true);

    try {
      await Auth.forgotPasswordSubmit(
        fields.email,
        fields.code,
        fields.password
      );
      setConfirmed(true);
    } catch (error) {
      onError(error);
      setIsConfirming(false);
    }
  }
  //reset password validation
  function renderRequestCodeForm() {
    return (
      <form onSubmit={handleSendCodeClick}>
        <FormGroup bsSize="large" controlId="email">
          <div className="formHeader">
            <h1>Reset Password</h1>
          </div>
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <Button
          block
          type="submit"
          bsSize="large"
          isLoading={isSendingCode}
          
        >
          Send Confirmation
        </Button>
      </form>
    );
  }
  //confirm password reset validation
  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmClick}>
        <FormGroup bsSize="large" controlId="code">
        <div className="resetformHeader">
            <h1>Confirm Reset</h1>
          </div>
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={fields.code}
            onChange={handleFieldChange}
          />
          <HelpBlock>
            Please check your email ({fields.email}) for the confirmation code.
          </HelpBlock>
        </FormGroup>
        <hr />
        <FormGroup bsSize="large" controlId="password">
          <ControlLabel>New Password</ControlLabel>
          <FormControl
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup bsSize="large" controlId="confirmPassword">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            type="password"
            value={fields.confirmPassword}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <Button
          block
          type="submit"
          bsSize="large"
          isLoading={isConfirming}
        
        >
          Confirm
        </Button>
      </form>
    );
  }
  //successful password reset validation
  function renderSuccessMessage() {
    return (
      <div className="success">
        <h3>Success</h3>
        <Glyphicon glyph="ok" />
        <p>Your password has been reset.</p>
        <p>
          <Link to="/login">
            Click here to login with your new credentials.
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="ResetPassword">
      {!codeSent
        ? renderRequestCodeForm()
        : !confirmed
        ? renderConfirmationForm()
        : renderSuccessMessage()}
    </div>
  );
}