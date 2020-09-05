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
  const [mcOption1, setMcOption1] = useState("");
  const [mcOption1Feedback, setMcOption1Feedback] = useState("");
  const [mcCorrectAnswer1, setMcCorrectAnswer1] = useState(false);
  const [mcOption2, setMcOption2] = useState("");
  const [mcOption2Feedback, setMcOption2Feedback] = useState("");
  const [mcCorrectAnswer2, setMcCorrectAnswer2] = useState(false);
  const [mcOption3, setMcOption3] = useState("");
  const [mcOption3Feedback, setMcOption3Feedback] = useState("");
  const [mcCorrectAnswer3, setMcCorrectAnswer3] = useState(false);
  const [mcOption4, setMcOption4] = useState("");
  const [mcOption4Feedback, setMcOption4Feedback] = useState("");
  const [mcCorrectAnswer4, setMcCorrectAnswer4] = useState(false);
  const [mcOption5, setMcOption5] = useState("");
  const [mcOption5Feedback, setMcOption5Feedback] = useState("");
  const [mcCorrectAnswer5, setMcCorrectAnswer5] = useState(false);
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
        mcOption1,
        mcOption1Feedback,
        mcCorrectAnswer1,
        mcOption2,
        mcOption2Feedback,
        mcCorrectAnswer2,
        mcOption3,
        mcOption3Feedback,
        mcCorrectAnswer3,
        mcOption4,
        mcOption4Feedback,
        mcCorrectAnswer4,
        mcOption5,
        mcOption5Feedback,
        mcCorrectAnswer5,
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

        <FormGroup controlId="AnswerGroup1">
          <dev>
            <ControlLabel for="Answers">Answer Set #1</ControlLabel>
          </dev>
          <dev>
            <FormControl
              value={mcCorrectAnswer1}
              id="CorrectAnswer"
              type="checkbox"
            />
          </dev>
          <ControlLabel for="Answer">Answer</ControlLabel>
          <FormControl
            value={mcOption1}
            id="Answer"
            class="answerfield"
            componentClass="textarea"
            onChange={(e) => setMcOption1(e.target.value)}
          />
          <ControlLabel for="Answerfeedback">Feedback</ControlLabel>
          <FormControl
            value={mcOption1Feedback}
            id="Answerfeedback"
            componentClass="textarea"
            onChange={(e) => setMcOption1Feedback(e.target.value)}
          />
          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
        </FormGroup>

        <FormGroup controlId="AnswerGroup2">
          <dev>
            <ControlLabel for="Answers">Answer Set #2</ControlLabel>
          </dev>
          <dev>
            <FormControl
              value={mcCorrectAnswer2}
              id="CorrectAnswer"
              type="checkbox"
            />
          </dev>
          <ControlLabel for="Answer">Answer</ControlLabel>
          <FormControl
            value={mcOption2}
            id="Answer"
            class="answerfield"
            componentClass="textarea"
            onChange={(e) => setMcOption2(e.target.value)}
          />
          <ControlLabel for="Answerfeedback">Feedback</ControlLabel>
          <FormControl
            value={mcOption2Feedback}
            id="Answerfeedback"
            componentClass="textarea"
            onChange={(e) => setMcOption2Feedback(e.target.value)}
          />

          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
        </FormGroup>

        <FormGroup controlId="AnswerGroup3">
          <dev>
            <ControlLabel for="Answers">Answer Set #3</ControlLabel>
          </dev>
          <dev>
            <FormControl
              value={mcCorrectAnswer3}
              id="CorrectAnswer"
              type="checkbox"
            />
          </dev>
          <ControlLabel for="Answer">Answer</ControlLabel>
          <FormControl
            value={mcOption3}
            id="Answer"
            class="answerfield"
            componentClass="textarea"
            onChange={(e) => setMcOption3(e.target.value)}
          />
          <ControlLabel for="Answerfeedback">Feedback</ControlLabel>
          <FormControl
            value={mcOption3Feedback}
            id="Answerfeedback"
            componentClass="textarea"
            onChange={(e) => setMcOption3Feedback(e.target.value)}
          />
          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
        </FormGroup>

        <FormGroup controlId="AnswerGroup4">
          <dev>
            <ControlLabel for="Answers">Answer Set #4</ControlLabel>
          </dev>
          <dev>
            <FormControl
              value={mcCorrectAnswer4}
              id="CorrectAnswer"
              type="checkbox"
            />
          </dev>
          <ControlLabel for="Answer">Answer</ControlLabel>
          <FormControl
            value={mcOption4}
            id="Answer"
            class="answerfield"
            componentClass="textarea"
            onChange={(e) => setMcOption4(e.target.value)}
          />
          <ControlLabel for="Answerfeedback">Feedback</ControlLabel>
          <FormControl
            value={mcOption4Feedback}
            id="Answerfeedback"
            componentClass="textarea"
            onChange={(e) => setMcOption4Feedback(e.target.value)}
          />
          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
        </FormGroup>

        <FormGroup controlId="AnswerGroup5">
          <dev>
            <ControlLabel for="Answers">Answer Set #5</ControlLabel>
          </dev>
          <dev>
            <FormControl
              value={mcCorrectAnswer5}
              id="CorrectAnswer"
              type="checkbox"
            />
          </dev>
          <ControlLabel for="Answer">Answer</ControlLabel>
          <FormControl
            value={mcOption5}
            id="Answer"
            class="answerfield"
            componentClass="textarea"
            onChange={(e) => setMcOption5(e.target.value)}
          />
          <ControlLabel for="Answerfeedback">Feedback</ControlLabel>
          <FormControl
            value={mcOption5Feedback}
            id="Answerfeedback"
            componentClass="textarea"
            onChange={(e) => setMcOption5Feedback(e.target.value)}
          />

          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
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
