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
import ReviewerList from "../data/reviewerList";
import OpenStaxList from "../data/openstaxList";
import ThoughtTypeList from "../data/thoughtTypeList";

export default function Questions() {
  const file = useRef(null);
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
  const [topic, setTopic] = useState("");
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
  const [firstReviewer, setFirstReviewer] = useState("");
  const [secReviewer, setSecReviewer] = useState("");
  const [correctAnswer1Thru5, setCorrectAnswer1Thru5] = useState("");
  const [openStaxTrad2e, setOpenStaxTrad2e] = useState("");
  const [openStaxAF2e, setOpenStaxAF2e] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [thoughtType, setThoughtType] = useState("");
  const [timeSuggested, setTimeSuggested] = useState("");
  const [solution, setSolution] = useState("");

  // handle onChange event of the Status dropdown
  const handleStatusChange = (e) => {
    setQuestionStatus(e.value);
  };

  const handleUnitChange = (e) => {
    setQuestionUnit(e.value);
  };

  const handleTopicChange = (e) => {
    setTopic(e.value);
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
          questionStatus,
          questionUnit,
          topic,
          assignedTo,
          firstReviewer,
          secReviewer,
          openStaxTrad2e,
          openStaxAF2e,
          thoughtType,
          timeSuggested,
          correctAnswer1Thru5,
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
          solution,
        } = question;

        if (attachment) {
          question.attachmentURL = await Storage.vault.get(attachment);
        }
        if (correctAnswer1Thru5 === "1") {
          setMcCorrectAnswer1(true);
        }
        if (correctAnswer1Thru5 === "2") {
          setMcCorrectAnswer2(true);
        }
        if (correctAnswer1Thru5 === "3") {
          setMcCorrectAnswer3(true);
        }
        if (correctAnswer1Thru5 === "4") {
          setMcCorrectAnswer4(true);
        }
        if (correctAnswer1Thru5 === "5") {
          setMcCorrectAnswer5(true);
        }
        setQuestionStatement(questionStatement);
        setQuestionStatus(questionStatus);
        setFirstReviewer(firstReviewer);
        setSecReviewer(secReviewer);
        setQuestionUnit(questionUnit);
        setTopic(topic);
        setOpenStaxTrad2e(openStaxTrad2e);
        setOpenStaxAF2e(openStaxAF2e);
        setAssignedTo(assignedTo);
        setThoughtType(thoughtType);
        setTimeSuggested(timeSuggested);
        setQuestion(question);
        setCorrectAnswer1Thru5(correctAnswer1Thru5);
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
        setSolution(solution);

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

  const handleAssignedToChange = (e) => {
    setAssignedTo(e.value);
  };

  const handleReviewer1Change = (e) => {
    setFirstReviewer(e.value);
  };

  const handleReviewer2Change = (e) => {
    setSecReviewer(e.value);
  };

  const handleOpenStaxTrad = (e) => {
    setOpenStaxTrad2e(e.value);
  };

  const handleOpenStaxAF = (e) => {
    setOpenStaxAF2e(e.value);
  };

  const handleThoughtType = (e) => {
    setThoughtType(e.value);
  };

  function handleClick1() {
    setMcCorrectAnswer1(true);
    setMcCorrectAnswer2(false);
    setMcCorrectAnswer3(false);
    setMcCorrectAnswer4(false);
    setMcCorrectAnswer5(false);
    setCorrectAnswer1Thru5("1");
  }

  function handleClick2() {
    setMcCorrectAnswer1(false);
    setMcCorrectAnswer2(true);
    setMcCorrectAnswer3(false);
    setMcCorrectAnswer4(false);
    setMcCorrectAnswer5(false);
    setCorrectAnswer1Thru5("2");
  }

  function handleClick3() {
    setMcCorrectAnswer1(false);
    setMcCorrectAnswer2(false);
    setMcCorrectAnswer3(true);
    setMcCorrectAnswer4(false);
    setMcCorrectAnswer5(false);
    setCorrectAnswer1Thru5("3");
  }

  function handleClick4() {
    setMcCorrectAnswer1(false);
    setMcCorrectAnswer2(false);
    setMcCorrectAnswer3(false);
    setMcCorrectAnswer4(true);
    setMcCorrectAnswer5(false);
    setCorrectAnswer1Thru5("4");
  }

  function handleClick5() {
    setMcCorrectAnswer1(false);
    setMcCorrectAnswer2(false);
    setMcCorrectAnswer3(false);
    setMcCorrectAnswer4(false);
    setMcCorrectAnswer5(true);
    setCorrectAnswer1Thru5("5");
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
        topic,
        assignedTo,
        firstReviewer,
        secReviewer,
        openStaxTrad2e,
        openStaxAF2e,
        thoughtType,
        timeSuggested,
        correctAnswer1Thru5,
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
        solution,
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

          <FormGroup>
            <ControlLabel className="assignedTitle" for="assignedTo">
              Assigned To:
            </ControlLabel>
            <Select
              className="basic-single"
              classNamePrefix="select"
              id="assignedTo"
              value={ReviewerList.find((obj) => obj.value === assignedTo)}
              isSearchable="true"
              name="firstReviewer"
              onChange={handleAssignedToChange}
              options={ReviewerList}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel className="reviewerTitle" for="reviewer1">
              Reviewer 1:
            </ControlLabel>
            <Select
              className="basic-single"
              classNamePrefix="select"
              id="reviewer1"
              value={ReviewerList.find((obj) => obj.value === firstReviewer)}
              isSearchable="true"
              name="firstReviewer"
              onChange={handleReviewer1Change}
              options={ReviewerList}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel className="reviewerTitle" for="reviewer2">
              Reviewer 2:
            </ControlLabel>
            <Select
              className="basic-single"
              classNamePrefix="select"
              id="reviewer2"
              value={ReviewerList.find((obj) => obj.value === secReviewer)}
              isSearchable="true"
              name="secReviewer"
              onChange={handleReviewer2Change}
              options={ReviewerList}
            />
          </FormGroup>

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
              value={QuestionTopic.find((obj) => obj.value === topic)}
              onChange={handleTopicChange}
              isSearchable="true"
              name="questionTopic"
              options={QuestionTopic}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel className="openstaxTitle" for="openstaxTrad">
              OpenStax Traditional Reference:
            </ControlLabel>
            <Select
              className="basic-single"
              classNamePrefix="select"
              id="openstaxTrad"
              value={OpenStaxList.find((obj) => obj.value === openStaxTrad2e)}
              isSearchable="true"
              name="openStaxTrad2e"
              onChange={handleOpenStaxTrad}
              options={OpenStaxList}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel className="openstaxTitle" for="openstaxAF">
              OpenStax Atoms First:
            </ControlLabel>
            <Select
              className="basic-single"
              classNamePrefix="select"
              id="openstaxAF"
              value={OpenStaxList.find((obj) => obj.value === openStaxAF2e)}
              isSearchable="true"
              name="openStaxAF2e"
              onChange={handleOpenStaxAF}
              options={OpenStaxList}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel className="thoughtType" for="thoughtType">
              Thought Type:
            </ControlLabel>
            <Select
              className="basic-single"
              classNamePrefix="select"
              id="thoughtType"
              value={ThoughtTypeList.find((obj) => obj.value === thoughtType)}
              isSearchable="true"
              name="thoughtType"
              onChange={handleThoughtType}
              options={ThoughtTypeList}
            />
          </FormGroup>
          <FormGroup>
            <label className="timeSuggested" for="timeSuggested">
              Time Suggested:
            </label>
            <input
              className="timeField"
              defaultValue={timeSuggested}
              id="timeSuggested"
              componentClass="textbox"
              onChange={(e) => setTimeSuggested(e.target.value)}
            />
          </FormGroup>

          <FormGroup controlId="questionStatement">
            <ControlLabel>Question Statement:</ControlLabel>
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
              <ControlLabel className="answerTitle" for="Answers">
                Multiple Choice Option No. 1
              </ControlLabel>
            </dev>
            <dev>
              <ControlLabel className="CorrectChkBox" for="CorrectAnswer">
                Correct
              </ControlLabel>
              <FormControl
                checked={mcCorrectAnswer1}
                onChange={handleClick1}
                id="CorrectAnswer"
                type="checkbox"
              />
            </dev>
            <ControlLabel className="fieldTitle" for="Answer">
              Answer:
            </ControlLabel>
            <FormControl
              value={mcOption1}
              id="Answer"
              class="answerfield"
              componentClass="textarea"
              onChange={(e) => setMcOption1(e.target.value)}
            />
            <ControlLabel className="fieldTitle" for="Answerfeedback">
              Feedback:
            </ControlLabel>
            <FormControl
              value={mcOption1Feedback}
              id="Answerfeedback"
              componentClass="textarea"
              onChange={(e) => setMcOption1Feedback(e.target.value)}
            />

            <FormGroup controlId="file">
              <ControlLabel className="answerAttachment">
                Attachment
              </ControlLabel>
              <FormControl onChange={handleFileChange} type="file" />
            </FormGroup>
          </FormGroup>

          <FormGroup controlId="AnswerGroup2">
            <dev>
              <ControlLabel className="answerTitle" for="Answers">
                Multiple Choice Option No. 2
              </ControlLabel>
            </dev>
            <dev>
              <ControlLabel className="CorrectChkBox" for="CorrectAnswer">
                Correct
              </ControlLabel>
              <FormControl
                checked={mcCorrectAnswer2}
                id="CorrectAnswer"
                onChange={handleClick2}
                type="checkbox"
              />
            </dev>
            <ControlLabel className="fieldTitle" for="Answer">
              Answer:
            </ControlLabel>
            <FormControl
              value={mcOption2}
              id="Answer"
              class="answerfield"
              componentClass="textarea"
              onChange={(e) => setMcOption2(e.target.value)}
            />
            <ControlLabel className="fieldTitle" for="Answerfeedback">
              Feedback:
            </ControlLabel>
            <FormControl
              value={mcOption2Feedback}
              id="Answerfeedback"
              componentClass="textarea"
              onChange={(e) => setMcOption2Feedback(e.target.value)}
            />
            <FormGroup controlId="file">
              <ControlLabel className="answerAttachment">
                Attachment
              </ControlLabel>
              <FormControl onChange={handleFileChange} type="file" />
            </FormGroup>
          </FormGroup>
          <FormGroup controlId="AnswerGroup3">
            <dev>
              <ControlLabel className="answerTitle" for="Answers">
                Multiple Choice Option No. 3
              </ControlLabel>
            </dev>
            <dev>
              <ControlLabel className="CorrectChkBox" for="CorrectAnswer">
                Correct
              </ControlLabel>
              <FormControl
                checked={mcCorrectAnswer3}
                onChange={handleClick3}
                id="CorrectAnswer"
                type="checkbox"
              />
            </dev>
            <ControlLabel className="fieldTitle" for="Answer">
              Answer:
            </ControlLabel>
            <FormControl
              value={mcOption3}
              id="Answer"
              class="answerfield"
              componentClass="textarea"
              onChange={(e) => setMcOption3(e.target.value)}
            />
            <ControlLabel className="fieldTitle" for="Answerfeedback">
              Feedback:
            </ControlLabel>
            <FormControl
              value={mcOption3Feedback}
              id="Answerfeedback"
              componentClass="textarea"
              onChange={(e) => setMcOption3Feedback(e.target.value)}
            />
            <FormGroup controlId="file">
              <ControlLabel className="answerAttachment">
                Attachment
              </ControlLabel>
              <FormControl onChange={handleFileChange} type="file" />
            </FormGroup>
          </FormGroup>

          <FormGroup controlId="AnswerGroup4">
            <dev>
              <ControlLabel className="answerTitle" for="Answers">
                Multiple Choice Option No. 4
              </ControlLabel>
            </dev>
            <dev>
              <ControlLabel className="CorrectChkBox" for="CorrectAnswer">
                Correct
              </ControlLabel>
              <FormControl
                checked={mcCorrectAnswer4}
                onChange={handleClick4}
                id="CorrectAnswer"
                type="checkbox"
              />
            </dev>
            <ControlLabel className="fieldTitle" for="Answer">
              Answer:
            </ControlLabel>
            <FormControl
              value={mcOption4}
              id="Answer"
              class="answerfield"
              componentClass="textarea"
              onChange={(e) => setMcOption4(e.target.value)}
            />
            <ControlLabel className="fieldTitle" for="Answerfeedback">
              Feedback:
            </ControlLabel>
            <FormControl
              value={mcOption4Feedback}
              id="Answerfeedback"
              componentClass="textarea"
              onChange={(e) => setMcOption4Feedback(e.target.value)}
            />
            <FormGroup controlId="file">
              <ControlLabel className="answerAttachment">
                Attachment
              </ControlLabel>
              <FormControl onChange={handleFileChange} type="file" />
            </FormGroup>
          </FormGroup>

          <FormGroup controlId="AnswerGroup5">
            <dev>
              <ControlLabel className="answerTitle" for="Answers">
                Multiple Choice Option No. 5
              </ControlLabel>
            </dev>
            <dev>
              <ControlLabel className="CorrectChkBox" for="CorrectAnswer">
                Correct
              </ControlLabel>
              <FormControl
                checked={mcCorrectAnswer5}
                onChange={handleClick5}
                id="CorrectAnswer"
                type="checkbox"
              />
            </dev>
            <ControlLabel className="fieldTitle" for="Answer">
              Answer:
            </ControlLabel>
            <FormControl
              value={mcOption5}
              id="Answer"
              class="answerfield"
              componentClass="textarea"
              onChange={(e) => setMcOption5(e.target.value)}
            />
            <ControlLabel className="fieldTitle" for="Answerfeedback">
              Feedback:
            </ControlLabel>
            <FormControl
              value={mcOption5Feedback}
              id="Answerfeedback"
              componentClass="textarea"
              onChange={(e) => setMcOption5Feedback(e.target.value)}
            />

            <FormGroup controlId="file">
              <ControlLabel className="answerAttachment">
                Attachment
              </ControlLabel>
              <FormControl onChange={handleFileChange} type="file" />
            </FormGroup>
          </FormGroup>

          <FormGroup>
            <ControlLabel className="solutionTitle" for="solution">
              Solution:
            </ControlLabel>
            <FormControl
              value={solution}
              id="solution"
              componentClass="textarea"
              onChange={(e) => setSolution(e.target.value)}
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
