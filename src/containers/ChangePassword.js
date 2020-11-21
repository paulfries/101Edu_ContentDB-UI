import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./ChangePassword.css";
// store what user enters in the form
export default function ChangePassword() {
  const history = useHistory();
  const [fields, handleFieldChange] = useFormFields({
    password: "",
    oldPassword: "",
    confirmPassword: "",
  });
  const [isChanging, setIsChanging] = useState(false);
  //checks if fields are empty
  function validateForm() {
    return (
      fields.oldPassword.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }
  //call back function
  async function handleChangeClick(event) {
    event.preventDefault();

    setIsChanging(true);

    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(
        currentUser,
        fields.oldPassword,
        fields.password
      );

      history.push("/settings");
    } catch (error) {
      onError(error);
      setIsChanging(false);
    }
  }
 //cahnge password form
  return (
    <div className="ChangePassword">
      <form onSubmit={handleChangeClick}>
        <FormGroup bsSize="large" controlId="oldPassword">
          <div className="formHeader">
            <h1>Change Password</h1>
          </div>
          <ControlLabel>Old Password</ControlLabel>
          <FormControl
            type="password"
            onChange={handleFieldChange}
            value={fields.oldPassword}
          />
        </FormGroup>
        <hr />
        <FormGroup bsSize="large" controlId="password">
          <ControlLabel>New Password</ControlLabel>
          <FormControl
            type="password"
            onChange={handleFieldChange}
            value={fields.password}
          />
        </FormGroup>
        <FormGroup bsSize="large" controlId="confirmPassword">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </FormGroup>
        <Button
          block
          type="submit"
          bsSize="large"

          isLoading={isChanging}
        >
          Change Password
        </Button>
      </form>
    </div>
  );
}