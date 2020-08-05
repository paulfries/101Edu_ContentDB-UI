import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Questions.css";
import { s3Upload } from "../libs/awsLib";

export default function Questions() {
    const file = useRef(null);
    const { id } = useParams();
    const history = useHistory();
    const [question, setQuestion] = useState(null);
    const [questionStatus, setQuestionStatus] = useState("");
    const [questionStatement, setQuestionStatement] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadQuestion() {
      return API.get("questions", `/questions/${id}`);
    }

    async function onLoad() {
      try {
        const question = await loadQuestion();
        const { questionStatement, attachment, questionStatus  } = question;

        if (attachment) {
          question.attachmentURL = await Storage.vault.get(attachment);
        }

        setQuestionStatement(questionStatement);
        setQuestionStatus(questionStatus);
        setQuestion(question);
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
      body: question
    });
  }
  
  async function handleSubmit(event) {
    let attachment;
  
    event.preventDefault();
  
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
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
        attachment: attachment || question.attachment
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
          <FormControl
            value={questionStatus}
            componentClass="select"
            onChange={e => setQuestionStatus(e.target.value)}>
            <option value="Incomplete">Incomplete</option>
            <option value="Ready for Review">Ready for Review</option>
            <option value="First Review Complete">First Review Complete</option>
            <option value="Second Review Complete">Second Review Complete</option>
            <option value="Modification Needed">Modification Needed</option>
            <option value="Ready for Upload">Ready for Upload</option>
            <option value="In Dev QA">In Dev / QA</option>
            <option value="Live in Chem101">Live in Chem101</option>
            </FormControl>
            </FormGroup>

          <FormGroup controlId="questionStatement">
          <ControlLabel>Question Statement</ControlLabel>
            <FormControl
              value={questionStatement}
              componentClass="textarea"
              onChange={e => setQuestionStatement(e.target.value)}
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