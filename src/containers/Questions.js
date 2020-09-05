import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Questions.css";
import { s3Upload } from "../libs/awsLib";
import Select from "react-select";
import Options from "../data/statusOptions";
import QuestionUnit from "../data/questionUnit";
import QuestionTopic from "../data/questionTopic";

export default function Questions() {
  const file = useRef(null);
  const feedbackfile1 = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  //    const [questionType, setQuestionType] = useState("Multiple-Choice"); // Probably remove before production
  const questionType = "Multiple-Choice"; // Probably remove before production
  const [question, setQuestion] = useState(null);
  const [questionStatus, setQuestionStatus] = useState("");
  const [questionStatement, setQuestionStatement] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [questionUnit, setQuestionUnit] = useState("");
  const [questionTopic, setQuestionTopic] = useState("");
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

  useEffect(() => {
    function loadQuestion() {
      return API.get("questions", `/questions/${id}`);
    }

    async function onLoad() {
      try {
        const question = await loadQuestion();
        const {
          questionStatement,
          attachment,
          mcOption1FeedbackImageName,
          questionStatus,
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
        } = question;

        if (attachment) {
          question.attachmentURL = await Storage.vault.get(attachment);
        }

        setQuestionStatement(questionStatement);
        setQuestionStatus(questionStatus);
        setQuestionUnit(questionUnit);
        setQuestionTopic(questionTopic);
        setQuestion(question);
        setMcOption1(mcOption1);
        setMcOption1Feedback(mcOption1Feedback);
        setMcCorrectAnswer1(mcCorrectAnswer1);
        setMcOption2(mcOption2);
        setMcOption2Feedback(mcOption2Feedback);
        setMcCorrectAnswer2(mcCorrectAnswer2);
        setMcOption3(mcOption3);
        setMcOption3Feedback(mcOption3Feedback);
        setMcCorrectAnswer3(mcCorrectAnswer3);
        setMcOption4(mcOption4);
        setMcOption4Feedback(mcOption4Feedback);
        setMcCorrectAnswer4(mcCorrectAnswer4);
        setMcOption5(mcOption5);
        setMcOption5Feedback(mcOption5Feedback);
        setMcCorrectAnswer5(mcCorrectAnswer5);
        //setQuestionType(questionType);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return questionStatement.length > 0;
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function saveQuestion(question) {
    return API.put("questions", `/questions/${id}`, {
      body: question,
    });
  }

  async function handleSubmit(event) {
    let attachment;

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
      if (file.current) {
        attachment = await s3Upload(file.current);
      }

      await saveQuestion({
        questionStatement,
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
        attachment: attachment || question.attachment,
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteQuestion() {
    return API.del("questions", `/questions/${id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteQuestion();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="Questions">
      {question && (
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
              placeholder="Set the Topic"
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
              isSearchable="true"
              name="questionStatus"
              options={Options}
            />
          </FormGroup>

          <FormGroup controlId="questionStatement">
            <ControlLabel>Question Statement</ControlLabel>
            <FormControl
              value={questionStatement}
              componentClass="textarea"
              onChange={(e) => setQuestionStatement(e.target.value)}
            />
          </FormGroup>
          {question.attachment && (
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={question.attachmentURL}
                >
                  {formatFilename(question.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!question.attachment && <ControlLabel>Attachment</ControlLabel>}
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
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
}
