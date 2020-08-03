import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";


export default function Home() {
  const [questions, setQuestions] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
  
      try {
        const questions = await loadQuestions();
        setQuestions(questions);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]);
  
  function loadQuestions() {
    return API.get("questions", "/questions");
  }

  function renderQuestionsList(questions) {
    return [{}].concat(questions).map((question, i) =>
      i !== 0 ? (
        <LinkContainer key={question.questionId} to={`/questions/${question.questionId}`}>
          <ListGroupItem header={question.questionStatement.trim().split("\n")[0]}>
            {"Created: " + new Date(question.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/questions/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new question
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Chem101 Content Database</h1>
        <p>A test question and answer database for the Chem101 Application</p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  function renderQuestions() {
    return (
      <div className="questions">
        <PageHeader>Your Chem101 Questions</PageHeader>
        <ListGroup>
          {!isLoading && renderQuestionsList(questions)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderQuestions() : renderLander()}
    </div>
  );
}