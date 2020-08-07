import React, { useRef, useState, ReactDOM } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./NewQuestion.css";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import Select from 'react-select';
import Options from '../data/newStatusOptions';



export default function NewQuestion() {
  const file = useRef(null);
  const history = useHistory();
  const [questionStatus, setQuestionStatus] = useState("Incomplete");
  const [questionStatement, setQuestionStatement] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const questionType = "Multiple-Choice";

 
  // handle onChange event of the Status dropdown
  const handleStatusChange = e => {
    setQuestionStatus(e.value);
  }

  function validateForm() {
    return questionStatement.length > 0;
  }


  function handleFileChange(event) {
    file.current = event.target.files[0];
  }


  async function handleSubmit(event) {
    event.preventDefault();
  
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 2097152
        } MB.`
      );
      return;
    }
  
    setIsLoading(true);
  
    try {
      const attachment = file.current ? await s3Upload(file.current) : null;
  
      await createQuestion({ questionStatement, attachment, questionStatus, questionType });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  
  function createQuestion(question) {
    return API.post("questions", "/questions", {
      body: question
    });
  }

  return (
    <div className="NewQuestion">
      <form onSubmit={handleSubmit}>      
          <FormGroup controlId="questionStatus">
          <ControlLabel>Question Status</ControlLabel>
          <Select
          className="basic-single"
          classNamePrefix="select"
          placeholder="Set the initial Status"
          value={Options.find(obj => obj.value === questionStatus)}
          onChange={handleStatusChange}
          defaultValue={Options[0]}
          isSearchable="true"
          name="questionStatus"
          options={Options}
        />
        </FormGroup>        
        <FormGroup controlId="questionStatement">
        <ControlLabel>Question Statment</ControlLabel>
          <FormControl
            value={questionStatement}
            componentClass="textarea"
            onChange={e => setQuestionStatement(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="file">
          <ControlLabel>Attachment</ControlLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </form>
    </div>
  );
}