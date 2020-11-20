import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import {
  Button,
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel,
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./ChangeEmail.css";
// store what user enters in the form
export default function ChangeEmail() {
  const history = useHistory();
  const [codeSent, setCodeSent] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    code: "",
    email: "",
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  //checks if fields are empty
  function validateEmailForm() {
    return fields.email.length > 0;
  }
  //checks if fields are empty
  function validateConfirmForm() {
    return fields.code.length > 0;
  }
  //call back function
  async function handleUpdateClick(event) {
    event.preventDefault();

    setIsSendingCode(true);

    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, { email: fields.email });
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
      await Auth.verifyCurrentUserAttributeSubmit("email", fields.code);

      history.push("/settings");
    } catch (error) {
      onError(error);
      setIsConfirming(false);
    }
  }
  // change email validation form
  function renderUpdateForm() {
    return (
      <form onSubmit={handleUpdateClick}>
        <div className="formHeader">
          <h1>Change Email</h1>
        </div>
        <div className="Form">
        <FormGroup bsSize="large" controlId="email">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        </div>
        <Button
          block
          type="submit"
          bsSize="large"
          isLoading={isSendingCode}
          
        >
          Update Email
        </Button>
      </form>
    
    );
  }
  //confirmation code validation form
  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmClick}>
        <FormGroup bsSize="large" controlId="code">
        <div className="formHeader">
        <h2>Confirmation Code</h2>
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

  return (
    <div className="ChangeEmail">
      {!codeSent ? renderUpdateForm() : renderConfirmationForm()}
    </div>
  );
}