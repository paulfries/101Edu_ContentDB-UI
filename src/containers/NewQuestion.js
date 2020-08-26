import React, { useRef, useState, ReactDOM } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./NewQuestion.css";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import Select from "react-select";
import Options from "../data/newStatusOptions";
import AnswerFields from "../components/AnswerFields";
import QuestionUnit from "../data/questionUnit";
import QuestionTopic from "../data/questionTopic";


export default function NewQuestion() {
  const file = useRef(null);
  const history = useHistory();
  const [questionStatus, setQuestionStatus] = useState("Incomplete");
  const [questionStatement, setQuestionStatement] = useState("");
  //const [answerCorrect1, setAnswerCorrect1] = useState("");
  //const [mcOption1, setMcOption1] = useState("");
  //const [mcOption1Feedback, setMcOption1Feedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const questionType = "Multiple-Choice";
  const [questionUnit, setQuestionUnit] = useState("");
  const [questionTopic, setQuestionTopic] = useState("");


  // handle onChange event of the Status dropdown
  const handleStatusChange = (e) => {
    setQuestionStatus(e.value);
  };

  const handleUnitChange = (e) => {
    setQuestionUnit(e.value);
  };

  const handleTopicChange = (e) => {
    setQuestionTopic(e.value);
  };

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

      await createQuestion({
        questionStatement,
        attachment,
        questionStatus,
        questionType,
        questionUnit,
        questionTopic,
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function createQuestion(question) {
    return API.post("questions", "/questions", {
      body: question,
    });
  }

  return (
    <div className="NewQuestion">
      <form onSubmit={handleSubmit}>
      <FormGroup controlId="questionUnit">
            <ControlLabel>Unit</ControlLabel>
            <Select
              className="basic-single"
              classNamePrefix="select"
              placeholder="Set the Unit"
              value={QuestionUnit.find((obj) => obj.value === questionUnit)}
              onChange={handleUnitChange}
              isSearchable="true"
              name="questionUnit"
              options={QuestionUnit}
            />
          </FormGroup>

          <FormGroup controlId="questionTopic">
            <ControlLabel>Topic</ControlLabel>
            <Select
              className="basic-single"
              classNamePrefix="select"
              placeholder="Set the topic"
              value={QuestionTopic.find((obj) => obj.value === questionTopic)}
              onChange={handleTopicChange}
              isSearchable="true"
              name="questionTopic"
              options={QuestionTopic}
            />
          </FormGroup>

        <FormGroup controlId="questionStatus">
          <ControlLabel>Question Status</ControlLabel>
          <Select
            className="basic-single"
            classNamePrefix="select"
            placeholder="Set the initial Status"
            value={Options.find((obj) => obj.value === questionStatus)}
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
            onChange={(e) => setQuestionStatement(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="file">
          <ControlLabel>Attachment</ControlLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <FormGroup controlId="AnswerGroup">
          <ControlLabel for="Answers">Answers and Feedback</ControlLabel>
          <AnswerFields
            id="Answers"
            onChange={(e) => setQuestionStatement(e.target.value)}
          />
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
